import { ConnectionOptions, createConnection } from 'typeorm';

import { DEFAULT_CHANNEL_CODE } from '../src/common/constants';
import { Channel } from '../src/entity/channel/channel.entity';

// tslint:disable:no-console
// tslint:disable:no-floating-promises
/**
 * Queries the database for the default Channel and returns its token.
 */
export async function getDefaultChannelToken(
    connectionOptions: ConnectionOptions,
    logging = true,
): Promise<string> {
    (connectionOptions as any).entities = [__dirname + '/../src/**/*.entity.ts'];
    const connection = await createConnection({ ...connectionOptions, name: 'getDefaultChannelToken' });

    const defaultChannel = await connection.manager.getRepository(Channel).findOne({
        where: {
            code: DEFAULT_CHANNEL_CODE,
        },
    });
    await connection.close();
    if (!defaultChannel) {
        throw new Error(`No default channel could be found!`);
    }
    if (logging) {
        console.log(`Got default channel token: ${defaultChannel.token}'`);
    }
    return defaultChannel.token;
}
