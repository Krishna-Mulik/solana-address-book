import { validatePulicKey } from "./src/utils/solana.utils.js";

const keys = [
    "5oNDL3swdJJF1g9DzJiZ4ynHXgszjAEpUkxVYejchzrY",
    // "5oNDL3swdJJ" invalid key throws error with isOnCurve
    "4BJXYkfvg37zEmBbsacZjeQDpTNx91KppxFJxRqrz48xe"
];

for (let i of keys) {
    console.log(i, ': ', validatePulicKey(i));
}
