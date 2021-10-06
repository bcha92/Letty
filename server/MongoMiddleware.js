// MongoDB Next Middlware
const mongokeys = async (req, res, next) => {
    // Options
    res.locals.options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };
    res.locals.database = "letty"; // Database Name
    // Assigning MongoDB Path Strings to res.locals
    res.locals.reservations = "reservations";
    res.locals.properties = "properties";

    // MongoDB "Test" Database Sandbox // For Testing new Endpoints ONLY
    // res.locals.test = "test";

    next();
};

export default mongokeys;