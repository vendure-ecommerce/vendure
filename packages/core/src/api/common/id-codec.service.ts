import { Injectable } from '@nestjs/common';
import { ConfigurableOperation, ConfigurableOperationInput } from '@vendure/common/lib/generated-types';

import { ConfigService } from '../../config/config.service';

import { IdCodec } from './id-codec';

@Injectable()
export class IdCodecService {
    private idCodec: IdCodec;
    constructor(configService: ConfigService) {
        this.idCodec = new IdCodec(configService.entityIdStrategy);
    }

    encode<T extends string | number | boolean | object | undefined>(target: T, transformKeys?: string[]): T {
        return this.idCodec.encode(target, transformKeys);
    }

    decode<T extends string | number | object | undefined>(target: T, transformKeys?: string[]): T {
        return this.idCodec.decode(target, transformKeys);
    }

    /**
     * Decodes any entity IDs used in ConfigurableOperation arguments, e.g. when specifying
     * facetValueIds.
     */
    decodeConfigurableOperation(input: ConfigurableOperationInput): ConfigurableOperationInput;
    decodeConfigurableOperation(input: ConfigurableOperationInput[]): ConfigurableOperationInput[];
    decodeConfigurableOperation(
        input: ConfigurableOperationInput | ConfigurableOperationInput[],
    ): ConfigurableOperationInput | ConfigurableOperationInput[] {
        const inputArray = Array.isArray(input) ? input : [input];
        for (const operationInput of inputArray) {
            for (const arg of operationInput.arguments) {
                if (arg.type === 'facetValueIds' && arg.value) {
                    const ids = JSON.parse(arg.value) as string[];
                    const decodedIds = ids.map(id => this.decode(id));
                    arg.value = JSON.stringify(decodedIds);
                }
            }
        }
        return Array.isArray(input) ? inputArray : inputArray[0];
    }

    /**
     * Encodes any entity IDs used in ConfigurableOperation arguments, e.g. when specifying
     * facetValueIds.
     */
    encodeConfigurableOperation(input: ConfigurableOperation): ConfigurableOperation;
    encodeConfigurableOperation(input: ConfigurableOperation[]): ConfigurableOperation[];
    encodeConfigurableOperation(
        input: ConfigurableOperation | ConfigurableOperation[],
    ): ConfigurableOperation | ConfigurableOperation[] {
        const inputArray = Array.isArray(input) ? input : [input];
        for (const operation of inputArray) {
            for (const arg of operation.args) {
                if (arg.type === 'facetValueIds' && arg.value) {
                    const ids = JSON.parse(arg.value) as string[];
                    const encoded = ids.map(id => this.encode(id));
                    arg.value = JSON.stringify(encoded);
                }
            }
        }
        return Array.isArray(input) ? inputArray : inputArray[0];
    }
}
