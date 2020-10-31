import { DEFAULT_CHANNEL_CODE } from '@vendure/common/lib/shared-constants';
import { Channel } from '@vendure/core';
import { ConnectionOptions, getConnection } from 'typeorm';

// tslint:disable:no-console
// tslint:disable:no-floating-promises
/**
 * Queries the database for the default Channel and returns its token.
 */
export async function getDefaultChannelToken(logging = true): Promise<string> {
    const connection = await getConnection();
    let defaultChannel: Channel | undefined;
    try {
        defaultChannel = await connection.manager.getRepository(Channel).findOne({
            where: {
                code: DEFAULT_CHANNEL_CODE,
            },
        });
    } catch (err) {
        console.log(`Error occurred when attempting to get default Channel`);
        console.log(err);
    }
    if (!defaultChannel) {
        throw new Error(`No default channel could be found!`);
    }
    if (logging) {
        console.log(`Got default channel token: ${defaultChannel.token}`);
    }
    return defaultChannel.token;
}
