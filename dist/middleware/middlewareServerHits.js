import { config } from "../config.js";
export const middlewareMetrocsInc = (req, res, next) => {
    config.api.fileserverHits += 1;
    next();
};
