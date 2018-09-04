import { Role } from './role';

export interface JwtPayload {
    identifier: string;
    roles: Role[];
}
