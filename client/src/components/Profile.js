import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import { GoTriangleDown, GoTriangleRight } from "react-icons/go";

// Main Profile Component
const Profile = ({ user, PORT }) => {
    let history = useHistory(); // useHistory

    // Local States for Cancel Book and Notification
    const [showCancel, setCancel] = useState(false);
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
                        prop.approved ? <G>APPROVED</G> : <R>DECLINED</R>
                    }</B>
                    <p className={showCancel ? "prop" : ""}>
                        {prop.approved === null ?
                            <>
                                <B className="cursor"
                                    onClick={() => setCancel(!showCancel)}
                                >{showCancel ?
                                    <GoTriangleDown /> : <GoTriangleRight />
                                } Cancel Booking? </B>
                                {showCancel && <O>WARNING! Once you press this button, this action will be irreversible.
                                <Button onClick={() => deleteReservation(prop._id)}>Cancel</Button>
                                </O>}
                            </> :
                            prop.approved ?
                            <G>Your booking has been approved by the owner and cannot be cancelled by this site. Please contact the owner directly for cancellation or alternative arrangements.</G> :
                            <R>
                                Your booking has been rejected by the owner. Please press cancel to remove this from your account.
                                <Button onClick={() => deleteReservation(prop._id)}>Cancel</Button>
                            </R>
                        }
                    </p>
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
    padding: 50px;
    & > p {font-size: 20px};
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
    border: 3px solid gray;
    border-radius: 10px;
    color: black;
    padding: 20px;
    margin: 10px 0;
    max-width: 700px;
    & > p.prop {
        display: flex;
        flex-direction: column;
    };
    @media (min-width: 769px) {
        min-width: 600px;
        margin-right: 20px;
    }
`;

const ItemProp = styled(Link)`
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

const Button = styled.button`margin-left: 10px;`;

export default Profile;