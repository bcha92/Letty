import React from "react";
import { GoogleMap, withScriptjs, withGoogleMap } from "react-google-maps";

// Map of Locations
const LocationsMap = () => {
    return <GoogleMap
        defaultZoom={15}
        defaultCenter={{ lat: 45.49496410858361, lng: -73.57789133761398 }}
        >
        </GoogleMap>
};

const WrappedMap = withScriptjs(withGoogleMap(LocationsMap));

export default WrappedMap;