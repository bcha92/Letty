import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const { MONGO_URI } = process.env;

// Test
export const testMongo = async (req, res) => {
    // Deconstructed res.locals middleware
    const { options, database, test } = res.locals;
    const mongo = new MongoClient(MONGO_URI, options);

    try {
        await mongo.connect();
        const db = mongo.db(database);

        const results = await db.collection(test).find().toArray();
        if (results.length === 0) {
            res.status(404).json({
                status: 404,
                message: "No results found",
            })
            mongo.close();
        }
        else {
            res.status(200).json({
                status: 200,
                message: "Test successful",
                data: results,
            })
        }
    }

    catch (err) { // Error Catching
        console.log("testMongo Error:", err);
    }
    mongo.close();
};

// Reservations
export const getUserReservations = async (req, res) => {
    
};