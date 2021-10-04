import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import WrappedMap from "./PropertiesMap";

// Locations Component
const Locations = ({ PORT, GK }) => {
    // Get Properties
    const [list, setList] = useState(null);

    useEffect(() => {
        fetch(PORT + "/properties")
        .then(res => res.json())
        .then(data => setList(data.data))
    }, [PORT])
    
    return <LocationWrap>
        <LocationList>
        <h2>Locations</h2>
            {list !== null ? list.map(property =>
                // List of Properties Iterated in DOM
                <Item
                    key={property._id}
                    to={`/locations/${property._id}`}
                >
                    <h2>{property.name}</h2>
                    <p>
                        {property.address}
                        {property.suite.length !== 0 &&
                        ", " + property.suite}
                    </p>
                </Item>
            ) : <h2>Loading...</h2>}
        </LocationList>
        <div style={{width: "100%", height: "100vh"}}>
            <WrappedMap
                googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${GK}`}
                loadingElement={<div style={{ height: "100%" }} />}
                containerElement={<div style={{
                    height: "100%", marginLeft: "20px",
                }} />}
                mapElement={<div style={{ height: "100%" }} />}
            />
        </div>
    </LocationWrap>
};

// Styled Components
const LocationWrap = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: column;
    & > h2 {
        font-size: 30px;
        margin-bottom: 20px;
    };
    @media (min-width: 769px) {
        flex-direction: row;
    };
`;

const LocationList = styled.div`
    display: flex;
    flex-flow: column wrap;
`;

const Item = styled(Link)`
    text-decoration: none;
    border: 4px solid gray;
    border-radius: 10px;
    color: black;
    padding: 10px;
    margin: 10px 0;
    max-width: 700px;
`;

export default Locations;