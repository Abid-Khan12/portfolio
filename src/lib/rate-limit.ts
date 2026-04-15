import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import env from "@/schemas/env-schema";

const redis = new Redis({
   url: env.UPSTASH_REDIS_REST_URL,
   token: env.UPSTASH_REDIS_REST_TOKEN,
});

const ratelimit = new Ratelimit({
   redis,
   limiter: Ratelimit.slidingWindow(60, "1 m"),
   prefix: "portfolio",
   analytics: true,
});

export default ratelimit;
