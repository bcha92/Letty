// Node Express Import
import express from "express";
import cors from "cors";
import morgan from "morgan";

// Opencage API and getPosition function (converts street address to latitude and longitude)
import opencage from "opencage-api-client";
import dotenv from "dotenv";
dotenv.config();

export const getPosition = async (address, key) => {
    // Geocode
    const requestObj = { key, q: address };

    try { // Await Opencage Data
        const data = await opencage.geocode(requestObj);
        return data.results[0].geometry;
    } catch (err) {
        console.log("getPositionError:", err);
    }
};

//Middleware Import (res.locals keywords to MongoDB Database) "/server/MongoMiddleware.js"
import mongokeys from "./server/MongoMiddleware.js";

// Handlers Import "/server/handlers"
import {
    getUserReservations, getReservation, bookReservation, deleteReservation,
} from "./server/handlers/reservations.js";
import {
    addProperty, getProperties, getProperty, addRoom, removeRoom, getImages,
} from "./server/handlers/properties.js";
import { decideBooking, checkRooms } from "./server/handlers/approve.js";
import getPropertyTypes from "./server/handlers/propertytypes.js";

// Local Port to host application || 4000 by default
const port = process.env.PORT || 4000;

const app = express(); // Initialized Express App
app.use(cors()); // Cross-Origin Resource Sharing
app.use(express.json()); // IMPORTANT FOR POST // DO NOT REMOVE
app.use(morgan("tiny")); // Logger Middleware to log http request errors

// Endpoints

// RESERVATIONS
// GET List of Reservation by User ID
app.get("/reservations/:userId", mongokeys, getUserReservations);
// GET a Reservation by Reservation ID
app.get("/reservations/:userId/:reservationId", mongokeys, getReservation);
// POST / Book a new Reservation
app.post("/book", mongokeys, bookReservation);
// DELETE a Reservation
app.delete("/book/:reservationId", mongokeys, deleteReservation);
// POST / Check availability of Rooms (noramlly, this is a GET endpoint, but it had to be converted to POST because it is submitting a "date range" from front end via req.body and checks MongoDb through the each reservation in the property spaceId to see if any of the dates overlap)
app.post("/checkRooms", mongokeys, checkRooms);

// PROPERTIES
// GET List of Properties by User ID
app.get("/properties", mongokeys, getProperties);
// GET a Property by Property ID
app.get("/properties/:propertyId", mongokeys, getProperty);
// POST / Add a new Property
app.post("/add", mongokeys, addProperty);
// PATCH / Add a room to a Property
app.patch("/properties/:propertyId", mongokeys, addRoom);
// PATCH / Remove a room from a Property
app.patch("/properties/:propertyId/:spaceId", mongokeys, removeRoom);
// GET // Images from Each Property
app.get("/images", mongokeys, getImages);

// TYPES
// GET / Property Types (e.g. Office, Kitchen, etc.)
app.get("/types", getPropertyTypes)

// APPROVES
// PATCH // Approve/Deny Booking by Property ID and Reservation ID
app.patch("/decision", mongokeys, decideBooking);

// Error Handling
app.get("*", (req, res) => res.status(400).json(
    "Error 404: This is an error. Please check your endpoints."
));
// Ready to listen on this port...
app.listen(port, () => console.log(`Standing by on port ${port}...`));