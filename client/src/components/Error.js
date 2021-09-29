import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { VscError } from "react-icons/vsc";

// Main Error Splash Component
const ErrorSplash = () => {
    return <ErrWrap>
        <VscError size="200px" />
        <h1>Oops!</h1>
        <h3>
            This is either an error, or you do not have access to this page.
        </h3>
        <HomeButton to="/">HOME</HomeButton>
    </ErrWrap>
};

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
`;

export default ErrorSplash;