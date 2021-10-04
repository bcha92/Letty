import React, { useState } from "react";
import styled from "styled-components";
import { GoTriangleDown, GoTriangleRight } from "react-icons/go";

// Owner Delete Room Sub-Component
const OwnerDeleteRoom = () => {
    // Show State
    const [show, setShow] = useState(false);

    return <OwnerDeleteWrap>
        <p className="pointer"
            onClick={() => setShow(!show)}
        >
            {show ? <GoTriangleDown /> : <GoTriangleRight />}
            <B><R>Delete this Room</R></B>
        </p>
    </OwnerDeleteWrap>
};

const OwnerDeleteWrap = styled.div`
`;

const B = styled.span`font-weight: bold;`;
const R = styled.span`color: red;`;

export default OwnerDeleteRoom;