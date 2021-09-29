import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const { MONGO_URI } = process.env;

// GET Reservations made by user
export const getUserReservations = async (req, res) => {
    const { userId } = req.params; // User Identification (Auth0 sub)
    // Deconstructed res.locals
    const { options, database, reservations } = res.locals;
    const mongo = new MongoClient(MONGO_URI, options);

    try {
        // Connect Mongo, begin session
        await mongo.connect();
        const db = mongo.db(database);
        const results = await db.collection(reservations).find().toArray();

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