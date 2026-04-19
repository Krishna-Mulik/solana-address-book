import type { RequestHandler } from "express";

export const deriveCotactPda: RequestHandler = async (req, res) => {
    const { mintAddress } = req.body;

    if (!mintAddress?.trim()) {
        return res.status(400).send('invalid mint addres');
    }

}
