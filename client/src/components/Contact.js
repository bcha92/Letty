import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";


// Contact Component
const Contact = ({ isAuthenticated, user, images }) => {
    // Randomized Background Images
    const [i, setI] = useState(0);
    useEffect(() => {
        setI(images !== null ? Math.floor(Math.random() * images.length) : 0)
    }, [images])

    // Contact Information Initial State
    const infoInit = {
        name: isAuthenticated ? user.nickname : "",
        email: isAuthenticated ? user.email : "",
        inquiry: "", phone: "", company: "",
        size: "", notes: "",
    };
    // Form Information State
    const [form, setForm] = useState(infoInit);

    // Form Submitted
    const [isSubmit, setSubmit] = useState(false);
    const submitHandle = () => setSubmit(true);

    return <Splash
        style={{ background: images === null ? "white" : `white url(${images[i]}) 100% repeat` }}
    >
        <ContactWrap>
            <h2>Contact Us</h2>
            <ContactMethod>
                <ContactForm>
                    <h3>We'll follow up</h3>
                    <p>One of our LETTY experts will reach out to you based on your communication preferences.</p>
                    {isSubmit && <Message>This form is a demonstration of submitting customer inquiries. No actual information is stored in this application.</Message>}
                    <Form onSubmit={(e) => {
                        // Form Submit Handler with Default Handler
                        e.preventDefault();
                        submitHandle();
                    }}>
                        <Entries>
                            <Input // Full Name
                                placeholder="Full Name *"
                                defaultValue={isAuthenticated ? user.name : ""}
                                onChange={e => setForm({...form, name: e.target.value})}
                                required
                            />
                            <Input // Email
                                placeholder="Email *"
                                defaultValue={isAuthenticated ? user.email : ""}
                                onChange={e => setForm({...form, email: e.target.value})}
                                type="email"
                                required
                            />
                            <Select // Select a reason for inquiry
                                id="inquiry"
                                defaultValue=""
                                onChange={e => setForm({...form, inquiry: e.target.value})}
                                required
                            >
                                <option value="" disabled>Your Inquiry</option>
                                <option value="find">Finding a Workspace</option>
                                <option value="host">Hosting a Workspace</option>
                                <option value="other-see notes">Other</option>
                            </Select>
                            <Input // Phone number
                                placeholder="Phone"
                                type="tel"
                                onChange={e => setForm({...form, phone: e.target.value})}
                            />
                            <Input // Company Name
                                placeholder="Company Name"
                                onChange={e => setForm({...form, company: e.target.value})}
                            />
                            <Select // Size of Company Dropdown
                                id="size"
                                defaultValue=""
                                onChange={e => setForm({...form, size: e.target.value})}
                            >
                                <option value="" disabled>Company size (optional)</option>
                                <option value="small">1-20</option>
                                <option value="large">20+</option>
                                <option value="other-enterprise">Other / Enterprise Solutions</option>
                            </Select>
                        </Entries>
                        <Entries>
                            <Notes // Additional Details
                                placeholder="Notes"
                                type="textarea"
                                onChange={e => setForm({...form, notes: e.target.value})}
                            />
                            <Submit
                                type="submit"
                                value="Get in Touch"
                            />
                        </Entries>
                    </Form>
                </ContactForm>

                <DivLine />

                <CallUs>
                    <h3>Call Us</h3>
                    <p>Questions about booking a LETTY workspace or hosting? Just call us:</p>
                    <B><a href="tel:+2015555555">(201) 555-5555</a></B>
                </CallUs>
            </ContactMethod>
        </ContactWrap>
    </Splash>
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

// Styled Component
const Splash = styled.div`
    display: flex;
    flex-flow: column wrap;
    animation: ${fadeIn} 4s linear;
`;

const ContactWrap = styled(Splash)` // Main Wrapper
    padding: 50px;
    background: rgba(255, 255, 255, 0.8);
    justify-content: center;
    align-items: center;
    text-align: center;
    & > h2 {
        margin: 20px;
        font-size: 30px;
    };
    animation: ${fadeIn} 1s linear;
`;

const DivLine = styled.div` // Dividing Line
    margin: 20px;
    background: gray;
    @media (max-width: 768px) {
        width: 50vw;
        height: 2px;
    }
    @media (min-width: 769px) {
        width: 2px;
        height: 50vh;
    }
    animation: ${fadeIn} 1400ms linear;
`;

const ContactMethod = styled(Splash)` // Sub Wrapper
    flex-direction: column-reverse;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    flex: 1;
    & > p {margin: 10px 0};
    @media (min-width: 769px) {
        flex-direction: row;
    };
`;

const ContactForm = styled(ContactMethod)` // Contact Us
    flex-direction: column;
    background: rgba(255, 255, 255, 0.7);
    padding: 40px 10px;
    animation: ${fadeIn} 2s linear;
`;

const CallUs = styled(ContactMethod)`
    flex-direction: column;
    background: rgba(255, 255, 255, 0.7);
    padding: 40px 10px;
    animation: ${fadeIn} 1700ms linear;
`;

const B = styled.p`
    & > a {text-decoration: none};
    color: blue;
    font-weight: bold;
`;

const Form = styled.form` // Form
    display: flex;
    flex-flow: column wrap;
`;

const Entries = styled(Splash)` // Form Input Set
    flex-wrap: nowrap;
    @media (min-width: 769px) {
        flex-flow: row wrap;
        justify-content: space-between;
        align-items: flex-end;
        & > input {min-width: 300px};
    }
    animation: ${fadeIn} 2200ms linear;
`;

const Input = styled.input` // Input Fields
    margin: 10px;
    padding: 10px;
    font-size: 20px;
    flex: 1;
    animation: ${fadeIn} 2500ms linear;
`;

const Submit = styled.input` // Submit Button
    padding: 10px;
    flex: 1;
    margin: 10px 10px;
    font-weight: bold;
    font-size: 20px;
    background: dodgerblue;
    color: white;
    border-radius: 10px;
    cursor: pointer;
    transition: 500ms ease-in-out;
    &:hover {
        background: skyblue;
        transform: scale(105%);
        transition: 500ms ease-in-out;
    }
    &:active {
        background: green;
        transition: 500ms ease-in;
    }
    animation: ${fadeIn} 3s linear;
`;

const Notes = styled.textarea` // Text Area
    margin: 10px;
    padding: 10px;
    font-size: 20px;
    width: 100%;
    flex: 2;
    @media (max-width: 768px) {
        max-width: 270px;
        resize: none;
    };
    animation: ${fadeIn} 2800ms linear;
`;

const Select = styled.select` // Dropdown Select
    margin: 10px;
    padding: 10px;
    flex: 1;
    font-size: 20px;
    & > option {padding: 5px};
    animation: ${fadeIn} 2500ms linear;
`;

const Message = styled.div` // Message after Submit
    border: 2px solid orange;
    background: lightgoldenrodyellow;
    padding: 10px 5px;
    animation: ${fadeIn} 1200ms linear;
`;

export default Contact;