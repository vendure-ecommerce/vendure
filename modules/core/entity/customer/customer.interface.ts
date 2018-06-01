import { Address } from "../address/address.interface";
import { User } from "../user/user.interface";

/**
 * A customer, i.e. a user who has trasacted with the shop in some way. A Customer may also be associated with
 * a registered User, but in the case of anonymous checkouts, there will be no associated User.
 */
export interface Customer {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    emailAddress: string;
    addresses: Address[];
    user?: User;
    createdAt: string;
    updatedAt: string;
}
