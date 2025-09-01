import { Injectable } from '@nestjs/common';
import { EntitySubscriberInterface, InsertEvent, UpdateEvent } from 'typeorm';

import { ConfigService } from '../config/config.service';
import { CustomFields, HasCustomFields } from '../config/custom-field/custom-field-types';
import { Logger } from '../config/logger/vendure-logger';

import { TransactionalConnection } from './transactional-connection';

@Injectable()
export class CustomFieldsValidationSubscriber implements EntitySubscriberInterface {
    constructor(
        private connection: TransactionalConnection,
        private configService: ConfigService,
    ) {
        connection.rawConnection.subscribers.push(this);
    }

    // TODO: add tests with other services
    validateCustomFields(entityName: string, entity: Partial<HasCustomFields>) {
        const customFields = this.configService.customFields[entityName as keyof CustomFields];
        if (entity.customFields === undefined) {
            return;
        }

        // Build a Set of valid custom field names for fast lookup
        const validFieldNames = new Set(customFields.map(field => field.name));
        for (const key of Object.keys(entity.customFields)) {
            if (!validFieldNames.has(key)) {
                Logger.warn(`Custom field ${key} not found for entity ${entityName}`);
                continue;
            }
        }

        return;
    }

    beforeInsert(event: InsertEvent<any>): Promise<any> | void {
        if (event.entity === undefined) {
            return;
        }

        const entityName = event.entity.constructor.name;
        this.validateCustomFields(entityName, event.entity);
    }

    beforeUpdate(event: UpdateEvent<any>): Promise<any> | void {
        if (event.entity === undefined) {
            return;
        }

        const entityName = event.entity.constructor.name;
        this.validateCustomFields(entityName, event.entity);
    }
}
