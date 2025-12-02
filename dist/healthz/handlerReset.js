import { configObject } from "../config.js";
export function handlerReset(req, res) {
    res.status(200);
    res.set({
        "Content-Type": "text/plain; charset=utf-8",
    });
    configObject.fileserverHits = 0;
    res.send(`Hits: ${configObject.fileserverHits}`);
}
