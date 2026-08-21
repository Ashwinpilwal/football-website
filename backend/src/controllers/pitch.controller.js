import axios from "axios";
import { ApiResponse } from "../utils/ApiResponse.js";

// Calculates spherical distance in meters between two lat/lon pairs
function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
}

export const getNearbyPitches = async (req, res) => {
    try {
        const { lat, lng, radius = 40000 } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({
                message: "Latitude (lat) and Longitude (lng) are required",
            });
        }

        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lng);
        const radiusNum = Math.min(50000, Math.max(1000, parseInt(radius, 10) || 40000));

        let places = [];
        const seenCoords = [];

        // 1. Primary Query: Geoapify Places API for sports pitches, stadiums, football arenas & complexes
        if (process.env.GEOAPIFY_API_KEY) {
            try {
                const geoapifyRes = await axios.get(
                    "https://api.geoapify.com/v2/places",
                    {
                        params: {
                            categories: "sport.pitch,sport.stadium,sport.sports_centre,sport.fitness,leisure.playground",
                            filter: `circle:${lngNum},${latNum},${radiusNum}`,
                            bias: `proximity:${lngNum},${latNum}`,
                            limit: 70,
                            apiKey: process.env.GEOAPIFY_API_KEY,
                        },
                        timeout: 7000,
                    }
                );

                if (Array.isArray(geoapifyRes.data?.features) && geoapifyRes.data.features.length > 0) {
                    geoapifyRes.data.features.forEach((f) => {
                        const coordinates = f.geometry?.coordinates || [lngNum, latNum];
                        const itemLat = coordinates[1];
                        const itemLng = coordinates[0];

                        // Deduplicate within 80 meters
                        const isDuplicate = seenCoords.some(
                            (c) => calculateDistanceMeters(itemLat, itemLng, c[0], c[1]) < 80
                        );
                        if (isDuplicate) return;
                        seenCoords.push([itemLat, itemLng]);

                        const dist = f.properties?.distance || calculateDistanceMeters(latNum, lngNum, itemLat, itemLng);
                        const rawTag = f.properties?.datasource?.raw || {};
                        const cats = f.properties?.categories || [];
                        const sport = rawTag.sport || (cats.some((c) => c.includes("stadium")) ? "Stadium" : "Football");
                        const surface = rawTag.surface || "";

                        const rawName = f.properties?.name || rawTag?.name || rawTag?.["name:en"];
                        let street = f.properties?.street || f.properties?.address_line1 || f.properties?.city || f.properties?.suburb || "Local";
                        street = street.replace(/Link Road/gi, "Ground").replace(/,/g, "").trim();

                        let cleanName = rawName;
                        if (!cleanName || cleanName.toLowerCase() === "unnamed" || cleanName.length < 3) {
                            if (cats.some((c) => c.includes("stadium"))) {
                                cleanName = `${street} Stadium`;
                            } else if (surface.includes("turf") || surface.includes("grass")) {
                                cleanName = `${street} Turf Pitch`;
                            } else if (cats.some((c) => c.includes("sports_centre"))) {
                                cleanName = `${street} Sports Arena`;
                            } else {
                                cleanName = `${street} Sports Ground`;
                            }
                        }

                        const isTurf =
                            cats.some((c) => c.includes("sports_centre") || c.includes("arena")) ||
                            surface.includes("turf") ||
                            surface.includes("artificial") ||
                            cleanName.toLowerCase().includes("turf") ||
                            cleanName.toLowerCase().includes("arena") ||
                            cleanName.toLowerCase().includes("club");

                        places.push({
                            type: "Feature",
                            geometry: {
                                type: "Point",
                                coordinates: [itemLng, itemLat],
                            },
                            properties: {
                                name: cleanName,
                                formatted: f.properties?.formatted || `${street}, Sports Ground`,
                                address_line1: cleanName,
                                address_line2: f.properties?.formatted || `${street}`,
                                categories: cats.length > 0 ? cats : ["sport.pitch", "football"],
                                lat: itemLat,
                                lon: itemLng,
                                distance: dist,
                                venueType: isTurf ? "turf" : "ground",
                                sport,
                                surface: surface || (isTurf ? "AstroTurf" : "Natural Grass / Standard"),
                                source: "Live Places API",
                            },
                        });
                    });
                }
            } catch (geoErr) {
                console.warn("Geoapify Places API warning:", geoErr.response?.data || geoErr.message);
            }
        }

        // Sort all discovered real-world venues by distance from user (closest first)
        places.sort((a, b) => (a.properties?.distance || 0) - (b.properties?.distance || 0));

        return res.status(200).json(new ApiResponse(200, places, "Nearby real pitches fetched successfully"));
    } catch (error) {
        console.error("Failed to fetch nearby real pitches:", error.message);
        res.status(500).json({
            message: "Failed to fetch nearby pitches and playgrounds",
        });
    }
};
