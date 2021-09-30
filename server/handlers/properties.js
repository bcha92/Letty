import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const { MONGO_URI } = process.env;

// GET Properties by user ID
export const getProperties = async (req, res) => {
    // Deconstructed res.locals
    const { options, database, properties } = res.locals;
    const mongo = new MongoClient(MONGO_URI, options);

    try {
        // Connect Mongo, begin session
        await mongo.connect();
        const db = mongo.db(database);
        const results = await db.collection(properties).find().toArray();

        // Results if no reservations are found
        if (results.length === 0) {
            res.status(400).json({
                status: 400,
                message: `No properties found.`,
            })
        }
        // Results if any reservations are found
        else {
            res.status(200).json({
                status: 200,
                message: `Properties found.`,
                data: results,
            })
        }
    }

    catch (err) { // Error Handler
        console.log("getProperties Error:", err);
    }
    mongo.close(); // Disconnect Mongo, end session
};

// GET a Property by Property ID
export const getProperty = async (req, res) => {
    const { propertyId } = req.params; // Property ID
    // Deconstructed res.locals
    const { options, database, properties } = res.locals;
    const mongo = new MongoClient(MONGO_URI, options);

    try {
        // Connect Mongo, begin session
        await mongo.connect();
        const db = mongo.db(database);
        const result = await db.collection(reservations).findOne({ _id: propertyId });

        // Result if no reservation is found
        if (result === null) {
            res.status(400).json({
                status: 400,
                message: `The property you are searching for by ID ${propertyId} is not found.`,
            })
        }
        // Result in reservation is found
        else {
            res.status(200).json({
                status: 200,
                message: `Propery ID ${propertyId} has been found.`,
                data: result,
            })
        }
    }

    catch (err) {
        console.log("getProperty Error:", err);
    }
    mongo.close(); // Disconnect Mongo, end session
};