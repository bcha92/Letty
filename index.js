// Node Express Import
import express, { json } from "express";
import cors from "cors";
import morgan from "morgan";

//Middleware Import
import mongokeys from "./server/MongoMiddleware.js";

// Handlers Import
import {
    getUserReservations, getReservation, bookReservation,
} from "./server/handlers/reservations.js";
import { getProperties, getProperty } from "./server/handlers/properties.js";

import { testMongo } from "./server/handlers/mongotest.js"; // TEST ONLY!!!

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
// BOOK a Reservation
app.post("/book", mongokeys, bookReservation);

// GET List of Properties by User ID
app.get("/properties", mongokeys, getProperties);
// GET a Property by Property ID
app.get("/properties/:propertyId", mongokeys, getProperty);

app.get("/test", mongokeys, testMongo);
// Error Handling
app.get("*", (req, res) => res.status(400).json(
    "Error 404: This is an error. Please check your endpoints."
));
// Ready to listen on this port...
app.listen(port, () => console.log(`Standing by on port ${port}...`));