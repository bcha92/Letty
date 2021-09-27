// Node Express Import
import express from "express";
import cors from "cors";
// Local Port to host application || 4000 by default
const port = process.env.PORT || 4000;
const app = express(); // Initialized Express App
app.use(cors()); // Cross-Origin Resource Sharing

// Endpoints

app.get("/", (req, res) => res.status(200).json("Test Endpoint: React client connected to express."))
// Error Handling
app.get("*", (req, res) => res.status(400).json(
    "Error 404: This is an error. Please check your endpoints."
));
// Ready to listen on this port...
app.listen(port, () => console.log(`Standing by on port ${port}...`));