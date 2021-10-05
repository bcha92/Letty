import React from "react";
import styled from "styled-components";

// Hosting Page for Non-Authenticated Users
const HostingIntro = ({ loginWithRedirect }) => {
    return <HostWrap>
        <h2>Host your Property with Ease!</h2>
        <p>Here at LETTY, we prize ourselves as being the premier intermediary between commercial property owners and short-term users.</p>
        <h3>Free Registration with No Recurring Service Charges</h3>
        <p>We are merely facilitators between users seeking short-term rentals of commercial properties to conduct businesses or simply engage in hobby work.</p>
        <p>We don't believe in punishing service charges if you can't find renters for your properties.</p>
        <h3>You only pay when you get paid.</h3>
        <p>So what are you waiting for? LETTY-us get started!</p>
        <button onClick={() => loginWithRedirect()}>Login</button>
    </HostWrap>
};

// Styled Components
const HostWrap = styled.div`
    padding: 20px;
    & > h2 {
        font-size: 30px;
        margin-bottom: 10px;
    };
    & > h3 {
        font-size: 24px;
        margin: 10px 0 5px;
    };
    & > p {
        font-size: 20px;
        margin-top: 5px;
    };
`;

export default HostingIntro;