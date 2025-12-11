const mongoose = require("mongoose");
const config = require("./config");

const { username, password, host, port, dbName, authSource } = config.mongodb;

const mongoURI = `mongodb://${username}:${password}@${host}:${port}/${dbName}?authSource=${authSource}`;

async function connectDB() {
    try {
        await mongoose.connect(mongoURI);
        console.log("MongoDB connected");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

module.exports = connectDB;
