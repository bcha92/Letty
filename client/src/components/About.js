import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

// About Component
const About = ({ images }) => {
    // Randomized Background Images
    const [i, setI] = useState();
    useEffect(() => {
        setI(images !== null ? Math.floor(Math.random() * images.length) : 0)
    }, [images])

    return <Splash
        style={{ background: images === null ? "white" : `white url(${images[i]}) 100% repeat` }}
    >
        <AboutWrap>
            <h2>About Us</h2>
            <p>This is a concept website demonstration of a short-term commercial space rental and reservation using Javascript React Hooks and Node Express.</p>
            <p>Project Author: Brandon Cha</p>
            <div>
            <p className="links">
                <a href="https://github.com/bcha92">GitHub</a>
            </p>
            <p className="links">
                <a href="https://www.linkedin.com/in/brandon-cha-928775a8/">LinkedIn</a>
            </p>
            </div>
        </AboutWrap>
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

// Styled Component
const Splash = styled.div`
    display: flex;
    flex-flow: column wrap;
    animation: ${fadeIn} 4s linear;
`;

const AboutWrap = styled(Splash)`
    background: rgba(255, 255, 255, 0.9);
    padding: 50px;
    justify-content: center;
    align-items: center;
    text-align: center;
    & > h2 {
        margin: 20px;
        font-size: 30px;
        animation: ${fadeIn} 2300ms linear;
    };
    & > p {
        margin-bottom: 10px;
        animation: ${fadeIn} 2700ms linear;
    };
    & > div {
        display: flex;
        animation: ${fadeIn} 3s linear;
    };
    .links { // GitHub Button
        padding: 10px 20px;
        margin: 20px 10px 0;
        border-radius: 10px;
        box-shadow: 0 5px gray;
        font-size: 20px;
        font-weight: bold;
        background: lightgreen;
        transition: 500ms ease-in-out;
        & > a {
            text-decoration: none;
            color: white;
        };
        &:hover {
            background: yellowgreen;
            transition: 500ms ease-in-out;
        };
        &:active {
            background: green;
            transform: translateY(4px);
            box-shadow: 0 1px gray;
        };
    };
    animation: ${fadeIn} 2s linear;
`;

export default About;