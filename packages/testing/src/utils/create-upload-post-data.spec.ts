import gql from 'graphql-tag';

import { createUploadPostData } from './create-upload-post-data';

describe('createUploadPostData()', () => {
    it('creates correct output for createAssets mutation', () => {
        const result = createUploadPostData(
            gql`
                mutation CreateAssets($input: [CreateAssetInput!]!) {
                    createAssets(input: $input) {
                        id
                        name
                    }
                }
            `,
            ['a.jpg', 'b.jpg'],
            filePaths => ({
                input: filePaths.map(() => ({ file: null })),
            }),
        );

        expect(result.operations.operationName).toBe('CreateAssets');
        expect(result.operations.variables).toEqual({
            input: [{ file: null }, { file: null }],
        });
        expect(result.map).toEqual({
            0: 'variables.input.0.file',
            1: 'variables.input.1.file',
        });
        expect(result.filePaths).toEqual([{ name: '0', file: 'a.jpg' }, { name: '1', file: 'b.jpg' }]);
    });

    it('creates correct output for importProducts mutation', () => {
        const result = createUploadPostData(
            gql`
                mutation ImportProducts($input: Upload!) {
                    importProducts(csvFile: $input) {
                        errors
                        importedCount
                    }
                }
            `,
            'data.csv',
            () => ({ csvFile: null }),
        );

        expect(result.operations.operationName).toBe('ImportProducts');
        expect(result.operations.variables).toEqual({ csvFile: null });
        expect(result.map).toEqual({
            0: 'variables.csvFile',
        });
        expect(result.filePaths).toEqual([{ name: '0', file: 'data.csv' }]);
    });
});
