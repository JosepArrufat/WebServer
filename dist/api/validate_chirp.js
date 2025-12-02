import { BadRequestError } from "../errors.js";
export async function handlerValidateChirp(req, res) {
    const params = req.body;
    if (!params) {
        res.status(400);
        res.send({
            "error": "Something went wrong"
        });
        return;
    }
    else if (params.body.length > 140) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }
    else {
        let cleanedBody = params.body
            .replace(/kerfuffle/gi, "****")
            .replace(/sharbert/gi, "****")
            .replace(/fornax/gi, "****");
        res.status(200);
        res.send({
            "cleanedBody": cleanedBody
        });
    }
}
