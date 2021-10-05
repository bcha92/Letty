import React, { useState } from "react";
import { useHistory } from "react-router";
import { GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow } from "react-google-maps";
import styled from "styled-components";

// Map of Locations
const LocationsMap = withScriptjs(withGoogleMap(({ properties }) => {
    // Set Location on Marker Click State
    const [location, setLocation] = useState(null);
    // UseHistory Redirect Link {May need to borrow from parent state (Property)}
    let history = useHistory();

    return <GoogleMap // Default rendering of Google Maps
        defaultZoom={15}
        defaultCenter={properties === undefined ?
            // If geo is undefined, default lat/lng to Concordia University, Montreal
            { lat: 45.49496410858361, lng: -73.57789133761398 } :
            { lat: 45.49496410858361, lng: -73.57789133761398 } // properties[0].geo
        }
        >

        {/* Shows a list of properties (or property) */}
        {properties !== undefined && properties.length !== 0 &&
        properties.map(property =>
            <Marker
            key={property._id}
            position={{ lat: 45.49496410858361, lng: -73.57789133761398 }/* property.geo */} // Lat/Lng
            onClick={() => setLocation(property)}
            />
        )}

        {/* Information Window on Click */}
        {location !== null && (
            <InfoWindow
        position={{ lat: 45.49496410858361, lng: -73.57789133761398 } /* property.geo */}
        onCloseClick={() => setLocation(null)}
            >
                <div>
                    <h3>{location.name}</h3>
                    <p>{location.address}</p>
                    {properties.length > 1 &&
                    <View className="blue"
                        onClick={() => {history.push(`/locations/${location._id}`)}}
                    >View Property</View>}
                </div>
            </InfoWindow>
        )}
        </GoogleMap>
}));

// Styled Components
const View = styled.p`
    color: blue;
    cursor: pointer;
`;

export default LocationsMap;