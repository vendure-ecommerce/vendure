import { Injectable } from '@nestjs/common';
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

import { RequestContext } from '../../api/common/request-context';
import { assertFound } from '../../common/utils';
import { Channel, TaxRate } from '../../entity';
import { Country } from '../../entity/country/country.entity';
import { Zone } from '../../entity/zone/zone.entity';
import { patchEntity } from '../helpers/utils/patch-entity';
import { translateDeep } from '../helpers/utils/translate-entity';
import { TransactionalConnection } from '../transaction/transactional-connection';

@Injectable()
export class ZoneService {
    /**
     * We cache all Zones to avoid hitting the DB many times per request.
     */
    private zones: Zone[] = [];
    constructor(private connection: TransactionalConnection) {}

    initZones() {
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
            .getRepository(ctx, Zone)
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
            zone.members = await this.getCountriesFromIds(ctx, input.memberIds);
        }
        const newZone = await this.connection.getRepository(ctx, Zone).save(zone);
        await this.updateZonesCache(ctx);
        return assertFound(this.findOne(ctx, newZone.id));
    }

    async update(ctx: RequestContext, input: UpdateZoneInput): Promise<Zone> {
        const zone = await this.connection.getEntityOrThrow(ctx, Zone, input.id);
        const updatedZone = patchEntity(zone, input);
        await this.connection.getRepository(ctx, Zone).save(updatedZone, { reload: false });
        await this.updateZonesCache(ctx);
        return assertFound(this.findOne(ctx, zone.id));
    }

    async delete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
        const zone = await this.connection.getEntityOrThrow(ctx, Zone, id);

        const channelsUsingZone = await this.connection
            .getRepository(ctx, Channel)
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
            .getRepository(ctx, TaxRate)
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
            await this.connection.getRepository(ctx, Zone).remove(zone);
            await this.updateZonesCache(ctx);
            return {
                result: DeletionResult.DELETED,
                message: '',
            };
        }
    }

    async addMembersToZone(ctx: RequestContext, input: MutationAddMembersToZoneArgs): Promise<Zone> {
        const countries = await this.getCountriesFromIds(ctx, input.memberIds);
        const zone = await this.connection.getEntityOrThrow(ctx, Zone, input.zoneId, {
            relations: ['members'],
        });
        const members = unique(zone.members.concat(countries), 'id');
        zone.members = members;
        await this.connection.getRepository(ctx, Zone).save(zone, { reload: false });
        await this.updateZonesCache(ctx);
        return assertFound(this.findOne(ctx, zone.id));
    }

    async removeMembersFromZone(
        ctx: RequestContext,
        input: MutationRemoveMembersFromZoneArgs,
    ): Promise<Zone> {
        const zone = await this.connection.getEntityOrThrow(ctx, Zone, input.zoneId, {
            relations: ['members'],
        });
        zone.members = zone.members.filter(country => !input.memberIds.includes(country.id));
        await this.connection.getRepository(ctx, Zone).save(zone, { reload: false });
        await this.updateZonesCache(ctx);
        return assertFound(this.findOne(ctx, zone.id));
    }

    private getCountriesFromIds(ctx: RequestContext, ids: ID[]): Promise<Country[]> {
        return this.connection.getRepository(ctx, Country).findByIds(ids);
    }

    /**
     * TODO: This is not good for multi-instance deployments. A better solution will
     * need to be found without adversely affecting performance.
     */
    async updateZonesCache(ctx?: RequestContext) {
        this.zones = await this.connection.getRepository(ctx, Zone).find({
            relations: ['members'],
        });
    }
}
