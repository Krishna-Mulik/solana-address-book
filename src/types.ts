
declare module "express-serve-static-core" {
    interface Request {
        addressObj?: {
            address: string,
            type: AddressType
        }
    }
}

export type Contact = {
    id: number;
    name: string;
    ata?: string;
    address: string;
    type: AddressType;
    createdAt: number;
}

export type AddressBook = Contact[];

export type AddressType = 'wallet' | 'pda'


