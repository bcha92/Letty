import React, { useState, useEffect } from "react";
import styled from "styled-components";

// Locations Component
const Locations = ({ PORT }) => {
    // Get Properties
    const [list, setList] = useState(null);

    useEffect(() => {
        fetch(PORT + "/properties")
        .then(res => res.json())
        .then(data => setList(data))
    }, [PORT])

    console.log(list);
    
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