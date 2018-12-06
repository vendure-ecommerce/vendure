import { Injectable } from '@nestjs/common';

import { ID } from '../../../../shared/shared-types';
import { ConfigService } from '../../config/config.service';

import { IdCodec } from './id-codec';

@Injectable()
export class IdCodecService {
    private idCodec: IdCodec;
    constructor(configService: ConfigService) {
        this.idCodec = new IdCodec(configService.entityIdStrategy);
    }

    encode(target: any, transformKeys?: string[]): string {
        return this.idCodec.encode(target, transformKeys);
    }

    decode(target: any, transformKeys?: string[]): ID {
        return this.idCodec.decode(target, transformKeys);
    }
}
