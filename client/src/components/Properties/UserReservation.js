import React, { useState } from "react";
import styled from "styled-components";
import { GoTriangleDown, GoTriangleRight } from "react-icons/go";

// User Reservation Booking
const UserReservation = ({
    property, propertyId, user, history, room,
}) => {
    // Dropdown State for User Reservation
    const [show, setShow] = useState(false);

    const maxDay = (start) => {
        let newStart = new Date(start);
        newStart.setDate(newStart.getDate() + 29);
        return newStart.toISOString().slice(0, 10);
    }

    const today = () => {
        let today = new Date();
        today.setDate(today.getDate() + 1);
        return today.toISOString().slice(0, 10);
    }
    
    // Reservation Booking Form Initial State
    const bookingForm = {
        userId: user.sub,
        name: user.name,
        email: user.email,
        propertyName: property.name,
        propertyId, approved: null, dates: [],
        message: "", reply: "", spaceId: room.id,
        charge: "", cc: "", cvc: "",
    };

    // Reservation Booking Form
    const [bookForm, setBookForm] = useState(bookingForm);
    const [startDay, setStartDay] = useState(""); // Start Day
    const [endDay, setEndDay] = useState(""); // End Day
    const [verify, setVerify] = useState(false); // Verify Dates
    const [warn, setWarn] = useState(""); // Warning Verified

    // Date Array Function
    const dateArray = (start, end=start) => {
        // start and end are date ISO strings
        let newStart = new Date(start);
        newStart.setDate(newStart.getDate())
        let newEnd = new Date(end);
        newEnd.setDate(newEnd.getDate());
        let dateArr = []; // New Array to be Returned

        for (newStart; newStart <= newEnd; newStart.setDate(newStart.getDate() + 1)) {
            dateArr.push(newStart.toISOString().slice(0, 10));
        }
        if (!dateArr.includes(newEnd.toISOString().slice(0, 10))) {
            dateArr.push(newEnd.toISOString().slice(0, 10));
        }

        setBookForm({...bookForm,
            dates: dateArr,
            charge: (room.rate * dateArr.length).toFixed(2)});
        return
    };

    // Add Reservation Handler States
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");

    // Handle Reservation Booking
    const handleReservation = (room) => {
        setStatus("processing");
        fetch("../book", {
            // POST method and headers
            method: "POST",
            body: JSON.stringify(bookForm),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        }).then(res => res.json()) // Processing from JSON
        .then(json => { // Deconstructed Status/Message
            const {status, message} = json;
            if (status === 201) { // If request was successful
                setStatus("success");
                setMessage(message);
                // Once finished, redirect to reservations
                history.push(`/profile/${json.data._id}`)
            }
            else { // Else, request was not successful
                setStatus("error")
                setMessage(message);
            }
        })
    };

    console.log(bookForm);

    return <BookWrapper>
        <h4
            onClick={() => setShow(!show)}
            style={{cursor: "pointer"}}
        >
            {show ? <GoTriangleDown /> : <GoTriangleRight />}
            Book a Room
        </h4>
        {show && <AddRoom
            onSubmit={e => {
                e.preventDefault();
                handleReservation(room);
            }}
            className="datebook"
        >
            <Input // From Date
                className="date"
                onChange={e => setStartDay(e.target.value)}
                min={today()}
                type="date"
                disabled={verify ? true : false}
                required
            />
            <Input // To Date
                className="date"
                onChange={e => setEndDay(e.target.value)}
                type="date"
                disabled={verify ? true : false}
                min={startDay}
                max={startDay !== "" ? maxDay(startDay) : startDay}
                required
            />
            <Input // Date Lock In
                type="button"
                value={verify ? "Change Dates" : "Set Dates"}
                onClick={() => {
                    if (startDay.length === 0 ||
                    endDay.length === 0) {
                        setWarn("Please indicate which dates you want to book and 'Select Dates' again")
                    }
                    else {
                        dateArray(startDay, endDay);
                        setVerify(!verify);
                        if (verify) {
                            setWarn("");
                        }
                        else {
                            setWarn("Your dates have been set. Please continue with your booking.")
                        }
                    }
                }}
            />
            {verify ? <><G>{warn}</G>

            <Input // Credit Card #
                type="number"
                placeholder="Credit Card *"
                onChange={e => setBookForm({...bookForm, cc: e.target.value})}
                disabled={verify ? false : true}
                required
                />
            <Input // CVC
                className="price"
                type="number"
                placeholder="CVC *"
                onChange={e => setBookForm({...bookForm, cvc: e.target.value})}
                disabled={verify ? false : true}
                required
                />
            <MessageBox // Message for Property Owner
                placeholder="Message to Owner"
                onChange={e => setBookForm({...bookForm, message: e.target.value})}
                disabled={verify ? false : true}
                />
            <Input
                type="submit"
                disabled={verify ? false : true}
                />
            {status === "error" &&
            <ErrBubble>
                <p>{message}</p>
            </ErrBubble>}

            </> : <O>{warn}</O>}
        </AddRoom>}
    </BookWrapper>
};

// Styled Components
const BookWrapper = styled.div`& > h4 {margin: 5px 0};`;

const AddRoom = styled.form`
    display: flex;
    flex-flow: column wrap;
    &.datebook {
        @media (min-width: 769px) {
            display: flex;
            flex-direction: row;
        }
    };
`;

const Input = styled.input`
    margin: 10px;
    padding: 10px;
    font-size: 20px;
    max-width: 200px;
    &.price {max-width: 100px};
    &.date {z-index: 1};
`;

const MessageBox = styled.textarea`
    margin: 10px;
    padding: 10px;
    font-size: 20px;
    min-width: 300px;
    &.reply {font-size: 16px};
`;

const ErrBubble = styled.div`
    display: flex;
    flex-flow: column wrap;
    margin: 0 10px;
    padding: 20px;
    background: rgba(255, 0, 0, 0.2);
    border: 1px solid red;
    border-radius: 10px;
    color: rgb(200, 0, 0);
    max-width: 400px;
    & > h3 {margin-bottom: 10px};
`;

const O = styled.span`
    margin: 0 10px;
    font-weight: bold;
    color: orange;
`;
const G = styled(O)`color: green;`;

export default UserReservation;