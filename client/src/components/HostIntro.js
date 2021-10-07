import React from "react";
import styled, { keyframes } from "styled-components";

// Hosting Component for Non-Authenticated Users
const HostingIntro = ({ loginWithRedirect, images }) => {
    return <Splash
        style={{ background: images === null || images.length === 0 ? "white" : `white url(${images[
            Math.floor(Math.random() * images.length)
        ]}) repeat center`, minHeight: "100vh"
        }}
    >
        <HostWrap>{/* Introduction Panel with Link to Login Page via Auth0 */}
            <h2>Host your Property with Ease!</h2>
            <p>Here at LETTY, we prize ourselves as being the premier intermediary between commercial property owners and short-term users.</p>
            <h3>Free Registration with No Recurring Service Charges</h3>
            <p>We are merely facilitators between users seeking short-term rentals of commercial properties to conduct businesses or simply engage in hobby work.</p>
            <p>We don't believe in punishing service charges if you can't find renters for your properties.</p>
            <h3>You only pay when you get paid.</h3>
            <p>So what are you waiting for? Join our ranks as owner-operators and LETTY-us get started!</p>
            <Button onClick={() => loginWithRedirect()}>Login</Button>
        </HostWrap>
    </Splash>
};

// Keyframes Animation
const fadeIn = keyframes`
    from { // Starting Position
        opacity: 0;
        transform: translateY(-50px);
    }

    30% {
        opacity: 0.5;
        transform: translateY(-10px);
    }
    60% {transform: translateY(-5px)}
    80% {transform: translateY(-2px)}

    to {
        opacity: 1;
        transform: translateY(0px);
    }
`;

// Styled Components
const Splash = styled.div`
    display: flex;
    flex-flow: column wrap;
    animation: ${fadeIn} 2500ms linear;
`;

const HostWrap = styled(Splash)`
    background: rgba(255, 255, 255, 0.8);
    border-radius: 20px;
    padding: 20px;
    margin: 50px;
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
    @media (min-width: 769px) {
        max-width: 45%;
    };
    animation: ${fadeIn} 1400ms linear;
`;

const Button = styled.button`
    font-weight: bold;
    font-size: 20px;
    background: dodgerblue;
    cursor: pointer;
    color: white;
    padding: 20px;
    margin-top: 30px;
    max-width: 200px;
    border-radius: 10px;
    transition: 300ms ease-in-out;
    &:hover {
        background: skyblue;
        transition: 500ms ease-in-out;
        transform: scale(110%);
    };
    animation: ${fadeIn} 2100ms linear;
`;

export default HostingIntro;