import React, { useState, useEffect } from "react";
import MapComponent from "./Map.jsx";
import SearchComponent from "./Search.jsx";
import BottomSwipeContainer from "./BottomSwipeContainer.jsx";
import "./App.css";
import events from "./events.json";

const App = () => {
    const [isMapOpen, setIsMapOpen] = useState(true);
    const [position, setPosition] = useState(null);
    const [userPosition, setUserPosition] = useState(null);
    const [filteredEvents, setFilteredEvents] = useState(events);

    useEffect(() => {
        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
        };

        const watchId = navigator.geolocation.watchPosition(
            success,
            error,
            options
        );

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    const success = (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        console.log("User position: ", latitude, longitude, accuracy);
        setUserPosition({ lat: latitude, lng: longitude, accuracy });
    };

    const error = (err) => {
        if (err.code === 1) {
            // alert("Please allow geolocation access");
            console.error("Please allow geolocation access");
        } else {
            console.error("Error retrieving location: ", err);
            // alert("Cannot get current location");
            console.error("Cannot get current location");
        }
    };

    // The onSearch function that gets called when a user selects a search result
    const handleSearch = (lat, lon) => {
        setPosition({ lat, lng: lon, accuracy: 0 });
    };

    return (
        <div id="container">
            {/* SearchComponent allows the user to search for a location */}
            <SearchComponent
                id="search"
                onSearch={handleSearch}
                onOpen={() => setIsMapOpen(false)}
                onClose={() => setIsMapOpen(true)}
                filteredEvents={filteredEvents}
                setFilteredEvents={setFilteredEvents}
            />

            {/* BottomSwipeContainer displays the list of events */}
            <BottomSwipeContainer
                events={filteredEvents}
                handleSearch={handleSearch}
            />

            {/* MapComponent displays the map centered on the user's position */}
            <MapComponent
                className={isMapOpen ? "map-open" : "map-closed"}
                position={position}
                userPosition={userPosition}
                events={filteredEvents}
            />
        </div>
    );
};

export default App;
