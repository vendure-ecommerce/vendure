import { describe, expect, it } from 'vitest';

import { sanitizeMetadata } from '../src/stripe/metadata-sanitize';

describe('Stripe Metadata Sanitize', () => {
    const metadata = {
        customerEmail: 'test@gmail.com',
    };
    it('should sanitize and create new object metadata', () => {
        const newMetadata = sanitizeMetadata(metadata);
        expect(newMetadata).toEqual(metadata);
        expect(newMetadata).not.toBe(metadata);
    });
    it('should omit fields that have key length exceed 40 characters', () => {
        const newMetadata = sanitizeMetadata({
            ...metadata,
            reallylongkey_reallylongkey_reallylongkey_reallylongkey_reallylongkey: 1,
        });
        expect(newMetadata).toEqual(metadata);
    });
    it('should omit fields that have value length exceed 500 characters', () => {
        const reallyLongText = Array(501).fill('a').join();
        const newMetadata = sanitizeMetadata({
            ...metadata,
            complexField: reallyLongText,
        });
        expect(newMetadata).toEqual(metadata);
    });
    it('should truncate metadata that have more than 50 keys', () => {
        const moreThan50KeysMetadata = Array(51)
            .fill('a')
            .reduce((obj, val, idx) => {
                obj[idx] = val;
                return obj;
            }, {});
        const newMetadata = sanitizeMetadata(moreThan50KeysMetadata);
        expect(Object.keys(newMetadata).length).toEqual(50);
        delete moreThan50KeysMetadata['50'];
        expect(newMetadata).toEqual(moreThan50KeysMetadata);
    });
});
