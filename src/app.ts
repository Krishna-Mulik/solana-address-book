import express from 'express';
import { addContacts, deleteContactById, getContactById, getContacts, updateContactName } from './controller/contacts.js';
import { validatePubKey } from './middleware/validatePubkey.middleware.js';
import { deriveCotactATA, verifyOwnership } from './controller/ata.js';

const app = express();

app.use(express.json({ limit: '16kb' }))

app.route('/api/contacts')
    .post(validatePubKey, addContacts)
    .get(getContacts);

app.route('/api/contacts/:id')
    .patch(updateContactName)
    .get(getContactById)
    .delete(deleteContactById);

// ATA Derivation

app.route('/api/contacts/:id/derive-ata')
    .post(deriveCotactATA);

app.route('/api/verify-ownership')
    .post(validatePubKey, verifyOwnership)

export default app;

