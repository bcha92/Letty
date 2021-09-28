import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import styled from "styled-components";
import { CgMenuGridR, CgProfile } from "react-icons/cg";

// Main Header Component
const Header = () => {
    // DropDown Menu State
    const [showMenu, setShowMenu] = useState(false);

    // Menu Handlers
    const toggleMenu = () => setShowMenu(!showMenu);
    const closeMenu = () => setShowMenu(false);

    return <HeaderWrap>
        <MenuWrap>
            <MobileMenu>
                <CgMenuGridR size="30px" onClick={toggleMenu} />
                <DropDown style={{display: showMenu ? "flex" : "none"}}>
                    <MobileNav to="/" onClick={closeMenu}>
                        Locations
                    </MobileNav>
                    <MobileNav to="/" onClick={closeMenu}>
                        Locations
                    </MobileNav>
                    <MobileNav to="/" onClick={closeMenu}>
                        Contact Us
                    </MobileNav>
                </DropDown>
            </MobileMenu>
            <NavWrap to="/">
                <h2>LETTY</h2>
            </NavWrap>
            <WebMenu>
                <WebNav to="/">Locations</WebNav>
                <WebNav to="/">Locations</WebNav>
            </WebMenu>
        </MenuWrap>
        <MenuWrap>
            <WebNav to="/">Contact Us</WebNav>
            <CgProfile size="30px" />
        </MenuWrap>
    </HeaderWrap>
};

// Styled Components
const HeaderWrap = styled.header`
    z-index: 1;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const MenuWrap = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const MobileMenu = styled.div`
    margin-right: 10px;
    cursor: pointer;
    @media (min-width: 769px) {
        display: none;
    };
`;

const WebMenu = styled.div`
    align-self: center;
    @media (max-width: 768px) {
        display: none;
    };
`;

const DropDown = styled.div`
    z-index: 1;
    margin-top: 20px;
    left: 0;
    position: fixed;
    background: white;
    flex-direction: column;
    width: 100%;
`;

const NavWrap = styled(NavLink)`
    text-decoration: none;
    margin-right: 50px;
`;

// Mobile Navigation Links
const MobileNav = styled(NavWrap)`
    padding: 20px;
    &:hover {background: greenyellow};
    `;

// Desktop Navigation Links
const WebNav = styled(NavWrap)`
    margin-right: 40px;
`;

export default Header;