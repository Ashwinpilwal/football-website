import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserLocation } from '../features/locationSlice';
import { authService } from '../services/auth.service';

const LocationInitializer = () => {
    const dispatch = useDispatch();
    const { userData, status } = useSelector((state) => state.auth);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    dispatch(
                        setUserLocation({
                            latitude: lat,
                            longitude: lon,
                        })
                    );

                    // If user is authenticated, update database
                    if (status && userData) {
                        try {
                            await authService.updateLocation({ lat, lon });
                        } catch (err) {
                            console.log("Location sync error:", err);
                        }
                    }
                },
                (error) => {
                    console.log("Geolocation error:", error);
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        }
    }, [dispatch, status, userData?._id]);

    return null;
};

export default LocationInitializer;
