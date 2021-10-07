import React, { useState } from "react";
import { useHistory } from "react-router";
import { GoTriangleDown, GoTriangleRight } from "react-icons/go";
import styled from "styled-components";

// Dropdown Option for Cancel Reservation
const CancelBookOption = ({ id }) => {
    let history = useHistory(); // UseHistory
    // Show Cancel Book Option Dropdown State
    const [show, setShow] = useState(false);

        // Delete Reservation Handler
    const deleteReservation = (reservationId) => {
        fetch(`../book/${reservationId}`, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        }).then(res => res.json()) // Processing from JSON
        .then(history.push("/"))
    }

    return <CancelWrap>
        <B
            className="cursor"
            onClick={() => setShow(!show)}
        >{show ? <GoTriangleDown /> : <GoTriangleRight />
        } Cancel Booking ?</B>

        {show &&
        <>
            <O>WARNING! Once you press this button, there's no turning back.</O>
            <Button
                onClick={() => deleteReservation(id)}
            >
                Cancel Booking
            </Button>
        </>}
    </CancelWrap>
};

// Styled Components
const CancelWrap = styled.div`
    display: flex;
    flex-flow: column wrap;
    margin-top: 5px;
`;

const B = styled.p`
    font-weight: bold;
    &.cursor {cursor: pointer};
`;
const O = styled(B)`
    color: orange;
    margin: 5px 0 10px;
`;

const Button = styled.button`
    font-weight: bold;
    color: white;
    max-width: 160px;
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

export default CancelBookOption;