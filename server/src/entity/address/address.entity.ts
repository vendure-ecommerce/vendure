import { Column, Entity, ManyToOne } from 'typeorm';

import { DeepPartial } from '../../../../shared/shared-types';
import { VendureEntity } from '../base/base.entity';
import { HasCustomFields } from '../base/has-custom-fields';
import { CustomAddressFields } from '../custom-entity-fields';
import { Customer } from '../customer/customer.entity';

@Entity()
export class Address extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<Address>) {
        super(input);
    }

    @ManyToOne(type => Customer, customer => customer.addresses)
    customer: Customer;

    @Column() fullName: string;

    @Column() company: string;

    @Column() streetLine1: string;

    @Column() streetLine2: string;

    @Column() city: string;

    @Column() province: string;

    @Column() postalCode: string;

    @Column() country: string;

    @Column() phoneNumber: string;

    @Column() defaultShippingAddress: boolean;

    @Column() defaultBillingAddress: boolean;

    @Column(type => CustomAddressFields)
    customFields: CustomAddressFields;
}
