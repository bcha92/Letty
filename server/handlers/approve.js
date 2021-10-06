import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const { MONGO_URI } = process.env;

// PATCH // Approve/Deny Booking for User
export const decideBooking = async (req, res) => {
    // Deconstructed req.body
    const { propertyId, reservationId, room, bool, reply } = req.body;
    // Deconstructed res.locals
    const { options, database, properties, reservations } = res.locals;
    const mongo = new MongoClient(MONGO_URI, options);

    try {
        // Connect Mongo, begin session
        await mongo.connect();
        const db = mongo.db(database);

        // Get Property
        const oldproperty = await db.collection(properties).findOne({ _id: propertyId });

        // Move items to new Array
        const updatedRes = [];
        await oldproperty.rooms.forEach(space => {
            if (space.id === room) {
                space.reservations.forEach(reservation => {
                    if (reservation._id === reservationId) {
                        reservation.approved = bool;
                        reservation.reply = reply;
                    }
                    updatedRes.push(reservation);
                })
            }
        })

        // Update the Property and Reservation
        // Replace "reservations" with updatedRes new Array
        const property = await db.collection(properties).updateOne( // Property
            { _id: propertyId, "rooms.id": room },
            { $set: { "rooms.$.reservations": updatedRes }}
        );
        const reservation = await db.collection(reservations).updateOne( // Reservation
            { _id: reservationId },
            { $set: { "approved": bool, "reply": reply }}
        );

        // Return res.status once update is finished
        res.status(200).json({
            status: 204,
            message: `Successfully ${bool ? "approved" : "denied"} reservation ID ${reservationId} for the ${room} space in property ID ${propertyId}`,
            data: {property: property, reservation}
        })
    }

    catch (err) { // Error Handler
        console.log("decideBooking Error:", err);
    }
    mongo.close(); // Disconnect Mongo, end session
};

// POST // Check Dates
export const checkRooms = async (req, res) => {
    // Deconstructed req.body
    const { propertyId, spaceId, dates } = req.body;

    // Deconstructed res.locals
    const { options, database, properties, reservations } = res.locals;
    const mongo = new MongoClient(MONGO_URI, options);

    try {
        // Connect Mongo, begin session
        await mongo.connect();
        const db = mongo.db(database);

        const property = await db.collection(properties).findOne({ _id: propertyId });
        let checkRes = false; // Initial flag for checking

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

        // If checkRes-ervation is true, error message is returned
        if (checkRes) {
            res.status(400).json({
                status: 400,
                message: "Sorry, these date(s) have already been booked for this space. Please select another range of dates and try again.",
                data: dates,
            })
        }
        // Else, everything else is good to go
        else {
            res.status(200).json({
                status: 200,
                message: "Your dates are available and has been set. Please continue with your booking.",
                data: dates,
            })
        }
    }

    catch (err) {
        console.log("checkRooms Error:", err);
    }
    mongo.close(); // Disconnect Mongo, end session
};