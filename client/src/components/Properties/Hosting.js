import React from "react";
import styled from "styled-components";

// Hosting Component
const Hosting = ({ isAuthenticated, user }) => {
    return (isAuthenticated ?
    <HostWrap>{/* Hosting page for Authenticated Users */}
        Host your Property Here
    </HostWrap> :

    <HostWrap>{/* Splash page for Non-Authenticated Users */}
        Sorry, you must be authenticated to access this
    </HostWrap>)
};

// Styled Components
const HostWrap = styled.div``;

export default Hosting;