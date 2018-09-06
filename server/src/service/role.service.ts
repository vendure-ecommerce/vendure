import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import {
    CUSTOMER_ROLE_CODE,
    CUSTOMER_ROLE_DESCRIPTION,
    SUPER_ADMIN_ROLE_CODE,
    SUPER_ADMIN_ROLE_DESCRIPTION,
} from '../common/constants';
import { Permission } from '../entity/role/permission';
import { Role } from '../entity/role/role.entity';
import { I18nError } from '../i18n/i18n-error';

import { ChannelService } from './channel.service';
import { ActiveConnection } from './helpers/connection.decorator';

export interface CreateRoleDto {
    code: string;
    description: string;
    permissions: Permission[];
}

@Injectable()
export class RoleService {
    constructor(@ActiveConnection() private connection: Connection, private channelService: ChannelService) {}

    async initRoles() {
        await this.ensureSuperAdminRoleExists();
        await this.ensureCustomerRoleExists();
    }

    getSuperAdminRole(): Promise<Role> {
        return this.getRoleByCode(SUPER_ADMIN_ROLE_CODE).then(role => {
            if (!role) {
                throw new I18nError(`error.super-admin-role-not-found`);
            }
            return role;
        });
    }

    getCustomerRole(): Promise<Role> {
        return this.getRoleByCode(CUSTOMER_ROLE_CODE).then(role => {
            if (!role) {
                throw new I18nError(`error.customer-role-not-found`);
            }
            return role;
        });
    }

    async create(input: CreateRoleDto): Promise<Role> {
        const role = new Role(input);
        role.channels = [this.channelService.getDefaultChannel()];
        return this.connection.manager.save(role);
    }

    private getRoleByCode(code: string): Promise<Role | undefined> {
        return this.connection.getRepository(Role).findOne({
            where: { code },
        });
    }

    private async ensureSuperAdminRoleExists() {
        try {
            await this.getSuperAdminRole();
        } catch (err) {
            await this.create({
                code: SUPER_ADMIN_ROLE_CODE,
                description: SUPER_ADMIN_ROLE_DESCRIPTION,
                permissions: Object.values(Permission),
            });
        }
    }

    private async ensureCustomerRoleExists() {
        try {
            await this.getCustomerRole();
        } catch (err) {
            await this.create({
                code: CUSTOMER_ROLE_CODE,
                description: CUSTOMER_ROLE_DESCRIPTION,
                permissions: [Permission.Authenticated],
            });
        }
    }
}
