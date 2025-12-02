import 'dotenv/config';
import express from "express";
import { handlerReadiness } from "./api/handlerReadiness.js";
import { middlewareLogResponses } from "./middleware/middlewareLogResponses.js";
import { middlewareMetrocsInc } from "./middleware/middlewareServerHits.js";
import { handlerCount } from "./api/handlerCount.js";
import { handlerReset } from "./api/handlerReset.js";
import { handlerChirp } from "./api/handlerChirp.js";
import { handlerGetChirps } from './api/handlerGetChirps.js';
import { middlewareError } from "./middleware/middlewareError.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";
import { handlerUsers } from './api/handlerUsers.js';
import { handlerGetChirp } from './api/handlerGetChirp.js';
const migrationClient = postgres(config.db.dbURL, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);
const app = express();
const PORT = 8080;
const asyncHandler = (handler) => {
    return async (req, res, next) => {
        try {
            await handler(req, res);
        }
        catch (err) {
            next(err); // Pass the error to Express
        }
    };
};
app.use(express.json());
app.use("/app", middlewareMetrocsInc);
app.use("/app", express.static("./src/app"));
app.use(middlewareLogResponses);
app.get("/api/healthz", asyncHandler(handlerReadiness));
app.post("/api/chirps", asyncHandler(handlerChirp));
app.get("/api/chirps", asyncHandler(handlerGetChirps));
app.get("/api/chirps/:chirpID", asyncHandler(handlerGetChirp));
app.post("/api/users", asyncHandler(handlerUsers));
app.get("/admin/metrics", asyncHandler(handlerCount));
app.post("/admin/reset", asyncHandler(handlerReset));
// Error handling middleware (must be last)
app.use(middlewareError);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
