import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import styled, { keyframes } from "styled-components";

// Homepage Component
const Homepage = ({ images }) => {
    let history = useHistory();

    // UseEffect for Randomized Images
    const [i, setI] = useState(0);
    useEffect(() => {
        setI(images !== null ? Math.floor(Math.random() * images.length) : 0)
    }, [images])

    return <Wrapper
        style={{ background: images === null ? "white" : `white url(${images[i]}) 100% repeat` }}
    >
        {/* Introduction Wrap */}
        <IntroWrap>
            <h1>A new way to see work</h1>
            <p>There a LETTY for everyone. Whether you are a growing startup or a heavyweight enterprise, there is a solution for you and your business or hobby side hustle.</p>
            <Button onClick={() => history.push("/locations")}>Locations</Button>
        </IntroWrap>

        {/* For Property Owners */}
        <ContainerWrap>
            <DetailWrap className="owner">
                <h2>Property Owners Welcome</h2>
                <p>Do you have extra space and time in your office that needs filling?</p>
                <p>Get paid as a property owner!</p>
                <Button onClick={() => history.push("/hosting")}>Locations</Button>
            </DetailWrap>

        {/* Why LETTY */}
            <DetailWrap className="detail">
                <h2>Why LETTY?</h2>
                <WhyLetty>
                    <div className="one">
                        <h3>Find the perfect workspace</h3>
                        <p>There is a space for everyone, not just for office workers. Our properties come from a diverse set of backgrounds from your traditional office space to commerical kitchens, craft workshops to lounges, computers labs to art studios. There is always a space for you.</p>
                    </div>
                    <div className="two">
                        <h3>Flexible Workspace</h3>
                        <p>Tired of paying month to month on rent, mortgage, or lease when you don't need to spend long term commitments there? Is your business highly versatile and mobile? Our properties are meant for short term rentals, from a single day to several weeks at a time, so you only pay when you need to use the space.</p>
                    </div>
                    <div className="three">
                        <h3>Facilities</h3>
                        <p>LETTY users and owners connect with each other to provide mutually beneficial services to one another. Property owners are encouraged to entice LETTY users with on-site benefits such as kitchenettes, fitness centers, spas, and more, in exchange for financial compensation for use of your spaces.</p>
                    </div>
                </WhyLetty>
            </DetailWrap>
        </ContainerWrap>
    </Wrapper>
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
const Wrapper = styled.div`
    display: flex;
    flex-flow: column wrap;
    animation: ${fadeIn} 1s linear;
`;

const IntroWrap = styled(Wrapper)`
    background: rgba(255, 255, 255, 0.9);
    margin: 50px;
    padding: 50px;
    border-radius: 50px;
    z-index: 2;
    max-width: 500px;
    & > p {margin: 10px 0};
    &:hover {
        transform: scale(110%);
        transition: 200ms ease-in-out;
    };
    transition: 500ms ease-in-out;
    animation: ${fadeIn} 1400ms linear;
`;

const ContainerWrap = styled(Wrapper)`
    margin-top: 50px;
    z-index: 1;
    background: white;
    @media (min-width: 769px) {
        flex-direction: row;
    }
`;

const DetailWrap = styled(Wrapper)`
    flex: 1;
    padding: 50px;
    &.owner {
        max-width: 500px;
        & > h2 {margin-bottom: 10px};
        & > button {margin-top: 20px};
    };
    animation: ${fadeIn} 1800ms linear;
`;

const WhyLetty = styled(Wrapper)`
    @media (min-width: 769px) {flex-direction: row};
    & > div {
        background: white;
        margin: 20px 0;
        padding: 20px;
        min-width: 300px;
        flex: 1;
        border: 3px solid lightgray;
        border-radius: 20px;
        &.one {animation: ${fadeIn} 2000ms linear};
        &.two {animation: ${fadeIn} 2200ms linear};
        &.three {animation: ${fadeIn} 2400ms linear};
        & > h3 {margin-bottom: 10px};
        @media (min-width: 769px) {margin: 10px};
        &:hover {
            transform: scale(105%);
            transition: 200ms ease-in-out;
            background: whitesmoke;
        };
        transition: 500ms ease-in-out;
    };
`;

const Button = styled.button`
    font-weight: bold;
    font-size: 20px;
    background: dodgerblue;
    color: white;
    padding: 10px;
    max-width: 200px;
    border-radius: 10px;
    cursor: pointer;
    transition: 500ms ease-in-out;
    &:hover {
        background: skyblue;
        transform: scale(110%);
        transition: 500ms ease-in-out;
    }
`;

export default Homepage;