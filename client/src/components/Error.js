import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { VscError } from "react-icons/vsc";

// Main Error Splash Component (shows only someone is trying to access unauthorized page or no page)
const ErrorSplash = () => {
    return <ErrWrap>
        <VscError size="200px" />
        <h1>Oops!</h1>
        <h3>
            This is either a faulty link, or you do not have permission to access to this page.
        </h3>
        <HomeButton to="/">HOME</HomeButton>
    </ErrWrap>
};

// Styled Components
const ErrWrap = styled.div`
    display: flex;
    flex-flow: column wrap;
    align-items: center;
    justify-content: center;
    margin: 50px;
    & > h3 {text-align: center};
`;

const HomeButton = styled(Link)`
    margin-top: 50px;
    padding: 30px 50px;
    border-radius: 10px;
    text-decoration: none;
    font-weight: bold;
    color: white;
    background: #f59999;
    transition: 400ms ease-in-out;
    &:hover {
        background: red;
        transition: 200ms ease-in-out;
    };
    &:active {background: orange};
`;

export default ErrorSplash;