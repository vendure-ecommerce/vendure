import gql from 'graphql-tag';
import { describe, it, assert } from 'vitest';

import { createUploadPostData } from './create-upload-post-data';

describe('createUploadPostData()', () => {
    it('creates correct output for createAssets mutation', () => {
        const result = createUploadPostData(
            gql`
                mutation CreateAssets($input: [CreateAssetInput!]!) {
                    createAssets(input: $input) {
                        ... on Asset {
                            id
                            name
                        }
                        ... on MimeTypeError {
                            errorCode
                            message
                            fileName
                            mimeType
                        }
                    }
                }
            `,
            ['a.jpg', 'b.jpg'],
            filePaths => ({
                input: filePaths.map(() => ({ file: null })),
            }),
        );

        assert.equal(result.operations.operationName, 'CreateAssets');
        assert.deepEqual(result.operations.variables, {
            input: [{ file: null }, { file: null }],
        });
        assert.deepEqual(result.map, {
            0: 'variables.input.0.file',
            1: 'variables.input.1.file',
        });
        assert.deepEqual(result.filePaths, [
            { name: '0', file: 'a.jpg' },
            { name: '1', file: 'b.jpg' },
        ]);
    });

    it('creates correct output for importProducts mutation', () => {
        const result = createUploadPostData(
            gql`
                mutation ImportProducts($input: Upload!) {
                    importProducts(csvFile: $input) {
                        errors
                        imported
                    }
                }
            `,
            'data.csv',
            () => ({ csvFile: null }),
        );

        assert.equal(result.operations.operationName, 'ImportProducts');
        assert.deepEqual(result.operations.variables, { csvFile: null });
        assert.deepEqual(result.map, {
            0: 'variables.csvFile',
        });
        assert.deepEqual(result.filePaths, [{ name: '0', file: 'data.csv' }]);
    });
});
