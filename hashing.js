import { createHash } from 'node:crypto';
export default function hashing(password) {
    return createHash("sha256").update(password,"binary").digest("base64");
}
