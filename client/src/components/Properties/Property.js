import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";
import styled from "styled-components";
import { GoTriangleDown, GoTriangleRight } from "react-icons/go";

// Error Page Import
import ErrorSplash from "../Error";


// Property Details Component
const PropertyDetail = ({ isAuthenticated, user, PORT }) => {
    let history = useHistory(); // Redirect history
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
        return dateArr;
    };

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

    // Property ID parameter
    const { propertyId } = useParams();

    // Get a Location in Detail
    const [property, setProperty] = useState(null);
    const [isLoaded, setLoaded] = useState(false);

    // Dropdown Menus
    const [showDes, setDes] = useState(false);
    const [showRes, setRes] = useState(false);
    const [showFea, setFea] = useState(false);
    const [showCon, setCon] = useState(false);
    const [showBook, setBook] = useState(false);

    // Add Room Form State
    const initState = {
        id: "", rate: "", reservations: [],
    };
    const [addForm, setAddForm] = useState(initState);

    // Add Room Handler States
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch(PORT + `/properties/${propertyId}`)
        .then(res => res.json())
        .then(data => {
            if (data.status === 200) {
                setLoaded(true);
            }
            setProperty(data.data);
        })}, [PORT, propertyId])

    // Handle New Room Submit
    const addRoom = (e) => {
        e.preventDefault();
        setStatus("processing"); // Processing Status
        fetch(PORT + `/properties/${propertyId}`, {
            // PATCH method and headers
            method: "PATCH",
            body: JSON.stringify(addForm),
            headers: {
                "Accept": "application/json",
                "Content-type": "application/json",
            },
        }).then(res => res.json()) // Processing from JSON
        .then(json => { // Deconstructed Status/Message
            const { status, message } = json;
            if (status === 204) { // If request was successful
                setStatus("success");
                setMessage(message);
                // Once finished, reloads page
                window.location.reload();
            }
            else { // Else, request was not successful
                setStatus("error");
                setMessage(message);
            }
        })
    };

    // Add Reservation Form State
    const [startDay, setStartDay] = useState(""); // Start Day
    const [endDay, setEndDay] = useState(""); // End Day
    const [dates, setDates] = useState([]); // Dates
    const [verify, setVerify] = useState(false); // Verify Dates
    const [warn, setWarn] = useState(""); // Warning Verified

    const bookingForm = {
        userId: isAuthenticated ? user.sub : "",
        name: isAuthenticated ? user.name : "",
        email: isAuthenticated ? user.email : "",
        propertyName: property !== null ? property.name : "",
        propertyId, approved: null, dates: dates,
        message: "", reply: "", spaceId: "",
        charge: "", cc: "", cvc: "",
    };
    const [bookForm, setBookForm] = useState(bookingForm); // Reservation Booking Form

    // Handle Reservation Booking
    const handleReservation = (room) => {
        setBookForm({...bookForm, spaceId: room.id, dates, charge: (room.rate * dates.length).toFixed(2)});
        setStatus("processing");
        fetch(PORT + "/book", {
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

    // Reply State for Owner
    const [reply, setReply] = useState("");
    // APPROVE/DENY HANDLE FOR OWNER
    const approveHandle = (propertyId, reservationId, room, bool, reply) => {
        fetch(PORT + "/decision", {
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

    return isLoaded && property !== null ?
    <PropertyWrapper>
        <PropertyInfo>{/* Current Property Information */}
            <h2>{property.name}</h2>
            <h3>
                {property.address}
                {property.suite.length !== 0 && ", " + property.suite}
            </h3>
            <p><B>Property ID:</B> {property._id}</p>

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
                    feature => <li>{feature}</li>
                )}</ul>}
            </PropWrap>

            <PropWrap>{/* Availability of Rooms // Add Rooms if Admin */}
                <B className="rooms">
                    Available Spaces on LETTY
                </B>
                <ul className="room">{property.rooms.map(
                    room => <li key={room.id}>
                        <p><B>{room.id}:</B> ${room.rate}/day</p>
                        {isAuthenticated && // Owner Logged In & has Reservations
                        property.owner.userId === user.sub &&
                        room.reservations.length !== 0 ? // Checks for Reservations
                        <ResList>
                            <h4>Reservations for this room:</h4>
                            {room.reservations.map(reservation =>
                            <ResBubble key={reservation._id}>
                                <h5>Reservation ID: {reservation._id}</h5>
                                <p><B>Dates:</B> {
                                    reservation.dates[0] + " to " + reservation.dates[reservation.dates.length - 1]
                                }</p>
                                <p><B>Message from User:</B> {reservation.message}</p>
                                {reservation.approved !== null ? <p><B>Your reply to User:</B> {reservation.reply}</p> :
                                <MessageBox
                                    className="reply"
                                    placeholder="Reply to User"
                                    onChange={e => setReply(e.target.value)}
                                />}
                                <p><B>Status:</B> {
                                reservation.approved === null ?
                                <>
                                    <O>PENDING</O>
                                    <Button onClick={
                                        () => approveHandle(property._id, reservation._id, room.id, true, reply)
                                    }>APPROVE</Button>
                                    <Button onClick={
                                        () => approveHandle(property._id, reservation._id, room.id, false, reply)
                                    }>DENY</Button>
                                </> :
                                reservation.approved ?
                                <G>APPROVED</G> : <R>DENIED</R>
                                }</p>
                            </ResBubble>
                            )}
                        </ResList>
                        : isAuthenticated && // Owner Logged In & no Reservations
                        property.owner.userId === user.sub ?
                        <ResList>
                            <h4>No reservation has been made for this room yet</h4>
                        </ResList>
                        : isAuthenticated && // Non-owner user Logged In // Book a Room
                        property.owner.userId !== user.sub ?
                        <ResList>
                            <h4
                                onClick={() => setBook(!showBook)}
                                style={{cursor: "pointer"}}
                            >
                                {showBook ? <GoTriangleDown /> : <GoTriangleRight />}
                                Book a Room
                            </h4>
                            {showBook && <AddRoom
                                onSubmit={(e) => {
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
                                <Input
                                    type="button"
                                    value={verify ? "Change Dates" : "Select Dates"}
                                    onClick={() => {
                                        if (startDay.length === 0 ||
                                            endDay.length === 0) {
                                            setWarn("Please indicate which dates you want to book and 'Select Dates' again")
                                        }
                                        else {
                                            setDates(dateArray(startDay, endDay));
                                            setVerify(!verify);
                                            if (verify) {
                                                setWarn("");
                                            }
                                            else {
                                                setWarn("Your dates have been selected for this session")
                                            }
                                        }
                                    }}
                                />
                                {verify ?
                                <G>{warn}</G>
                                : <O>{warn}</O>}

                                <Input // Credit Card #
                                    type="number"
                                    placeholder="Credit Card *"
                                    onChange={e => setBookForm({...bookForm, cc: e.target.value})}
                                    required
                                />
                                <Input // CVC
                                    className="price"
                                    type="number"
                                    placeholder="CVC *"
                                    onChange={e => setBookForm({...bookForm, cvc: e.target.value})}
                                    required
                                />
                                <MessageBox
                                    placeholder="Message for Property Owner"
                                    onChange={e => setBookForm({...bookForm, message: e.target.value})}
                                />
                                <Input
                                    type="submit"
                                    disabled={verify ? false : true}
                                />
                                {status === "error" &&
                                <ErrBubble>
                                    <p>
                                        {message}
                                    </p>
                                </ErrBubble>}
                            </AddRoom>}
                        </ResList> :
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
                <><p className="fill"><B>Add New Space:</B> Please fill out the room name/ID and the daily rate you would like to charge for its use and press submit:</p>
                <AddRoom onSubmit={e => addRoom(e)}>
                    <div>
                        <Input // Room Name
                            onChange={e => setAddForm({...addForm, id: e.target.value})}
                            placeholder="Space Name/ID *"
                            required
                        />
                        <Input // Daily Room Rate
                            onChange={e => {
                                let value = e.target.value
                                setAddForm({...addForm, rate: value})
                            }}
                            placeholder="Rate *"
                            className="price"
                            type="number"
                            required
                        />
                    </div>
                    {// Error Message Handler
                    status === "error" &&
                    <ErrBubble>
                        <h3>Error!</h3>
                        <p>{message}</p>
                    </ErrBubble>}
                    <Input
                        type="Submit"
                    />
                </AddRoom></>}
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

const ResList = styled.div`
    & > h4 {margin: 5px 0};
`;

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

const B = styled.span`
    font-weight: bold;
`;

const O = styled(B)`
    color: orange;
    margin-left: 10px;
`;

const G = styled(B)`
    margin-left: 10px;
    color: green;
`;

const R = styled(B)`
    margin-left: 10px;
    color: red;
`;

const ResBubble = styled.div`
    border: 1px solid lightgray;
    border-radius: 10px;
    padding: 10px;
`;

const Button = styled.button`
    margin-left: 10px;
`;

export default PropertyDetail;