import type { RequestHandler } from "express";
import { isValidMint } from "../utils/solana.utils.js";
import { PublicKey } from "@solana/web3.js";
import { getAddressBook, updateAddressBook } from "../utils/db.utils.js";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import nacl from "tweetnacl";
import bs58 from 'bs58';

export const deriveCotactATA: RequestHandler = async (req, res) => {
    const { mintAddress } = req.body;
    const { id } = req.params;

    console.log(mintAddress, id, 'data for ata');


    if (!mintAddress?.trim() || !id) {
        return res.status(400).send('invalid mint addres');
    }

    const isValidMintCheck = await isValidMint(mintAddress);

    if (!isValidMintCheck) {
        return res.status(400).send('invalid mint addres');
    }

    const addressBook = await getAddressBook();

    const owneraddress = addressBook.find(addrs => addrs.id == Number(id));

    if (!owneraddress) {
        return res.status(400).send('invalid owner not found');
    }

    const ownerPubkey = new PublicKey(owneraddress?.address);

    const mintPubkey = new PublicKey(mintAddress);

    const [pda, _bump] = PublicKey.findProgramAddressSync([
        ownerPubkey.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        mintPubkey.toBuffer(),
    ],
        ASSOCIATED_TOKEN_PROGRAM_ID
    );

    owneraddress.ata = pda.toBase58();

    updateAddressBook(addressBook);

    res.status(200).json({
        ata: pda.toBase58(),
        owner: owneraddress.address,
        mint: mintAddress
    });
}

export const verifyOwnership: RequestHandler = async (req, res) => {
    const { address, message, signature } = req.body;

    const messageBytes = new TextEncoder().encode(message);

    const verify = nacl.sign.detached.verify(messageBytes, bs58.decode(address), bs58.decode(signature));

    res.status(200).json({
        valid: verify
    });
}

export const derivePda: RequestHandler = async (req, res) => {
    const { programId, seeds }: {
        programId: string, seeds: string[]
    } = req.body;

    if (!programId?.trim() || !Array.isArray(seeds)) {
        return res.status(400).send('invalid inputs');
    }

    let programKey;
    try {
        programKey = new PublicKey(programId);
    } catch (error) {
        return res.status(400).send('invlaid programId');
    }

    const seedBuffers = seeds.map(seed => {
        const bytes = new TextEncoder().encode(seed);

        if (bytes.length > 32) throw new Error('seed exceeds 32 bytes');

        return bytes;
    });

    const [pda, bump] = PublicKey.findProgramAddressSync(
        seedBuffers,
        programKey
    )

    return res.status(200).json({
        pda,
        bump
    });
}

