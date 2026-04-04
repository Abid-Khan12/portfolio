import winston from "winston";

import env from "@/schemas/env-schema";

const logger = winston.createLogger({
   level: env.NODE_ENV === "production" ? "info" : "debug",

   format: winston.format.combine(
      winston.format.errors({ stack: true }),
      winston.format.timestamp({
         format: "YYYY-MM-DD hh:mm a",
      }),
      winston.format.colorize({ all: true }),
      winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
         const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : "";
         return `[${timestamp}] ${level}: ${stack || message}${metaStr}`;
      }),
   ),

   transports: [new winston.transports.Console()],
});

export default logger;
