import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer

export const dbConnect = async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {});

  mongoose.connection.on('connected', () => {
    console.log(`Mongoose connection successful`);
  });

  mongoose.connection.on('error', (err) => {
        console.error(`Mongoose connection error ${err}`);
    });

};

export const dbDisconnect = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
};