import { config } from "../config.js";
export function handlerCount(req, res) {
    res.status(200);
    res.set({
        "Content-Type": "text/html; charset=utf-8",
    });
    const htmlContent = `
    <html>
        <body>
            <h1>Welcome, Chirpy Admin</h1>
            <p>Chirpy has been visited ${config.api.fileserverHits} times!</p>
        </body>
    </html>`;
    res.send(htmlContent);
}
