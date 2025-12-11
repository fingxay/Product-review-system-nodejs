require("dotenv").config();

const config = {
    mongodb: {
        username: process.env.MONGODB_USER,
        password: process.env.MONGODB_PASSWORD,
        host: process.env.MONGODB_HOST,
        port: process.env.MONGODB_PORT,
        dbName: process.env.MONGODB_DB_NAME,
        authSource: process.env.MONGODB_AUTH_SOURCE
    }
};

module.exports = config;
