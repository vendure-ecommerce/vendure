import { Address } from '../address/address.interface';
import { Role } from "../../auth/role";

/**
 * A registered user of the system, either a Customer or Administrator. The User interface / entity is responsible
 * for the identity of the user for the purposes of authentication & authorization.
 */
export class User {
    id: number;
    identifier: string;
    passwordHash: string;
    roles: Role[];
    lastLogin: string;
    createdAt: string;
    updatedAt: string;
}
