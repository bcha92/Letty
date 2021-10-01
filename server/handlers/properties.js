import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const { MONGO_URI } = process.env;

import { v4 as uuidv4 } from "uuid";

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
        const result = await db.collection(properties).findOne({ _id: propertyId });

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

// ADD a Property
export const addProperty = async (req, res) => {
    // Deconstrcuted req.body
    const { name, address, country, rooms } = req.body;

    // Check for missing information before starting Mongo
    let missingInfo = false;
    rooms.forEach(room => {
        if (room.id.length === 0 || room.price.length === 0) {
            missingInfo = true;
        }
    });

    if (name.length === 0 || address.length === 0 ||
    country.length === 0 || rooms.length === 0 || missingInfo) {
        return res.status(400).json({
            status: 400,
            message: `Missing Information, unable to process`,
            data: req.body,
        })
    }

    // Deconstructed res.locals
    const { options, database, properties } = res.locals;
    const mongo = new MongoClient(MONGO_URI, options);

    try {
        // Connect Mongo, begin session
        await mongo.connect();
        const db = mongo.db(database);

        // Add property to database
        const newProperty = { _id: uuidv4(), registered: new Date(), ...req.body };
        await db.collection(properties).insertOne(newProperty);

        // Return res.status once property is added
        res.status(201).json({
            status: 201,
            message: "New property added to site!",
            date: newProperty,
        })
    }

    catch (err) { // Error Handling
        console.log("addProperty Error:", err);
    }
    mongo.close(); // Disconnect Mongo, end session
};