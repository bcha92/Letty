import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styled, { keyframes } from "styled-components";

// Import Sub-Component CancelBookOption
import CancelBookOption from "./ProfileCancel";

// Main Profile Component (for Authenticated Users ONLY)
const Profile = ({ user, PORT, images }) => {
    let history = useHistory(); // useHistory

    // Local States for Cancel Book and Notification
    const [pending, setPending] = useState(null);

    // Billing States
    const [payments, setPayments] = useState(0);
    const [penPay, setPenPay] = useState(0);
    const [earnings, setEarnings] = useState(0);
    const [penEarn, setPenEarn] = useState(0);

    // Get Properties by Owner ID
    const [properties, getProperties] = useState(null);

    useEffect(() => {
        fetch(PORT + "/properties")
        .then(res => res.json())
        .then(data => {
            let earning = 0; // Earnings Confirmed
            let pendEarn = 0; // Earnings Pending
            let penArr = []; // Array for pending status
            data.data.filter(
                prop => prop.owner.userId === user.sub
            ).forEach(prop => {
                prop.rooms.forEach(room => {
                    room.reservations.forEach(res => {
                        // Sets "Pending Status"
                        if (res.approved === null &&
                            !penArr.includes(prop._id)
                        ) {penArr.push(prop._id)}

                        // Sets "Earnings and Pending Earnings"
                        if (res.approved === null) {
                            pendEarn += Number(res.charge);
                        }
                        // Payments do not include "Declined" transactions
                        else if (res.approved === false) {
                            earning += Number(res.charge);
                        }
                    })
                })
            })
            setPending(penArr);
            setEarnings(earning.toFixed(2));
            setPenEarn(pendEarn.toFixed(2));

            return getProperties(data.data.filter(
                prop => prop.owner.userId === user.sub
            ))
        })
    }, [PORT, user.sub])

    // Get Reservations by User ID
    const [reservations, getReservations] = useState(null);
    useEffect(() => {
        fetch(PORT + `/reservations/${user.sub}`)
        .then(res => res.json())
        .then(data => {
            let payments = 0; // Total Payments Owed
            let pendPay = 0; // Total Payments Pending
            data.data.forEach(res => {
                if (res.approved === null) {
                    pendPay += Number(res.charge);
                }
                else if (res.approved) {
                    payments += Number(res.charge);
                }
            })
            setPenPay(pendPay.toFixed(2));
            setPayments(payments.toFixed(2));
            return getReservations(data.data);
        })
    }, [PORT, user.sub, payments])

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

    return <ProfileWrap // Main Profile Component
        style={{ background: images === null ? "white" : `white url(${images[
            Math.floor(Math.random() * images.length)
        ]}) 100% repeat` }}
    >
        <MainProfile>{/* Main Profile Information */}
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
            <p>{// Payments for Reservations
                penPay !== "0.00" ?
                <B>Payments Due for Reservations: <R>${payments} </R>
                +<O> ${penPay} PENDING</O></B> :
                <B>Payments Due for Reservations: <R>${payments} </R></B>
            }</p>
            <p>{// Earnings for Reservations
                penEarn !== "0.00" ?
                <B>Earnings Expected from Properties: <G>${earnings} </G>
                +<O> ${penEarn} PENDING</O></B> :
                <B>Earnings Expected from Properties: <G>${earnings} </G></B>
            }</p>
            <p><B>
                Balance: {
                    Number(earnings) - Number(payments) < 0 ?
                    <R>-${(Number(earnings) - Number(payments)).toFixed(2)}</R> :
                    <G>+${(Number(earnings) - Number(payments)).toFixed(2)}</G>
                } (Pending transactions not included)
            </B>
            </p>
            </ProfileDetails>
        </MainProfile>

        <DivLine />

        {/* Reservations */}
        <HostWrapper>
            <h3>Your Reservations</h3>
            <ListWrap>
                {reservations !== null ? // List of your Reservations
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
                        prop.approved ? <G>APPROVED</G> : <R>REJECTED</R>
                    }</B>
                    {prop.approved === null ?
                    <CancelBookOption id={prop._id} /> :
                    prop.approved ?
                    <G>Your booking has been approved by the owner and cannot be cancelled by this site. Please contact the owner directly for cancellation or alternative arrangements.</G> :
                    <R>
                        Your booking has been rejected by the owner. Please press dismiss to remove this from your account.
                        <Button onClick={() => deleteReservation(prop._id)}>Dismiss</Button>
                    </R>}
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
                {properties !== null ? // List of your Hosted Properties
                properties.length !== 0 ?
                properties.map(prop =>
                    <ItemProp
                        key={prop._id}
                        to={`/locations/${prop._id}`}
                    >
                        <p><B>{prop.name}</B></p>
                        <p>{prop.address}</p>
                        <p>Property ID: <I>{prop._id}</I></p>
                        {pending.includes(prop._id) &&
                        <Biv><div /><O>You have pending reservations</O></Biv>}
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
const ProfileWrap = styled.div`
    display: flex;
    flex-direction: column;
    animation: ${fadeIn} 1s linear;
`;

const MainProfile = styled(ProfileWrap)`
    background: rgba(255, 255, 255, 0.85);
    justify-content: center;
    align-items: center;
    padding: 50px 0 20px;
    & > h2 {
        font-size: 30px;
        animation: ${fadeIn} 1800ms linear;
    };
    & > img {
        width: 200px;
        height: 200px;
        margin: 20px;
        animation: ${fadeIn} 1500ms linear;
    };
`;

const ProfileDetails = styled(ProfileWrap)`
    flex-wrap: wrap;
    padding: 50px;
    & > p {font-size: 20px};
    animation: ${fadeIn} 1200ms linear;
`;

const B = styled.span`
    font-weight: bold;
    &.cursor {cursor: pointer};
`;
const G = styled(B)`color: green;`;
const R = styled(B)`color: red;`;
const O = styled(B)`color: orange;`;
const I = styled.span`font-style: italic;`;

const DivLine = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 2px;
    width: 100%;
    background: lightgray;
`;

const HostWrapper = styled(ProfileWrap)`
    background: rgba(255, 255, 255, 0.7);
    padding: 20px;
    & > h3 {
        font-size: 26px;
        margin-bottom: 20px;
    };
`;

const ListWrap = styled(ProfileWrap)`
    margin: 10px;
    @media (min-width: 769px) {
        display: flex;
        flex-flow: row wrap;
    };
`;

const Item = styled.div`
    background: rgba(255, 255, 255, 0.8);
    border: 3px solid gray;
    border-radius: 10px;
    color: black;
    display: flex;
    flex-flow: column wrap;
    flex: 1;
    padding: 20px;
    margin: 10px 0;
    min-width: 350px;
    max-width: 40vw;
    @media (min-width: 769px) {
        min-width: 600px;
        margin-right: 20px;
    }
    animation: ${fadeIn} 2200ms linear;
`;

const ItemProp = styled(Link)`
    background: rgba(255, 255, 255, 0.9);
    text-decoration: none;
    border: 3px solid gray;
    border-radius: 10px;
    color: black;
    padding: 20px;
    margin: 10px 0;
    max-width: 700px;
    @media (min-width: 769px) {
        margin-right: 20px;
        min-width: 600px;
    };
    animation: ${fadeIn} 2500ms linear;
`;

const Biv = styled(ProfileWrap)`
    flex-direction: row;
    align-items: center;
    & > div {
        background: orange;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin: 0 10px;
    };
`;

const Button = styled.button`
    margin: 10px 0;
    font-weight: bold;
    color: white;
    background: red;
    padding: 10px;
    border-radius: 10px;
    cursor: pointer;
    transition: 500ms ease-in-out;
    &:hover {
        background: orangered;
        transition: 200ms ease-in-out;
    };
`;

export default Profile;