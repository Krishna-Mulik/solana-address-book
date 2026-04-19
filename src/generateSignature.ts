import nacl from "tweetnacl";
import bs58 from "bs58";
import { log } from "node:console";

const sender = nacl.sign.keyPair();
const reciever = nacl.sign.keyPair();

console.log('senders public: ', sender.publicKey);
console.log('reciever public: ', reciever.publicKey);


// sender logic
const message = "hello world";

const messagesBytes = new TextEncoder().encode(message);

const signature = nacl.sign.detached(messagesBytes, sender.secretKey);
console.log('signature: ', signature);

// reciever logic
const alteredMessage = "hello world, hehe"
const verifyWithAlteredMessage = nacl.sign.detached.verify(new TextEncoder().encode(alteredMessage), signature, sender.publicKey);

const verify = nacl.sign.detached.verify(new TextEncoder().encode(message), signature, sender.publicKey);

console.log('verificaton with alteredMessage: ', verifyWithAlteredMessage);
console.log('verificaton: ', verify);

console.log("wallet   :", bs58.encode(sender.secretKey).length);
console.log("address  :", bs58.encode(sender.publicKey).length);
console.log("signature:", bs58.encode(signature).length);


