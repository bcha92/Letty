import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const { MONGO_URI } = process.env;

import { v4 as uuidv4 } from "uuid"; // Random UUID Generator

// GET Reservations made by user ID
export const getUserReservations = async (req, res) => {
    const { userId } = req.params; // User Identification (Auth0 sub)
    // Deconstructed res.locals
    const { options, database, reservations } = res.locals;
    const mongo = new MongoClient(MONGO_URI, options);

    try {
        // Connect Mongo, begin session
        await mongo.connect();
        const db = mongo.db(database);
        const results = await db.collection(reservations).find({ userId }).toArray();

        // Results if no reservations are found
        if (results.length === 0) {
            res.status(400).json({
                status: 400,
                message: `No reservations found for User ID ${userId}.`,
            })
        }
        // Results if any reservations are found
        else {
            res.status(200).json({
                status: 200,
                message: `Reservations found for User ID ${userId}.`,
                data: results,
            })
        }
    }

    catch (err) { // Error Handler
        console.log("getUserReservation Error:", err);
    }
    mongo.close(); // Disconnect Mongo, end session
};

// GET a Reservation by Reservation ID
export const getReservation = async (req, res) => {
    // User ID (Auth0 sub) and Reservation ID
    const { reservationId } = req.params;
    // Deconstructed res.locals
    const { options, database, reservations } = res.locals;
    const mongo = new MongoClient(MONGO_URI, options);

    try {
        // Connect Mongo, begin session
        await mongo.connect();
        const db = mongo.db(database);
        const result = await db.collection(reservations).findOne({ _id: reservationId });

        // Result if no reservation is found
        if (result === null) {
            res.status(400).json({
                status: 400,
                message: `Reservation ID ${reservationId} not found.`,
            })
        }
        // Result if reservation is found
        else {
            res.status(200).json({
                status: 200,
                message: `Reservation ID ${reservationId} found`,
                data: result,
            })
        }
    }

    catch (err) { // Error Handling
        console.log("getReservation Error:", err);
    }
    mongo.close(); // Disconnect Mongo, end session
};

// POST / Book a Reservation
export const bookReservation = async (req, res) => {
    // Deconstructed req.body
    const { propertyId, dates, charge, cc, cvc } = req.body;

    // Check for missing information before starting Mongo
    if (cc.length === 0 || cvc.length === 0) {
        return res.status(400).json({
            status: 400,
            message: `Missing payment information`,
            data: req.body,
        })
    }

    // Deconstructed res.locals
    const { options, database, properties, reservations, test } = res.locals;
    const mongo = new MongoClient(MONGO_URI, options);

    try {
        // Connect Mongo, begin session
        await mongo.connect();
        const db = mongo.db(database);

        // Check for overlapping booking dates for this property
        const property = await db.collection(properties).findOne({ _id: propertyId });
        // Add more

        // Once booking dates is finalized, reservation is entered into the system
        const _id = uuidv4(); // new Reservation ID Created
        const newBody = { _id, timestamp: new Date(), ...req.body }; // Format for new Body
        const newRes = { _id, charge, approved: null }; // Format for Entry in Properties
        console.log(newRes);

        await db.collection(test).insertOne(newBody); // Insert into Reservation // **Change Here
        // Add more // Insert into Properties

        // Return res.status
        res.status(201).json({
            status: 201,
            message: `Reservation successfully booked: ID ${_id}`,
            data: newBody,
        })
    }

    catch (err) { // Error Handling
        console.log("bookReservation:", err);
    }
    mongo.close(); // Disconnect Mongo, end sessoin
};

// DELETE a Reservation by Reservation ID
export const deleteReservation = async (req, res) => {
    const { reservationId } = req.params; // Reservation ID
    // Deconstructed res.locals
    const { options, database, properties, reservations, test } = res.locals;
    const mongo = new MongoClient(MONGO_URI, options);

    try {
        // Connect Mongo, begin session
        await mongo.connect();
        const db = mongo.db(database);
        const reservation = await db.collection(test).findOne({ _id: reservationId });
        console.log(reservation);

        // If no Reservation Found, Return Error and Close Mongo
        if (reservation === null) {
            mongo.close(); // End Session
            return res.status(400).json({
                status: 400,
                message: `The reservation you are looking for by ID ${reservationId} does not exist.`,
            })
        }

        // Remove Reservation from List of Reservations
        await db.collection(test).deleteOne({ _id: reservationId });
        // Update Property // Remove Reservation Entry from "Reservations"
        const property = await db.collection(properties).findOne({ _id: reservation.propertyId });

        // Once finished, return res.status and success
        res.status(200).json({
            status: 204,
            message: `Reservation ID ${reservationId} has successfully been deleted.`,
        })
    }

    catch (err) { // Error Handling
        console.log("deleteReservation Error:", err);
    }
    mongo.close(); // Disconnect Mongo, end session
};