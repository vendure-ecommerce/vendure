import { User } from '../user/user.interface';

/**
 * An administrator of the system.
 */
export interface Administrator {
    id: number;
    firstName: string;
    lastName: string;
    emailAddress: string;
    user: User;
    createdAt: string;
    updatedAt: string;
}
