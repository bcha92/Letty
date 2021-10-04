import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";
import styled from "styled-components";
import { GoTriangleDown, GoTriangleRight } from "react-icons/go";

// Error Page Import
import ErrorSplash from "../Error";

// Import Sub-Components
import OwnerAddRoom from "./OwnerAddRoom";
import OwnerCheckRes from "./OwnerCheckRes";
import OwnerDeleteRoom from "./OwnerDeleteRoom";
import UserReservation from "./UserReservation";

// Property Details Component
const PropertyDetail = ({ isAuthenticated, user, PORT }) => {
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
        })}, [PORT, propertyId])

    return isLoaded && property !== null ?
    <PropertyWrapper>
        <PropertyInfo>{/* Current Property Information */}
            <h2>{property.name}</h2>
            <h3>
                {property.address}
                {property.suite.length !== 0 && ", " + property.suite}
            </h3>
            <p><B>Property ID:</B> {property._id}</p>
            <p><B>Property Type:</B> {property.type}</p>

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
                        <OwnerDeleteRoom /></>

                        : isAuthenticated && // Owner Logged In & no Reservations
                        property.owner.userId === user.sub ?
                        <ResList>
                            <h4>No reservation has been made for this room yet</h4>
                        </ResList>

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
        </PropertyInfo>
    </PropertyWrapper> :

    property === null ?
    <PropertyWrapper>
        <h2>Loading...</h2>
    </PropertyWrapper> :
    <ErrorSplash />
};

// Styled Copmonents
const PropertyWrapper = styled.div`
    display: flex;
    flex-flow: column wrap;
`;

const PropertyInfo = styled(PropertyWrapper)`
    padding: 20px;
    & > h3 {margin-bottom: 20px};
`;

const PropWrap = styled(PropertyWrapper)`
    margin: 10px 0;
    & > span {
        cursor: pointer;
        &.rooms {cursor: inherit};
    };
    & > p {
        margin-left: 20px;
        &.fill {
            margin: 10px
        };
    };
    & > ul {
        margin-left: 40px;
        &.room {
            margin-left: 20px;
            list-style: none;
            & > li {
                padding: 5px;
                border: 2px solid gray;
                border-radius: 10px;
                margin: 5px 0;
                max-width: 700px;
            }
        }
    };
`;

const ResList = styled.div`& > h4 {margin: 5px 0};`;
const B = styled.span`font-weight: bold;`;

export default PropertyDetail;