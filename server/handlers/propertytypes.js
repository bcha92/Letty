// File System Module
import { readFileSync } from "fs";
// Get Property Types from JSON file // parsed as array
const types = JSON.parse(readFileSync("./server/handlers/types.json"));

// Import Property Types
const getPropertyTypes = async (req, res) => {
    try {
        // System Error Handler for Undefined or Zero Input in types.json
        if (types.length === 0 || types === undefined) {
            return res.status(400).json({
                status: 400,
                message: "Property Types not found or file does not exist.",
            })
        }
        // Sends back json data if property is found (local types.json file)
        res.status(200).json({
            status: 200,
            message: "Property Types found.",
            data: types,
        })
    }

    catch (err) { // Error Catcher
        console.log("getPropertyTypes Error:", err);
    }
};

export default getPropertyTypes;