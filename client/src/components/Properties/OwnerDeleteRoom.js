import React, { useState } from "react";
import styled from "styled-components";
import { GoTriangleDown, GoTriangleRight } from "react-icons/go";

// Owner Delete Room Sub-Component
const OwnerDeleteRoom = ({ propertyId, spaceId, history }) => {
    // Show State
    const [show, setShow] = useState(false);

    // Handle Delete a Room and Redirect to Profile
    const handleDelete = (propertyId, spaceId) => {
        fetch(`../properties/${propertyId}/${spaceId}`, {
            // PATCH method and headers
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
        .then(history.push("../profile"))
    };

    return <OwnerDeleteWrap>
        <p className="pointer"
            onClick={() => setShow(!show)}
        >
            {show ? <GoTriangleDown /> : <GoTriangleRight />}
            <R>Delete this Room</R>
        </p>
        {show && <>
        <p><O>Warning! Once you press this button, this action is irreversible. The room will be deleted from this property and any reservations made associated with this property will be cancelled.</O></p>
        <button onClick={() => handleDelete(propertyId, spaceId)}>DELETE</button>
        </>}
    </OwnerDeleteWrap>
};

const OwnerDeleteWrap = styled.div`
    & > p {
        margin-left: 20px;
        &.pointer {
            margin-left: 0;
            cursor: pointer;
        }
    };
    & > button {
        margin: 10px 20px;
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
        };
    };
`;

const B = styled.span`font-weight: bold;`;
const R = styled(B)`color: red;`;
const O = styled(B)`color: orange;`;

export default OwnerDeleteRoom;