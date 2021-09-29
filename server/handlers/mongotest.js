import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const { MONGO_URI } = process.env;

// Test // Delete Later
export const testMongo = async (req, res) => {
    // Deconstructed res.locals middleware
    const { options, database, test } = res.locals;
    const mongo = new MongoClient(MONGO_URI, options);

    try {
        // Connect Mongo, begin session
        await mongo.connect();
        const db = mongo.db(database);
        const results = await db.collection(test).find({userId: "auth0|abcdefg"}).toArray();

        // Result if no matches are found
        if (results.length === 0) {
            res.status(404).json({
                status: 404,
                message: "No results found",
            })
        }
        // Result if matches are found
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
    mongo.close(); // Disconnect Mongo, end session
};