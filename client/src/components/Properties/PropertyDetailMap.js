import React from "react";
import { GoogleMap, withScriptjs, withGoogleMap, Marker } from "react-google-maps";

// Location Detail Map via Google Maps (for small-scale Single Markers)
const LocationDetailMap = withScriptjs(withGoogleMap(({ property }) => {
    // Default Coordinates for Concordia University, Montreal
    const concordia = { lat: 45.49496410858361, lng: -73.57789133761398 };
    return <GoogleMap // Default rendering of Google Maps
        defaultZoom={16}
        defaultCenter={property === null ?
            // If geo is undefined, default lat/lng to Concordia University, Montreal
            concordia : property.geo
        }
        >
        {property !== null && <Marker // Property Marker
            key={property._id}
            position={property.geo}
        />}
        </GoogleMap>
}));

export default LocationDetailMap;