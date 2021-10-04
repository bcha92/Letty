import React, { useState } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";

// Hosting Component
const Hosting = ({ isAuthenticated, user, PORT }) => {
    let history = useHistory();
    // Property Registration Form Initial State
    const initState = {
        name: "", address: "", suite: "", description: "",
        features: [], restrictions: "", images: [], rooms: [],
        type: "",
        owner: {
            userId: isAuthenticated ? user.sub : null,
            name: isAuthenticated ? user.name : null,
            email: isAuthenticated ? user.email : null,
        },
    };

    // Set Registration Form State
    const [form, setForm] = useState(initState);

    // Property Registration Handler States
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");

    // Handling Submit for Property Registration
    const registerProperty = e => {
        e.preventDefault();
        setStatus("processing"); // Processing Status
        fetch(PORT + "/add", { // POST METHOD AND HEADERS
            method: "POST",
            body: JSON.stringify(form),
            headers: {
                "Accept": "application/json",
                "Content-type": "application/json",
            },
        }).then(res => res.json()) // PROCESSING FROM JSON
        .then(json => { // DECONSTRUCTED STATUS/MESSAGE
            const { status, message } = json;
            if (status === 201) { // If request was successful
                setStatus("success");
                setMessage(message);
                // Once finished, redirects to new property page
                history.push(`/locations/${json.data._id}`)
            }
            else { // Else, request was not successful
                setStatus("error");
                setMessage(message);
            }
        })
    }

    return (isAuthenticated ?
    <HostWrap>{/* Hosting page for Authenticated Users */}
        <HostingSplash>
            <h2>Register your Property</h2>
            <p>Please fill out as much detail about your property.</p>
            <N><R>*</R> Required Fields</N>
            <Form onSubmit={registerProperty}>
                <Input // Property Name
                    placeholder="Property Name *"
                    onChange={e => setForm({...form, name: e.target.value})}
                    required
                />
                <Input // Address
                    placeholder="Address (123 Main St Montreal H0H 0H0) *"
                    onChange={e => setForm({...form, address: e.target.value})}
                    required
                />
                <div>
                    <Input // Suite
                        className="short"
                        placeholder="Suite"
                        onChange={e => setForm({...form, suite: e.target.value})}
                    />
                    <Select // Type of Property
                        onChange={e => setForm({...form, type: e.target.value})}
                        defaultValue=""
                        required
                    >
                        <option value="" disabled>Select Type of Property *</option>
                        <option value="Art Studio">Art Studio</option>
                        <option value="Automotive or Garage">Automotive / Garage</option>
                        <option value="Computer Lab">Computer Lab</option>
                        <option value="Crafting Workshop">Crafting Workshop</option>
                        <option value="Fitness">Fitness Center / Studio</option>
                        <option value="Industrial">Industrial (Other)</option>
                        <option value="Kitchen">Kitchen and Food Prep</option>
                        <option value="Health / Medical">Health / Medical</option>
                        <option value="Office">Office</option>
                        <option value="Other">Other</option>
                    </Select>
                </div>

                <LargeInput // Features
                    placeholder="On-site Features/Amenities (list each seperated by ',', do not add space after ',')"
                    onChange={e => {
                        let features = (e.target.value).split(",")
                        setForm({...form, features});
                    }}
                />
                <LargeInput // Description
                    placeholder="Description of Property"
                    onChange={e => setForm({...form, description: e.target.value})}
                />
                <LargeInput // Restrictions
                    placeholder="Rules/Restrictions for Users"
                    onChange={e => setForm({...form, restrictions: e.target.value})}
                />

                {// Error Message Handler
                status === "error" &&
                <ErrBubble>
                    <h3>Error!</h3>
                    <p>{message}</p>
                </ErrBubble>}

                <Input // Submit Button
                    type="submit"
                    className="submit"
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
    & > h4 {margin: 10px 0};
    @media (min-width: 769px) {
        flex-direction: column;
    }
`;

const Input = styled.input`
    margin: 10px;
    padding: 10px;
    font-size: 20px;
    min-width: 400px;
    flex: 1;
    &.short {
        min-width: 100px;
        max-width: 100px;
    };
    &.shorten {
        min-width: 150px;
        max-width: 150px;
    };
    &.submit {
        min-height: 50px;
    }
    @media (min-width: 769px) {
        max-height: 20px;
        max-width: 600px;
    };
`;

const Select = styled.select`
    margin: 10px;
    padding: 10px;
    max-width: 400px;
    font-size: 18px;
`;

const LargeInput = styled.textarea`
    margin: 10px;
    padding: 10px;
    font-size: 20px;
    flex: 1;
    min-width: 400px;
    min-height: 100px;
`;

const R = styled.span`color: red;`;
const N = styled.p`font-size: 14px;`;

const ErrBubble = styled.div`
    display: flex;
    flex-flow: column wrap;
    margin: 0 10px;
    padding: 20px;
    background: rgba(255, 0, 0, 0.2);
    border: 1px solid red;
    border-radius: 10px;
    color: rgb(200, 0, 0);
    & > h3 {margin-bottom: 10px};
`;

export default Hosting;