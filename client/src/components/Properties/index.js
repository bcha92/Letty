import React from "react";
import styled from "styled-components";

// Locations Component
const Locations = () => {
    return <LocationWrap>
        <h2>Locations</h2>
    </LocationWrap>
};

// Styled Components
const LocationWrap = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: column;
    & > h2 {
        font-size: 30px;
        margin-bottom: 20px;
    };
`;

export default Locations;