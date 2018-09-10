import { AttemptLogin, AttemptLoginVariables } from 'shared/generated-types';

import { ATTEMPT_LOGIN } from '../../admin-ui/src/app/data/definitions/auth-definitions';
import { getDefaultChannelToken } from '../mock-data/get-default-channel-token';
import { SimpleGraphQLClient } from '../mock-data/simple-graphql-client';
import { SUPER_ADMIN_USER_IDENTIFIER, SUPER_ADMIN_USER_PASSWORD } from '../src/common/constants';

import { testConfig } from './config/test-config';

// tslint:disable:no-console
/**
 * A GraphQL client for use in e2e tests configured to use the test server endpoint.
 */
export class TestClient extends SimpleGraphQLClient {
    constructor() {
        super(`http://localhost:${testConfig.port}/${testConfig.apiPath}`);
    }

    async init() {
        const token = await getDefaultChannelToken();
        this.setChannelToken(token);
        await this.asSuperAdmin();
    }
}
