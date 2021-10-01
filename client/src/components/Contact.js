import React, { useState } from "react";
import styled from "styled-components";


// Contact Component
const Contact = ({ isAuthenticated, user }) => {
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

    return <ContactWrap>
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
                            defaultValue={isAuthenticated ? user.nickname : ""}
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
};

// Styled Component
const ContactWrap = styled.div` // Main Wrapper
    padding: 50px;
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
    align-items: center;
    text-align: center;
    & > h2 {
        margin: 20px;
        font-size: 30px;
    };
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
`;

const ContactMethod = styled.div` // Sub Wrapper
    display: flex;
    flex-flow: column-reverse wrap;
    justify-content: center;
    align-items: center;
    flex: 1;
    & > p {margin: 10px 0};
    @media (min-width: 769px) {
        flex-direction: row;
    };
`;

const ContactForm = styled(ContactMethod)` // Contact Us
    flex-direction: column;
`;

const CallUs = styled(ContactMethod)`
    flex-direction: column;
`; // Call Us

const B = styled.p`
    & > a {text-decoration: none};
    color: blue;
    font-weight: bold;
`;

const Form = styled.form` // Form
    display: flex;
    flex-flow: column wrap;
`;

const Entries = styled.div` // Form Input Set
    display: flex;
    flex-direction: column;
    @media (min-width: 769px) {
        flex-flow: row wrap;
        justify-content: space-between;
        & > input {min-width: 300px};
        align-items: center;
    }
`;

const Input = styled.input` // Input Fields
    margin: 10px;
    padding: 10px;
    font-size: 20px;
    flex: 1;
`;

const Submit = styled.input` // Submit Button
    padding: 10px;
    flex: 1;
`;

const Notes = styled.textarea` // Text Area
    margin: 10px;
    padding: 10px;
    font-size: 20px;
    width: 100%;
    flex: 2;
`;

const Select = styled.select` // Dropdown Select
    margin: 10px;
    padding: 10px;
    flex: 1;
    font-size: 20px;
    & > option {padding: 5px};
`;

const Message = styled.div` // Message after Submit
    border: 2px solid orange;
    background: lightgoldenrodyellow;
    padding: 10px 5px;
`;

export default Contact;