import React, { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserLocation } from '../features/locationSlice';
import { updateLocationState } from '../features/authSlice';
import { authService } from '../services/auth.service';

const LocationInitializer = () => {
    const dispatch = useDispatch();
    const { userData, status } = useSelector((state) => state.auth);
    const locationState = useSelector((state) => state.location);

    const lastSyncedRef = useRef(null);
    const isSyncingRef = useRef(false);

    // Sync live coordinates with backend database and update Redux user location
    const syncLocationToDB = useCallback(async (lat, lon) => {
        if (lat == null || lon == null) return;

        // Skip if coordinates are identical to what was already synced
        if (
            lastSyncedRef.current &&
            lastSyncedRef.current.lat === lat &&
            lastSyncedRef.current.lon === lon
        ) {
            return;
        }

        if (isSyncingRef.current) return;
        isSyncingRef.current = true;

        try {
            console.log("Syncing location to database:", { lat, lon });
            const response = await authService.updateLocation({ lat, lon });
            lastSyncedRef.current = { lat, lon };
            console.log("Location successfully synced to database:", response);

            // Keep Redux userData.location in sync with database
            dispatch(updateLocationState({
                lat,
                lon,
                updatedAt: new Date().toISOString()
            }));
        } catch (err) {
            console.error("Location sync failed:", {
                status: err.response?.status,
                message: err.response?.data?.message,
                error: err.message,
            });
        } finally {
            isSyncingRef.current = false;
        }
    }, [dispatch]);

    // 1. Initial Geolocation request on mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = Number(position.coords.latitude.toFixed(6));
                    const lon = Number(position.coords.longitude.toFixed(6));

                    // Save to Redux location slice
                    dispatch(
                        setUserLocation({
                            latitude: lat,
                            longitude: lon,
                        })
                    );

                    // If user is already authenticated, sync to DB immediately
                    if (status && userData?._id) {
                        syncLocationToDB(lat, lon);
                    }
                },
                (error) => {
                    console.log("Geolocation unavailable or denied:", error.message);
                    // If device location is OFF, fallback to user's saved DB location if available
                    if (userData?.location?.lat != null && userData?.location?.lon != null) {
                        dispatch(
                            setUserLocation({
                                latitude: userData.location.lat,
                                longitude: userData.location.lon,
                            })
                        );
                    }
                },
                { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
            );
        } else if (userData?.location?.lat != null && userData?.location?.lon != null) {
            // Geolocation not supported by browser
            dispatch(
                setUserLocation({
                    latitude: userData.location.lat,
                    longitude: userData.location.lon,
                })
            );
        }
    }, [dispatch]);

    // 2. Auth state listener & sync
    // Handles race condition: When user authentication finishes after geolocation coordinates were acquired,
    // or when the user logs in, immediately sync the acquired location to DB.
    // Also, if location was OFF and locationSlice is empty, initialize it with user's saved DB location.
    useEffect(() => {
        if (!status || !userData?._id) return;

        if (locationState?.latitude != null && locationState?.longitude != null) {
            // We have active device coordinates in Redux; ensure they are synced to database
            syncLocationToDB(locationState.latitude, locationState.longitude);
        } else if (userData?.location?.lat != null && userData?.location?.lon != null) {
            // Device location is OFF / denied, initialize Redux locationSlice with saved DB location
            dispatch(
                setUserLocation({
                    latitude: userData.location.lat,
                    longitude: userData.location.lon,
                })
            );
        }
    }, [status, userData?._id, locationState?.latitude, locationState?.longitude, dispatch, syncLocationToDB]);

    return null;
};

export default LocationInitializer;
