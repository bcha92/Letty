import React from "react";
import { NavLink, BrowserRouter, Switch, Route } from "react-router-dom";
import styled from "styled-components";

// Profile Sub-Components
import Reservations from "./Reservations";
import Hosts from "./Hosts";

// Main Profile Component
const Profile = ({ user, PORT }) => {
    console.log(user);
    return <BrowserRouter>
        <ProfileWrap>
            {/* Main Profile Component */}
            <MainProfile>
                <h2>Hello {user.name === user.email ?
                        user.nickname.slice(0, 1).toUpperCase()
                        + user.nickname.slice(1,) :
                        user.name
                }</h2>
                <img src={user.picture} alt={user.name} />
                <ProfileDetails>
                <p><B>Contact Email:</B> {user.email}</p>
                <p><B>Email Verified:</B> {
                    user.email_verified ?
                    <G>VERIFIED</G> : <R>NOT VERIFIED</R>
                }</p>
                </ProfileDetails>
            </MainProfile>
            <Navigation>
                <NavLink to="/profile" exact activeClassName="selected">Reservations</NavLink>
                <NavLink to="/profile/host" exact activeClassName="selected">Listed LETTY</NavLink>
            </Navigation>

            <DivLine />

            {/* Profile Sub-Components: Reservations/Hosts */}
            <Switch>
                <Route exact path="/profile">
                    <Reservations
                        user={user}
                        PORT={PORT}
                    />
                </Route>
                <Route path="/profile/host">
                    <Hosts
                        user={user}
                        PORT={PORT}
                    />
                </Route>
            </Switch>

        </ProfileWrap>
    </BrowserRouter>
};

// Styled Components
const ProfileWrap = styled.div`
    display: flex;
    flex-direction: column;
`;

const MainProfile = styled(ProfileWrap)`
    justify-content: center;
    align-items: center;
    padding: 50px 0 20px;
    & > h2 {font-size: 30px};
    & > img {
        width: 200px;
        height: 200px;
        margin: 20px;
    };
    `;

const ProfileDetails = styled(ProfileWrap)`
    flex-wrap: wrap;
    & > p {font-size: 20px};
    @media (min-width: 769px) {
        max-width: 400px
    };
`;

const Navigation = styled(ProfileWrap)`
    margin-bottom: 20px;
    flex-direction: row;
    justify-content: center;
    & > a {
        margin: 0 50px;
        text-decoration: none;
        font-weight: bold;
        font-size: 20px;
        &.selected {
            border-bottom: 2px solid blue;
        };
    };
`;

const B = styled.span`font-weight: bold;`;
const G = styled(B)`color: green;`;
const R = styled(B)`color: red;`;

const DivLine = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 2px;
    width: 100%;
    background: lightgray;
`;

export default Profile;