import { Permission } from 'shared/generated-types';

export interface JwtPayload {
    identifier: string;
    roles: Permission[];
}
