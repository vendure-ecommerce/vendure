import { LanguageCode, mergeConfig } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import {
    CUSTOM_ERROR_MESSAGE_TRANSLATION,
    TranslationTestPlugin,
} from './fixtures/test-plugins/translation-test-plugin';

describe('Translation', () => {
    const { server, adminClient } = createTestEnvironment(
        mergeConfig(testConfig, {
            plugins: [TranslationTestPlugin],
        }),
    );

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 0,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('shall receive custom error message', async () => {
        const { customErrorMessage } = await adminClient.query(VERIFY_ERROR);
        expect(customErrorMessage.errorCode).toBe('CUSTOM_ERROR');
        expect(customErrorMessage.message).toBe(CUSTOM_ERROR_MESSAGE_TRANSLATION);
    });

    it('shall receive german error message', async () => {
        const { customErrorMessage } = await adminClient.query(VERIFY_ERROR, {}, { languageCode: LanguageCode.de });
        expect(customErrorMessage.errorCode).toBe('CUSTOM_ERROR');
        expect(customErrorMessage.message).toBe('DE_' + CUSTOM_ERROR_MESSAGE_TRANSLATION);
    });

});

const VERIFY_ERROR = gql`
    query CustomError {
        customErrorMessage {
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
`;
