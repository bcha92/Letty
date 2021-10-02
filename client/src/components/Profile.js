import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

// Main Profile Component
const Profile = ({ user, PORT }) => {
    // Get Properties by Owner ID
    const [properties, getProperties] = useState(null);
    useEffect(() => {
        fetch(PORT + "/properties")
        .then(res => res.json())
        .then(data => getProperties(
            data.data.filter(
                prop => prop.owner.userId === user.sub
            )
        ))
    }, [PORT, user.sub])

    // Get Reservations by User ID
    const [reservations, getReservations] = useState(null);
    useEffect(() => {
        fetch(PORT + `/reservations/${user.sub}`)
        .then(res => res.json())
        .then(data => getReservations(data.data))
    }, [PORT, user.sub])

    console.log("PROP", properties)
    console.log("RESV", reservations);

    return <ProfileWrap>
        {/* Main Profile Component */}
        <MainProfile>
            <h2>Hello {user.name === user.email ?
                    user.nickname.slice(0, 1).toUpperCase()
                    + user.nickname.slice(1,) :
                    user.name
            }</h2>
            <img src={user.picture} alt={user.name} />
            <ProfileDetails>
            <p><B>Contact Email:</B> {user.email}</p>
            <p><B>Email Verified:</B> {
                user.email_verified ?
                <G>VERIFIED</G> : <R>NOT VERIFIED</R>
            }</p>
            </ProfileDetails>
        </MainProfile>

        <DivLine />

        {/* Reservations */}
        <HostWrapper>
            <h3>Your Reservations</h3>
            <ListWrap>
                {reservations !== null ?
                reservations.length !== 0 ?
                reservations.map(prop => 
                <Item
                    key={prop._id}
                    to={`/`}
                >
                    <p>Reservation ID: {prop._id}</p>
                </Item>
                ) :
                <B>
                    It looks like you don't have any reservations on file.
                </B>
                : <B>Loading...</B>}
            </ListWrap>
        </HostWrapper>

        {/* Hosts */}
        <HostWrapper>
            <h3>Your Properties</h3>
            <ListWrap>
                {properties !== null ?
                properties.length !== 0 ?
                properties.map(prop =>
                    <Item
                        key={prop._id}
                        to={`/locations/${prop._id}`}
                    >
                        <p><B>{prop.name}</B></p>
                    </Item>
                ) :
                <B>
                    It looks like you don't have any properties on file.
                </B>
                : <B>Loading...</B>}
            </ListWrap>
        </HostWrapper>

    </ProfileWrap>
};

// Styled Components
const ProfileWrap = styled.div`
    display: flex;
    flex-direction: column;
`;

const MainProfile = styled(ProfileWrap)`
    justify-content: center;
    align-items: center;
    padding: 50px 0 20px;
    & > h2 {font-size: 30px};
    & > img {
        width: 200px;
        height: 200px;
        margin: 20px;
    };
    `;

const ProfileDetails = styled(ProfileWrap)`
    flex-wrap: wrap;
    & > p {font-size: 20px};
    @media (min-width: 769px) {
        max-width: 400px
    };
`;

const B = styled.span`font-weight: bold;`;
const G = styled(B)`color: green;`;
const R = styled(B)`color: red;`;

const DivLine = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 2px;
    width: 100%;
    background: lightgray;
`;

const HostWrapper = styled(ProfileWrap)`
    padding: 20px;
    & > h3 {
        font-size: 26px;
        margin-bottom: 20px;
    };
`;

const ListWrap = styled(ProfileWrap)`
    margin: 10px;
`;

const Item = styled(Link)`
    text-decoration: none;
    border: 3px solid gray;
    border-radius: 10px;
    color: black;
    padding: 10px;
    margin: 10px 0;
    max-width: 700px;
`;

export default Profile;