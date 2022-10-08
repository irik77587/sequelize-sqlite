import { createHash } from 'node:crypto';
export default function hashing(password) {
    return createHash("sha256").update(password,"binary").digest("base64");
}
// https://www.npmjs.com/package/http-status-codes
// npm i http-status-codes
