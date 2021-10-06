import React from "react";
import { useHistory } from "react-router";
import { GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow } from "react-google-maps";
import styled from "styled-components";

// Map of Locations
const LocationsMap = withScriptjs(withGoogleMap(({
    properties, setSelect, select=null, location=null, setLocation
}) => {
    const concordia = { lat: 45.49496410858361, lng: -73.57789133761398 };
    // UseHistory Redirect Link {May need to borrow from parent state (Property)}
    let history = useHistory();

    return <GoogleMap // Default rendering of Google Maps
        defaultZoom={14}
        defaultCenter={properties.length > 1 ?
            // If geo is undefined, default lat/lng to Concordia University, Montreal
            concordia :
            properties.length === 0 ?
            concordia :
            properties[0].geo
        }
        center={location !== null ? location.geo :
            properties === null ?
            properties[0].geo : select !== null ?
            select.geo :
            concordia}
        >

        {/* Shows a list of properties (or property) */}
        {
        properties.map(property =>
            <Marker
            key={property._id}
            position={property.geo === undefined ? // Address Converted from Lat
                { lat: 45.49496410858361, lng: -73.57789133761398 } :
                property.geo}
            onClick={() => {
                setLocation(property);
                if (properties.length > 1) { // Prevents error when clicking
                    setSelect(property._id);
                }
            }}
            />
        )}

        {/* Information Window on Click */}
        {location !== null && properties.length > 0 && 
            <InfoWindow
                position={location.geo === undefined ?
                    { lat: 45.49496410858361, lng: -73.57789133761398 } :
                    location.geo}
                onCloseClick={() => {
                    setLocation(null);
                    if (properties.length > 1) {
                        setSelect(null);
                    }
                }}
            >
                <div>
                    <h3>{location.name}</h3>
                    <p>{location.type}</p>
                    <p>{location.address}</p>
                    {properties.length > 1 &&
                    <View className="blue"
                        onClick={() => {history.push(`/locations/${location._id}`)}}
                    >View Property</View>}
                </div>
            </InfoWindow>
        }
        </GoogleMap>
}));

// Styled Components
const View = styled.p`
    color: blue;
    cursor: pointer;
`;

export default LocationsMap;