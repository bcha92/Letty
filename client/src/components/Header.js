import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import styled from "styled-components";
import { CgMenuGridR, CgProfile } from "react-icons/cg";

// Main Header Component
const Header = ({
    loginWithRedirect, isAuthenticated,
    logout, user,
}) => {
    // DropDown Menu State
    const [showMenu, setShowMenu] = useState(false);
    // User Menu State
    const [userMenu, setUserMenu] = useState(false);
    // Menu Handlers
    const toggleMenu = () => setShowMenu(!showMenu);
    const toggleUser = () => setUserMenu(!userMenu);
    const closeMenu = () => {
        setShowMenu(false);
        setUserMenu(false);
    };

    // Auth0 Login/Logout Handlers
    const loginHandle = () => {
        setShowMenu(false);
        setUserMenu(false);
        loginWithRedirect();
    };
    const logoutHandle = () => {
        setShowMenu(false);
        setUserMenu(false);
        logout({returnTo: window.location.origin})
    };

    return <StickyWrap>
        <HeaderWrap>
            <MenuWrap>

                {/* Only visible for smaller screens */}
                <MobileMenu>
                    <CgMenuGridR size="25px" onClick={toggleMenu} />
                    <DropDown style={{display: showMenu ? "flex" : "none"}}>

                        {isAuthenticated ? // User Navigation shown if Authenticated
                        <>
                        <p>Hello {user.name === user.email ?
                            user.nickname.slice(0, 1).toUpperCase()
                            + user.nickname.slice(1,) :
                            user.name
                        }</p>
                        <MobileNav exact to="/profile" onClick={closeMenu}>
                            Your LETTY Dashboard
                        </MobileNav>
                        <MobileNav to={window.location.origin} onClick={logoutHandle}>
                            Log Out
                        </MobileNav>
                        </> :

                        <>
                        <p>Hello Guest</p>
                        <MobileNav to={window.location.origin} onClick={loginHandle}>
                            Log In
                        </MobileNav>
                        </>}

                        <p>Navigation</p>
                        <MobileNav to="/locations" onClick={closeMenu}>
                            Find a LETTY
                        </MobileNav>
                        <MobileNav to="/hosting" onClick={closeMenu}>
                            Host a LETTY
                        </MobileNav>
                        <MobileNav to="/about" onClick={closeMenu}>
                            About
                        </MobileNav>
                        <MobileNav to="/contact" onClick={closeMenu}>
                            Contact
                        </MobileNav>
                    </DropDown>
                </MobileMenu>

                {/* Only visible to larger screens */}
                <WebMenu>
                    <NavWrap className="webLeft" exact to="/" onClick={closeMenu}>
                        <h2>LETTY</h2>
                    </NavWrap>
                    <WebNav to="/locations" onClick={closeMenu}>Find a LETTY</WebNav>
                    <WebNav to="/hosting" onClick={closeMenu}>Host a LETTY</WebNav>
                </WebMenu>

            </MenuWrap>

            {/* Only visible to smaller screens */}
            <MobileMenu>
                <NavWrap exact to="/" onClick={closeMenu}>
                    <h2>LETTY</h2>
                </NavWrap>
            </MobileMenu>

            <MenuWrap>

                {/* Only visible to larger screens */}
                <WebMenu>
                    <WebNav to="/about" onClick={closeMenu}>About</WebNav>
                    <WebNav to="/contact" onClick={closeMenu}>Contact</WebNav>
                </WebMenu>

                {isAuthenticated ? // Only visible if Login Authenticated
                <>
                    <MobileMenu>{/* Only visible to smaller screens */}
                        <NavWrap exact to="/profile" onClick={closeMenu}>
                            <img
                                src={user.picture}
                                alt={user.name}
                                width="30px"
                                height="30px"
                            />
                        </NavWrap>
                    </MobileMenu>

                    <WebMenu className="userMenu" onClick={toggleUser} >{/* Only visible to larger screens */}
                        <span>Hello {user.name === user.email ?
                            user.nickname.slice(0, 1).toUpperCase()
                            + user.nickname.slice(1,) :
                            user.name
                        }</span>
                        <img
                            src={user.picture}
                            alt={user.name}
                            width="30px"
                            height="30px"
                        />
                        <UserDrop style={{display: userMenu ? "flex": "none"}}>
                            <MobileNav
                                className="weby"
                                exact to="/profile"
                                onClick={closeMenu}
                            >
                                Your LETTY Dashboard
                            </MobileNav>
                            <MobileNav
                                className="weby"
                                to={window.location.origin}
                                onClick={logoutHandle}
                            >
                                Log Out
                            </MobileNav>
                        </UserDrop>
                    </WebMenu>
                </> :
                // Only visible is Login Not Authenticated
                <Button onClick={loginHandle}>
                    <span>Log In </span><CgProfile size="20px" />
                </Button>}

            </MenuWrap>
        </HeaderWrap>
    </StickyWrap>
};

// Styled Components
const StickyWrap = styled.header`
    position: sticky;
    top: 0;
    z-index: 10;
`;

const HeaderWrap = styled.div` // Main Header
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: whitesmoke;
`;

const MenuWrap = styled.div` // Left/Right Menus
    display: flex;
    justify-content: center;
    align-items: center;
`;

const MobileMenu = styled.div` // Mobile Menu
    margin-right: 10px;
    cursor: pointer;
    & > a { // For Logo/Title
        display: flex;
        align-items: center;
        justify-content: center;
    }
    @media (min-width: 769px) { // Screen
        display: none;
    };
`;

const WebMenu = styled.div` // Web Menu
    display: flex;
    flex-direction: row;
    align-items: center;
    &.userMenu { // Dropdown User Menu (if Authenticated)
        cursor: pointer;
        & > span {margin-right: 10px};
    };
    @media (max-width: 768px) { // Screen
        display: none;
    };
`;

const DropDown = styled.div` // Dropdown Menu
    z-index: 1;
    margin-top: 20px;
    left: 0;
    position: fixed;
    background: white;
    flex-direction: column;
    width: 100%;
    & > p {
        padding: 5px 10px;
        font-weight: bold;
        cursor: default;
    };
`;

const UserDrop = styled.div` // User Dropdown Menu
    z-index: 1;
    border: 1px solid gray;
    top: 50px;
    right: 0;
    position: fixed;
    background: white;
    flex-direction: column;
    width: 200px;
    & > a {width: 160px};
`;

const NavWrap = styled(NavLink)` // Basic Styled Link
    text-decoration: none;
    color: black;
    &.webLeft {margin-right: 50px};
    &:hover {
        transform: scale(120%);
        transition: 300ms ease-in-out;
        font-weight: bold;
    }
    transition: 500ms ease-in-out;
`;

// Mobile Navigation Links
const MobileNav = styled(NavWrap)` // Mobile Dropdown
    padding: 10px 20px;
    width: 100%;
    &:hover { // Hover
        background: greenyellow;
        transform: translateX(20px) scale(105%);
        border: 1px solid green;
    };
    &.weby {
        &:hover {
            transform: translateX(-20px) scale(105%);
        }
    }
    `;

// Desktop Navigation Links
const WebNav = styled(NavWrap)` // Desktop Links
    margin-right: 40px;
`;

const Button = styled.button` // Login Button (Unauthenticated)
    padding: 10px 20px;
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    & > span { // Greeting "Name" (Authenticated)
        font-size: initial;
        margin-right: 10px;
        @media (max-width: 768px) { // Screen
            display: none;
        };
    }
    transition: 300ms ease-in-out;
    &:hover {
        transform: scale(120%);
        font-weight: bold;
    }
`;

export default Header;