import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

// Profile Reservations Component
const Hosts = ({ PORT, user }) => {
    // Get Properties By Owner ID
    const [properties, getProperties] = useState(null);

    useEffect(() => {
        fetch(PORT + "/properties")
        .then(res => res.json())
        .then(data => getProperties(
            data.data.filter(
                prop => prop.owner.userId === user.sub
            )
        ))
    }, [PORT, user.sub])

    console.log(properties);

    return <HostWrapper>
        <h3>Your Properties</h3>
        <HostList>
            {properties !== null ? properties.map(prop =>
                <Item
                    key={prop._id}
                    to={`/locations/${prop._id}`}
                >
                    <p><B>{prop.name}</B></p>
                </Item>
            ) : <h3>Loading</h3>}
        </HostList>
    </HostWrapper>
};

// Styled Components
const HostWrapper = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: column;
    & > h3 {
        font-size: 26px;
        margin-bottom: 20px;
    };
`;

const HostList = styled.div`
    display: flex;
    flex-flow: column wrap;
`;

const Item = styled(Link)`
    text-decoration: none;
    border: 3px solid gray;
    border-radius: 10px;
    color: black;
    padding: 10px;
    margin: 10px 0;
    max-width: 700px;
`;

const B = styled.span`
    font-weight: bold;
`;

export default Hosts;