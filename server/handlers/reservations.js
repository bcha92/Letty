import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const { MONGO_URI } = process.env;

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