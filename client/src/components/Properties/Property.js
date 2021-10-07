import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";
import styled, { keyframes } from "styled-components";
import { GoTriangleDown, GoTriangleRight } from "react-icons/go";

// Error Page Import
import ErrorSplash from "../Error";

// Import Sub-Components
import OwnerAddRoom from "./OwnerAddRoom";
import OwnerCheckRes from "./OwnerCheckRes";
import OwnerDeleteRoom from "./OwnerDeleteRoom";
import UserReservation from "./UserReservation";
import LocationDetailMap from "./PropertyDetailMap";
import ImageCarousel from "./ImageCarousel";

// Property Details Component
const PropertyDetail = ({ isAuthenticated, user, PORT, GK }) => {
    let history = useHistory(); // Redirect history
    const { propertyId } = useParams(); // Property ID parameter

    // Get a Location in Detail
    const [property, setProperty] = useState(null);
    const [isLoaded, setLoaded] = useState(false);

    // Dropdown Menus
    const [showDes, setDes] = useState(false);
    const [showRes, setRes] = useState(false);
    const [showFea, setFea] = useState(false);
    const [showCon, setCon] = useState(false);

    useEffect(() => {
        fetch(PORT + `/properties/${propertyId}`)
        .then(res => res.json())
        .then(data => {
            if (data.status === 200) {
                setLoaded(true);
            }
            setProperty(data.data);
        })
    }, [PORT, propertyId])

    return isLoaded && property !== null ?
    <PropertyWrapper
        style={{ background: property.images.length === 0 ? "white" : `white url(${property.images[
            Math.floor(Math.random() * property.images.length)
        ]}) repeat center`
        }}
    >
        <div>
            <PropertyInfo>{/* Current Property Information */}
                <h2>{property.name}</h2>
                <h3>
                    {property.address}
                    {property.suite.length !== 0 && ", " + property.suite}
                </h3>
                <p><B>Property ID:</B> {property._id}</p>
                <p><B>Property Type:</B> {property.type}</p>

                <DobWrap>
                {/* MAP // GOOGLE // PROPERTY LOCAL */}
                    <div style={{
                        width: "300px", height: "300px", margin: "20px"
                    }}>
                        <LocationDetailMap
                            googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${GK}`}
                            loadingElement={<div style={{ height: "100%" }} />}
                            containerElement={<div style={{ height: "100%" }} />}
                            mapElement={<div style={{ height: "100%" }} />}
                            property={property}
                        />
                    </div>

                    {/* Image Carousel */}
                    <ImageCarousel images={property.images} />
                </DobWrap>

                {/* Details in Dropdown Menus */}
                <PropWrap>{/* Property Description */}
                    <B onClick={() => setDes(!showDes)}>{
                        showDes ? <GoTriangleDown /> : <GoTriangleRight />
                    } Property Description
                    </B>
                    {showDes && <p>{property.description}</p>}
                </PropWrap>
                <PropWrap>{/* Property Rules and Restrictions */}
                    <B onClick={() => setRes(!showRes)}>{
                        showRes ? <GoTriangleDown /> : <GoTriangleRight />
                    } Rules and Restrictions
                    </B>
                    {showRes && <p>{property.restrictions}</p>}
                </PropWrap>
                <PropWrap>{/* Property Features List */}
                    <B onClick={() => setFea(!showFea)}>{
                        showFea ? <GoTriangleDown /> : <GoTriangleRight />
                    } Features and Site Facilities
                    </B>
                    {showFea && <ul>{property.features.map(
                        (feature, index) => <li key={index}>{feature}</li>
                    )}</ul>}
                </PropWrap>
            </PropertyInfo>
        </div>

        <div>
            <PropWrap>{/* Availability of Rooms // Add Rooms if Admin */}
                <B className="rooms">
                    Available Spaces on LETTY
                </B>
                <ul className="room">{property.rooms.map(
                    room => <li key={room.id}>
                        <p><B>{room.id}:</B> ${room.rate}/day</p>
                        <p><B>Max Occupancy:</B> {room.occupancy} { // Max Occupancy of Each Room
                            room.occupancy === "1" ? "person" : "people"
                        }</p>
                        {isAuthenticated && // Owner Logged In & has Reservations
                        property.owner.userId === user.sub &&
                        room.reservations.length !== 0 ? // Checks for Reservations

                        // OwnerCheckRes.js sub-component
                        <><OwnerCheckRes
                            reservations={room.reservations}
                            history={history}
                            room={room}
                            property={property}
                        />
                        <OwnerDeleteRoom
                            propertyId={property._id}
                            spaceId={room.id}
                        /></>

                        : isAuthenticated && // Owner Logged In & no Reservations
                        property.owner.userId === user.sub ?
                        <><ResList>
                            <h4>No reservation has been made for this room yet</h4>
                        </ResList>
                        <OwnerDeleteRoom
                            propertyId={property._id}
                            spaceId={room.id}
                            history={history}
                        />
                        </>

                        : isAuthenticated && // Non-owner user Logged In // Book a Room
                        property.owner.userId !== user.sub ?
                        // UserReservation.js Sub-Component
                        <UserReservation
                            property={property}
                            user={user}
                            propertyId={propertyId}
                            history={history}
                            room={room}
                        /> :
                        // Guests and users NOT Logged In
                        <ResList>
                            <h4>You must be logged in to book a space</h4>
                        </ResList>}
                    </li>
                )}</ul>

                {/* Owner Only // Rooms not Booked for this Property */}
                {property.rooms.length === 0 && <p>{
                    isAuthenticated &&
                    property.owner.userId === user.sub ?
                    "You have not registered any spaces for rent on this property." :
                    "There are no spaces for rent on this property."
                }</p>}

                {/* Add Rooms // Property Owner Only */}
                {isAuthenticated &&
                property.owner.userId === user.sub &&
                // OwnerAddRoom.js: OwnerAddRoom Sub-Component
                <OwnerAddRoom
                    propertyId={property._id}
                    history={history}
                />}

            </PropWrap>
            {/* Owner Contact Information // Shown to everyone except owner */}
            {(!isAuthenticated || property.owner.userId !== user.sub) &&
            <PropWrap>
                <B onClick={() => setCon(!showCon)}>{
                    showCon ? <GoTriangleDown /> : <GoTriangleRight />
                } Contact Information
                </B>
                {showCon && <>
                    <p><B>Name:</B> {property.owner.name}</p>
                    <p><B>Email:</B> {property.owner.email}</p>
                </>}
            </PropWrap>}
        </div>
    </PropertyWrapper> :

    property === null ?
    <PropertyWrapper>
        <h2>Loading...</h2>
    </PropertyWrapper> :
    <ErrorSplash />
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

// Styled Copmonents
const PropertyWrapper = styled.div`
    display: flex;
    flex-flow: column wrap;
    & > div {background: rgba(255, 255, 255, 0.8)};
    @media (min-width: 1000px) {
        display: flex;
        flex-direction: row;
        & > div {
            background: rgba(255, 255, 255, 0.8);
            display: flex;
            flex-direction: column;
            flex: 1;
        };
    };
    animation: ${fadeIn} 4s linear;
`;

const PropertyInfo = styled.div`
    display: flex;
    flex-flow: column wrap;
    padding: 10px;
    & > h3 {margin-bottom: 10px};
    & > h2, h3, p {margin: 0 20px};
    animation: ${fadeIn} 2s linear;
`;

const PropWrap = styled(PropertyInfo)`
    background: rgba(255, 255, 255, 0.8);
    border-radius: 20px;
    margin: 20px;
    & > span {
        cursor: pointer;
        &.rooms {
            cursor: inherit;
            margin: 0 20px 10px;
        };
    };
    & > p {margin-left: 20px};
    & > ul {
        margin-left: 40px;
        &.room {
            margin-left: 20px;
            list-style: none;
            & > li {
                & > p {margin-left: 0};
                background: white;
                padding: 20px;
                border: 2px solid gray;
                border-radius: 10px;
                margin: 5px 0;
                max-width: 700px;
                animation: ${fadeIn} 2500ms linear;
            };
        };
    };
    animation: ${fadeIn} 2200ms linear;
`;

const DobWrap = styled(PropertyInfo)`
    background: rgba(255, 255, 255, 0.9);
    border-radius: 20px;
    margin: 20px;
    padding-right: 30px;
    align-items: center;
    @media (min-width: 1680px) {
        flex-direction: row;
        justify-content: space-between;
    };
    & > div {
        animation: ${fadeIn} 2500ms linear;
    };
    animation: ${fadeIn} 2200ms linear;
`;

const ResList = styled.div`& > h4 {margin: 5px 0};`;
const B = styled.span`
    font-weight: bold;
`;

export default PropertyDetail;