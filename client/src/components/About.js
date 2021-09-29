import React from "react";
import styled from "styled-components";

// About Component
const About = () => {
    return <AboutWrap>
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
};

// Styled Component
const AboutWrap = styled.div`
    padding: 50px;
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
    align-items: center;
    text-align: center;
    & > h2 {
        margin: 20px;
        font-size: 30px;
    };
    & > p {margin-bottom: 10px};
    & > div {
        display: flex;
    };
    .links { // GitHub Button
        padding: 10px 20px;
        margin: 5px;
        border-radius: 10px;
        box-shadow: 0 5px gray;
        font-size: 20px;
        font-weight: bold;
        background: lightgreen;
        & > a {
            text-decoration: none;
            color: white;
        };
        &:hover {background: yellowgreen};
        &:active {
            background: yellowgreen;
            transform: translateY(4px);
            box-shadow: 0 1px gray;
        };
    };
`;

export default About;