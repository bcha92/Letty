import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import styled, { keyframes } from "styled-components";

// Hosting Component (for Authorized Users Only)
const Hosting = ({ user, PORT, images }) => {
    let history = useHistory();
    // Property Registration Form Initial State
    const initState = {
        name: "", address: "", suite: "", description: "",
        features: [], restrictions: "", images: [], rooms: [],
        type: "",
        owner: {
            userId: user.sub,
            name: user.name,
            email: user.email,
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

    // Randomized Background Images
    const [i, setI] = useState();
    useEffect(() => {
        setI(images !== null ? Math.floor(Math.random() * images.length) : 0)
    }, [images])

    return <HostWrap // Hosting page for Authenticated Users
        style={{ background: images === null ? "white" : `white url(${images[i]}) 100% repeat` }}
    >
        <HostingSplash>
            <h2>Register your Property</h2>
            <p>Please fill out as much detail about your property.</p>
            <N><R>*</R> Required Fields</N>
            <Form onSubmit={registerProperty}>
                <div>
                    <div>
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
                    </div>

                    <LargeInput // Features
                        className="features"
                        placeholder="On-site Features/Amenities (list each seperated by ',', do not add space after ',')"
                        onChange={e => {
                        let features = (e.target.value).split(",")
                        setForm({...form, features});
                    }}/>
                </div>
                <LargeInput // Description
                    placeholder="Description of Property"
                    className="desc"
                    onChange={e => setForm({...form, description: e.target.value})}
                />
                <LargeInput // Restrictions
                    placeholder="Rules/Restrictions for Users"
                    className="rest"
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
    </HostWrap>
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
const HostWrap = styled.div`
    display: flex;
    flex-flow: column wrap;
    animation: ${fadeIn} 1s linear;
`;

const HostingSplash = styled(HostWrap)`
    background: rgba(255, 255, 255, 0.8);
    padding: 20px;
    & > h2 {
        font-size: 30px;
        margin-bottom: 20px;
    };
    & > h2, p {animation: ${fadeIn} 900ms linear};
`;

const Form = styled.form`
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    & > h4 {margin: 10px 0};
    @media (min-width: 769px) {
        flex-direction: column;
        & > div {
            display: flex;
            flex-direction: row;
            & > div {
                display: flex;
                flex-direction: column;
            };
        };
    }
    & > div > div {
        animation: ${fadeIn} 1100ms linear;
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
        animation: ${fadeIn} 3s linear;
        font-weight: bold;
        font-size: 20px;
        background: dodgerblue;
        color: white;
        max-width: 200px;
        border-radius: 10px;
        cursor: pointer;
        transition: 500ms ease-in-out;
        &:hover {
            background: skyblue;
            transform: scale(105%);
            transition: 500ms ease-in-out;
        }
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
    min-height: 100px;
    @media (max-width: 768px) {
        resize: none;
        max-width: 400px;
        &.features {
            min-width: 400px;
        };
    };
    @media (min-width: 769px) {
        min-height: 150px;
    };
    animation: ${fadeIn} 2s linear;
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
    animation: ${fadeIn} 300ms linear;
`;

export default Hosting;