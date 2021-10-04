// Node Express Import
import express from "express";
import cors from "cors";
import morgan from "morgan";

//Middleware Import
import mongokeys from "./server/MongoMiddleware.js";

// Handlers Import
import {
    getUserReservations, getReservation, bookReservation, deleteReservation,
} from "./server/handlers/reservations.js";
import {
    addProperty, getProperties, getProperty, addRoom, removeRoom,
} from "./server/handlers/properties.js";
import { decideBooking } from "./server/handlers/approve.js";

// Local Port to host application || 4000 by default
const port = process.env.PORT || 4000;

const app = express(); // Initialized Express App
app.use(cors()); // Cross-Origin Resource Sharing
app.use(express.json()); // IMPORTANT FOR POST // DO NOT REMOVE
app.use(morgan("tiny")); // Logger Middleware to log http request errors

// Endpoints
// GET List of Reservation by User ID
app.get("/reservations/:userId", mongokeys, getUserReservations);
// GET a Reservation by Reservation ID
app.get("/reservations/:userId/:reservationId", mongokeys, getReservation);
// POST / Book a new Reservation
app.post("/book", mongokeys, bookReservation);
// DELETE a Reservation
app.delete("/book/:reservationId", mongokeys, deleteReservation);

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

// PATCH // Approve/Deny Booking by Property ID and Reservation ID
app.patch("/decision", mongokeys, decideBooking);

// Error Handling
app.get("*", (req, res) => res.status(400).json(
    "Error 404: This is an error. Please check your endpoints."
));
// Ready to listen on this port...
app.listen(port, () => console.log(`Standing by on port ${port}...`));