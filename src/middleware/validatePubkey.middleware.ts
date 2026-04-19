import type { RequestHandler } from "express";
import { detectPubKeyType } from "../utils/solana.utils.js";

export const validatePubKey: RequestHandler = async (req, res, next) => {
    try {
        const { address } = req.body;
        const type = detectPubKeyType(address);
        req.addressObj = {
            address,
            type
        }
        next();
    } catch (error) {
        res.status(400).send('validatePubKey: ' + error)
    }
}
