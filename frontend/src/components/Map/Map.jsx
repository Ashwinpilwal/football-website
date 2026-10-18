import api from "../../utils/axios.utils";
import { useEffect, useState } from "react";
import {MapContainer, TileLayer, Marker, Popup} from "react-leaflet";

import { useSelector } from "react-redux";

// import "leaflet/dist/leaflet.css";
import L from "leaflet";

const Map = () => {

    const {latitude, longitude} = useSelector((state) => state.location)
    console.log("Latitude & Longitude: ", latitude, " ", longitude)
    
    const userLocation = latitude !== null && longitude !==null ?
        [latitude, longitude] : [31.2536, 75.7033]


    const [cafes, setCafes] = useState([]);

    const cafeIcon = L.icon({
        iconUrl: "/coffee.png",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
    });


    useEffect(() => {
        if (!userLocation) return;
        if (latitude === null || longitude === null) return;

        const fetchCafes = async () => {
            const response = await api.get(
                `/cafes/nearby?lat=${latitude}&lng=${longitude}`
            );

            setCafes(response.data);

            console.log("Fetched Cafes: ", response.data);
        };

        fetchCafes();
    }, [longitude, latitude]);


    console.log(cafes)

    
    
    return (
        
        <MapContainer  
        center={userLocation || [31.2536, 75.7033]}
        zoom={13}
        zoomControl={false}
        attributionControl={false}
        style={{
            height: "500px",
            width: "500px",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,.4)",
        }}
        >

            <TileLayer
                attribution='&copy; OpenStreetMap contributors &copy; CARTO'
                url={`https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=${import.meta.env.VITE_CARTO_API_KEY || "cb1_4o4p_1_68e988dc40d91fccd5cbefb6"}`}
                />


            {userLocation && (
                <Marker position={userLocation}>
                    <Popup>You are here</Popup>
                </Marker>
            )}

            {cafes.map((cafe) => (
                <Marker
                key={cafe.properties.place_id}
                position={[
                    cafe.geometry.coordinates[1],
                    cafe.geometry.coordinates[0]
                ]}
                icon={cafeIcon}
                >
                    <Popup>
                        <h3>{cafe.properties.name || "Unnamed Place"}</h3>
                        <p>{cafe.properties.address_line2}</p>
                        <p>{cafe.properties.distance} meters away</p>
                    </Popup>
                </Marker>
            ))}

        </MapContainer>
    )
}
export default Map;