import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import {
    CreateZoneInput,
    DeletionResponse,
    DeletionResult,
    MutationAddMembersToZoneArgs,
    MutationRemoveMembersFromZoneArgs,
    UpdateZoneInput,
} from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { unique } from '@vendure/common/lib/unique';
import { Connection } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { assertFound } from '../../common/utils';
import { Channel, TaxRate } from '../../entity';
import { Country } from '../../entity/country/country.entity';
import { Zone } from '../../entity/zone/zone.entity';
import { getEntityOrThrow } from '../helpers/utils/get-entity-or-throw';
import { patchEntity } from '../helpers/utils/patch-entity';
import { translateDeep } from '../helpers/utils/translate-entity';

@Injectable()
export class ZoneService implements OnModuleInit {
    /**
     * We cache all Zones to avoid hitting the DB many times per request.
     */
    private zones: Zone[] = [];
    constructor(@InjectConnection() private connection: Connection) {}

    onModuleInit() {
        return this.updateZonesCache();
    }

    findAll(ctx: RequestContext): Zone[] {
        return this.zones.map(zone => {
            zone.members = zone.members.map(country => translateDeep(country, ctx.languageCode));
            return zone;
        });
    }

    findOne(ctx: RequestContext, zoneId: ID): Promise<Zone | undefined> {
        return this.connection
            .getRepository(Zone)
            .findOne(zoneId, {
                relations: ['members'],
            })
            .then(zone => {
                if (zone) {
                    zone.members = zone.members.map(country => translateDeep(country, ctx.languageCode));
                    return zone;
                }
            });
    }

    async create(ctx: RequestContext, input: CreateZoneInput): Promise<Zone> {
        const zone = new Zone(input);
        if (input.memberIds) {
            zone.members = await this.getCountriesFromIds(input.memberIds);
        }
        const newZone = await this.connection.getRepository(Zone).save(zone);
        await this.updateZonesCache();
        return assertFound(this.findOne(ctx, newZone.id));
    }

    async update(ctx: RequestContext, input: UpdateZoneInput): Promise<Zone> {
        const zone = await getEntityOrThrow(this.connection, Zone, input.id);
        const updatedZone = patchEntity(zone, input);
        await this.connection.getRepository(Zone).save(updatedZone, { reload: false });
        await this.updateZonesCache();
        return assertFound(this.findOne(ctx, zone.id));
    }

    async delete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
        const zone = await getEntityOrThrow(this.connection, Zone, id);

        const channelsUsingZone = await this.connection
            .getRepository(Channel)
            .createQueryBuilder('channel')
            .where('channel.defaultTaxZone = :id', { id })
            .orWhere('channel.defaultShippingZone = :id', { id })
            .getMany();

        if (0 < channelsUsingZone.length) {
            return {
                result: DeletionResult.NOT_DELETED,
                message: ctx.translate('message.zone-used-in-channels', {
                    channelCodes: channelsUsingZone.map(t => t.code).join(', '),
                }),
            };
        }

        const taxRatesUsingZone = await this.connection
            .getRepository(TaxRate)
            .createQueryBuilder('taxRate')
            .where('taxRate.zone = :id', { id })
            .getMany();

        if (0 < taxRatesUsingZone.length) {
            return {
                result: DeletionResult.NOT_DELETED,
                message: ctx.translate('message.zone-used-in-tax-rates', {
                    taxRateNames: taxRatesUsingZone.map(t => t.name).join(', '),
                }),
            };
        } else {
            await this.connection.getRepository(Zone).remove(zone);
            await this.updateZonesCache();
            return {
                result: DeletionResult.DELETED,
                message: '',
            };
        }
    }

    async addMembersToZone(ctx: RequestContext, input: MutationAddMembersToZoneArgs): Promise<Zone> {
        const countries = await this.getCountriesFromIds(input.memberIds);
        const zone = await getEntityOrThrow(this.connection, Zone, input.zoneId, { relations: ['members'] });
        const members = unique(zone.members.concat(countries), 'id');
        zone.members = members;
        await this.connection.getRepository(Zone).save(zone, { reload: false });
        await this.updateZonesCache();
        return assertFound(this.findOne(ctx, zone.id));
    }

    async removeMembersFromZone(
        ctx: RequestContext,
        input: MutationRemoveMembersFromZoneArgs,
    ): Promise<Zone> {
        const zone = await getEntityOrThrow(this.connection, Zone, input.zoneId, { relations: ['members'] });
        zone.members = zone.members.filter(country => !input.memberIds.includes(country.id as string));
        await this.connection.getRepository(Zone).save(zone, { reload: false });
        await this.updateZonesCache();
        return assertFound(this.findOne(ctx, zone.id));
    }

    private getCountriesFromIds(ids: ID[]): Promise<Country[]> {
        return this.connection.getRepository(Country).findByIds(ids);
    }

    private async updateZonesCache() {
        this.zones = await this.connection.getRepository(Zone).find({
            relations: ['members'],
        });
    }
}
