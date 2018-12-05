import * as fs from 'fs-extra';
import * as path from 'path';

import { ImportParser } from './import-parser';

describe('ImportParser', () => {
    describe('parseProducts', () => {
        it('single product with a single variant', async () => {
            const importParser = new ImportParser();

            const input = await loadTestFixture('single-product-single-variant.csv');
            const result = await importParser.parseProducts(input);

            expect(result).toMatchSnapshot();
        });

        it('single product with a multiple variants', async () => {
            const importParser = new ImportParser();

            const input = await loadTestFixture('single-product-multiple-variants.csv');
            const result = await importParser.parseProducts(input);

            expect(result).toMatchSnapshot();
        });

        it('multiple products with multiple variants', async () => {
            const importParser = new ImportParser();

            const input = await loadTestFixture('multiple-products-multiple-variants.csv');
            const result = await importParser.parseProducts(input);

            expect(result).toMatchSnapshot();
        });

        it('works with streamed input', async () => {
            const importParser = new ImportParser();

            const filename = path.join(__dirname, 'test-fixtures', 'multiple-products-multiple-variants.csv');
            const input = fs.createReadStream(filename);
            const result = await importParser.parseProducts(input);

            expect(result).toMatchSnapshot();
        });

        describe('error conditions', () => {
            it('throws on invalid option values', async () => {
                const importParser = new ImportParser();

                const input = await loadTestFixture('invalid-option-values.csv');
                try {
                    await importParser.parseProducts(input);
                    fail('should have thrown');
                } catch (err) {
                    expect(err.message).toBe(
                        'The number of optionValues must match the number of optionGroups for the product "Artists Smock"',
                    );
                }
            });

            it('throws on ivalid columns', async () => {
                const importParser = new ImportParser();

                const input = await loadTestFixture('invalid-columns.csv');
                try {
                    await importParser.parseProducts(input);
                    fail('should have thrown');
                } catch (err) {
                    expect(err.message).toBe(
                        'The import file is missing the following columns: "slug", "assets"',
                    );
                }
            });
        });
    });
});

function loadTestFixture(fileName: string): Promise<string> {
    return fs.readFile(path.join(__dirname, 'test-fixtures', fileName), 'utf-8');
}
