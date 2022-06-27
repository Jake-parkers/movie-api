import dbConfig from "../config/mongo";
import mongoose from "mongoose";
import Logger from "../helpers/logger";
import InternalServerException from "../error-handling/internal-server-exception";

async function initiateMongodb() {
    try {
        await mongoose.connect(dbConfig.mongoUri, dbConfig.config);
    } catch(error: any) {
        throw new InternalServerException({ message: "Database connection failed", stack: error.stack || error, context: { db_url: dbConfig.mongoUri } })
    }

    mongoose.connection.on('connected', () => {
        console.log(`Mongoose connection to ${dbConfig.mongoUri} successful`)
        Logger.info(`Mongoose connection to ${dbConfig.mongoUri} successful`);
    });

    mongoose.connection.on('error', (err) => {
        console.error(`Mongoose connection error ${err}`);
        Logger.error(`Mongoose connection error ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
        console.log("Mongoose connection disconnected")
        Logger.info("Mongoose connection disconnected")
    })
}

export default initiateMongodb;