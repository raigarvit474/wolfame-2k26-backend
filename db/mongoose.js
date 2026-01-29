const mongoose = require("mongoose")

const url = process.env.MONGODB_URL;

mongoose.connect(url, {
    useNewUrlParser: true,
}).then(() => {
    console.log("Connected to Database");
}).catch(err => {
    console.error("Error connecting to Database", err);
});