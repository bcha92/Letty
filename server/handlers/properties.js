import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const { MONGO_URI, OPENCAGE_API_KEY } = process.env;
import { getPosition } from "../../index.js";

// import 
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

        // Results if no properties are found
        if (results.length === 0) {
            res.status(400).json({
                status: 400,
                message: `No properties found.`,
            })
        }
        // Results if any properties are found
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

        // Result if no property is found
        if (result === null) {
            res.status(400).json({
                status: 400,
                message: `The property you are searching for by ID ${propertyId} is not found.`,
            })
        }
        // Result in property is found
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
    const { name, address, type } = req.body;

    if (name.length === 0 || address.length === 0 ||
        type.length === 0
    ) {
        return res.status(400).json({
            status: 400,
            message: "Missing Information, unable to process",
            data: req.body,
        })
    }

    // Deconstructed res.locals
    const { options, database, properties } = res.locals;
    const mongo = new MongoClient(MONGO_URI, options);

    try {
        // Geocode Position
        const geo = await getPosition(address, OPENCAGE_API_KEY);
        if (geo.lat === undefined || geo.lng === undefined) {
            return res.status(400).json({
                status: 400,
                message: "Missing Information, unable to process",
                geo, data: req.body,
            })
        }

        // Connect Mongo, begin session
        await mongo.connect();
        const db = mongo.db(database);

        // Add property to database
        const newProperty = { _id: uuidv4(), registered: new Date(), geo, ...req.body };
        await db.collection(properties).insertOne(newProperty);

        // Return res.status once property is added
        res.status(201).json({
            status: 201,
            message: "New property added to site!",
            data: newProperty,
        })
    }

    catch (err) { // Error Handling
        console.log("addProperty Error:", err);
    }
    mongo.close(); // Disconnect Mongo, end session
};

// PATCH // ADD a Room to an Existing Property
export const addRoom = async (req, res) => {
    // Deconstructed req.body
    const { id, occupancy, rate } = req.body;
    // Missing Information Handler // Rate can be 0 and does not need to be checked
    if (id.length === 0 || rate.length === 0 ||
        occupancy.length === 0
        ) {
        return res.status(400).json({
            status: 400,
            message: "Missing Information, unable to process",
            data: req.body,
        })
    }

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
        // Result if reservation is found
        else {
            // Insert req.body in rooms in Property
            await db.collection(properties).updateOne(
                { _id: propertyId }, // Filter Parameter to Find Property
                { $push: { rooms: req.body}}
            );

            // Return res.status once room is added
            res.status(200).json({
                status: 204,
                message: `Successfully added Room ${req.body.id} in Property ID ${propertyId}`,
                data: req.body,
            })
        }
    }

    catch (err) {
        console.log("addRoom Error:", err);
    }
    mongo.close(); // Disconnect Mongo, end session
}

// PATCH // REMOVE Room from an Existing Property and Update Reservations Accordingly
export const removeRoom = async (req, res) => {
    // Property ID and Room ID parameters
    const { propertyId, spaceId } = req.params;
    const { options, database, properties, reservations } = res.locals;
    const mongo = new MongoClient(MONGO_URI, options);

    try {
        // Connect Mongo, begin session
        await mongo.connect();
        const db = mongo.db(database);

        // Find property, update "rooms"
        const property = await db.collection(properties).findOne({ _id: propertyId });
        let newRooms = [];
        property.rooms.forEach(room => {
            if (room.id !== spaceId) {
                newRooms.push(room);
            }
        })
        const newProp = await db.collection(properties).updateOne(
            { _id: propertyId },
            { $set: { "rooms": newRooms }}
        );

        // Update Reservations with same property Id and spaceId
        await db.collection(reservations).updateMany(
            { propertyId, spaceId },
            { $set: { "approved": false, "reply": "AUTOMATED MESSAGE: The Property Owner has removed the room from the property listing or has been removed by moderators for violating our terms of service agreement." }}
        );

        // Return Status and Message Once finished
        res.status(200).json({
            status: 204,
            message: `The Room ${spaceId} listed on Property ID ${propertyId} has been successfully removed. Reservations already with booking with this room has also been cancelled`,
            data: newProp,
        })
    }

    catch (err) {
        console.log("removeRoom Error:", err);
    }
    mongo.close(); // Disconnect Mongo, end session
};

// GET // Images
export const getImages = async (req, res) => {
    // Deconstructed res.locals
    const { options, database, properties } = res.locals;
    const mongo = new MongoClient(MONGO_URI, options);

    try {
        // Connect Mongo, begin session
        await mongo.connect();
        const db = mongo.db(database);
        const results = await db.collection(properties).find().toArray();

        let imgArray = [];
        results.forEach(property => {
            imgArray.push(...property.images);
        })

        // Results if no reservations are found
        if (imgArray.length === 0) {
            res.status(400).json({
                status: 400,
                message: `No images found.`,
                data: imgArray,
            })
        }
        // Results if any reservations are found
        else {
            res.status(200).json({
                status: 200,
                message: `Images found.`,
                data: imgArray,
            })
        }
    }

    catch (err) {
        console.log("getImages Error:", err);
    }
    mongo.close(); // Disconnect Mongo, end session
};
