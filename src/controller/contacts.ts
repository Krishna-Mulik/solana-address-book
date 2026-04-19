import type { RequestHandler } from "express";
import { getAddressBook, updateAddressBook } from "../utils/db.utils.js";
import type { Contact } from "../types.js";

export const addContacts: RequestHandler = async (req, res) => {
    try {
        console.log('addcontacts invoked');

        const { name } = req.body;

        if (!name?.trim()) {
            return res.status(400).send('invalid name');
        }

        const addressObj = req.addressObj;


        if (!addressObj) {
            return res.status(500).send('internal server error, while create contact');
        }

        const addressBook = await getAddressBook();

        const isAddressExists = addressBook.find(obj => {
            return obj.address === addressObj.address;
        });

        if (isAddressExists) {
            return res.status(409).send('address already exists');
        }


        console.log('address book: ', addressBook);


        const id = addressBook.length + 1;

        const contact: Contact = {
            id,
            name,
            address: addressObj.address,
            type: addressObj.type,
            createdAt: Date.now()
        }

        addressBook.push(contact);

        await updateAddressBook(addressBook);

        res.status(201).json({
            message: 'contact added successfully',
            contact
        });

    } catch (error) {
        throw new Error(`Error adding contact: ${error}`)
    }
}

export const getContacts: RequestHandler = async (req, res) => {

    const { type } = req.query;

    console.log('queries: ', type);



    const addressBook = await getAddressBook();

    if (Object.keys(req.query).length > 0) {


        const filters = req.query as Record<string, unknown>;

        const result = addressBook.filter(obj =>
            Object.keys(filters).every(key =>
                key in obj && obj[key as keyof Contact] === filters[key]
            )
        );

        return res.status(200).json(result);
    }

    res.status(200).json(addressBook);
}

export const getContactById: RequestHandler = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).send('invalid id')
    }

    const addressBook = await getAddressBook()

    const result = addressBook.find(contact => contact.id === Number(id));

    if (!result) return res.status(404).send('contact not found.')

    res.status(200).send(result);
}

export const updateContactName: RequestHandler = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).send('invalid id')
    }

    const { name } = req.body;

    if (!name?.trim()) {
        return res.status(400).send('invalid name')
    }

    const addressBook = await getAddressBook();

    const contact = addressBook.find(contact => contact.id === Number(id));
    if (!contact) return res.status(404).send('contact not found.');

    contact.name = name;

    updateAddressBook(addressBook);

    res.status(200).send(contact);
}

export const deleteContactById: RequestHandler = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).send('invalid id')
    }

    const addressBook = await getAddressBook();

    await updateAddressBook(addressBook.filter(contact => contact.id !== Number(id)))

    res.status(204).send();
}

