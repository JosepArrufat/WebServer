import { upgradeUser } from "../db/queries/users.js";
import { NotFoundError } from "../errors.js";
export async function handlerWebhooks(req, res) {
    console.log('Request details:', {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.body
    });
    const { event, data } = req.body;
    if (event != "user.upgraded")
        return res.status(204).end();
    const upgradedUser = await upgradeUser(data.userId);
    if (!upgradedUser)
        throw new NotFoundError();
    return res.status(204).send();
}
