import { PublicKey } from '@solana/web3.js'
import type { AddressType } from '../types.js';
import { clusterApiUrl, Connection } from "@solana/web3.js";
import { getMint } from '@solana/spl-token';

let connection: Connection | null = null;
let connectionPromise: Promise<Connection> | null = null;

export const getConnection = async () => {
    if (connection) return connection;

    if (!connectionPromise) {
        connectionPromise = (async () => {
            const conn = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
            connection = conn;
            return conn;
        })();
    }

    return connectionPromise;
}


export const isValidMint = async (mintAddress: string): Promise<boolean> => {
    try {
        const connection = await getConnection();

        const pubKey = new PublicKey(mintAddress);

        await getMint(connection, pubKey)
        return true;
    } catch (error) {
        console.error('mint-validation failed: ', error);
        return false;
    }
}

export const detectPubKeyType = (pubKey: string): AddressType => {
    try {
        const key = new PublicKey(pubKey);
        return PublicKey.isOnCurve(key) ? "wallet" : "pda";
    } catch {
        throw new Error("Invalid public key");
    }
};
