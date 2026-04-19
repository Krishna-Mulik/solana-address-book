import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import type { AddressBook } from '../types.js';

const databasePath = path.join(process.cwd(), 'DATABASE', 'address-book.json');

export const updateAddressBook = async (data: AddressBook) => {
    console.log('sringiy test ', JSON.stringify(data));

    await writeFile(databasePath, JSON.stringify(data))
}

export const getAddressBook = async (): Promise<AddressBook> => {
    let raw = await readFile(databasePath, 'utf-8');

    console.log('raw: ', raw);

    if (!raw?.trim()) {
        raw = '[]';
    }

    let data = JSON.parse(raw);

    console.log('parse test ', JSON.stringify(data));

    return data;
}
