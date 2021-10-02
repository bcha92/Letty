import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import { GoTriangleDown, GoTriangleRight } from "react-icons/go";

// Error Page Import
import ErrorSplash from "../Error";

// Property Details Component
const PropertyDetail = ({ isAuthenticated, user, PORT }) => {
    // Property ID parameter
    const { propertyId } = useParams();

    // Get a Location in Detail
    const [property, setProperty] = useState(null);
    const [isLoaded, setLoaded] = useState(false);

    // Dropdown Menus
    const [showDes, setDes] = useState(false);
    const [showRes, setRes] = useState(false);
    const [showFea, setFea] = useState(false);

    // Add Room Form State
    const initState = {
        id: "", rate: "",
        reservations: [],
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

    return isLoaded && property !== null ?
    <PropertyWrapper>
        <PropertyInfo>{/* Current Property Information */}
            <h2>{property.name}</h2>
            <h3>
                {property.address}
                {property.suite.length !== 0 && ", " + property.suite}
            </h3>
            <p><B>Property ID:</B> {property._id}</p>

            <PropWrap>{/* Details in Dropdown Menus */}
                <B onClick={() => setDes(!showDes)}>{
                    showDes ? <GoTriangleDown /> : <GoTriangleRight />
                } Property Description
                </B>
                {showDes && <p>{property.description}</p>}
            </PropWrap>
            <PropWrap>
                <B onClick={() => setRes(!showRes)}>{
                    showRes ? <GoTriangleDown /> : <GoTriangleRight />
                } Rules and Restrictions
                </B>
                {showRes && <p>{property.restrictions}</p>}
            </PropWrap>
            <PropWrap>
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
                        <B>{room.id}:</B> ${room.rate}/day
                    </li>
                )}</ul>
                {property.rooms.length === 0 && <p>{
                    isAuthenticated &&
                    property.owner.userId === user.sub ?
                    "You have not registered any spaces for rent on this property." :
                    "There are no spaces for rent on this property."
                }</p>}

                {isAuthenticated &&
                property.owner.userId === user.sub &&
                <><p className="fill"><B>Add New Space:</B> Please fill out the room name/ID and the daily rate you would like to charge for its use and press submit:</p>
                <AddRoom // Add Rooms // Building Owner Only
                    onSubmit={e => addRoom(e)}
                >
                    <div>
                        <Input
                            onChange={e => setAddForm({...addForm, id: e.target.value})}
                            placeholder="Space Name/ID *"
                            required
                        />
                        <Input
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
        </PropertyInfo>
    </PropertyWrapper> :

    property === null ?
    <PropertyWrapper>
        <h2>Loading</h2>
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
                max-width: 400px;
            }
        }
    };
`;

const AddRoom = styled.form`
    display: flex;
    flex-flow: column wrap;
`;

const Input = styled.input`
    margin: 10px;
    padding: 10px;
    font-size: 20px;
    max-width: 200px;
    &.price {max-width: 100px};
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

export default PropertyDetail;