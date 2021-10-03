import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";

// Main Profile Component
const Profile = ({ user, PORT }) => {
    let history = useHistory(); // useHistory
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

    // Delete Reservation Handler
    const deleteReservation = (reservationId) => {
        fetch(PORT + `/book/${reservationId}`, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        }).then(res => res.json()) // Processing from JSON
        .then(history.push("/"))
    }

    console.log(properties);

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
                <Item key={prop._id}>
                    <p><B>Reservation ID:</B> {prop._id}</p>
                    <p><B>Booking Date:</B> {prop.timestamp.slice(0, 10)}</p>
                    <p><B>Property:</B> {prop.propertyName}</p>
                    <p><B>Space Booked:</B> {prop.spaceId}</p>
                    <p><B>Dates:</B> {prop.dates[0]} to {prop.dates[prop.dates.length - 1]}
                    </p>
                    <p><B>Payment Due for this Reservation:</B> ${prop.charge}</p>
                    <p><B>Message to Owner:</B> {
                        prop.message.length !== 0 ? prop.message : "<No message>"
                    }</p>
                    <p><B>Reply from Owner:</B> {
                        prop.reply.length !== 0 ? prop.reply : "No reply yet... or the owner chose not to provide a reply message."
                    }</p>
                    <B>Status: {
                        prop.approved === null ? <O>PENDING</O> :
                        prop.approved ? <G>APPROVED</G> : <R>DECLINED</R>
                    }</B>
                    <p><B>
                        Cancel Booking? {prop.approved === null ?
                            <O>WARNING! Once you press this button, this action will be irreversible.</O> :
                            prop.approved ?
                            <G>Your booking has been approved by the owner and cannot be cancelled by this site. Please contact the owner directly for cancellation or alternative arrangements.</G> :
                            <R>Your booking has been rejected by the owner. Please press cancel to remove this from your account.</R>
                        }
                    </B></p>
                    {!prop.approved && <Button onClick={() => deleteReservation(prop._id)}>Cancel</Button> /* Cancel Reservation Button */}
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
                    <ItemProp
                        key={prop._id}
                        to={`/locations/${prop._id}`}
                    >
                        <p><B>{prop.name}</B></p>
                    </ItemProp>
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
const O = styled(B)`color: orange;`;

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

const Item = styled.div`
    border: 3px solid gray;
    border-radius: 10px;
    color: black;
    padding: 10px;
    margin: 10px 0;
    max-width: 700px;
    `;

const ItemProp = styled(Link)`
    text-decoration: none;
    border: 3px solid gray;
    border-radius: 10px;
    color: black;
    padding: 10px;
    margin: 10px 0;
    max-width: 700px;
`;

const Button = styled.button``;


export default Profile;