import { Injectable } from '@nestjs/common';
import { GlobalFlag } from '@vendure/common/lib/generated-types';
import { normalizeString } from '@vendure/common/lib/normalize-string';
import { unique } from '@vendure/common/lib/unique';
import parse from 'csv-parse';
import { Stream } from 'stream';

export type BaseProductRecord = {
    name?: string;
    slug?: string;
    description?: string;
    assets?: string;
    facets?: string;
    optionGroups?: string;
    optionValues?: string;
    sku?: string;
    price?: string;
    taxCategory?: string;
    stockOnHand?: string;
    trackInventory?: string;
    variantAssets?: string;
    variantFacets?: string;
};

export type RawProductRecord = BaseProductRecord & { [customFieldName: string]: string };

export interface ParsedProductVariant {
    optionValues: string[];
    sku: string;
    price: number;
    taxCategory: string;
    stockOnHand: number;
    trackInventory: GlobalFlag;
    assetPaths: string[];
    facets: Array<{
        facet: string;
        value: string;
    }>;
    customFields: {
        [name: string]: string;
    };
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
    facets: Array<{
        facet: string;
        value: string;
    }>;
    customFields: {
        [name: string]: string;
    };
}

export interface ParsedProductWithVariants {
    product: ParsedProduct;
    variants: ParsedProductVariant[];
}

export interface ParseResult<T> {
    results: T[];
    errors: string[];
    processed: number;
}

const requiredColumns: Array<keyof BaseProductRecord> = [
    'name',
    'slug',
    'description',
    'assets',
    'facets',
    'optionGroups',
    'optionValues',
    'sku',
    'price',
    'taxCategory',
    'variantAssets',
    'variantFacets',
];

/**
 * Validates and parses CSV files into a data structure which can then be used to created new entities.
 */
@Injectable()
export class ImportParser {
    async parseProducts(input: string | Stream): Promise<ParseResult<ParsedProductWithVariants>> {
        const options: parse.Options = {
            trim: true,
            relax_column_count: true,
        };
        return new Promise<ParseResult<ParsedProductWithVariants>>((resolve, reject) => {
            let errors: string[] = [];

            if (typeof input === 'string') {
                parse(input, options, (err: any, records: string[][]) => {
                    if (err) {
                        errors = errors.concat(err);
                    }
                    if (records) {
                        const parseResult = this.processRawRecords(records);
                        errors = errors.concat(parseResult.errors);
                        resolve({ results: parseResult.results, errors, processed: parseResult.processed });
                    } else {
                        resolve({ results: [], errors, processed: 0 });
                    }
                });
            } else {
                const parser = parse(options);
                const records: string[][] = [];
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
                    const parseResult = this.processRawRecords(records);
                    errors = errors.concat(parseResult.errors);
                    resolve({ results: parseResult.results, errors, processed: parseResult.processed });
                });
            }
        });
    }

    private processRawRecords(records: string[][]): ParseResult<ParsedProductWithVariants> {
        const results: ParsedProductWithVariants[] = [];
        const errors: string[] = [];
        let currentRow: ParsedProductWithVariants | undefined;
        const headerRow = records[0];
        const rest = records.slice(1);
        const totalProducts = rest.map(row => row[0]).filter(name => name.trim() !== '').length;
        const columnError = validateRequiredColumns(headerRow);
        if (columnError) {
            return { results: [], errors: [columnError], processed: 0 };
        }
        let line = 1;
        for (const record of rest) {
            line++;
            const columnCountError = validateColumnCount(headerRow, record);
            if (columnCountError) {
                errors.push(columnCountError + ` on line ${line}`);
                continue;
            }
            const r = mapRowToObject(headerRow, record);
            if (r.name) {
                if (currentRow) {
                    populateOptionGroupValues(currentRow);
                    results.push(currentRow);
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
            const optionError = validateOptionValueCount(r, currentRow);
            if (optionError) {
                errors.push(optionError + ` on line ${line}`);
            }
        }
        if (currentRow) {
            populateOptionGroupValues(currentRow);
            results.push(currentRow);
        }
        return { results, errors, processed: totalProducts };
    }
}

function populateOptionGroupValues(currentRow: ParsedProductWithVariants) {
    const values = currentRow.variants.map(v => v.optionValues);
    currentRow.product.optionGroups.forEach((og, i) => {
        og.values = unique(values.map(v => v[i]));
    });
}

function validateRequiredColumns(r: string[]): string | undefined {
    const rowKeys = r;
    const missing: string[] = [];
    for (const col of requiredColumns) {
        if (!rowKeys.includes(col)) {
            missing.push(col);
        }
    }
    if (missing.length) {
        return `The import file is missing the following columns: ${missing.map(m => `"${m}"`).join(', ')}`;
    }
}

function validateColumnCount(columns: string[], row: string[]): string | undefined {
    if (columns.length !== row.length) {
        return `Invalid Record Length: header length is ${columns.length}, got ${row.length}`;
    }
}

function mapRowToObject(columns: string[], row: string[]): { [key: string]: string } {
    return row.reduce((obj, val, i) => {
        return { ...obj, [columns[i]]: val };
    }, {});
}

function validateOptionValueCount(
    r: BaseProductRecord,
    currentRow?: ParsedProductWithVariants,
): string | undefined {
    if (!currentRow) {
        return;
    }
    const optionValues = parseStringArray(r.optionValues);
    if (currentRow.product.optionGroups.length !== optionValues.length) {
        return `The number of optionValues must match the number of optionGroups`;
    }
}

function parseProductFromRecord(r: RawProductRecord): ParsedProduct {
    const name = parseString(r.name);
    const slug = parseString(r.slug) || normalizeString(name, '-');
    return {
        name,
        slug,
        description: parseString(r.description),
        assetPaths: parseStringArray(r.assets),
        optionGroups: parseStringArray(r.optionGroups).map(ogName => ({
            name: ogName,
            values: [],
        })),
        facets: parseStringArray(r.facets).map(pair => {
            const [facet, value] = pair.split(':');
            return { facet, value };
        }),
        customFields: parseCustomFields('product', r),
    };
}

function parseVariantFromRecord(r: RawProductRecord): ParsedProductVariant {
    return {
        optionValues: parseStringArray(r.optionValues),
        sku: parseString(r.sku),
        price: parseNumber(r.price),
        taxCategory: parseString(r.taxCategory),
        stockOnHand: parseNumber(r.stockOnHand),
        trackInventory:
            r.trackInventory == null || r.trackInventory === ''
                ? GlobalFlag.INHERIT
                : parseBoolean(r.trackInventory)
                ? GlobalFlag.TRUE
                : GlobalFlag.FALSE,
        assetPaths: parseStringArray(r.variantAssets),
        facets: parseStringArray(r.variantFacets).map(pair => {
            const [facet, value] = pair.split(':');
            return { facet, value };
        }),
        customFields: parseCustomFields('variant', r),
    };
}

function parseCustomFields(prefix: 'product' | 'variant', r: RawProductRecord): { [name: string]: string } {
    return Object.entries(r)
        .filter(([key, value]) => {
            return key.indexOf(`${prefix}:`) === 0;
        })
        .reduce((output, [key, value]) => {
            const fieldName = key.replace(`${prefix}:`, '');
            return {
                ...output,
                [fieldName]: value,
            };
        }, {});
}

function parseString(input?: string): string {
    return (input || '').trim();
}

function parseNumber(input?: string): number {
    return +(input || '').trim();
}

function parseBoolean(input?: string): boolean {
    if (input == null) {
        return false;
    }
    switch (input.toLowerCase()) {
        case 'true':
        case '1':
        case 'yes':
            return true;
        default:
            return false;
    }
}

function parseStringArray(input?: string, separator = '|'): string[] {
    return (input || '')
        .trim()
        .split(separator)
        .map(s => s.trim())
        .filter(s => s !== '');
}
