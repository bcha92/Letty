import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import { GoTriangleDown, GoTriangleRight } from "react-icons/go";

// Owner Check Reservations Sub-Component
const OwnerCheckRes = ({ // Props from Property.js
    reservations, room, property
}) => {
    let history = useHistory();
    // Dropdown State for OwnerCheckRes
    const [show, setShow] = useState(false);
    // Reservation Pending State
    const [pending, setPending] = useState(false);
    // Reply State for Owner
    const [reply, setReply] = useState("");

    // APPROVE/DENY HANDLE FOR OWNER "PATCH"
    const approveHandle = (
        propertyId, reservationId, room, bool, reply
    ) => {
        fetch("../decision", {
            // PATCH method and Headers
            method: "PATCH",
            body: JSON.stringify({
                propertyId, reservationId, room, bool, reply
            }),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        }).then(res => res.json()) // Processing from JSON
        .then(history.push("/profile"))
    };

    useEffect(() => {
        reservations.forEach(res => {
            if (res.approved === null) {
                setPending(true);
            }
        })
    })

    return <OwnerCheckWrap>
        <h4 onClick={() => setShow(!show)}>{show ?
            <GoTriangleDown /> : <GoTriangleRight />
        } Reservations for this room {
            pending && <Biv><div /><O>You have pending reservations</O></Biv>
        }</h4>

        {show && reservations.map(reservation =>
        // Iterates List of Reservations for this Room
        <ResBubble key={reservation._id}>
            <h5>Reservation ID: {reservation._id}</h5>
            <p><B>Dates:</B> { // Date Range
                reservation.dates[0] + " to " + 
                reservation.dates[reservation.dates.length - 1]
            }</p>
            {/* Message from user. Not editable */}
            <p><B>Message from User:</B> {reservation.message}</p>

            {reservation.approved !== null ?
            // Reservation Status // Optional Reply to User
            <p><B>Your reply to User:</B> {reservation.reply}</p> :
            <MessageBox // Reply Input for Owner to User
                className="reply"
                placeholder="Reply to User"
                onChange={e => setReply(e.target.value)}
            />}

            <p><B>Status:</B> {
                // Status Indicator and Buttons
                reservation.approved === null ?
                <><O>PENDING</O>
                <Button className="approve" onClick={
                    () => approveHandle(property._id, reservation._id, room.id, true, reply)
                }>APPROVE</Button>
                <Button onClick={
                    () => approveHandle(property._id, reservation._id, room.id, false, reply)
                }>REJECT</Button>
                </> :

                // If reservation is approved or not:
                reservation.approved ?
                <G>APPROVED</G> :
                <R>REJECTED</R>
            }</p>
        </ResBubble>)}
    </OwnerCheckWrap>
};

// Styled Components
const OwnerCheckWrap = styled.div`
    & > h4 {
        margin: 5px 0;
        cursor: pointer;
        display: flex;
    };
`;

const MessageBox = styled.textarea`
    margin: 10px;
    padding: 10px;
    font-size: 20px;
    min-width: 300px;
    &.reply {font-size: 16px};
    transition: 500ms ease-out;
`;

const Biv = styled.div`
    display: flex;
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

// Styled Texts
const B = styled.span`font-weight: bold;`;
const O = styled(B)`color: orange;`;
const G = styled(O)`color: green;`;
const R = styled(O)`color: red;`;

const ResBubble = styled.div`
    border: 1px solid lightgray;
    border-radius: 10px;
    padding: 10px;
    margin-top: 10px;
`;

const Button = styled.button`
    margin-left: 10px;
    padding: 10px 20px;
    font-weight: bold;
    color: white;
    background: red;
    border-radius: 10px;
    cursor: pointer;
    transition: 300ms ease-in-out;
    &:hover {
        background: orange;
        transition: 300ms ease-in-out;
    }
    &.approve {
        background: green;
        &:hover {
            background: yellowgreen;
            transform: scale(105%);
            transition: 300ms ease-in-out;
        }
    };
`;

export default OwnerCheckRes;