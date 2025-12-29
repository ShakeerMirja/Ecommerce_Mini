const mongoose = require("mongoose");

require("dotenv").config();
exports.connectdb = () => {
    mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("Database connected successfully"))
    .catch((error) => console.log(error.message));
}
