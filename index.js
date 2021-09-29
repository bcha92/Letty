// Node Express Import
import express from "express";
import cors from "cors";

//Middleware Import
import mongokeys from "./server/MongoMiddleware.js";

// Handlers Import
import { testMongo } from "./server/handlers/reservations.js";

// Local Port to host application || 4000 by default
const port = process.env.PORT || 4000;

const app = express(); // Initialized Express App
app.use(cors()); // Cross-Origin Resource Sharing

// Endpoints

app.get("/", mongokeys, testMongo);
// Error Handling
app.get("*", (req, res) => res.status(400).json(
    "Error 404: This is an error. Please check your endpoints."
));
// Ready to listen on this port...
app.listen(port, () => console.log(`Standing by on port ${port}...`));