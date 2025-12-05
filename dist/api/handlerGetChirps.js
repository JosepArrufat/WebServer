import { getAllChirps, getChirpsByAuthor } from "../db/queries/chirps.js";
export async function handlerGetChirps(req, res) {
    const { authorId, sort } = req.query;
    const chirps = authorId
        ? await getChirpsByAuthor(authorId, sort)
        : await getAllChirps(sort);
    const formattedChirps = chirps.map(chirp => ({
        id: chirp.id,
        createdAt: chirp.createdAt,
        updatedAt: chirp.updatedAt,
        body: chirp.body,
        userId: chirp.user_id
    }));
    res.status(200);
    res.json(formattedChirps);
}
