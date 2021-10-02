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
                data: results,
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
    const { userId, reservationId } = req.params;
    // Deconstructed res.locals
    const { options, database, reservations } = res.locals;
    const mongo = new MongoClient(MONGO_URI, options);

    try {
        // Connect Mongo, begin session
        await mongo.connect();
        const db = mongo.db(database);
        const result = await db.collection(reservations).findOne({ _id: reservationId });

        // Result if no reservation is found
        if (result === null || result.userId !== userId) {
            res.status(400).json({
                status: 400,
                message: `Reservation ID ${reservationId} not found, or you are not authorized to access this page`,
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
    const { propertyId, spaceId, dates, charge, cc, cvc } = req.body;

    // Check for missing information before starting Mongo
    if (cc.length === 0 || cvc.length === 0) {
        return res.status(400).json({
            status: 400,
            message: `Missing payment information`,
            data: req.body,
        })
    }

    // Deconstructed res.locals
    const { options, database, properties, reservations } = res.locals;
    const mongo = new MongoClient(MONGO_URI, options);

    try {
        // Connect Mongo, begin session
        await mongo.connect();
        const db = mongo.db(database);

        // Check for overlapping booking dates for this property
        const property = await db.collection(properties).findOne({ _id: propertyId });
        let checkRes = false; // Initial Flag for Checking Reservation
        let roomBookings;
        // Iterates through each room in property.rooms
        property.rooms.forEach(room => {
            if (room.id === spaceId) { // If booking room match found,
                roomBookings = room.reservations;
            }
        })
        // Iterates through each date of booking
        dates.forEach(date => {
            // Iterates through each reservation
            roomBookings.forEach(booking => {
                if (booking.dates.includes(date)) {
                    checkRes = true;
                }
            })
        });
        // If checkRes-ervation is true (i.e. conflicting booking dates), error is returned.
        if (checkRes) {
            mongo.close();
            return res.status(400).json({
                status: 400,
                message: "One or more dates you are trying to book has already been booked by another party. Please select another date(s) for this space, or choose another space to book. Thank you.",
                data: req.body,
            })
        }

        // Once booking dates is finalized, reservation is entered into the system
        const _id = uuidv4(); // new Reservation ID Created
        const newBody = { _id, timestamp: new Date(), ...req.body }; // Format for new Body
        const newRes = { _id, charge, dates, approved: null }; // Format for Entry in Properties

        await db.collection(reservations).insertOne(newBody); // Insert into Reservation // **Change Here
        await db.collection(properties).updateOne( // Update the Property
            { _id: propertyId, "rooms.id": spaceId }, // Filter Parameter to Find Property
            { $push: { "rooms.$.reservations": newRes }} // Parameters to update // PUSH
        );

        // Return res.status once reservation is booked
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
    const { options, database, properties, reservations } = res.locals;
    const mongo = new MongoClient(MONGO_URI, options);

    try {
        // Connect Mongo, begin session
        await mongo.connect();
        const db = mongo.db(database);
        const reservation = await db.collection(reservations).findOne({ _id: reservationId });

        // If no Reservation Found, Return Error and Close Mongo
        if (reservation === null) {
            mongo.close(); // End Session
            return res.status(400).json({
                status: 400,
                message: `The reservation you are looking for by ID ${reservationId} does not exist.`,
            })
        }

        // Update Property // Find and Remove Reservation Entry from "Reservations"
        const property = await db.collection(properties).findOne({ _id: reservation.propertyId });
        let selectedRoom;
        // Iterates each room and assigns selectedRoom's reservations if matches spaceId
        property.rooms.forEach(room => {
            if (room.id === reservation.spaceId) {
                selectedRoom = room.reservations;
            }
        });
        let newReservations = []; // New Array for Updated Reservations
        // Pushes all reservations into new array that does not match the current reservationId
        selectedRoom.forEach(booking => {
            if (booking._id !== reservationId) {
                newReservations.push(booking);
            }
        });

        await db.collection(properties).updateOne( // Update the Property with new Reservations Array
            { _id: reservation.propertyId, "rooms.id": reservation.spaceId },
            { $set: { "rooms.$.reservations": newReservations }}
        );

        // Remove Reservation from List of Reservations
        await db.collection(reservations).deleteOne({ _id: reservationId });

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