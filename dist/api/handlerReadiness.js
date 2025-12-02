export function handlerReadiness(req, res) {
    res.status(200);
    res.set({
        "Content-Type": "text/plain; charset=utf-8",
    });
    res.send("OK");
}
