export interface CreateAddressDto {
    fullName: string;
    company: string;
    streetLine1: string;
    streetLine2: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
    defaultShippingAddress: boolean;
    defaultBillingAddress: boolean;
}
