import crypto from 'crypto';
export const urlAlphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';

const POOL_SIZE_MULTIPLIER = 32;
let pool: any;
let poolOffset: any;

const random = (bytes: number): Uint8Array => {
    if (!pool || pool.length < bytes) {
        pool = Buffer.allocUnsafe(bytes * POOL_SIZE_MULTIPLIER);
        crypto.randomFillSync(pool);
        poolOffset = 0;
    } else if (poolOffset + bytes > pool.length) {
        crypto.randomFillSync(pool);
        poolOffset = 0;
    }

    const res = pool.subarray(poolOffset, poolOffset + bytes);
    poolOffset += bytes;
    return res;
};
function customRandom(
    alphabet: string,
    size: number,
    getRandom: (bytes: number) => Uint8Array,
): () => string {
    const mask = (2 << (31 - Math.clz32((alphabet.length - 1) | 1))) - 1;
    const step = Math.ceil((1.6 * mask * size) / alphabet.length);

    return () => {
        let id = '';
        while (true) {
            const bytes = getRandom(step);
            let i = step;
            while (i--) {
                id += alphabet[bytes[i] & mask] || '';
                if (id.length === size) return id;
            }
        }
    };
}

const customAlphabet = (alphabet: string, size: number) => customRandom(alphabet, size, random);

function nanoid(size: number = 21): string {
    const bytes = random(size);
    let id = '';
    while (size--) {
        id += urlAlphabet[bytes[size] & 63];
    }
    return id;
}

export { nanoid, customAlphabet, customRandom, random };
