import React, { useState } from "react";
import styled from "styled-components";

// Hosting Component
const Hosting = ({ isAuthenticated, user }) => {
    // Property Registration Form Initial State
    const initState = {
        name: "", address: "", suite: "", country: "",
        description: "", features: [], restrictions: "",
        images: [], rooms: [],
        owner: {
            userId: user.sub, name: user.name,
            email: user.email,
        },
    };
    // Set Registration Form State
    const [form, setForm] = useState(initState);
    console.log(form);

    return (isAuthenticated ?
    <HostWrap>{/* Hosting page for Authenticated Users */}
        <HostingSplash>
            <h2>Register your Property</h2>
            <p>Please fill out as much detail about your property.</p>
            <N><R>*</R> Required Fields</N>
            <Form onSubmit={e => {
                e.preventDefault();
            }}>
                <Input // Property Name
                    placeholder="Property Name *"
                    onChange={e => setForm({...form, name: e.target.value})}
                    required
                />
                <Input // Address (Mapbox Replace?)
                    placeholder="Address *"
                    onChange={e => setForm({...form, address: e.target.value})}
                    required
                />
                <Input // Suite
                    placeholder="Suite"
                    onChange={e => setForm({...form, suite: e.target.value})}
                />
                <Input // Country
                    placeholder="Country *"
                    onChange={e => setForm({...form, country: e.target.value})}
                />
            </Form>
        </HostingSplash>
    </HostWrap> :

    <HostWrap>{/* Splash page for Non-Authenticated Users */}
        <HostingSplash>
            <h2>Host your Property with Ease!</h2>
        </HostingSplash>
    </HostWrap>)
};

// Styled Components
const HostWrap = styled.div`
    display: flex;
    flex-flow: column wrap;
`;

const HostingSplash = styled(HostWrap)`
    padding: 20px;
    & > h2 {
        font-size: 30px;
        margin-bottom: 20px;
    };
`;

const Form = styled.form`
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    @media (min-width: 769px) {
        flex-flow: row wrap;
    }
`;

const Input = styled.input`
    margin: 10px;
    padding: 10px;
    font-size: 20px;
    flex: 1;
`;

const R = styled.span`color: red;`;
const N = styled.p`font-size: 14px;`;

export default Hosting;