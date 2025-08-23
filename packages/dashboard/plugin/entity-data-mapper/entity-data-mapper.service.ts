import { Inject, Injectable } from '@nestjs/common';
import { CustomFields, VendureEntity } from '@vendure/core';
import { DASHBOARD_PLUGIN_OPTIONS } from '../constants';
import { DashboardPluginOptions } from '../types';
import { EntityDataMapper } from './entity-data-mapper.interface';
import { ProductDataMapper } from './product.data-mapper';
import { VendureEntityDataMapper } from './vendure-entity.data-mapper';

@Injectable()
export class EntityDataMapperService {
    defaultMappers: Map<keyof CustomFields | string, EntityDataMapper> = new Map([
        ['Product', new ProductDataMapper()],
    ]);
    constructor(
        @Inject(DASHBOARD_PLUGIN_OPTIONS) private readonly dashboardPluginOptions: DashboardPluginOptions,
    ) {}

    async map(entityName: string, entity: VendureEntity) {
        const mappers =
            this.dashboardPluginOptions.globalSearch?.entityDataMappers ??
            new Map<string, EntityDataMapper>();
        let mapperForEntity: EntityDataMapper | undefined;

        if (!mappers.has(entityName)) {
            mapperForEntity = mappers.get(entityName);
        } else if (this.defaultMappers.has(entityName)) {
            mapperForEntity = this.defaultMappers.get(entityName);
        }

        if (!mapperForEntity) {
            mapperForEntity = new VendureEntityDataMapper();
        }

        return mapperForEntity!.map(entity);
    }
}
