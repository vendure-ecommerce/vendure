import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { DEFAULT_CHANNEL_CODE } from '../common/constants';
import { Channel } from '../entity/channel/channel.entity';

@Injectable()
export class ChannelService {
    private allChannels: Channel[] = [];

    constructor(@InjectConnection() private connection: Connection) {}

    /**
     * When the app is bootstrapped, ensure a default Channel exists and populate the
     * channel lookup array.
     */
    async initChannels() {
        await this.ensureDefaultChannelExists();
        this.allChannels = await this.findAll();
    }

    /**
     * Given a channel token, returns the corresponding Channel if it exists.
     */
    getChannelFromToken(token: string): Channel | undefined {
        return this.allChannels.find(channel => channel.token === token);
    }

    findAll(): Promise<Channel[]> {
        return this.connection.getRepository(Channel).find();
    }

    /**
     * There must always be a default Channel. If none yet exists, this method creates one.
     */
    private async ensureDefaultChannelExists() {
        const defaultChannel = await this.connection.getRepository(Channel).findOne({
            where: {
                code: DEFAULT_CHANNEL_CODE,
            },
        });

        if (!defaultChannel) {
            const newDefaultChannel = new Channel({ code: DEFAULT_CHANNEL_CODE });
            await this.connection.manager.save(newDefaultChannel);
        }
    }
}
