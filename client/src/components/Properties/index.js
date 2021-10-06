import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import styled, { keyframes } from "styled-components";
import LocationsMap from "./PropertyMap";

// Locations Component
const Locations = ({ PORT, GK }) => {
    let history = useHistory(); // History
    // Get Properties
    const [list, setList] = useState(null);
    const [select, setSelect] = useState(null);

    // Set Property Filter State by Type
    const [type, setType] = useState("all");
    const [propType, setPropType] = useState([]);

    // Set Location on Marker Click State
    const [location, setLocation] = useState(null);

    useEffect(() => {
        fetch(PORT + `/properties?type=${type}`)
        .then(res => res.json())
        .then(data => setList(data.data))
        fetch(PORT + "/types")
        .then(res => res.json())
        .then(data => setPropType(data.data))
    }, [PORT, type])

    return <LocationWrap>
        <LocationList onClick={() => setSelect(null)}>
            <h2>Locations</h2>
            <h3>Filter By Type:</h3>
            <Select // Type of Property
                onChange={e => setType(e.target.value)}
                defaultValue="all"
            >{/* Property Types options mapped by fetch */}
                <option key="all" value="all">All - No Filter</option>
                {propType !== null && propType.map((type, index) => 
                <option key={index} value={type}>{type}</option>)}
            </Select>
            {list !== undefined && list === null ? <h2>Loading...</h2> :
            list.length === 0 ?
            <h2>There are no locations that match your criteria</h2> :
            list.map(property =>
                // List of Properties Iterated
                <Item
                    key={property._id}
                    className={select === property._id && "selected"}
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelect(property._id);
                        setLocation(property);
                    }}
                >
                    <h2>{property.name}</h2>
                    <p>
                        {property.address}
                        {property.suite.length !== 0 &&
                        ", " + property.suite}
                    </p>
                    <p>Property Type: {property.type}</p>
                    <p
                        className="blue"
                        onClick={() => history.push(`/locations/${property._id}`)}
                    >View Property in Detail</p>
                </Item>
            )}
        </LocationList>

        {/* MAP // GOOGLE MAP // AREA */}
        {list !== null && <div style={{width: "100%", height: "80vh"}} className="map">
            <LocationsMap
                googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${GK}`}
                loadingElement={<div style={{ height: "100%" }} />}
                containerElement={<div style={{
                    height: "100%", marginLeft: "20px",
                }} />}
                mapElement={<div style={{ height: "100%" }} />}
                properties={list}
                zoom={14}
                setSelect={setSelect}
                select={select}
                location={location}
                setLocation={setLocation}
            />
        </div>}

    </LocationWrap>
};

// Keyframes Animation
const fadeIn = keyframes`
    from { // Starting Position
        opacity: 0;
        transform: translateY(-50px);
    }

    30% {
        opacity: 0.5;
        transform: translateY(-10px);
    }
    60% {transform: translateY(-5px)}
    80% {transform: translateY(-2px)}

    to {
        opacity: 1;
        transform: translateY(0px);
    }
`;

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
    & > div.map {
        animation: ${fadeIn} 2000ms linear;
    };
`;

const LocationList = styled.div`
    display: flex;
    flex-flow: column wrap;
`;

const Select = styled.select`
    z-index: 5;
    margin: 10px;
    padding: 10px;
    max-width: 400px;
    font-size: 18px;
    transition: 500ms ease-in-out;
    &:hover {
        background: whitesmoke;
        transform: scale(105%);
        transition: 300ms ease-in-out
    }
`;

const Item = styled.div`
    text-decoration: none;
    border: 4px solid gray;
    border-radius: 10px;
    color: black;
    padding: 10px;
    margin: 10px 0;
    max-width: 700px;
    cursor: pointer;
    &:hover {
        background: whitesmoke;
        border: 4px solid yellowgreen;
        transition: 300ms ease-in-out;
    }
    &.selected {
        border: 4px solid skyblue;
        background: whitesmoke;
        transform: scale(105%);
        transition: 400ms ease-in;
    };
    & > p.blue {
        color: blue;
        cursor: pointer;
    };
    transition: 400ms ease-out;
    animation: ${fadeIn} 1200ms linear;
`;

export default Locations;