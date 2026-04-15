import mongoose, { ConnectOptions } from "mongoose";

import logger from "@/lib/winston";

import env from "@/schemas/env-schema";

const MONGODB_URI = env.MONGO_URI;

interface MongooseCache {
   conn: typeof mongoose | null;
   promise: Promise<typeof mongoose> | null;
}

declare global {
   var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
   global.mongoose = cached;
}

async function connectDB() {
   if (cached.conn) {
      logger.info("Chached DB connected 1");

      return cached.conn;
   }

   if (!cached.promise) {
      const clientOptions: ConnectOptions = {
         dbName: "portfolio",
         appName: "Cluster0",
         serverApi: {
            version: "1",
            strict: true,
            deprecationErrors: true,
         },
         bufferCommands: false,
      };
      cached.promise = mongoose.connect(MONGODB_URI, clientOptions).then((mongoose) => {
         return mongoose;
      });
      logger.info("DB connected");
   }

   try {
      cached.conn = await cached.promise;
      logger.info("Chached DB connected 2");
   } catch (e) {
      logger.error(e);
      cached.promise = null;
      throw e;
   }

   return cached.conn;
}

export default connectDB;
