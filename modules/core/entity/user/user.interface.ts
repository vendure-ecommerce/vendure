import { Address } from '../address/address.interface';

export class User {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    emailAddress: string;
    addresses: Address[];
    createdAt: string;
    updatedAt: string;
}
