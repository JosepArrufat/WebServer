import { configObject } from "../config.js";
export function handlerCount(req, res) {
    res.status(200);
    res.set({
        "Content-Type": "text/plain; charset=utf-8",
    });
    res.send(`Hits: ${configObject.fileserverHits}`);
}
