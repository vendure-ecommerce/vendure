import { Injectable } from '@nestjs/common';
import { ID, PaginatedList } from '../common/common-types';
import { VendureEntity } from '../entity/base/base.entity';
import { ConfigService } from './config.service';

/**
 * This service is responsible for encoding/decoding entity IDs according to the configured EntityIdStrategy.
 * It should only need to be used in resolvers - the design is that once a request hits the business logic layer
 * (ProductService etc) all entity IDs are in the form used as the primary key in the database.
 */
@Injectable()
export class IdCodecService {
    constructor(private configService: ConfigService) {}

    /**
     * Decode an id from the client into the format used as the database primary key.
     * Acts recursively on all objects containing an "id" property.
     */
    decode<T extends string | number | object | undefined>(target: T): T {
        return this.transformRecursive(target, input => this.configService.entityIdStrategy.decodeId(input));
    }

    /**
     * Encode any entity ids according to the encode.
     * Acts recursively on all objects containing an "id" property.
     */
    encode<T extends string | number | object | undefined>(target: T): T {
        return this.transformRecursive(target, input => this.configService.entityIdStrategy.encodeId(input));
    }

    private transformRecursive<T>(target: T, transformFn: (input: any) => ID): T {
        if (target == null) {
            return target;
        }
        if (typeof target === 'string' || typeof target === 'number') {
            return transformFn(target as any) as any;
        }
        this.transform(target, transformFn);

        if (Array.isArray(target)) {
            if (target.length === 0) {
                return target;
            }
            const isSimpleObject = this.isSimpleObject(target[0]);
            const isEntity = this.isEntity(target[0]);
            if (isSimpleObject && !isEntity) {
                return target;
            }
            if (isSimpleObject) {
                const length = target.length;
                for (let i = 0; i < length; i++) {
                    this.transform(target[i], transformFn);
                }
            } else {
                const length = target.length;
                for (let i = 0; i < length; i++) {
                    target[i] = this.transformRecursive(target[i], transformFn);
                }
            }
        } else {
            for (const key of Object.keys(target)) {
                if (this.isObject(target[key])) {
                    this.transformRecursive(target[key], transformFn);
                }
            }
        }
        return target;
    }

    private transform<T>(target: T, transformFn: (input: any) => ID): T {
        if (this.isEntity(target)) {
            target.id = transformFn(target.id);
        }
        return target;
    }

    private isSimpleObject(target: any): boolean {
        const values = Object.values(target);
        for (const value of values) {
            if (this.isObject(value)) {
                return false;
            }
        }
        return true;
    }

    private isEntity(target: any): target is VendureEntity {
        return target && target.hasOwnProperty('id');
    }

    private isObject(target: any): target is object {
        return typeof target === 'object' && target != null;
    }
}
