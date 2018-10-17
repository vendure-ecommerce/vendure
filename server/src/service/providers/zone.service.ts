import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import {
    AddMembersToZoneMutationArgs,
    CreateZoneInput,
    RemoveMembersFromZoneMutationArgs,
    UpdateZoneInput,
} from 'shared/generated-types';
import { ID } from 'shared/shared-types';
import { unique } from 'shared/unique';
import { Connection } from 'typeorm';

import { assertFound } from '../../common/utils';
import { Country } from '../../entity/country/country.entity';
import { Zone } from '../../entity/zone/zone.entity';
import { getEntityOrThrow } from '../helpers/get-entity-or-throw';
import { patchEntity } from '../helpers/patch-entity';

@Injectable()
export class ZoneService {
    constructor(@InjectConnection() private connection: Connection) {}

    findAll(): Promise<Zone[]> {
        return this.connection.getRepository(Zone).find({
            relations: ['members'],
        });
    }

    findOne(zoneId: ID): Promise<Zone | undefined> {
        return this.connection.getRepository(Zone).findOne(zoneId, {
            relations: ['members'],
        });
    }

    async create(input: CreateZoneInput): Promise<Zone> {
        const zone = new Zone(input);
        if (input.memberIds) {
            zone.members = await this.getCountriesFromIds(input.memberIds);
        }
        const newZone = await this.connection.getRepository(Zone).save(zone);
        return assertFound(this.findOne(newZone.id));
    }

    async update(input: UpdateZoneInput): Promise<Zone> {
        const zone = await getEntityOrThrow(this.connection, Zone, input.id);
        const updatedZone = patchEntity(zone, input);
        await this.connection.getRepository(Zone).save(updatedZone);
        return assertFound(this.findOne(zone.id));
    }

    async addMembersToZone(input: AddMembersToZoneMutationArgs): Promise<Zone> {
        const countries = await this.getCountriesFromIds(input.memberIds);
        const zone = await getEntityOrThrow(this.connection, Zone, input.zoneId);
        const members = unique(zone.members.concat(countries), 'id');
        zone.members = members;
        await this.connection.getRepository(Zone).save(zone);
        return zone;
    }

    async removeMembersFromZone(input: RemoveMembersFromZoneMutationArgs): Promise<Zone> {
        const zone = await getEntityOrThrow(this.connection, Zone, input.zoneId);
        zone.members = zone.members.filter(country => !input.memberIds.includes(country.id as string));
        await this.connection.getRepository(Zone).save(zone);
        return zone;
    }

    private getCountriesFromIds(ids: ID[]): Promise<Country[]> {
        return this.connection.getRepository(Country).findByIds(ids);
    }
}
