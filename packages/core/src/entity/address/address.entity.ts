import { Column, Entity, ManyToOne } from 'typeorm';

import { DeepPartial, HasCustomFields } from '../../../../../shared/shared-types';
import { VendureEntity } from '../base/base.entity';
import { Country } from '../country/country.entity';
import { CustomAddressFields } from '../custom-entity-fields';
import { Customer } from '../customer/customer.entity';

/**
 * @description
 * Represent's a {@link Customer}'s address.
 *
 * @docsCategory entities
 */
@Entity()
export class Address extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<Address>) {
        super(input);
    }

    @ManyToOne(type => Customer, customer => customer.addresses)
    customer: Customer;

    @Column({ default: '' }) fullName: string;

    @Column({ default: '' })
    company: string;

    @Column() streetLine1: string;

    @Column({ default: '' })
    streetLine2: string;

    @Column({ default: '' }) city: string;

    @Column({ default: '' })
    province: string;

    @Column({ default: '' }) postalCode: string;

    @ManyToOne(type => Country)
    country: Country;

    @Column({ default: '' })
    phoneNumber: string;

    @Column({ default: false })
    defaultShippingAddress: boolean;

    @Column({ default: false })
    defaultBillingAddress: boolean;

    @Column(type => CustomAddressFields)
    customFields: CustomAddressFields;
}
