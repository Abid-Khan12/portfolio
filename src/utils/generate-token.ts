import jwt from "jsonwebtoken";
import { Types } from "mongoose";

import env from "@/schemas/env-schema";

const generateJWTExpiryTime = (time: string): number => {
   const match = time.match(/^(\d+)([smhdw])$/);

   if (!match) {
      throw new Error("Invalid time format. Use formats like 1h, 30m, 7d, 1w");
   }

   const value = parseInt(match[1], 10);
   const unit = match[2];

   switch (unit) {
      case "s":
         return value;
      case "m":
         return value * 60;
      case "h":
         return value * 60 * 60;
      case "d":
         return value * 60 * 60 * 24;
      case "w":
         return value * 60 * 60 * 24 * 7;
      default:
         throw new Error("Invalid time unit");
   }
};

export const generateAccessToken = (userId: Types.ObjectId): string => {
   return jwt.sign({ userId: userId }, env.JWT_ACCESS_SECRET, {
      expiresIn: generateJWTExpiryTime(env.ACCESS_TOKEN_EXPIRY),
      subject: "accessToken",
   });
};

export const verifyAccessToken = (token: string) => {
   return jwt.verify(token, env.JWT_ACCESS_SECRET);
};
