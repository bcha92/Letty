import React from "react";
import { useHistory } from "react-router";
import styled from "styled-components";

// Homepage Component
const Homepage = () => {
    let history = useHistory();
    return <Wrapper>
        {/* Introduction Wrap */}
        <IntroWrap>
            <h1>A new way to see work</h1>
            <p>There a LETTY for everyone. Whether you are a growing startup or a heavyweight enterprise, there is a solution for you and your business or hobby side hustle.</p>
            <button onClick={() => history.push("/locations")}>Locations</button>
        </IntroWrap>

        {/* For Property Owners */}
        <ContainerWrap>
            <h2>Property Owners Welcome</h2>
            <p>Do you have extra space and time in your office that needs filling?</p>
            <p>Get paid as a property owner!</p>
            <button onClick={() => history.push("/hosting")}>Locations</button>
        </ContainerWrap>

        {/* Why LETTY */}
        <ContainerWrap>
            <h2>Why LETTY?</h2>
            <div>
                <h3>Find the perfect workspace</h3>
                <p>There is a space for everyone, not just for office workers. Our properties come from a diverse set of backgrounds from your traditional office space to commerical kitchens, craft workshops to lounges, computers labs to art studios.</p>
            </div>
            <div>
                <h3>Flexible Workspace</h3>
                <p>Tired of paying month to month on rent, mortgage, or lease when you don't need to spend long term commitments there? Is your business highly versatile and mobile? Our properties are meant for short term rentals, from a single day to several weeks at a time, so you only pay when you need to use the space.</p>
            </div>
            <div>
                <h3>Facilities</h3>
                <p>It's not everything, but it's something. Even if it's a short term commitment, LETTY users and owners connect with each other to provide mutually beneficial services to one another. Property owners would love to have LETTY users using tools, machinery, utensils, and on-site facilities that would otherwise be unused or under-used. If you're a proeprty owner, encourage users by enticing them with benefits of on-site facilites like office kitchens, fitness centers, spas, and more, in exchange for financial compensation for use of your spaces.</p>
            </div>
        </ContainerWrap>
    </Wrapper>
};

// Styled Components
const Wrapper = styled.div`
    padding: 20px;
    display: flex;
    flex-flow: column wrap;
`;

const IntroWrap = styled(Wrapper)`
    z-index: 2;
    max-width: 500px;
    & > p {margin: 10px 0};
`;

const ContainerWrap = styled(Wrapper)`

`;

export default Homepage;