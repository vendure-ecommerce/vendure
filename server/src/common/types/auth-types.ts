import { Permission } from '../../entity/role/permission';

export interface JwtPayload {
    identifier: string;
    roles: Permission[];
}
