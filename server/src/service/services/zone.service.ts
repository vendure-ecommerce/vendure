import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import {
    AddMembersToZoneMutationArgs,
    CreateZoneInput,
    RemoveMembersFromZoneMutationArgs,
    UpdateZoneInput,
} from '../../../../shared/generated-types';
import { ID } from '../../../../shared/shared-types';
import { unique } from '../../../../shared/unique';
import { RequestContext } from '../../api/common/request-context';
import { assertFound } from '../../common/utils';
import { Country } from '../../entity/country/country.entity';
import { Zone } from '../../entity/zone/zone.entity';
import { getEntityOrThrow } from '../helpers/utils/get-entity-or-throw';
import { patchEntity } from '../helpers/utils/patch-entity';
import { translateDeep } from '../helpers/utils/translate-entity';

@Injectable()
export class ZoneService {
    constructor(@InjectConnection() private connection: Connection) {}

    findAll(ctx: RequestContext): Promise<Zone[]> {
        return this.connection
            .getRepository(Zone)
            .find({
                relations: ['members'],
            })
            .then(zones => {
                zones.forEach(
                    zone =>
                        (zone.members = zone.members.map(country =>
                            translateDeep(country, ctx.languageCode),
                        )),
                );
                return zones;
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
        return assertFound(this.findOne(ctx, newZone.id));
    }

    async update(ctx: RequestContext, input: UpdateZoneInput): Promise<Zone> {
        const zone = await getEntityOrThrow(this.connection, Zone, input.id);
        const updatedZone = patchEntity(zone, input);
        await this.connection.getRepository(Zone).save(updatedZone);
        return assertFound(this.findOne(ctx, zone.id));
    }

    async addMembersToZone(ctx: RequestContext, input: AddMembersToZoneMutationArgs): Promise<Zone> {
        const countries = await this.getCountriesFromIds(input.memberIds);
        const zone = await getEntityOrThrow(this.connection, Zone, input.zoneId, { relations: ['members'] });
        const members = unique(zone.members.concat(countries), 'id');
        zone.members = members;
        await this.connection.getRepository(Zone).save(zone);
        return assertFound(this.findOne(ctx, zone.id));
    }

    async removeMembersFromZone(
        ctx: RequestContext,
        input: RemoveMembersFromZoneMutationArgs,
    ): Promise<Zone> {
        const zone = await getEntityOrThrow(this.connection, Zone, input.zoneId, { relations: ['members'] });
        zone.members = zone.members.filter(country => !input.memberIds.includes(country.id as string));
        await this.connection.getRepository(Zone).save(zone);
        return assertFound(this.findOne(ctx, zone.id));
    }

    private getCountriesFromIds(ids: ID[]): Promise<Country[]> {
        return this.connection.getRepository(Country).findByIds(ids);
    }
}
