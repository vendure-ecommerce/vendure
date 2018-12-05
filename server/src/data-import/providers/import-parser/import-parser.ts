import { Injectable } from '@nestjs/common';
import * as parse from 'csv-parse';
import { Stream } from 'stream';

export interface RawProductRecord {
    name?: string;
    slug?: string;
    description?: string;
    assets?: string;
    optionGroups?: string;
    optionValues?: string;
    sku?: string;
    price?: string;
    taxCategory?: string;
    variantAssets?: string;
}

export interface ParsedProductVariant {
    optionValues: string[];
    sku: string;
    price: number;
    taxCategory: string;
    assetPaths: string[];
}

export interface ParsedProduct {
    name: string;
    slug: string;
    description: string;
    assetPaths: string[];
    optionGroups: Array<{
        name: string;
        values: string[];
    }>;
}

export interface ParsedProductWithVariants {
    product: ParsedProduct;
    variants: ParsedProductVariant[];
}

/**
 * Validates and parses CSV files into a data structure which can then be used to created new entities.
 */
@Injectable()
export class ImportParser {
    async parseProducts(input: string | Stream): Promise<ParsedProductWithVariants[]> {
        const options: parse.Options = {
            columns: true,
            trim: true,
        };
        return new Promise<ParsedProductWithVariants[]>((resolve, reject) => {
            if (typeof input === 'string') {
                parse(input, options, (err, records: RawProductRecord[]) => {
                    if (err) {
                        reject(err);
                    }

                    try {
                        const output = this.processRawRecords(records);
                        resolve(output);
                    } catch (err) {
                        reject(err);
                    }
                });
            } else {
                const parser = parse(options);
                const records: RawProductRecord[] = [];
                // input.on('open', () => input.pipe(parser));
                input.pipe(parser);
                parser.on('readable', () => {
                    let record;
                    // tslint:disable-next-line:no-conditional-assignment
                    while ((record = parser.read())) {
                        records.push(record);
                    }
                });
                parser.on('error', reject);
                parser.on('end', () => {
                    try {
                        const output = this.processRawRecords(records);
                        resolve(output);
                    } catch (err) {
                        reject(err);
                    }
                });
            }
        });
    }

    private processRawRecords(records: RawProductRecord[]): ParsedProductWithVariants[] {
        const output: ParsedProductWithVariants[] = [];
        let currentRow: ParsedProductWithVariants | undefined;
        validateColumns(records[0]);
        for (const r of records) {
            if (r.name) {
                if (currentRow) {
                    populateOptionGroupValues(currentRow);
                    output.push(currentRow);
                }
                currentRow = {
                    product: parseProductFromRecord(r),
                    variants: [parseVariantFromRecord(r)],
                };
            } else {
                if (currentRow) {
                    currentRow.variants.push(parseVariantFromRecord(r));
                }
            }
            validateOptionValueCount(r, currentRow);
        }
        if (currentRow) {
            populateOptionGroupValues(currentRow);
            output.push(currentRow);
        }
        return output;
    }
}

function populateOptionGroupValues(currentRow: ParsedProductWithVariants) {
    const values = currentRow.variants.map(v => v.optionValues);
    currentRow.product.optionGroups.forEach((og, i) => {
        const uniqueValues = Array.from(new Set(values.map(v => v[i])));
        og.values = uniqueValues;
    });
}

function validateColumns(r: RawProductRecord) {
    const requiredColumns: Array<keyof RawProductRecord> = [
        'name',
        'slug',
        'description',
        'assets',
        'optionGroups',
        'optionValues',
        'sku',
        'price',
        'taxCategory',
        'variantAssets',
    ];
    const rowKeys = Object.keys(r);
    const missing: string[] = [];
    for (const col of requiredColumns) {
        if (!rowKeys.includes(col)) {
            missing.push(col);
        }
    }
    if (missing.length) {
        throw new Error(
            `The import file is missing the following columns: ${missing.map(m => `"${m}"`).join(', ')}`,
        );
    }
}

function validateOptionValueCount(r: RawProductRecord, currentRow?: ParsedProductWithVariants) {
    if (!currentRow) {
        return;
    }
    const optionValues = parseStringArray(r.optionValues);
    if (currentRow.product.optionGroups.length !== optionValues.length) {
        throw new Error(
            `The number of optionValues must match the number of optionGroups for the product "${r.name}"`,
        );
    }
}

function parseProductFromRecord(r: RawProductRecord): ParsedProduct {
    return {
        name: parseString(r.name),
        slug: parseString(r.slug),
        description: parseString(r.description),
        assetPaths: parseStringArray(r.assets),
        optionGroups: parseStringArray(r.optionGroups).map(name => ({
            name,
            values: [],
        })),
    };
}

function parseVariantFromRecord(r: RawProductRecord): ParsedProductVariant {
    return {
        optionValues: parseStringArray(r.optionValues),
        sku: parseString(r.sku),
        price: parseNumber(r.price),
        taxCategory: parseString(r.taxCategory),
        assetPaths: parseStringArray(r.variantAssets),
    };
}

function parseString(input?: string): string {
    return (input || '').trim();
}

function parseNumber(input?: string): number {
    return +(input || '').trim();
}

function parseStringArray(input?: string, separator = ','): string[] {
    return (input || '')
        .trim()
        .split(separator)
        .map(s => s.trim())
        .filter(s => s !== '');
}
