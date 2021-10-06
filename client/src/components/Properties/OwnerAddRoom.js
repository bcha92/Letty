import React, { useState } from "react";
import styled from "styled-components";
import { GoTriangleDown, GoTriangleRight } from "react-icons/go";

// Owner Add Room Sub-Component
const OwnerAddRoom = ({ propertyId, history }) => {
    // Add Room Form State
    const initState = {
        id: "", rate: "0", occupancy: "", reservations: [],
    };

    // Show Add Room Tab
    const [show, setShow] = useState(false);
    const [addForm, setAddForm] = useState(initState);
    // Add Room Handler States
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");

    // Handle New Room Submit "PATCH"
    const addRoom = (e) => {
        e.preventDefault();
        setStatus("processing"); // Processing Status
        fetch(`../properties/${propertyId}`, {
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
                // Once finished, redirect page to profile
                history.push("../profile");
            }
            else { // Else, request was not successful
                setStatus("error");
                setMessage(message);
            }
        })
    };

    return <OwnerAddWrap>
        <p className="pointer"
            onClick={() => setShow(!show)}
        >
            {show ? <GoTriangleDown /> : <GoTriangleRight />}
            <B>Add New Space</B>
        </p>

        {// Show/Hide Tab
        show && <div>
        <p>Please fill out the room name/ID, maximum occupancy of people for this room, and the daily rate you would like to charge for its use and press submit.</p>
        <AddRoom onSubmit={e => addRoom(e)}>
            <div>
                <Input // Room Name
                    onChange={e => setAddForm({...addForm, id: e.target.value})}
                    placeholder="Space Name/ID *"
                    required
                />
                <Input // Max Occupancy for Room
                    onChange={e => setAddForm({...addForm, occupancy: e.target.value})}
                    type="number"
                    placeholder="Persons *"
                    className="price"
                    required
                />
                <Input // Daily Room Rate
                    onChange={e => {
                        let value = e.target.value
                        setAddForm({...addForm, rate: value})
                    }}
                    type="number"
                    placeholder="Rate *"
                    className="price"
                    required
                />
                <Input
                    type="Submit"
                    className="submit"
                />
            </div>

            {// Error Message Handler
            status === "error" &&
            <ErrBubble>
                <h3>Error!</h3>
                <p>{message}</p>
            </ErrBubble>}
        </AddRoom>
        </div>}
    </OwnerAddWrap>
};

// Styled Components
const OwnerAddWrap = styled.div`
    & > p {
        margin-left: 10px;
        &.pointer {
            margin-left: 0;
            cursor: pointer;
        }
    };
    & > div {margin-left: 15px};
`;

const AddRoom = styled.form`
    display: flex;
    flex-flow: column wrap;
`;

const Input = styled.input`
    margin: 5px;
    padding: 10px;
    font-size: 20px;
    max-width: 200px;
    &.price {max-width: 100px};
    &.date {z-index: 1};
    &.submit {
        padding: 10px 20px;
        font-weight: bold;
        color: white;
        background: green;
        border-radius: 10px;
        cursor: pointer;
        transition: 300ms ease-in-out;
        &:hover {
            background: yellowgreen;
            transition: 300ms ease-in-out;
        }
    }
`;

const ErrBubble = styled.div`
    display: flex;
    flex-flow: column wrap;
    margin: 0 5px;
    padding: 20px;
    background: rgba(255, 0, 0, 0.2);
    border: 1px solid red;
    border-radius: 10px;
    color: rgb(200, 0, 0);
    max-width: 400px;
    & > h3 {margin-bottom: 10px};
`;

const B = styled.span`font-weight: bold;`;

export default OwnerAddRoom;