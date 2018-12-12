/* tslint:disable */
import { GraphQLResolveInfo } from 'graphql';

export type Resolver<Result, Parent = any, Context = any, Args = any> = (
    parent: Parent,
    args: Args,
    context: Context,
    info: GraphQLResolveInfo,
) => Promise<Result> | Result;

export type SubscriptionResolver<Result, Parent = any, Context = any, Args = any> = {
    subscribe<R = Result, P = Parent>(
        parent: P,
        args: Args,
        context: Context,
        info: GraphQLResolveInfo,
    ): AsyncIterator<R | Result>;
    resolve?<R = Result, P = Parent>(
        parent: P,
        args: Args,
        context: Context,
        info: GraphQLResolveInfo,
    ): R | Result | Promise<R | Result>;
};

export type DateTime = any;

export type Json = any;

export type Upload = any;

export interface PaginatedList {
    items: Node[];
    totalItems: number;
}

export interface Node {
    id: string;
}

export interface Query {
    administrators: AdministratorList;
    administrator?: Administrator | null;
    assets: AssetList;
    asset?: Asset | null;
    me?: CurrentUser | null;
    channels: Channel[];
    channel?: Channel | null;
    activeChannel: Channel;
    config: Config;
    countries: CountryList;
    country?: Country | null;
    availableCountries: Country[];
    customerGroups: CustomerGroup[];
    customerGroup?: CustomerGroup | null;
    customers: CustomerList;
    customer?: Customer | null;
    activeCustomer?: Customer | null;
    facets: FacetList;
    facet?: Facet | null;
    order?: Order | null;
    activeOrder?: Order | null;
    orderByCode?: Order | null;
    nextOrderStates: string[];
    orders: OrderList;
    eligibleShippingMethods: ShippingMethodQuote[];
    paymentMethods: PaymentMethodList;
    paymentMethod?: PaymentMethod | null;
    productCategories: ProductCategoryList;
    productCategory?: ProductCategory | null;
    productOptionGroups: ProductOptionGroup[];
    productOptionGroup?: ProductOptionGroup | null;
    products: ProductList;
    product?: Product | null;
    promotion?: Promotion | null;
    promotions: PromotionList;
    adjustmentOperations: AdjustmentOperations;
    roles: RoleList;
    role?: Role | null;
    shippingMethods: ShippingMethodList;
    shippingMethod?: ShippingMethod | null;
    shippingEligibilityCheckers: AdjustmentOperation[];
    shippingCalculators: AdjustmentOperation[];
    taxCategories: TaxCategory[];
    taxCategory?: TaxCategory | null;
    taxRates: TaxRateList;
    taxRate?: TaxRate | null;
    zones: Zone[];
    zone?: Zone | null;
    temp__?: boolean | null;
    networkStatus: NetworkStatus;
    userStatus: UserStatus;
    uiState: UiState;
}

export interface AdministratorList extends PaginatedList {
    items: Administrator[];
    totalItems: number;
}

export interface Administrator extends Node {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    firstName: string;
    lastName: string;
    emailAddress: string;
    user: User;
}

export interface User extends Node {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    identifier: string;
    passwordHash: string;
    verified: boolean;
    roles: Role[];
    lastLogin?: string | null;
    customFields?: Json | null;
}

export interface Role extends Node {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    code: string;
    description: string;
    permissions: Permission[];
    channels: Channel[];
}

export interface Channel extends Node {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    code: string;
    token: string;
    defaultTaxZone?: Zone | null;
    defaultShippingZone?: Zone | null;
    defaultLanguageCode: LanguageCode;
    pricesIncludeTax: boolean;
}

export interface Zone extends Node {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    name: string;
    members: Country[];
}

export interface Country extends Node {
    id: string;
    languageCode: LanguageCode;
    code: string;
    name: string;
    enabled: boolean;
    translations: CountryTranslation[];
}

export interface CountryTranslation {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    languageCode: LanguageCode;
    name: string;
}

export interface AssetList extends PaginatedList {
    items: Asset[];
    totalItems: number;
}

export interface Asset extends Node {
    id: string;
    name: string;
    type: AssetType;
    fileSize: number;
    mimeType: string;
    source: string;
    preview: string;
}

export interface CurrentUser {
    id: string;
    identifier: string;
    channelTokens: string[];
}

export interface Config {
    customFields?: Json | null;
}

export interface CountryList extends PaginatedList {
    items: Country[];
    totalItems: number;
}

export interface CustomerGroup extends Node {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    name: string;
}

export interface CustomerList extends PaginatedList {
    items: Customer[];
    totalItems: number;
}

export interface Customer extends Node {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    title?: string | null;
    firstName: string;
    lastName: string;
    phoneNumber?: string | null;
    emailAddress: string;
    addresses?: Address[] | null;
    user?: User | null;
    customFields?: Json | null;
}

export interface Address extends Node {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    fullName?: string | null;
    company?: string | null;
    streetLine1?: string | null;
    streetLine2?: string | null;
    city?: string | null;
    province?: string | null;
    postalCode?: string | null;
    country?: string | null;
    phoneNumber?: string | null;
    defaultShippingAddress?: boolean | null;
    defaultBillingAddress?: boolean | null;
    customFields?: Json | null;
}

export interface FacetList extends PaginatedList {
    items: Facet[];
    totalItems: number;
}

export interface Facet extends Node {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    languageCode: LanguageCode;
    name: string;
    code: string;
    values: FacetValue[];
    translations: FacetTranslation[];
    customFields?: Json | null;
}

export interface FacetValue extends Node {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    languageCode: LanguageCode;
    facet: Facet;
    name: string;
    code: string;
    translations: FacetValueTranslation[];
    customFields?: Json | null;
}

export interface FacetValueTranslation {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    languageCode: LanguageCode;
    name: string;
}

export interface FacetTranslation {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    languageCode: LanguageCode;
    name: string;
}

export interface Order extends Node {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    code: string;
    state: string;
    active: boolean;
    customer?: Customer | null;
    shippingAddress?: ShippingAddress | null;
    lines: OrderLine[];
    adjustments: Adjustment[];
    payments?: Payment[] | null;
    subTotalBeforeTax: number;
    subTotal: number;
    shipping: number;
    shippingMethod?: ShippingMethod | null;
    totalBeforeTax: number;
    total: number;
}

export interface ShippingAddress {
    fullName?: string | null;
    company?: string | null;
    streetLine1?: string | null;
    streetLine2?: string | null;
    city?: string | null;
    province?: string | null;
    postalCode?: string | null;
    country?: string | null;
    phoneNumber?: string | null;
}

export interface OrderLine extends Node {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    productVariant: ProductVariant;
    featuredAsset?: Asset | null;
    unitPrice: number;
    unitPriceWithTax: number;
    quantity: number;
    items: OrderItem[];
    totalPrice: number;
    adjustments: Adjustment[];
    order: Order;
}

export interface ProductVariant extends Node {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    languageCode: LanguageCode;
    sku: string;
    name: string;
    featuredAsset?: Asset | null;
    assets: Asset[];
    price: number;
    priceIncludesTax: boolean;
    priceWithTax: number;
    taxRateApplied: TaxRate;
    taxCategory: TaxCategory;
    options: ProductOption[];
    facetValues: FacetValue[];
    translations: ProductVariantTranslation[];
    customFields?: Json | null;
}

export interface TaxRate extends Node {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    name: string;
    enabled: boolean;
    value: number;
    category: TaxCategory;
    zone: Zone;
    customerGroup?: CustomerGroup | null;
}

export interface TaxCategory extends Node {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    name: string;
}

export interface ProductOption extends Node {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    languageCode?: LanguageCode | null;
    code?: string | null;
    name?: string | null;
    translations: ProductOptionTranslation[];
    customFields?: Json | null;
}

export interface ProductOptionTranslation {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    languageCode: LanguageCode;
    name: string;
}

export interface ProductVariantTranslation {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    languageCode: LanguageCode;
    name: string;
}

export interface OrderItem extends Node {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    unitPrice: number;
    unitPriceWithTax: number;
    unitPriceIncludesTax: boolean;
    taxRate: number;
    adjustments: Adjustment[];
}

export interface Adjustment {
    adjustmentSource: string;
    type: AdjustmentType;
    description: string;
    amount: number;
}

export interface Payment extends Node {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    method: string;
    amount: number;
    state: string;
    transactionId?: string | null;
    metadata?: Json | null;
}

export interface ShippingMethod extends Node {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    code: string;
    description: string;
    checker: AdjustmentOperation;
    calculator: AdjustmentOperation;
}

export interface AdjustmentOperation {
    code: string;
    args: ConfigArg[];
    description: string;
}

export interface ConfigArg {
    name: string;
    type: string;
    value?: string | null;
}

export interface OrderList extends PaginatedList {
    items: Order[];
    totalItems: number;
}

export interface ShippingMethodQuote {
    id: string;
    price: number;
    description: string;
}

export interface PaymentMethodList extends PaginatedList {
    items: PaymentMethod[];
    totalItems: number;
}

export interface PaymentMethod extends Node {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    code: string;
    enabled: boolean;
    configArgs: ConfigArg[];
}

export interface ProductCategoryList extends PaginatedList {
    items: ProductCategory[];
    totalItems: number;
}

export interface ProductCategory extends Node {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    languageCode?: LanguageCode | null;
    name: string;
    position: number;
    description: string;
    featuredAsset?: Asset | null;
    assets: Asset[];
    parent: ProductCategory;
    children?: ProductCategory[] | null;
    facetValues: FacetValue[];
    descendantFacetValues: FacetValue[];
    translations: ProductCategoryTranslation[];
    customFields?: Json | null;
}

export interface ProductCategoryTranslation {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    languageCode: LanguageCode;
    name: string;
    description: string;
}

export interface ProductOptionGroup extends Node {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    languageCode: LanguageCode;
    code: string;
    name: string;
    options: ProductOption[];
    translations: ProductOptionGroupTranslation[];
    customFields?: Json | null;
}

export interface ProductOptionGroupTranslation {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    languageCode: LanguageCode;
    name: string;
}

export interface ProductList extends PaginatedList {
    items: Product[];
    totalItems: number;
}

export interface Product extends Node {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    languageCode: LanguageCode;
    name: string;
    slug: string;
    description: string;
    featuredAsset?: Asset | null;
    assets: Asset[];
    variants: ProductVariant[];
    optionGroups: ProductOptionGroup[];
    translations: ProductTranslation[];
    customFields?: Json | null;
}

export interface ProductTranslation {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    languageCode: LanguageCode;
    name: string;
    slug: string;
    description: string;
}

export interface Promotion extends Node {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    name: string;
    enabled: boolean;
    conditions: AdjustmentOperation[];
    actions: AdjustmentOperation[];
}

export interface PromotionList extends PaginatedList {
    items: Promotion[];
    totalItems: number;
}

export interface AdjustmentOperations {
    conditions: AdjustmentOperation[];
    actions: AdjustmentOperation[];
}

export interface RoleList extends PaginatedList {
    items: Role[];
    totalItems: number;
}

export interface ShippingMethodList extends PaginatedList {
    items: ShippingMethod[];
    totalItems: number;
}

export interface TaxRateList extends PaginatedList {
    items: TaxRate[];
    totalItems: number;
}

export interface NetworkStatus {
    inFlightRequests: number;
}

export interface UserStatus {
    username: string;
    isLoggedIn: boolean;
    loginTime: string;
}

export interface UiState {
    language: LanguageCode;
}

export interface Mutation {
    createAdministrator: Administrator;
    updateAdministrator: Administrator;
    assignRoleToAdministrator: Administrator;
    createAssets: Asset[];
    login: LoginResult;
    logout: boolean;
    registerCustomerAccount: boolean;
    verifyCustomerAccount: LoginResult;
    refreshCustomerVerification: boolean;
    createChannel: Channel;
    updateChannel: Channel;
    createCountry: Country;
    updateCountry: Country;
    createCustomerGroup: CustomerGroup;
    updateCustomerGroup: CustomerGroup;
    addCustomersToGroup: CustomerGroup;
    removeCustomersFromGroup: CustomerGroup;
    createCustomer: Customer;
    updateCustomer: Customer;
    createCustomerAddress: Address;
    updateCustomerAddress: Address;
    createFacet: Facet;
    updateFacet: Facet;
    createFacetValues: FacetValue[];
    updateFacetValues: FacetValue[];
    importProducts?: ImportInfo | null;
    addItemToOrder?: Order | null;
    removeItemFromOrder?: Order | null;
    adjustItemQuantity?: Order | null;
    transitionOrderToState?: Order | null;
    setOrderShippingAddress?: Order | null;
    setOrderShippingMethod?: Order | null;
    addPaymentToOrder?: Order | null;
    setCustomerForOrder?: Order | null;
    updatePaymentMethod: PaymentMethod;
    createProductCategory: ProductCategory;
    updateProductCategory: ProductCategory;
    moveProductCategory: ProductCategory;
    createProductOptionGroup: ProductOptionGroup;
    updateProductOptionGroup: ProductOptionGroup;
    createProduct: Product;
    updateProduct: Product;
    addOptionGroupToProduct: Product;
    removeOptionGroupFromProduct: Product;
    generateVariantsForProduct: Product;
    updateProductVariants: (ProductVariant | null)[];
    createPromotion: Promotion;
    updatePromotion: Promotion;
    createRole: Role;
    updateRole: Role;
    createShippingMethod: ShippingMethod;
    updateShippingMethod: ShippingMethod;
    createTaxCategory: TaxCategory;
    updateTaxCategory: TaxCategory;
    createTaxRate: TaxRate;
    updateTaxRate: TaxRate;
    createZone: Zone;
    updateZone: Zone;
    addMembersToZone: Zone;
    removeMembersFromZone: Zone;
    requestStarted: number;
    requestCompleted: number;
    setAsLoggedIn: UserStatus;
    setAsLoggedOut: UserStatus;
    setUiLanguage?: LanguageCode | null;
}

export interface LoginResult {
    user: CurrentUser;
}

export interface ImportInfo {
    errors?: string[] | null;
    processed: number;
    imported: number;
}

export interface AdministratorListOptions {
    take?: number | null;
    skip?: number | null;
    sort?: AdministratorSortParameter | null;
    filter?: AdministratorFilterParameter | null;
}

export interface AdministratorSortParameter {
    id?: SortOrder | null;
    createdAt?: SortOrder | null;
    updatedAt?: SortOrder | null;
    firstName?: SortOrder | null;
    lastName?: SortOrder | null;
    emailAddress?: SortOrder | null;
}

export interface AdministratorFilterParameter {
    firstName?: StringOperators | null;
    lastName?: StringOperators | null;
    emailAddress?: StringOperators | null;
    createdAt?: DateOperators | null;
    updatedAt?: DateOperators | null;
}

export interface StringOperators {
    eq?: string | null;
    contains?: string | null;
}

export interface DateOperators {
    eq?: DateTime | null;
    before?: DateTime | null;
    after?: DateTime | null;
    between?: DateRange | null;
}

export interface DateRange {
    start: DateTime;
    end: DateTime;
}

export interface AssetListOptions {
    take?: number | null;
    skip?: number | null;
    sort?: AssetSortParameter | null;
    filter?: AssetFilterParameter | null;
}

export interface AssetSortParameter {
    id?: SortOrder | null;
    createdAt?: SortOrder | null;
    updatedAt?: SortOrder | null;
    name?: SortOrder | null;
    description?: SortOrder | null;
}

export interface AssetFilterParameter {
    name?: StringOperators | null;
    description?: StringOperators | null;
    type?: StringOperators | null;
    createdAt?: DateOperators | null;
    updatedAt?: DateOperators | null;
}

export interface CountryListOptions {
    take?: number | null;
    skip?: number | null;
    sort?: CountrySortParameter | null;
    filter?: CountryFilterParameter | null;
}

export interface CountrySortParameter {
    id?: SortOrder | null;
    createdAt?: SortOrder | null;
    updatedAt?: SortOrder | null;
    code?: SortOrder | null;
    name?: SortOrder | null;
    enabled?: SortOrder | null;
}

export interface CountryFilterParameter {
    code?: StringOperators | null;
    name?: StringOperators | null;
    enabled?: BooleanOperators | null;
    createdAt?: DateOperators | null;
    updatedAt?: DateOperators | null;
}

export interface BooleanOperators {
    eq?: boolean | null;
}

export interface CustomerListOptions {
    take?: number | null;
    skip?: number | null;
    sort?: CustomerSortParameter | null;
    filter?: CustomerFilterParameter | null;
}

export interface CustomerSortParameter {
    id?: SortOrder | null;
    createdAt?: SortOrder | null;
    updatedAt?: SortOrder | null;
    firstName?: SortOrder | null;
    lastName?: SortOrder | null;
    phoneNumber?: SortOrder | null;
    emailAddress?: SortOrder | null;
}

export interface CustomerFilterParameter {
    firstName?: StringOperators | null;
    lastName?: StringOperators | null;
    phoneNumber?: StringOperators | null;
    emailAddress?: StringOperators | null;
    createdAt?: DateOperators | null;
    updatedAt?: DateOperators | null;
}

export interface FacetListOptions {
    take?: number | null;
    skip?: number | null;
    sort?: FacetSortParameter | null;
    filter?: FacetFilterParameter | null;
}

export interface FacetSortParameter {
    id?: SortOrder | null;
    createdAt?: SortOrder | null;
    updatedAt?: SortOrder | null;
    name?: SortOrder | null;
    code?: SortOrder | null;
}

export interface FacetFilterParameter {
    name?: StringOperators | null;
    code?: StringOperators | null;
    createdAt?: DateOperators | null;
    updatedAt?: DateOperators | null;
}

export interface OrderListOptions {
    take?: number | null;
    skip?: number | null;
    sort?: OrderSortParameter | null;
    filter?: OrderFilterParameter | null;
}

export interface OrderSortParameter {
    id?: SortOrder | null;
    createdAt?: SortOrder | null;
    updatedAt?: SortOrder | null;
    code?: SortOrder | null;
}

export interface OrderFilterParameter {
    code?: StringOperators | null;
    createdAt?: DateOperators | null;
    updatedAt?: DateOperators | null;
}

export interface PaymentMethodListOptions {
    take?: number | null;
    skip?: number | null;
    sort?: PaymentMethodSortParameter | null;
    filter?: PaymentMethodFilterParameter | null;
}

export interface PaymentMethodSortParameter {
    id?: SortOrder | null;
    createdAt?: SortOrder | null;
    updatedAt?: SortOrder | null;
    code?: SortOrder | null;
}

export interface PaymentMethodFilterParameter {
    code?: StringOperators | null;
    createdAt?: DateOperators | null;
    updatedAt?: DateOperators | null;
}

export interface ProductCategoryListOptions {
    take?: number | null;
    skip?: number | null;
    sort?: ProductCategorySortParameter | null;
    filter?: ProductCategoryFilterParameter | null;
}

export interface ProductCategorySortParameter {
    id?: SortOrder | null;
    createdAt?: SortOrder | null;
    updatedAt?: SortOrder | null;
    name?: SortOrder | null;
    description?: SortOrder | null;
}

export interface ProductCategoryFilterParameter {
    name?: StringOperators | null;
    description?: StringOperators | null;
    createdAt?: DateOperators | null;
    updatedAt?: DateOperators | null;
}

export interface ProductListOptions {
    take?: number | null;
    skip?: number | null;
    sort?: ProductSortParameter | null;
    filter?: ProductFilterParameter | null;
}

export interface ProductSortParameter {
    id?: SortOrder | null;
    createdAt?: SortOrder | null;
    updatedAt?: SortOrder | null;
    name?: SortOrder | null;
    slug?: SortOrder | null;
    description?: SortOrder | null;
    image?: SortOrder | null;
}

export interface ProductFilterParameter {
    name?: StringOperators | null;
    slug?: StringOperators | null;
    description?: StringOperators | null;
    createdAt?: DateOperators | null;
    updatedAt?: DateOperators | null;
}

export interface PromotionListOptions {
    take?: number | null;
    skip?: number | null;
    sort?: PromotionSortParameter | null;
    filter?: PromotionFilterParameter | null;
}

export interface PromotionSortParameter {
    id?: SortOrder | null;
    createdAt?: SortOrder | null;
    updatedAt?: SortOrder | null;
    name?: SortOrder | null;
}

export interface PromotionFilterParameter {
    name?: StringOperators | null;
    createdAt?: DateOperators | null;
    updatedAt?: DateOperators | null;
    type?: StringOperators | null;
}

export interface RoleListOptions {
    take?: number | null;
    skip?: number | null;
    sort?: RoleSortParameter | null;
    filter?: RoleFilterParameter | null;
}

export interface RoleSortParameter {
    id?: SortOrder | null;
    createdAt?: SortOrder | null;
    updatedAt?: SortOrder | null;
    code?: SortOrder | null;
    description?: SortOrder | null;
}

export interface RoleFilterParameter {
    code?: StringOperators | null;
    description?: StringOperators | null;
    createdAt?: DateOperators | null;
    updatedAt?: DateOperators | null;
}

export interface ShippingMethodListOptions {
    take?: number | null;
    skip?: number | null;
    sort?: ShippingMethodSortParameter | null;
    filter?: ShippingMethodFilterParameter | null;
}

export interface ShippingMethodSortParameter {
    id?: SortOrder | null;
    createdAt?: SortOrder | null;
    updatedAt?: SortOrder | null;
    code?: SortOrder | null;
    description?: SortOrder | null;
}

export interface ShippingMethodFilterParameter {
    code?: StringOperators | null;
    description?: StringOperators | null;
    createdAt?: DateOperators | null;
    updatedAt?: DateOperators | null;
}

export interface TaxRateListOptions {
    take?: number | null;
    skip?: number | null;
    sort?: TaxRateSortParameter | null;
    filter?: TaxRateFilterParameter | null;
}

export interface TaxRateSortParameter {
    id?: SortOrder | null;
    createdAt?: SortOrder | null;
    updatedAt?: SortOrder | null;
    name?: SortOrder | null;
    enabled?: SortOrder | null;
}

export interface TaxRateFilterParameter {
    code?: StringOperators | null;
    name?: StringOperators | null;
    enabled?: BooleanOperators | null;
    createdAt?: DateOperators | null;
    updatedAt?: DateOperators | null;
}

export interface CreateAdministratorInput {
    firstName: string;
    lastName: string;
    emailAddress: string;
    password: string;
    roleIds: string[];
}

export interface UpdateAdministratorInput {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    emailAddress?: string | null;
    password?: string | null;
    roleIds?: string[] | null;
}

export interface CreateAssetInput {
    file: Upload;
}

export interface RegisterCustomerInput {
    emailAddress: string;
    title?: string | null;
    firstName?: string | null;
    lastName?: string | null;
}

export interface CreateChannelInput {
    code: string;
    token: string;
    defaultLanguageCode: LanguageCode;
    pricesIncludeTax: boolean;
    defaultTaxZoneId?: string | null;
    defaultShippingZoneId?: string | null;
}

export interface UpdateChannelInput {
    id: string;
    code?: string | null;
    token?: string | null;
    defaultLanguageCode?: LanguageCode | null;
    pricesIncludeTax?: boolean | null;
    defaultTaxZoneId?: string | null;
    defaultShippingZoneId?: string | null;
}

export interface CreateCountryInput {
    code: string;
    translations: CountryTranslationInput[];
    enabled: boolean;
}

export interface CountryTranslationInput {
    id?: string | null;
    languageCode: LanguageCode;
    name?: string | null;
}

export interface UpdateCountryInput {
    id: string;
    code?: string | null;
    translations?: CountryTranslationInput[] | null;
    enabled?: boolean | null;
}

export interface CreateCustomerGroupInput {
    name: string;
    customerIds?: string[] | null;
}

export interface UpdateCustomerGroupInput {
    id: string;
    name?: string | null;
}

export interface CreateCustomerInput {
    title?: string | null;
    firstName: string;
    lastName: string;
    phoneNumber?: string | null;
    emailAddress: string;
    customFields?: Json | null;
}

export interface UpdateCustomerInput {
    id: string;
    title?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    phoneNumber?: string | null;
    emailAddress?: string | null;
    customFields?: Json | null;
}

export interface CreateAddressInput {
    fullName?: string | null;
    company?: string | null;
    streetLine1?: string | null;
    streetLine2?: string | null;
    city?: string | null;
    province?: string | null;
    postalCode?: string | null;
    country?: string | null;
    phoneNumber?: string | null;
    defaultShippingAddress?: boolean | null;
    defaultBillingAddress?: boolean | null;
    customFields?: Json | null;
}

export interface UpdateAddressInput {
    id: string;
    fullName?: string | null;
    company?: string | null;
    streetLine1?: string | null;
    streetLine2?: string | null;
    city?: string | null;
    province?: string | null;
    postalCode?: string | null;
    country?: string | null;
    phoneNumber?: string | null;
    defaultShippingAddress?: boolean | null;
    defaultBillingAddress?: boolean | null;
    customFields?: Json | null;
}

export interface CreateFacetInput {
    code: string;
    translations: FacetTranslationInput[];
    values?: CreateFacetValueWithFacetInput[] | null;
    customFields?: Json | null;
}

export interface FacetTranslationInput {
    id?: string | null;
    languageCode: LanguageCode;
    name?: string | null;
    customFields?: Json | null;
}

export interface CreateFacetValueWithFacetInput {
    code: string;
    translations: FacetValueTranslationInput[];
}

export interface FacetValueTranslationInput {
    id?: string | null;
    languageCode: LanguageCode;
    name?: string | null;
    customFields?: Json | null;
}

export interface UpdateFacetInput {
    id: string;
    code?: string | null;
    translations?: FacetTranslationInput[] | null;
    customFields?: Json | null;
}

export interface CreateFacetValueInput {
    facetId: string;
    code: string;
    translations: FacetValueTranslationInput[];
    customFields?: Json | null;
}

export interface UpdateFacetValueInput {
    id: string;
    code?: string | null;
    translations?: FacetValueTranslationInput[] | null;
    customFields?: Json | null;
}

export interface PaymentInput {
    method: string;
    metadata: Json;
}

export interface UpdatePaymentMethodInput {
    id: string;
    code?: string | null;
    enabled?: boolean | null;
    configArgs?: ConfigArgInput[] | null;
}

export interface ConfigArgInput {
    name: string;
    value: string;
}

export interface CreateProductCategoryInput {
    featuredAssetId?: string | null;
    assetIds?: string[] | null;
    parentId?: string | null;
    facetValueIds?: string[] | null;
    translations: ProductCategoryTranslationInput[];
    customFields?: Json | null;
}

export interface ProductCategoryTranslationInput {
    id?: string | null;
    languageCode: LanguageCode;
    name?: string | null;
    description?: string | null;
    customFields?: Json | null;
}

export interface UpdateProductCategoryInput {
    id: string;
    featuredAssetId?: string | null;
    parentId?: string | null;
    assetIds?: string[] | null;
    facetValueIds?: string[] | null;
    translations: ProductCategoryTranslationInput[];
    customFields?: Json | null;
}

export interface MoveProductCategoryInput {
    categoryId: string;
    parentId: string;
    index: number;
}

export interface CreateProductOptionGroupInput {
    code: string;
    translations: ProductOptionGroupTranslationInput[];
    options: CreateProductOptionInput[];
    customFields?: Json | null;
}

export interface ProductOptionGroupTranslationInput {
    id?: string | null;
    languageCode: LanguageCode;
    name?: string | null;
    customFields?: Json | null;
}

export interface CreateProductOptionInput {
    code: string;
    translations: ProductOptionGroupTranslationInput[];
    customFields?: Json | null;
}

export interface UpdateProductOptionGroupInput {
    id: string;
    code?: string | null;
    translations?: ProductOptionGroupTranslationInput[] | null;
    customFields?: Json | null;
}

export interface CreateProductInput {
    featuredAssetId?: string | null;
    assetIds?: string[] | null;
    translations: ProductTranslationInput[];
    customFields?: Json | null;
}

export interface ProductTranslationInput {
    id?: string | null;
    languageCode: LanguageCode;
    name?: string | null;
    slug?: string | null;
    description?: string | null;
    customFields?: Json | null;
}

export interface UpdateProductInput {
    id: string;
    featuredAssetId?: string | null;
    assetIds?: string[] | null;
    translations?: ProductTranslationInput[] | null;
    customFields?: Json | null;
}

export interface UpdateProductVariantInput {
    id: string;
    translations?: ProductVariantTranslationInput[] | null;
    facetValueIds?: string[] | null;
    sku?: string | null;
    taxCategoryId?: string | null;
    price?: number | null;
    featuredAssetId?: string | null;
    assetIds?: string[] | null;
    customFields?: Json | null;
}

export interface ProductVariantTranslationInput {
    id?: string | null;
    languageCode: LanguageCode;
    name?: string | null;
    customFields?: Json | null;
}

export interface CreatePromotionInput {
    name: string;
    enabled: boolean;
    conditions: AdjustmentOperationInput[];
    actions: AdjustmentOperationInput[];
}

export interface AdjustmentOperationInput {
    code: string;
    arguments: ConfigArgInput[];
}

export interface UpdatePromotionInput {
    id: string;
    name?: string | null;
    enabled?: boolean | null;
    conditions?: AdjustmentOperationInput[] | null;
    actions?: AdjustmentOperationInput[] | null;
}

export interface CreateRoleInput {
    code: string;
    description: string;
    permissions: Permission[];
}

export interface UpdateRoleInput {
    id: string;
    code?: string | null;
    description?: string | null;
    permissions?: Permission[] | null;
}

export interface CreateShippingMethodInput {
    code: string;
    description: string;
    checker: AdjustmentOperationInput;
    calculator: AdjustmentOperationInput;
}

export interface UpdateShippingMethodInput {
    id: string;
    code?: string | null;
    description?: string | null;
    checker?: AdjustmentOperationInput | null;
    calculator?: AdjustmentOperationInput | null;
}

export interface CreateTaxCategoryInput {
    name: string;
}

export interface UpdateTaxCategoryInput {
    id: string;
    name?: string | null;
}

export interface CreateTaxRateInput {
    name: string;
    enabled: boolean;
    value: number;
    categoryId: string;
    zoneId: string;
    customerGroupId?: string | null;
}

export interface UpdateTaxRateInput {
    id: string;
    name?: string | null;
    value?: number | null;
    enabled?: boolean | null;
    categoryId?: string | null;
    zoneId?: string | null;
    customerGroupId?: string | null;
}

export interface CreateZoneInput {
    name: string;
    memberIds?: string[] | null;
}

export interface UpdateZoneInput {
    id: string;
    name?: string | null;
}

export interface CreateProductVariantInput {
    translations: ProductVariantTranslationInput[];
    sku: string;
    price?: number | null;
    taxCategoryId: string;
    optionIds?: string[] | null;
    featuredAssetId?: string | null;
    assetIds?: string[] | null;
    customFields?: Json | null;
}

export interface NumberOperators {
    eq?: number | null;
    lt?: number | null;
    lte?: number | null;
    gt?: number | null;
    gte?: number | null;
    between?: NumberRange | null;
}

export interface NumberRange {
    start: number;
    end: number;
}

export interface ProductOptionTranslationInput {
    id?: string | null;
    languageCode: LanguageCode;
    name?: string | null;
    customFields?: Json | null;
}
export interface AdministratorsQueryArgs {
    options?: AdministratorListOptions | null;
}
export interface AdministratorQueryArgs {
    id: string;
}
export interface AssetsQueryArgs {
    options?: AssetListOptions | null;
}
export interface AssetQueryArgs {
    id: string;
}
export interface ChannelQueryArgs {
    id: string;
}
export interface CountriesQueryArgs {
    options?: CountryListOptions | null;
}
export interface CountryQueryArgs {
    id: string;
}
export interface CustomerGroupQueryArgs {
    id: string;
}
export interface CustomersQueryArgs {
    options?: CustomerListOptions | null;
}
export interface CustomerQueryArgs {
    id: string;
}
export interface FacetsQueryArgs {
    languageCode?: LanguageCode | null;
    options?: FacetListOptions | null;
}
export interface FacetQueryArgs {
    id: string;
    languageCode?: LanguageCode | null;
}
export interface OrderQueryArgs {
    id: string;
}
export interface OrderByCodeQueryArgs {
    code: string;
}
export interface OrdersQueryArgs {
    options?: OrderListOptions | null;
}
export interface PaymentMethodsQueryArgs {
    options?: PaymentMethodListOptions | null;
}
export interface PaymentMethodQueryArgs {
    id: string;
}
export interface ProductCategoriesQueryArgs {
    languageCode?: LanguageCode | null;
    options?: ProductCategoryListOptions | null;
}
export interface ProductCategoryQueryArgs {
    id: string;
    languageCode?: LanguageCode | null;
}
export interface ProductOptionGroupsQueryArgs {
    languageCode?: LanguageCode | null;
    filterTerm?: string | null;
}
export interface ProductOptionGroupQueryArgs {
    id: string;
    languageCode?: LanguageCode | null;
}
export interface ProductsQueryArgs {
    languageCode?: LanguageCode | null;
    options?: ProductListOptions | null;
}
export interface ProductQueryArgs {
    id: string;
    languageCode?: LanguageCode | null;
}
export interface PromotionQueryArgs {
    id: string;
}
export interface PromotionsQueryArgs {
    options?: PromotionListOptions | null;
}
export interface RolesQueryArgs {
    options?: RoleListOptions | null;
}
export interface RoleQueryArgs {
    id: string;
}
export interface ShippingMethodsQueryArgs {
    options?: ShippingMethodListOptions | null;
}
export interface ShippingMethodQueryArgs {
    id: string;
}
export interface TaxCategoryQueryArgs {
    id: string;
}
export interface TaxRatesQueryArgs {
    options?: TaxRateListOptions | null;
}
export interface TaxRateQueryArgs {
    id: string;
}
export interface ZoneQueryArgs {
    id: string;
}
export interface CreateAdministratorMutationArgs {
    input: CreateAdministratorInput;
}
export interface UpdateAdministratorMutationArgs {
    input: UpdateAdministratorInput;
}
export interface AssignRoleToAdministratorMutationArgs {
    administratorId: string;
    roleId: string;
}
export interface CreateAssetsMutationArgs {
    input: CreateAssetInput[];
}
export interface LoginMutationArgs {
    username: string;
    password: string;
    rememberMe?: boolean | null;
}
export interface RegisterCustomerAccountMutationArgs {
    input: RegisterCustomerInput;
}
export interface VerifyCustomerAccountMutationArgs {
    token: string;
    password: string;
}
export interface RefreshCustomerVerificationMutationArgs {
    emailAddress: string;
}
export interface CreateChannelMutationArgs {
    input: CreateChannelInput;
}
export interface UpdateChannelMutationArgs {
    input: UpdateChannelInput;
}
export interface CreateCountryMutationArgs {
    input: CreateCountryInput;
}
export interface UpdateCountryMutationArgs {
    input: UpdateCountryInput;
}
export interface CreateCustomerGroupMutationArgs {
    input: CreateCustomerGroupInput;
}
export interface UpdateCustomerGroupMutationArgs {
    input: UpdateCustomerGroupInput;
}
export interface AddCustomersToGroupMutationArgs {
    customerGroupId: string;
    customerIds: string[];
}
export interface RemoveCustomersFromGroupMutationArgs {
    customerGroupId: string;
    customerIds: string[];
}
export interface CreateCustomerMutationArgs {
    input: CreateCustomerInput;
    password?: string | null;
}
export interface UpdateCustomerMutationArgs {
    input: UpdateCustomerInput;
}
export interface CreateCustomerAddressMutationArgs {
    customerId: string;
    input: CreateAddressInput;
}
export interface UpdateCustomerAddressMutationArgs {
    input: UpdateAddressInput;
}
export interface CreateFacetMutationArgs {
    input: CreateFacetInput;
}
export interface UpdateFacetMutationArgs {
    input: UpdateFacetInput;
}
export interface CreateFacetValuesMutationArgs {
    input: CreateFacetValueInput[];
}
export interface UpdateFacetValuesMutationArgs {
    input: UpdateFacetValueInput[];
}
export interface ImportProductsMutationArgs {
    csvFile: Upload;
}
export interface AddItemToOrderMutationArgs {
    productVariantId: string;
    quantity: number;
}
export interface RemoveItemFromOrderMutationArgs {
    orderItemId: string;
}
export interface AdjustItemQuantityMutationArgs {
    orderItemId: string;
    quantity: number;
}
export interface TransitionOrderToStateMutationArgs {
    state: string;
}
export interface SetOrderShippingAddressMutationArgs {
    input: CreateAddressInput;
}
export interface SetOrderShippingMethodMutationArgs {
    shippingMethodId: string;
}
export interface AddPaymentToOrderMutationArgs {
    input: PaymentInput;
}
export interface SetCustomerForOrderMutationArgs {
    input: CreateCustomerInput;
}
export interface UpdatePaymentMethodMutationArgs {
    input: UpdatePaymentMethodInput;
}
export interface CreateProductCategoryMutationArgs {
    input: CreateProductCategoryInput;
}
export interface UpdateProductCategoryMutationArgs {
    input: UpdateProductCategoryInput;
}
export interface MoveProductCategoryMutationArgs {
    input: MoveProductCategoryInput;
}
export interface CreateProductOptionGroupMutationArgs {
    input: CreateProductOptionGroupInput;
}
export interface UpdateProductOptionGroupMutationArgs {
    input: UpdateProductOptionGroupInput;
}
export interface CreateProductMutationArgs {
    input: CreateProductInput;
}
export interface UpdateProductMutationArgs {
    input: UpdateProductInput;
}
export interface AddOptionGroupToProductMutationArgs {
    productId: string;
    optionGroupId: string;
}
export interface RemoveOptionGroupFromProductMutationArgs {
    productId: string;
    optionGroupId: string;
}
export interface GenerateVariantsForProductMutationArgs {
    productId: string;
    defaultTaxCategoryId?: string | null;
    defaultPrice?: number | null;
    defaultSku?: string | null;
}
export interface UpdateProductVariantsMutationArgs {
    input: UpdateProductVariantInput[];
}
export interface CreatePromotionMutationArgs {
    input: CreatePromotionInput;
}
export interface UpdatePromotionMutationArgs {
    input: UpdatePromotionInput;
}
export interface CreateRoleMutationArgs {
    input: CreateRoleInput;
}
export interface UpdateRoleMutationArgs {
    input: UpdateRoleInput;
}
export interface CreateShippingMethodMutationArgs {
    input: CreateShippingMethodInput;
}
export interface UpdateShippingMethodMutationArgs {
    input: UpdateShippingMethodInput;
}
export interface CreateTaxCategoryMutationArgs {
    input: CreateTaxCategoryInput;
}
export interface UpdateTaxCategoryMutationArgs {
    input: UpdateTaxCategoryInput;
}
export interface CreateTaxRateMutationArgs {
    input: CreateTaxRateInput;
}
export interface UpdateTaxRateMutationArgs {
    input: UpdateTaxRateInput;
}
export interface CreateZoneMutationArgs {
    input: CreateZoneInput;
}
export interface UpdateZoneMutationArgs {
    input: UpdateZoneInput;
}
export interface AddMembersToZoneMutationArgs {
    zoneId: string;
    memberIds: string[];
}
export interface RemoveMembersFromZoneMutationArgs {
    zoneId: string;
    memberIds: string[];
}
export interface SetAsLoggedInMutationArgs {
    username: string;
    loginTime: string;
}
export interface SetUiLanguageMutationArgs {
    languageCode?: LanguageCode | null;
}

export enum SortOrder {
    ASC = 'ASC',
    DESC = 'DESC',
}

export enum Permission {
    Authenticated = 'Authenticated',
    SuperAdmin = 'SuperAdmin',
    Owner = 'Owner',
    Public = 'Public',
    CreateCatalog = 'CreateCatalog',
    ReadCatalog = 'ReadCatalog',
    UpdateCatalog = 'UpdateCatalog',
    DeleteCatalog = 'DeleteCatalog',
    CreateCustomer = 'CreateCustomer',
    ReadCustomer = 'ReadCustomer',
    UpdateCustomer = 'UpdateCustomer',
    DeleteCustomer = 'DeleteCustomer',
    CreateAdministrator = 'CreateAdministrator',
    ReadAdministrator = 'ReadAdministrator',
    UpdateAdministrator = 'UpdateAdministrator',
    DeleteAdministrator = 'DeleteAdministrator',
    CreateOrder = 'CreateOrder',
    ReadOrder = 'ReadOrder',
    UpdateOrder = 'UpdateOrder',
    DeleteOrder = 'DeleteOrder',
    CreateSettings = 'CreateSettings',
    ReadSettings = 'ReadSettings',
    UpdateSettings = 'UpdateSettings',
    DeleteSettings = 'DeleteSettings',
}

export enum LanguageCode {
    aa = 'aa',
    ab = 'ab',
    af = 'af',
    ak = 'ak',
    sq = 'sq',
    am = 'am',
    ar = 'ar',
    an = 'an',
    hy = 'hy',
    as = 'as',
    av = 'av',
    ae = 'ae',
    ay = 'ay',
    az = 'az',
    ba = 'ba',
    bm = 'bm',
    eu = 'eu',
    be = 'be',
    bn = 'bn',
    bh = 'bh',
    bi = 'bi',
    bs = 'bs',
    br = 'br',
    bg = 'bg',
    my = 'my',
    ca = 'ca',
    ch = 'ch',
    ce = 'ce',
    zh = 'zh',
    cu = 'cu',
    cv = 'cv',
    kw = 'kw',
    co = 'co',
    cr = 'cr',
    cs = 'cs',
    da = 'da',
    dv = 'dv',
    nl = 'nl',
    dz = 'dz',
    en = 'en',
    eo = 'eo',
    et = 'et',
    ee = 'ee',
    fo = 'fo',
    fj = 'fj',
    fi = 'fi',
    fr = 'fr',
    fy = 'fy',
    ff = 'ff',
    ka = 'ka',
    de = 'de',
    gd = 'gd',
    ga = 'ga',
    gl = 'gl',
    gv = 'gv',
    el = 'el',
    gn = 'gn',
    gu = 'gu',
    ht = 'ht',
    ha = 'ha',
    he = 'he',
    hz = 'hz',
    hi = 'hi',
    ho = 'ho',
    hr = 'hr',
    hu = 'hu',
    ig = 'ig',
    is = 'is',
    io = 'io',
    ii = 'ii',
    iu = 'iu',
    ie = 'ie',
    ia = 'ia',
    id = 'id',
    ik = 'ik',
    it = 'it',
    jv = 'jv',
    ja = 'ja',
    kl = 'kl',
    kn = 'kn',
    ks = 'ks',
    kr = 'kr',
    kk = 'kk',
    km = 'km',
    ki = 'ki',
    rw = 'rw',
    ky = 'ky',
    kv = 'kv',
    kg = 'kg',
    ko = 'ko',
    kj = 'kj',
    ku = 'ku',
    lo = 'lo',
    la = 'la',
    lv = 'lv',
    li = 'li',
    ln = 'ln',
    lt = 'lt',
    lb = 'lb',
    lu = 'lu',
    lg = 'lg',
    mk = 'mk',
    mh = 'mh',
    ml = 'ml',
    mi = 'mi',
    mr = 'mr',
    ms = 'ms',
    mg = 'mg',
    mt = 'mt',
    mn = 'mn',
    na = 'na',
    nv = 'nv',
    nr = 'nr',
    nd = 'nd',
    ng = 'ng',
    ne = 'ne',
    nn = 'nn',
    nb = 'nb',
    no = 'no',
    ny = 'ny',
    oc = 'oc',
    oj = 'oj',
    or = 'or',
    om = 'om',
    os = 'os',
    pa = 'pa',
    fa = 'fa',
    pi = 'pi',
    pl = 'pl',
    pt = 'pt',
    ps = 'ps',
    qu = 'qu',
    rm = 'rm',
    ro = 'ro',
    rn = 'rn',
    ru = 'ru',
    sg = 'sg',
    sa = 'sa',
    si = 'si',
    sk = 'sk',
    sl = 'sl',
    se = 'se',
    sm = 'sm',
    sn = 'sn',
    sd = 'sd',
    so = 'so',
    st = 'st',
    es = 'es',
    sc = 'sc',
    sr = 'sr',
    ss = 'ss',
    su = 'su',
    sw = 'sw',
    sv = 'sv',
    ty = 'ty',
    ta = 'ta',
    tt = 'tt',
    te = 'te',
    tg = 'tg',
    tl = 'tl',
    th = 'th',
    bo = 'bo',
    ti = 'ti',
    to = 'to',
    tn = 'tn',
    ts = 'ts',
    tk = 'tk',
    tr = 'tr',
    tw = 'tw',
    ug = 'ug',
    uk = 'uk',
    ur = 'ur',
    uz = 'uz',
    ve = 've',
    vi = 'vi',
    vo = 'vo',
    cy = 'cy',
    wa = 'wa',
    wo = 'wo',
    xh = 'xh',
    yi = 'yi',
    yo = 'yo',
    za = 'za',
    zu = 'zu',
}

export enum AssetType {
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO',
    BINARY = 'BINARY',
}

export enum AdjustmentType {
    TAX = 'TAX',
    PROMOTION = 'PROMOTION',
    SHIPPING = 'SHIPPING',
    REFUND = 'REFUND',
    TAX_REFUND = 'TAX_REFUND',
    PROMOTION_REFUND = 'PROMOTION_REFUND',
    SHIPPING_REFUND = 'SHIPPING_REFUND',
}

export namespace QueryResolvers {
    export interface Resolvers<Context = any> {
        administrators?: AdministratorsResolver<AdministratorList, any, Context>;
        administrator?: AdministratorResolver<Administrator | null, any, Context>;
        assets?: AssetsResolver<AssetList, any, Context>;
        asset?: AssetResolver<Asset | null, any, Context>;
        me?: MeResolver<CurrentUser | null, any, Context>;
        channels?: ChannelsResolver<Channel[], any, Context>;
        channel?: ChannelResolver<Channel | null, any, Context>;
        activeChannel?: ActiveChannelResolver<Channel, any, Context>;
        config?: ConfigResolver<Config, any, Context>;
        countries?: CountriesResolver<CountryList, any, Context>;
        country?: CountryResolver<Country | null, any, Context>;
        availableCountries?: AvailableCountriesResolver<Country[], any, Context>;
        customerGroups?: CustomerGroupsResolver<CustomerGroup[], any, Context>;
        customerGroup?: CustomerGroupResolver<CustomerGroup | null, any, Context>;
        customers?: CustomersResolver<CustomerList, any, Context>;
        customer?: CustomerResolver<Customer | null, any, Context>;
        activeCustomer?: ActiveCustomerResolver<Customer | null, any, Context>;
        facets?: FacetsResolver<FacetList, any, Context>;
        facet?: FacetResolver<Facet | null, any, Context>;
        order?: OrderResolver<Order | null, any, Context>;
        activeOrder?: ActiveOrderResolver<Order | null, any, Context>;
        orderByCode?: OrderByCodeResolver<Order | null, any, Context>;
        nextOrderStates?: NextOrderStatesResolver<string[], any, Context>;
        orders?: OrdersResolver<OrderList, any, Context>;
        eligibleShippingMethods?: EligibleShippingMethodsResolver<ShippingMethodQuote[], any, Context>;
        paymentMethods?: PaymentMethodsResolver<PaymentMethodList, any, Context>;
        paymentMethod?: PaymentMethodResolver<PaymentMethod | null, any, Context>;
        productCategories?: ProductCategoriesResolver<ProductCategoryList, any, Context>;
        productCategory?: ProductCategoryResolver<ProductCategory | null, any, Context>;
        productOptionGroups?: ProductOptionGroupsResolver<ProductOptionGroup[], any, Context>;
        productOptionGroup?: ProductOptionGroupResolver<ProductOptionGroup | null, any, Context>;
        products?: ProductsResolver<ProductList, any, Context>;
        product?: ProductResolver<Product | null, any, Context>;
        promotion?: PromotionResolver<Promotion | null, any, Context>;
        promotions?: PromotionsResolver<PromotionList, any, Context>;
        adjustmentOperations?: AdjustmentOperationsResolver<AdjustmentOperations, any, Context>;
        roles?: RolesResolver<RoleList, any, Context>;
        role?: RoleResolver<Role | null, any, Context>;
        shippingMethods?: ShippingMethodsResolver<ShippingMethodList, any, Context>;
        shippingMethod?: ShippingMethodResolver<ShippingMethod | null, any, Context>;
        shippingEligibilityCheckers?: ShippingEligibilityCheckersResolver<
            AdjustmentOperation[],
            any,
            Context
        >;
        shippingCalculators?: ShippingCalculatorsResolver<AdjustmentOperation[], any, Context>;
        taxCategories?: TaxCategoriesResolver<TaxCategory[], any, Context>;
        taxCategory?: TaxCategoryResolver<TaxCategory | null, any, Context>;
        taxRates?: TaxRatesResolver<TaxRateList, any, Context>;
        taxRate?: TaxRateResolver<TaxRate | null, any, Context>;
        zones?: ZonesResolver<Zone[], any, Context>;
        zone?: ZoneResolver<Zone | null, any, Context>;
        temp__?: TempResolver<boolean | null, any, Context>;
        networkStatus?: NetworkStatusResolver<NetworkStatus, any, Context>;
        userStatus?: UserStatusResolver<UserStatus, any, Context>;
        uiState?: UiStateResolver<UiState, any, Context>;
    }

    export type AdministratorsResolver<R = AdministratorList, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        AdministratorsArgs
    >;
    export interface AdministratorsArgs {
        options?: AdministratorListOptions | null;
    }

    export type AdministratorResolver<R = Administrator | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        AdministratorArgs
    >;
    export interface AdministratorArgs {
        id: string;
    }

    export type AssetsResolver<R = AssetList, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        AssetsArgs
    >;
    export interface AssetsArgs {
        options?: AssetListOptions | null;
    }

    export type AssetResolver<R = Asset | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        AssetArgs
    >;
    export interface AssetArgs {
        id: string;
    }

    export type MeResolver<R = CurrentUser | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type ChannelsResolver<R = Channel[], Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type ChannelResolver<R = Channel | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        ChannelArgs
    >;
    export interface ChannelArgs {
        id: string;
    }

    export type ActiveChannelResolver<R = Channel, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type ConfigResolver<R = Config, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CountriesResolver<R = CountryList, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        CountriesArgs
    >;
    export interface CountriesArgs {
        options?: CountryListOptions | null;
    }

    export type CountryResolver<R = Country | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        CountryArgs
    >;
    export interface CountryArgs {
        id: string;
    }

    export type AvailableCountriesResolver<R = Country[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type CustomerGroupsResolver<R = CustomerGroup[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type CustomerGroupResolver<R = CustomerGroup | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        CustomerGroupArgs
    >;
    export interface CustomerGroupArgs {
        id: string;
    }

    export type CustomersResolver<R = CustomerList, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        CustomersArgs
    >;
    export interface CustomersArgs {
        options?: CustomerListOptions | null;
    }

    export type CustomerResolver<R = Customer | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        CustomerArgs
    >;
    export interface CustomerArgs {
        id: string;
    }

    export type ActiveCustomerResolver<R = Customer | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type FacetsResolver<R = FacetList, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        FacetsArgs
    >;
    export interface FacetsArgs {
        languageCode?: LanguageCode | null;
        options?: FacetListOptions | null;
    }

    export type FacetResolver<R = Facet | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        FacetArgs
    >;
    export interface FacetArgs {
        id: string;
        languageCode?: LanguageCode | null;
    }

    export type OrderResolver<R = Order | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        OrderArgs
    >;
    export interface OrderArgs {
        id: string;
    }

    export type ActiveOrderResolver<R = Order | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type OrderByCodeResolver<R = Order | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        OrderByCodeArgs
    >;
    export interface OrderByCodeArgs {
        code: string;
    }

    export type NextOrderStatesResolver<R = string[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type OrdersResolver<R = OrderList, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        OrdersArgs
    >;
    export interface OrdersArgs {
        options?: OrderListOptions | null;
    }

    export type EligibleShippingMethodsResolver<
        R = ShippingMethodQuote[],
        Parent = any,
        Context = any
    > = Resolver<R, Parent, Context>;
    export type PaymentMethodsResolver<R = PaymentMethodList, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        PaymentMethodsArgs
    >;
    export interface PaymentMethodsArgs {
        options?: PaymentMethodListOptions | null;
    }

    export type PaymentMethodResolver<R = PaymentMethod | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        PaymentMethodArgs
    >;
    export interface PaymentMethodArgs {
        id: string;
    }

    export type ProductCategoriesResolver<R = ProductCategoryList, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        ProductCategoriesArgs
    >;
    export interface ProductCategoriesArgs {
        languageCode?: LanguageCode | null;
        options?: ProductCategoryListOptions | null;
    }

    export type ProductCategoryResolver<R = ProductCategory | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        ProductCategoryArgs
    >;
    export interface ProductCategoryArgs {
        id: string;
        languageCode?: LanguageCode | null;
    }

    export type ProductOptionGroupsResolver<R = ProductOptionGroup[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        ProductOptionGroupsArgs
    >;
    export interface ProductOptionGroupsArgs {
        languageCode?: LanguageCode | null;
        filterTerm?: string | null;
    }

    export type ProductOptionGroupResolver<
        R = ProductOptionGroup | null,
        Parent = any,
        Context = any
    > = Resolver<R, Parent, Context, ProductOptionGroupArgs>;
    export interface ProductOptionGroupArgs {
        id: string;
        languageCode?: LanguageCode | null;
    }

    export type ProductsResolver<R = ProductList, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        ProductsArgs
    >;
    export interface ProductsArgs {
        languageCode?: LanguageCode | null;
        options?: ProductListOptions | null;
    }

    export type ProductResolver<R = Product | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        ProductArgs
    >;
    export interface ProductArgs {
        id: string;
        languageCode?: LanguageCode | null;
    }

    export type PromotionResolver<R = Promotion | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        PromotionArgs
    >;
    export interface PromotionArgs {
        id: string;
    }

    export type PromotionsResolver<R = PromotionList, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        PromotionsArgs
    >;
    export interface PromotionsArgs {
        options?: PromotionListOptions | null;
    }

    export type AdjustmentOperationsResolver<
        R = AdjustmentOperations,
        Parent = any,
        Context = any
    > = Resolver<R, Parent, Context>;
    export type RolesResolver<R = RoleList, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        RolesArgs
    >;
    export interface RolesArgs {
        options?: RoleListOptions | null;
    }

    export type RoleResolver<R = Role | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        RoleArgs
    >;
    export interface RoleArgs {
        id: string;
    }

    export type ShippingMethodsResolver<R = ShippingMethodList, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        ShippingMethodsArgs
    >;
    export interface ShippingMethodsArgs {
        options?: ShippingMethodListOptions | null;
    }

    export type ShippingMethodResolver<R = ShippingMethod | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        ShippingMethodArgs
    >;
    export interface ShippingMethodArgs {
        id: string;
    }

    export type ShippingEligibilityCheckersResolver<
        R = AdjustmentOperation[],
        Parent = any,
        Context = any
    > = Resolver<R, Parent, Context>;
    export type ShippingCalculatorsResolver<
        R = AdjustmentOperation[],
        Parent = any,
        Context = any
    > = Resolver<R, Parent, Context>;
    export type TaxCategoriesResolver<R = TaxCategory[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type TaxCategoryResolver<R = TaxCategory | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        TaxCategoryArgs
    >;
    export interface TaxCategoryArgs {
        id: string;
    }

    export type TaxRatesResolver<R = TaxRateList, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        TaxRatesArgs
    >;
    export interface TaxRatesArgs {
        options?: TaxRateListOptions | null;
    }

    export type TaxRateResolver<R = TaxRate | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        TaxRateArgs
    >;
    export interface TaxRateArgs {
        id: string;
    }

    export type ZonesResolver<R = Zone[], Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type ZoneResolver<R = Zone | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        ZoneArgs
    >;
    export interface ZoneArgs {
        id: string;
    }

    export type TempResolver<R = boolean | null, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type NetworkStatusResolver<R = NetworkStatus, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type UserStatusResolver<R = UserStatus, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type UiStateResolver<R = UiState, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace AdministratorListResolvers {
    export interface Resolvers<Context = any> {
        items?: ItemsResolver<Administrator[], any, Context>;
        totalItems?: TotalItemsResolver<number, any, Context>;
    }

    export type ItemsResolver<R = Administrator[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type TotalItemsResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace AdministratorResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        createdAt?: CreatedAtResolver<DateTime, any, Context>;
        updatedAt?: UpdatedAtResolver<DateTime, any, Context>;
        firstName?: FirstNameResolver<string, any, Context>;
        lastName?: LastNameResolver<string, any, Context>;
        emailAddress?: EmailAddressResolver<string, any, Context>;
        user?: UserResolver<User, any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CreatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UpdatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type FirstNameResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type LastNameResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type EmailAddressResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UserResolver<R = User, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace UserResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        createdAt?: CreatedAtResolver<DateTime, any, Context>;
        updatedAt?: UpdatedAtResolver<DateTime, any, Context>;
        identifier?: IdentifierResolver<string, any, Context>;
        passwordHash?: PasswordHashResolver<string, any, Context>;
        verified?: VerifiedResolver<boolean, any, Context>;
        roles?: RolesResolver<Role[], any, Context>;
        lastLogin?: LastLoginResolver<string | null, any, Context>;
        customFields?: CustomFieldsResolver<Json | null, any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CreatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UpdatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type IdentifierResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type PasswordHashResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type VerifiedResolver<R = boolean, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type RolesResolver<R = Role[], Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type LastLoginResolver<R = string | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type CustomFieldsResolver<R = Json | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
}

export namespace RoleResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        createdAt?: CreatedAtResolver<DateTime, any, Context>;
        updatedAt?: UpdatedAtResolver<DateTime, any, Context>;
        code?: CodeResolver<string, any, Context>;
        description?: DescriptionResolver<string, any, Context>;
        permissions?: PermissionsResolver<Permission[], any, Context>;
        channels?: ChannelsResolver<Channel[], any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CreatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UpdatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CodeResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type DescriptionResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type PermissionsResolver<R = Permission[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type ChannelsResolver<R = Channel[], Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace ChannelResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        createdAt?: CreatedAtResolver<DateTime, any, Context>;
        updatedAt?: UpdatedAtResolver<DateTime, any, Context>;
        code?: CodeResolver<string, any, Context>;
        token?: TokenResolver<string, any, Context>;
        defaultTaxZone?: DefaultTaxZoneResolver<Zone | null, any, Context>;
        defaultShippingZone?: DefaultShippingZoneResolver<Zone | null, any, Context>;
        defaultLanguageCode?: DefaultLanguageCodeResolver<LanguageCode, any, Context>;
        pricesIncludeTax?: PricesIncludeTaxResolver<boolean, any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CreatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UpdatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CodeResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type TokenResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type DefaultTaxZoneResolver<R = Zone | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type DefaultShippingZoneResolver<R = Zone | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type DefaultLanguageCodeResolver<R = LanguageCode, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type PricesIncludeTaxResolver<R = boolean, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
}

export namespace ZoneResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        createdAt?: CreatedAtResolver<DateTime, any, Context>;
        updatedAt?: UpdatedAtResolver<DateTime, any, Context>;
        name?: NameResolver<string, any, Context>;
        members?: MembersResolver<Country[], any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CreatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UpdatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type NameResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type MembersResolver<R = Country[], Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace CountryResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        languageCode?: LanguageCodeResolver<LanguageCode, any, Context>;
        code?: CodeResolver<string, any, Context>;
        name?: NameResolver<string, any, Context>;
        enabled?: EnabledResolver<boolean, any, Context>;
        translations?: TranslationsResolver<CountryTranslation[], any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type LanguageCodeResolver<R = LanguageCode, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type CodeResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type NameResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type EnabledResolver<R = boolean, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type TranslationsResolver<R = CountryTranslation[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
}

export namespace CountryTranslationResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        createdAt?: CreatedAtResolver<DateTime, any, Context>;
        updatedAt?: UpdatedAtResolver<DateTime, any, Context>;
        languageCode?: LanguageCodeResolver<LanguageCode, any, Context>;
        name?: NameResolver<string, any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CreatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UpdatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type LanguageCodeResolver<R = LanguageCode, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type NameResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace AssetListResolvers {
    export interface Resolvers<Context = any> {
        items?: ItemsResolver<Asset[], any, Context>;
        totalItems?: TotalItemsResolver<number, any, Context>;
    }

    export type ItemsResolver<R = Asset[], Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type TotalItemsResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace AssetResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        name?: NameResolver<string, any, Context>;
        type?: TypeResolver<AssetType, any, Context>;
        fileSize?: FileSizeResolver<number, any, Context>;
        mimeType?: MimeTypeResolver<string, any, Context>;
        source?: SourceResolver<string, any, Context>;
        preview?: PreviewResolver<string, any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type NameResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type TypeResolver<R = AssetType, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type FileSizeResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type MimeTypeResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type SourceResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type PreviewResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace CurrentUserResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        identifier?: IdentifierResolver<string, any, Context>;
        channelTokens?: ChannelTokensResolver<string[], any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type IdentifierResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type ChannelTokensResolver<R = string[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
}

export namespace ConfigResolvers {
    export interface Resolvers<Context = any> {
        customFields?: CustomFieldsResolver<Json | null, any, Context>;
    }

    export type CustomFieldsResolver<R = Json | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
}

export namespace CountryListResolvers {
    export interface Resolvers<Context = any> {
        items?: ItemsResolver<Country[], any, Context>;
        totalItems?: TotalItemsResolver<number, any, Context>;
    }

    export type ItemsResolver<R = Country[], Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type TotalItemsResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace CustomerGroupResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        createdAt?: CreatedAtResolver<DateTime, any, Context>;
        updatedAt?: UpdatedAtResolver<DateTime, any, Context>;
        name?: NameResolver<string, any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CreatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UpdatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type NameResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace CustomerListResolvers {
    export interface Resolvers<Context = any> {
        items?: ItemsResolver<Customer[], any, Context>;
        totalItems?: TotalItemsResolver<number, any, Context>;
    }

    export type ItemsResolver<R = Customer[], Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type TotalItemsResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace CustomerResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        createdAt?: CreatedAtResolver<DateTime, any, Context>;
        updatedAt?: UpdatedAtResolver<DateTime, any, Context>;
        title?: TitleResolver<string | null, any, Context>;
        firstName?: FirstNameResolver<string, any, Context>;
        lastName?: LastNameResolver<string, any, Context>;
        phoneNumber?: PhoneNumberResolver<string | null, any, Context>;
        emailAddress?: EmailAddressResolver<string, any, Context>;
        addresses?: AddressesResolver<Address[] | null, any, Context>;
        user?: UserResolver<User | null, any, Context>;
        customFields?: CustomFieldsResolver<Json | null, any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CreatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UpdatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type TitleResolver<R = string | null, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type FirstNameResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type LastNameResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type PhoneNumberResolver<R = string | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type EmailAddressResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type AddressesResolver<R = Address[] | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type UserResolver<R = User | null, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CustomFieldsResolver<R = Json | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
}

export namespace AddressResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        createdAt?: CreatedAtResolver<DateTime, any, Context>;
        updatedAt?: UpdatedAtResolver<DateTime, any, Context>;
        fullName?: FullNameResolver<string | null, any, Context>;
        company?: CompanyResolver<string | null, any, Context>;
        streetLine1?: StreetLine1Resolver<string | null, any, Context>;
        streetLine2?: StreetLine2Resolver<string | null, any, Context>;
        city?: CityResolver<string | null, any, Context>;
        province?: ProvinceResolver<string | null, any, Context>;
        postalCode?: PostalCodeResolver<string | null, any, Context>;
        country?: CountryResolver<string | null, any, Context>;
        phoneNumber?: PhoneNumberResolver<string | null, any, Context>;
        defaultShippingAddress?: DefaultShippingAddressResolver<boolean | null, any, Context>;
        defaultBillingAddress?: DefaultBillingAddressResolver<boolean | null, any, Context>;
        customFields?: CustomFieldsResolver<Json | null, any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CreatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UpdatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type FullNameResolver<R = string | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type CompanyResolver<R = string | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type StreetLine1Resolver<R = string | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type StreetLine2Resolver<R = string | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type CityResolver<R = string | null, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type ProvinceResolver<R = string | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type PostalCodeResolver<R = string | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type CountryResolver<R = string | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type PhoneNumberResolver<R = string | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type DefaultShippingAddressResolver<R = boolean | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type DefaultBillingAddressResolver<R = boolean | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type CustomFieldsResolver<R = Json | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
}

export namespace FacetListResolvers {
    export interface Resolvers<Context = any> {
        items?: ItemsResolver<Facet[], any, Context>;
        totalItems?: TotalItemsResolver<number, any, Context>;
    }

    export type ItemsResolver<R = Facet[], Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type TotalItemsResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace FacetResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        createdAt?: CreatedAtResolver<DateTime, any, Context>;
        updatedAt?: UpdatedAtResolver<DateTime, any, Context>;
        languageCode?: LanguageCodeResolver<LanguageCode, any, Context>;
        name?: NameResolver<string, any, Context>;
        code?: CodeResolver<string, any, Context>;
        values?: ValuesResolver<FacetValue[], any, Context>;
        translations?: TranslationsResolver<FacetTranslation[], any, Context>;
        customFields?: CustomFieldsResolver<Json | null, any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CreatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UpdatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type LanguageCodeResolver<R = LanguageCode, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type NameResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CodeResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type ValuesResolver<R = FacetValue[], Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type TranslationsResolver<R = FacetTranslation[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type CustomFieldsResolver<R = Json | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
}

export namespace FacetValueResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        createdAt?: CreatedAtResolver<DateTime, any, Context>;
        updatedAt?: UpdatedAtResolver<DateTime, any, Context>;
        languageCode?: LanguageCodeResolver<LanguageCode, any, Context>;
        facet?: FacetResolver<Facet, any, Context>;
        name?: NameResolver<string, any, Context>;
        code?: CodeResolver<string, any, Context>;
        translations?: TranslationsResolver<FacetValueTranslation[], any, Context>;
        customFields?: CustomFieldsResolver<Json | null, any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CreatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UpdatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type LanguageCodeResolver<R = LanguageCode, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type FacetResolver<R = Facet, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type NameResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CodeResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type TranslationsResolver<R = FacetValueTranslation[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type CustomFieldsResolver<R = Json | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
}

export namespace FacetValueTranslationResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        createdAt?: CreatedAtResolver<DateTime, any, Context>;
        updatedAt?: UpdatedAtResolver<DateTime, any, Context>;
        languageCode?: LanguageCodeResolver<LanguageCode, any, Context>;
        name?: NameResolver<string, any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CreatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UpdatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type LanguageCodeResolver<R = LanguageCode, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type NameResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace FacetTranslationResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        createdAt?: CreatedAtResolver<DateTime, any, Context>;
        updatedAt?: UpdatedAtResolver<DateTime, any, Context>;
        languageCode?: LanguageCodeResolver<LanguageCode, any, Context>;
        name?: NameResolver<string, any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CreatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UpdatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type LanguageCodeResolver<R = LanguageCode, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type NameResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace OrderResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        createdAt?: CreatedAtResolver<DateTime, any, Context>;
        updatedAt?: UpdatedAtResolver<DateTime, any, Context>;
        code?: CodeResolver<string, any, Context>;
        state?: StateResolver<string, any, Context>;
        active?: ActiveResolver<boolean, any, Context>;
        customer?: CustomerResolver<Customer | null, any, Context>;
        shippingAddress?: ShippingAddressResolver<ShippingAddress | null, any, Context>;
        lines?: LinesResolver<OrderLine[], any, Context>;
        adjustments?: AdjustmentsResolver<Adjustment[], any, Context>;
        payments?: PaymentsResolver<Payment[] | null, any, Context>;
        subTotalBeforeTax?: SubTotalBeforeTaxResolver<number, any, Context>;
        subTotal?: SubTotalResolver<number, any, Context>;
        shipping?: ShippingResolver<number, any, Context>;
        shippingMethod?: ShippingMethodResolver<ShippingMethod | null, any, Context>;
        totalBeforeTax?: TotalBeforeTaxResolver<number, any, Context>;
        total?: TotalResolver<number, any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CreatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UpdatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CodeResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type StateResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type ActiveResolver<R = boolean, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CustomerResolver<R = Customer | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type ShippingAddressResolver<R = ShippingAddress | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type LinesResolver<R = OrderLine[], Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type AdjustmentsResolver<R = Adjustment[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type PaymentsResolver<R = Payment[] | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type SubTotalBeforeTaxResolver<R = number, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type SubTotalResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type ShippingResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type ShippingMethodResolver<R = ShippingMethod | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type TotalBeforeTaxResolver<R = number, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type TotalResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace ShippingAddressResolvers {
    export interface Resolvers<Context = any> {
        fullName?: FullNameResolver<string | null, any, Context>;
        company?: CompanyResolver<string | null, any, Context>;
        streetLine1?: StreetLine1Resolver<string | null, any, Context>;
        streetLine2?: StreetLine2Resolver<string | null, any, Context>;
        city?: CityResolver<string | null, any, Context>;
        province?: ProvinceResolver<string | null, any, Context>;
        postalCode?: PostalCodeResolver<string | null, any, Context>;
        country?: CountryResolver<string | null, any, Context>;
        phoneNumber?: PhoneNumberResolver<string | null, any, Context>;
    }

    export type FullNameResolver<R = string | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type CompanyResolver<R = string | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type StreetLine1Resolver<R = string | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type StreetLine2Resolver<R = string | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type CityResolver<R = string | null, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type ProvinceResolver<R = string | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type PostalCodeResolver<R = string | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type CountryResolver<R = string | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type PhoneNumberResolver<R = string | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
}

export namespace OrderLineResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        createdAt?: CreatedAtResolver<DateTime, any, Context>;
        updatedAt?: UpdatedAtResolver<DateTime, any, Context>;
        productVariant?: ProductVariantResolver<ProductVariant, any, Context>;
        featuredAsset?: FeaturedAssetResolver<Asset | null, any, Context>;
        unitPrice?: UnitPriceResolver<number, any, Context>;
        unitPriceWithTax?: UnitPriceWithTaxResolver<number, any, Context>;
        quantity?: QuantityResolver<number, any, Context>;
        items?: ItemsResolver<OrderItem[], any, Context>;
        totalPrice?: TotalPriceResolver<number, any, Context>;
        adjustments?: AdjustmentsResolver<Adjustment[], any, Context>;
        order?: OrderResolver<Order, any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CreatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UpdatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type ProductVariantResolver<R = ProductVariant, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type FeaturedAssetResolver<R = Asset | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type UnitPriceResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UnitPriceWithTaxResolver<R = number, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type QuantityResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type ItemsResolver<R = OrderItem[], Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type TotalPriceResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type AdjustmentsResolver<R = Adjustment[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type OrderResolver<R = Order, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace ProductVariantResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        createdAt?: CreatedAtResolver<DateTime, any, Context>;
        updatedAt?: UpdatedAtResolver<DateTime, any, Context>;
        languageCode?: LanguageCodeResolver<LanguageCode, any, Context>;
        sku?: SkuResolver<string, any, Context>;
        name?: NameResolver<string, any, Context>;
        featuredAsset?: FeaturedAssetResolver<Asset | null, any, Context>;
        assets?: AssetsResolver<Asset[], any, Context>;
        price?: PriceResolver<number, any, Context>;
        priceIncludesTax?: PriceIncludesTaxResolver<boolean, any, Context>;
        priceWithTax?: PriceWithTaxResolver<number, any, Context>;
        taxRateApplied?: TaxRateAppliedResolver<TaxRate, any, Context>;
        taxCategory?: TaxCategoryResolver<TaxCategory, any, Context>;
        options?: OptionsResolver<ProductOption[], any, Context>;
        facetValues?: FacetValuesResolver<FacetValue[], any, Context>;
        translations?: TranslationsResolver<ProductVariantTranslation[], any, Context>;
        customFields?: CustomFieldsResolver<Json | null, any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CreatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UpdatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type LanguageCodeResolver<R = LanguageCode, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type SkuResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type NameResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type FeaturedAssetResolver<R = Asset | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type AssetsResolver<R = Asset[], Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type PriceResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type PriceIncludesTaxResolver<R = boolean, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type PriceWithTaxResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type TaxRateAppliedResolver<R = TaxRate, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type TaxCategoryResolver<R = TaxCategory, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type OptionsResolver<R = ProductOption[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type FacetValuesResolver<R = FacetValue[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type TranslationsResolver<R = ProductVariantTranslation[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type CustomFieldsResolver<R = Json | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
}

export namespace TaxRateResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        createdAt?: CreatedAtResolver<DateTime, any, Context>;
        updatedAt?: UpdatedAtResolver<DateTime, any, Context>;
        name?: NameResolver<string, any, Context>;
        enabled?: EnabledResolver<boolean, any, Context>;
        value?: ValueResolver<number, any, Context>;
        category?: CategoryResolver<TaxCategory, any, Context>;
        zone?: ZoneResolver<Zone, any, Context>;
        customerGroup?: CustomerGroupResolver<CustomerGroup | null, any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CreatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UpdatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type NameResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type EnabledResolver<R = boolean, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type ValueResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CategoryResolver<R = TaxCategory, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type ZoneResolver<R = Zone, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CustomerGroupResolver<R = CustomerGroup | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
}

export namespace TaxCategoryResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        createdAt?: CreatedAtResolver<DateTime, any, Context>;
        updatedAt?: UpdatedAtResolver<DateTime, any, Context>;
        name?: NameResolver<string, any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CreatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UpdatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type NameResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace ProductOptionResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        createdAt?: CreatedAtResolver<DateTime, any, Context>;
        updatedAt?: UpdatedAtResolver<DateTime, any, Context>;
        languageCode?: LanguageCodeResolver<LanguageCode | null, any, Context>;
        code?: CodeResolver<string | null, any, Context>;
        name?: NameResolver<string | null, any, Context>;
        translations?: TranslationsResolver<ProductOptionTranslation[], any, Context>;
        customFields?: CustomFieldsResolver<Json | null, any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CreatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UpdatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type LanguageCodeResolver<R = LanguageCode | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type CodeResolver<R = string | null, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type NameResolver<R = string | null, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type TranslationsResolver<R = ProductOptionTranslation[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type CustomFieldsResolver<R = Json | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
}

export namespace ProductOptionTranslationResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        createdAt?: CreatedAtResolver<DateTime, any, Context>;
        updatedAt?: UpdatedAtResolver<DateTime, any, Context>;
        languageCode?: LanguageCodeResolver<LanguageCode, any, Context>;
        name?: NameResolver<string, any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CreatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UpdatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type LanguageCodeResolver<R = LanguageCode, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type NameResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace ProductVariantTranslationResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        createdAt?: CreatedAtResolver<DateTime, any, Context>;
        updatedAt?: UpdatedAtResolver<DateTime, any, Context>;
        languageCode?: LanguageCodeResolver<LanguageCode, any, Context>;
        name?: NameResolver<string, any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CreatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UpdatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type LanguageCodeResolver<R = LanguageCode, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type NameResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace OrderItemResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        createdAt?: CreatedAtResolver<DateTime, any, Context>;
        updatedAt?: UpdatedAtResolver<DateTime, any, Context>;
        unitPrice?: UnitPriceResolver<number, any, Context>;
        unitPriceWithTax?: UnitPriceWithTaxResolver<number, any, Context>;
        unitPriceIncludesTax?: UnitPriceIncludesTaxResolver<boolean, any, Context>;
        taxRate?: TaxRateResolver<number, any, Context>;
        adjustments?: AdjustmentsResolver<Adjustment[], any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CreatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UpdatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UnitPriceResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UnitPriceWithTaxResolver<R = number, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type UnitPriceIncludesTaxResolver<R = boolean, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type TaxRateResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type AdjustmentsResolver<R = Adjustment[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
}

export namespace AdjustmentResolvers {
    export interface Resolvers<Context = any> {
        adjustmentSource?: AdjustmentSourceResolver<string, any, Context>;
        type?: TypeResolver<AdjustmentType, any, Context>;
        description?: DescriptionResolver<string, any, Context>;
        amount?: AmountResolver<number, any, Context>;
    }

    export type AdjustmentSourceResolver<R = string, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type TypeResolver<R = AdjustmentType, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type DescriptionResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type AmountResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace PaymentResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        createdAt?: CreatedAtResolver<DateTime, any, Context>;
        updatedAt?: UpdatedAtResolver<DateTime, any, Context>;
        method?: MethodResolver<string, any, Context>;
        amount?: AmountResolver<number, any, Context>;
        state?: StateResolver<string, any, Context>;
        transactionId?: TransactionIdResolver<string | null, any, Context>;
        metadata?: MetadataResolver<Json | null, any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CreatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UpdatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type MethodResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type AmountResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type StateResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type TransactionIdResolver<R = string | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type MetadataResolver<R = Json | null, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace ShippingMethodResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        createdAt?: CreatedAtResolver<DateTime, any, Context>;
        updatedAt?: UpdatedAtResolver<DateTime, any, Context>;
        code?: CodeResolver<string, any, Context>;
        description?: DescriptionResolver<string, any, Context>;
        checker?: CheckerResolver<AdjustmentOperation, any, Context>;
        calculator?: CalculatorResolver<AdjustmentOperation, any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CreatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UpdatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CodeResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type DescriptionResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CheckerResolver<R = AdjustmentOperation, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type CalculatorResolver<R = AdjustmentOperation, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
}

export namespace AdjustmentOperationResolvers {
    export interface Resolvers<Context = any> {
        code?: CodeResolver<string, any, Context>;
        args?: ArgsResolver<ConfigArg[], any, Context>;
        description?: DescriptionResolver<string, any, Context>;
    }

    export type CodeResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type ArgsResolver<R = ConfigArg[], Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type DescriptionResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace ConfigArgResolvers {
    export interface Resolvers<Context = any> {
        name?: NameResolver<string, any, Context>;
        type?: TypeResolver<string, any, Context>;
        value?: ValueResolver<string | null, any, Context>;
    }

    export type NameResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type TypeResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type ValueResolver<R = string | null, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace OrderListResolvers {
    export interface Resolvers<Context = any> {
        items?: ItemsResolver<Order[], any, Context>;
        totalItems?: TotalItemsResolver<number, any, Context>;
    }

    export type ItemsResolver<R = Order[], Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type TotalItemsResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace ShippingMethodQuoteResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        price?: PriceResolver<number, any, Context>;
        description?: DescriptionResolver<string, any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type PriceResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type DescriptionResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace PaymentMethodListResolvers {
    export interface Resolvers<Context = any> {
        items?: ItemsResolver<PaymentMethod[], any, Context>;
        totalItems?: TotalItemsResolver<number, any, Context>;
    }

    export type ItemsResolver<R = PaymentMethod[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type TotalItemsResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace PaymentMethodResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        createdAt?: CreatedAtResolver<DateTime, any, Context>;
        updatedAt?: UpdatedAtResolver<DateTime, any, Context>;
        code?: CodeResolver<string, any, Context>;
        enabled?: EnabledResolver<boolean, any, Context>;
        configArgs?: ConfigArgsResolver<ConfigArg[], any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CreatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UpdatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CodeResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type EnabledResolver<R = boolean, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type ConfigArgsResolver<R = ConfigArg[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
}

export namespace ProductCategoryListResolvers {
    export interface Resolvers<Context = any> {
        items?: ItemsResolver<ProductCategory[], any, Context>;
        totalItems?: TotalItemsResolver<number, any, Context>;
    }

    export type ItemsResolver<R = ProductCategory[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type TotalItemsResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace ProductCategoryResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        createdAt?: CreatedAtResolver<DateTime, any, Context>;
        updatedAt?: UpdatedAtResolver<DateTime, any, Context>;
        languageCode?: LanguageCodeResolver<LanguageCode | null, any, Context>;
        name?: NameResolver<string, any, Context>;
        position?: PositionResolver<number, any, Context>;
        description?: DescriptionResolver<string, any, Context>;
        featuredAsset?: FeaturedAssetResolver<Asset | null, any, Context>;
        assets?: AssetsResolver<Asset[], any, Context>;
        parent?: ParentResolver<ProductCategory, any, Context>;
        children?: ChildrenResolver<ProductCategory[] | null, any, Context>;
        facetValues?: FacetValuesResolver<FacetValue[], any, Context>;
        descendantFacetValues?: DescendantFacetValuesResolver<FacetValue[], any, Context>;
        translations?: TranslationsResolver<ProductCategoryTranslation[], any, Context>;
        customFields?: CustomFieldsResolver<Json | null, any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CreatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UpdatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type LanguageCodeResolver<R = LanguageCode | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type NameResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type PositionResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type DescriptionResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type FeaturedAssetResolver<R = Asset | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type AssetsResolver<R = Asset[], Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type ParentResolver<R = ProductCategory, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type ChildrenResolver<R = ProductCategory[] | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type FacetValuesResolver<R = FacetValue[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type DescendantFacetValuesResolver<R = FacetValue[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type TranslationsResolver<
        R = ProductCategoryTranslation[],
        Parent = any,
        Context = any
    > = Resolver<R, Parent, Context>;
    export type CustomFieldsResolver<R = Json | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
}

export namespace ProductCategoryTranslationResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        createdAt?: CreatedAtResolver<DateTime, any, Context>;
        updatedAt?: UpdatedAtResolver<DateTime, any, Context>;
        languageCode?: LanguageCodeResolver<LanguageCode, any, Context>;
        name?: NameResolver<string, any, Context>;
        description?: DescriptionResolver<string, any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CreatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UpdatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type LanguageCodeResolver<R = LanguageCode, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type NameResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type DescriptionResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace ProductOptionGroupResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        createdAt?: CreatedAtResolver<DateTime, any, Context>;
        updatedAt?: UpdatedAtResolver<DateTime, any, Context>;
        languageCode?: LanguageCodeResolver<LanguageCode, any, Context>;
        code?: CodeResolver<string, any, Context>;
        name?: NameResolver<string, any, Context>;
        options?: OptionsResolver<ProductOption[], any, Context>;
        translations?: TranslationsResolver<ProductOptionGroupTranslation[], any, Context>;
        customFields?: CustomFieldsResolver<Json | null, any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CreatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UpdatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type LanguageCodeResolver<R = LanguageCode, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type CodeResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type NameResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type OptionsResolver<R = ProductOption[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type TranslationsResolver<
        R = ProductOptionGroupTranslation[],
        Parent = any,
        Context = any
    > = Resolver<R, Parent, Context>;
    export type CustomFieldsResolver<R = Json | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
}

export namespace ProductOptionGroupTranslationResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        createdAt?: CreatedAtResolver<DateTime, any, Context>;
        updatedAt?: UpdatedAtResolver<DateTime, any, Context>;
        languageCode?: LanguageCodeResolver<LanguageCode, any, Context>;
        name?: NameResolver<string, any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CreatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UpdatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type LanguageCodeResolver<R = LanguageCode, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type NameResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace ProductListResolvers {
    export interface Resolvers<Context = any> {
        items?: ItemsResolver<Product[], any, Context>;
        totalItems?: TotalItemsResolver<number, any, Context>;
    }

    export type ItemsResolver<R = Product[], Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type TotalItemsResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace ProductResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        createdAt?: CreatedAtResolver<DateTime, any, Context>;
        updatedAt?: UpdatedAtResolver<DateTime, any, Context>;
        languageCode?: LanguageCodeResolver<LanguageCode, any, Context>;
        name?: NameResolver<string, any, Context>;
        slug?: SlugResolver<string, any, Context>;
        description?: DescriptionResolver<string, any, Context>;
        featuredAsset?: FeaturedAssetResolver<Asset | null, any, Context>;
        assets?: AssetsResolver<Asset[], any, Context>;
        variants?: VariantsResolver<ProductVariant[], any, Context>;
        optionGroups?: OptionGroupsResolver<ProductOptionGroup[], any, Context>;
        translations?: TranslationsResolver<ProductTranslation[], any, Context>;
        customFields?: CustomFieldsResolver<Json | null, any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CreatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UpdatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type LanguageCodeResolver<R = LanguageCode, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type NameResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type SlugResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type DescriptionResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type FeaturedAssetResolver<R = Asset | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type AssetsResolver<R = Asset[], Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type VariantsResolver<R = ProductVariant[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type OptionGroupsResolver<R = ProductOptionGroup[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type TranslationsResolver<R = ProductTranslation[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type CustomFieldsResolver<R = Json | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
}

export namespace ProductTranslationResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        createdAt?: CreatedAtResolver<DateTime, any, Context>;
        updatedAt?: UpdatedAtResolver<DateTime, any, Context>;
        languageCode?: LanguageCodeResolver<LanguageCode, any, Context>;
        name?: NameResolver<string, any, Context>;
        slug?: SlugResolver<string, any, Context>;
        description?: DescriptionResolver<string, any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CreatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UpdatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type LanguageCodeResolver<R = LanguageCode, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type NameResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type SlugResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type DescriptionResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace PromotionResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        createdAt?: CreatedAtResolver<DateTime, any, Context>;
        updatedAt?: UpdatedAtResolver<DateTime, any, Context>;
        name?: NameResolver<string, any, Context>;
        enabled?: EnabledResolver<boolean, any, Context>;
        conditions?: ConditionsResolver<AdjustmentOperation[], any, Context>;
        actions?: ActionsResolver<AdjustmentOperation[], any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CreatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UpdatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type NameResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type EnabledResolver<R = boolean, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type ConditionsResolver<R = AdjustmentOperation[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type ActionsResolver<R = AdjustmentOperation[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
}

export namespace PromotionListResolvers {
    export interface Resolvers<Context = any> {
        items?: ItemsResolver<Promotion[], any, Context>;
        totalItems?: TotalItemsResolver<number, any, Context>;
    }

    export type ItemsResolver<R = Promotion[], Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type TotalItemsResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace AdjustmentOperationsResolvers {
    export interface Resolvers<Context = any> {
        conditions?: ConditionsResolver<AdjustmentOperation[], any, Context>;
        actions?: ActionsResolver<AdjustmentOperation[], any, Context>;
    }

    export type ConditionsResolver<R = AdjustmentOperation[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type ActionsResolver<R = AdjustmentOperation[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
}

export namespace RoleListResolvers {
    export interface Resolvers<Context = any> {
        items?: ItemsResolver<Role[], any, Context>;
        totalItems?: TotalItemsResolver<number, any, Context>;
    }

    export type ItemsResolver<R = Role[], Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type TotalItemsResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace ShippingMethodListResolvers {
    export interface Resolvers<Context = any> {
        items?: ItemsResolver<ShippingMethod[], any, Context>;
        totalItems?: TotalItemsResolver<number, any, Context>;
    }

    export type ItemsResolver<R = ShippingMethod[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type TotalItemsResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace TaxRateListResolvers {
    export interface Resolvers<Context = any> {
        items?: ItemsResolver<TaxRate[], any, Context>;
        totalItems?: TotalItemsResolver<number, any, Context>;
    }

    export type ItemsResolver<R = TaxRate[], Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type TotalItemsResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace NetworkStatusResolvers {
    export interface Resolvers<Context = any> {
        inFlightRequests?: InFlightRequestsResolver<number, any, Context>;
    }

    export type InFlightRequestsResolver<R = number, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
}

export namespace UserStatusResolvers {
    export interface Resolvers<Context = any> {
        username?: UsernameResolver<string, any, Context>;
        isLoggedIn?: IsLoggedInResolver<boolean, any, Context>;
        loginTime?: LoginTimeResolver<string, any, Context>;
    }

    export type UsernameResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type IsLoggedInResolver<R = boolean, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type LoginTimeResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace UiStateResolvers {
    export interface Resolvers<Context = any> {
        language?: LanguageResolver<LanguageCode, any, Context>;
    }

    export type LanguageResolver<R = LanguageCode, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
}

export namespace MutationResolvers {
    export interface Resolvers<Context = any> {
        createAdministrator?: CreateAdministratorResolver<Administrator, any, Context>;
        updateAdministrator?: UpdateAdministratorResolver<Administrator, any, Context>;
        assignRoleToAdministrator?: AssignRoleToAdministratorResolver<Administrator, any, Context>;
        createAssets?: CreateAssetsResolver<Asset[], any, Context>;
        login?: LoginResolver<LoginResult, any, Context>;
        logout?: LogoutResolver<boolean, any, Context>;
        registerCustomerAccount?: RegisterCustomerAccountResolver<boolean, any, Context>;
        verifyCustomerAccount?: VerifyCustomerAccountResolver<LoginResult, any, Context>;
        refreshCustomerVerification?: RefreshCustomerVerificationResolver<boolean, any, Context>;
        createChannel?: CreateChannelResolver<Channel, any, Context>;
        updateChannel?: UpdateChannelResolver<Channel, any, Context>;
        createCountry?: CreateCountryResolver<Country, any, Context>;
        updateCountry?: UpdateCountryResolver<Country, any, Context>;
        createCustomerGroup?: CreateCustomerGroupResolver<CustomerGroup, any, Context>;
        updateCustomerGroup?: UpdateCustomerGroupResolver<CustomerGroup, any, Context>;
        addCustomersToGroup?: AddCustomersToGroupResolver<CustomerGroup, any, Context>;
        removeCustomersFromGroup?: RemoveCustomersFromGroupResolver<CustomerGroup, any, Context>;
        createCustomer?: CreateCustomerResolver<Customer, any, Context>;
        updateCustomer?: UpdateCustomerResolver<Customer, any, Context>;
        createCustomerAddress?: CreateCustomerAddressResolver<Address, any, Context>;
        updateCustomerAddress?: UpdateCustomerAddressResolver<Address, any, Context>;
        createFacet?: CreateFacetResolver<Facet, any, Context>;
        updateFacet?: UpdateFacetResolver<Facet, any, Context>;
        createFacetValues?: CreateFacetValuesResolver<FacetValue[], any, Context>;
        updateFacetValues?: UpdateFacetValuesResolver<FacetValue[], any, Context>;
        importProducts?: ImportProductsResolver<ImportInfo | null, any, Context>;
        addItemToOrder?: AddItemToOrderResolver<Order | null, any, Context>;
        removeItemFromOrder?: RemoveItemFromOrderResolver<Order | null, any, Context>;
        adjustItemQuantity?: AdjustItemQuantityResolver<Order | null, any, Context>;
        transitionOrderToState?: TransitionOrderToStateResolver<Order | null, any, Context>;
        setOrderShippingAddress?: SetOrderShippingAddressResolver<Order | null, any, Context>;
        setOrderShippingMethod?: SetOrderShippingMethodResolver<Order | null, any, Context>;
        addPaymentToOrder?: AddPaymentToOrderResolver<Order | null, any, Context>;
        setCustomerForOrder?: SetCustomerForOrderResolver<Order | null, any, Context>;
        updatePaymentMethod?: UpdatePaymentMethodResolver<PaymentMethod, any, Context>;
        createProductCategory?: CreateProductCategoryResolver<ProductCategory, any, Context>;
        updateProductCategory?: UpdateProductCategoryResolver<ProductCategory, any, Context>;
        moveProductCategory?: MoveProductCategoryResolver<ProductCategory, any, Context>;
        createProductOptionGroup?: CreateProductOptionGroupResolver<ProductOptionGroup, any, Context>;
        updateProductOptionGroup?: UpdateProductOptionGroupResolver<ProductOptionGroup, any, Context>;
        createProduct?: CreateProductResolver<Product, any, Context>;
        updateProduct?: UpdateProductResolver<Product, any, Context>;
        addOptionGroupToProduct?: AddOptionGroupToProductResolver<Product, any, Context>;
        removeOptionGroupFromProduct?: RemoveOptionGroupFromProductResolver<Product, any, Context>;
        generateVariantsForProduct?: GenerateVariantsForProductResolver<Product, any, Context>;
        updateProductVariants?: UpdateProductVariantsResolver<(ProductVariant | null)[], any, Context>;
        createPromotion?: CreatePromotionResolver<Promotion, any, Context>;
        updatePromotion?: UpdatePromotionResolver<Promotion, any, Context>;
        createRole?: CreateRoleResolver<Role, any, Context>;
        updateRole?: UpdateRoleResolver<Role, any, Context>;
        createShippingMethod?: CreateShippingMethodResolver<ShippingMethod, any, Context>;
        updateShippingMethod?: UpdateShippingMethodResolver<ShippingMethod, any, Context>;
        createTaxCategory?: CreateTaxCategoryResolver<TaxCategory, any, Context>;
        updateTaxCategory?: UpdateTaxCategoryResolver<TaxCategory, any, Context>;
        createTaxRate?: CreateTaxRateResolver<TaxRate, any, Context>;
        updateTaxRate?: UpdateTaxRateResolver<TaxRate, any, Context>;
        createZone?: CreateZoneResolver<Zone, any, Context>;
        updateZone?: UpdateZoneResolver<Zone, any, Context>;
        addMembersToZone?: AddMembersToZoneResolver<Zone, any, Context>;
        removeMembersFromZone?: RemoveMembersFromZoneResolver<Zone, any, Context>;
        requestStarted?: RequestStartedResolver<number, any, Context>;
        requestCompleted?: RequestCompletedResolver<number, any, Context>;
        setAsLoggedIn?: SetAsLoggedInResolver<UserStatus, any, Context>;
        setAsLoggedOut?: SetAsLoggedOutResolver<UserStatus, any, Context>;
        setUiLanguage?: SetUiLanguageResolver<LanguageCode | null, any, Context>;
    }

    export type CreateAdministratorResolver<R = Administrator, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        CreateAdministratorArgs
    >;
    export interface CreateAdministratorArgs {
        input: CreateAdministratorInput;
    }

    export type UpdateAdministratorResolver<R = Administrator, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        UpdateAdministratorArgs
    >;
    export interface UpdateAdministratorArgs {
        input: UpdateAdministratorInput;
    }

    export type AssignRoleToAdministratorResolver<R = Administrator, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        AssignRoleToAdministratorArgs
    >;
    export interface AssignRoleToAdministratorArgs {
        administratorId: string;
        roleId: string;
    }

    export type CreateAssetsResolver<R = Asset[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        CreateAssetsArgs
    >;
    export interface CreateAssetsArgs {
        input: CreateAssetInput[];
    }

    export type LoginResolver<R = LoginResult, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        LoginArgs
    >;
    export interface LoginArgs {
        username: string;
        password: string;
        rememberMe?: boolean | null;
    }

    export type LogoutResolver<R = boolean, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type RegisterCustomerAccountResolver<R = boolean, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        RegisterCustomerAccountArgs
    >;
    export interface RegisterCustomerAccountArgs {
        input: RegisterCustomerInput;
    }

    export type VerifyCustomerAccountResolver<R = LoginResult, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        VerifyCustomerAccountArgs
    >;
    export interface VerifyCustomerAccountArgs {
        token: string;
        password: string;
    }

    export type RefreshCustomerVerificationResolver<R = boolean, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        RefreshCustomerVerificationArgs
    >;
    export interface RefreshCustomerVerificationArgs {
        emailAddress: string;
    }

    export type CreateChannelResolver<R = Channel, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        CreateChannelArgs
    >;
    export interface CreateChannelArgs {
        input: CreateChannelInput;
    }

    export type UpdateChannelResolver<R = Channel, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        UpdateChannelArgs
    >;
    export interface UpdateChannelArgs {
        input: UpdateChannelInput;
    }

    export type CreateCountryResolver<R = Country, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        CreateCountryArgs
    >;
    export interface CreateCountryArgs {
        input: CreateCountryInput;
    }

    export type UpdateCountryResolver<R = Country, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        UpdateCountryArgs
    >;
    export interface UpdateCountryArgs {
        input: UpdateCountryInput;
    }

    export type CreateCustomerGroupResolver<R = CustomerGroup, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        CreateCustomerGroupArgs
    >;
    export interface CreateCustomerGroupArgs {
        input: CreateCustomerGroupInput;
    }

    export type UpdateCustomerGroupResolver<R = CustomerGroup, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        UpdateCustomerGroupArgs
    >;
    export interface UpdateCustomerGroupArgs {
        input: UpdateCustomerGroupInput;
    }

    export type AddCustomersToGroupResolver<R = CustomerGroup, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        AddCustomersToGroupArgs
    >;
    export interface AddCustomersToGroupArgs {
        customerGroupId: string;
        customerIds: string[];
    }

    export type RemoveCustomersFromGroupResolver<R = CustomerGroup, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        RemoveCustomersFromGroupArgs
    >;
    export interface RemoveCustomersFromGroupArgs {
        customerGroupId: string;
        customerIds: string[];
    }

    export type CreateCustomerResolver<R = Customer, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        CreateCustomerArgs
    >;
    export interface CreateCustomerArgs {
        input: CreateCustomerInput;
        password?: string | null;
    }

    export type UpdateCustomerResolver<R = Customer, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        UpdateCustomerArgs
    >;
    export interface UpdateCustomerArgs {
        input: UpdateCustomerInput;
    }

    export type CreateCustomerAddressResolver<R = Address, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        CreateCustomerAddressArgs
    >;
    export interface CreateCustomerAddressArgs {
        customerId: string;
        input: CreateAddressInput;
    }

    export type UpdateCustomerAddressResolver<R = Address, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        UpdateCustomerAddressArgs
    >;
    export interface UpdateCustomerAddressArgs {
        input: UpdateAddressInput;
    }

    export type CreateFacetResolver<R = Facet, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        CreateFacetArgs
    >;
    export interface CreateFacetArgs {
        input: CreateFacetInput;
    }

    export type UpdateFacetResolver<R = Facet, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        UpdateFacetArgs
    >;
    export interface UpdateFacetArgs {
        input: UpdateFacetInput;
    }

    export type CreateFacetValuesResolver<R = FacetValue[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        CreateFacetValuesArgs
    >;
    export interface CreateFacetValuesArgs {
        input: CreateFacetValueInput[];
    }

    export type UpdateFacetValuesResolver<R = FacetValue[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        UpdateFacetValuesArgs
    >;
    export interface UpdateFacetValuesArgs {
        input: UpdateFacetValueInput[];
    }

    export type ImportProductsResolver<R = ImportInfo | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        ImportProductsArgs
    >;
    export interface ImportProductsArgs {
        csvFile: Upload;
    }

    export type AddItemToOrderResolver<R = Order | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        AddItemToOrderArgs
    >;
    export interface AddItemToOrderArgs {
        productVariantId: string;
        quantity: number;
    }

    export type RemoveItemFromOrderResolver<R = Order | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        RemoveItemFromOrderArgs
    >;
    export interface RemoveItemFromOrderArgs {
        orderItemId: string;
    }

    export type AdjustItemQuantityResolver<R = Order | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        AdjustItemQuantityArgs
    >;
    export interface AdjustItemQuantityArgs {
        orderItemId: string;
        quantity: number;
    }

    export type TransitionOrderToStateResolver<R = Order | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        TransitionOrderToStateArgs
    >;
    export interface TransitionOrderToStateArgs {
        state: string;
    }

    export type SetOrderShippingAddressResolver<R = Order | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        SetOrderShippingAddressArgs
    >;
    export interface SetOrderShippingAddressArgs {
        input: CreateAddressInput;
    }

    export type SetOrderShippingMethodResolver<R = Order | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        SetOrderShippingMethodArgs
    >;
    export interface SetOrderShippingMethodArgs {
        shippingMethodId: string;
    }

    export type AddPaymentToOrderResolver<R = Order | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        AddPaymentToOrderArgs
    >;
    export interface AddPaymentToOrderArgs {
        input: PaymentInput;
    }

    export type SetCustomerForOrderResolver<R = Order | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        SetCustomerForOrderArgs
    >;
    export interface SetCustomerForOrderArgs {
        input: CreateCustomerInput;
    }

    export type UpdatePaymentMethodResolver<R = PaymentMethod, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        UpdatePaymentMethodArgs
    >;
    export interface UpdatePaymentMethodArgs {
        input: UpdatePaymentMethodInput;
    }

    export type CreateProductCategoryResolver<R = ProductCategory, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        CreateProductCategoryArgs
    >;
    export interface CreateProductCategoryArgs {
        input: CreateProductCategoryInput;
    }

    export type UpdateProductCategoryResolver<R = ProductCategory, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        UpdateProductCategoryArgs
    >;
    export interface UpdateProductCategoryArgs {
        input: UpdateProductCategoryInput;
    }

    export type MoveProductCategoryResolver<R = ProductCategory, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        MoveProductCategoryArgs
    >;
    export interface MoveProductCategoryArgs {
        input: MoveProductCategoryInput;
    }

    export type CreateProductOptionGroupResolver<
        R = ProductOptionGroup,
        Parent = any,
        Context = any
    > = Resolver<R, Parent, Context, CreateProductOptionGroupArgs>;
    export interface CreateProductOptionGroupArgs {
        input: CreateProductOptionGroupInput;
    }

    export type UpdateProductOptionGroupResolver<
        R = ProductOptionGroup,
        Parent = any,
        Context = any
    > = Resolver<R, Parent, Context, UpdateProductOptionGroupArgs>;
    export interface UpdateProductOptionGroupArgs {
        input: UpdateProductOptionGroupInput;
    }

    export type CreateProductResolver<R = Product, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        CreateProductArgs
    >;
    export interface CreateProductArgs {
        input: CreateProductInput;
    }

    export type UpdateProductResolver<R = Product, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        UpdateProductArgs
    >;
    export interface UpdateProductArgs {
        input: UpdateProductInput;
    }

    export type AddOptionGroupToProductResolver<R = Product, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        AddOptionGroupToProductArgs
    >;
    export interface AddOptionGroupToProductArgs {
        productId: string;
        optionGroupId: string;
    }

    export type RemoveOptionGroupFromProductResolver<R = Product, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        RemoveOptionGroupFromProductArgs
    >;
    export interface RemoveOptionGroupFromProductArgs {
        productId: string;
        optionGroupId: string;
    }

    export type GenerateVariantsForProductResolver<R = Product, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        GenerateVariantsForProductArgs
    >;
    export interface GenerateVariantsForProductArgs {
        productId: string;
        defaultTaxCategoryId?: string | null;
        defaultPrice?: number | null;
        defaultSku?: string | null;
    }

    export type UpdateProductVariantsResolver<
        R = (ProductVariant | null)[],
        Parent = any,
        Context = any
    > = Resolver<R, Parent, Context, UpdateProductVariantsArgs>;
    export interface UpdateProductVariantsArgs {
        input: UpdateProductVariantInput[];
    }

    export type CreatePromotionResolver<R = Promotion, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        CreatePromotionArgs
    >;
    export interface CreatePromotionArgs {
        input: CreatePromotionInput;
    }

    export type UpdatePromotionResolver<R = Promotion, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        UpdatePromotionArgs
    >;
    export interface UpdatePromotionArgs {
        input: UpdatePromotionInput;
    }

    export type CreateRoleResolver<R = Role, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        CreateRoleArgs
    >;
    export interface CreateRoleArgs {
        input: CreateRoleInput;
    }

    export type UpdateRoleResolver<R = Role, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        UpdateRoleArgs
    >;
    export interface UpdateRoleArgs {
        input: UpdateRoleInput;
    }

    export type CreateShippingMethodResolver<R = ShippingMethod, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        CreateShippingMethodArgs
    >;
    export interface CreateShippingMethodArgs {
        input: CreateShippingMethodInput;
    }

    export type UpdateShippingMethodResolver<R = ShippingMethod, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        UpdateShippingMethodArgs
    >;
    export interface UpdateShippingMethodArgs {
        input: UpdateShippingMethodInput;
    }

    export type CreateTaxCategoryResolver<R = TaxCategory, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        CreateTaxCategoryArgs
    >;
    export interface CreateTaxCategoryArgs {
        input: CreateTaxCategoryInput;
    }

    export type UpdateTaxCategoryResolver<R = TaxCategory, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        UpdateTaxCategoryArgs
    >;
    export interface UpdateTaxCategoryArgs {
        input: UpdateTaxCategoryInput;
    }

    export type CreateTaxRateResolver<R = TaxRate, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        CreateTaxRateArgs
    >;
    export interface CreateTaxRateArgs {
        input: CreateTaxRateInput;
    }

    export type UpdateTaxRateResolver<R = TaxRate, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        UpdateTaxRateArgs
    >;
    export interface UpdateTaxRateArgs {
        input: UpdateTaxRateInput;
    }

    export type CreateZoneResolver<R = Zone, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        CreateZoneArgs
    >;
    export interface CreateZoneArgs {
        input: CreateZoneInput;
    }

    export type UpdateZoneResolver<R = Zone, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        UpdateZoneArgs
    >;
    export interface UpdateZoneArgs {
        input: UpdateZoneInput;
    }

    export type AddMembersToZoneResolver<R = Zone, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        AddMembersToZoneArgs
    >;
    export interface AddMembersToZoneArgs {
        zoneId: string;
        memberIds: string[];
    }

    export type RemoveMembersFromZoneResolver<R = Zone, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        RemoveMembersFromZoneArgs
    >;
    export interface RemoveMembersFromZoneArgs {
        zoneId: string;
        memberIds: string[];
    }

    export type RequestStartedResolver<R = number, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type RequestCompletedResolver<R = number, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type SetAsLoggedInResolver<R = UserStatus, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        SetAsLoggedInArgs
    >;
    export interface SetAsLoggedInArgs {
        username: string;
        loginTime: string;
    }

    export type SetAsLoggedOutResolver<R = UserStatus, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type SetUiLanguageResolver<R = LanguageCode | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        SetUiLanguageArgs
    >;
    export interface SetUiLanguageArgs {
        languageCode?: LanguageCode | null;
    }
}

export namespace LoginResultResolvers {
    export interface Resolvers<Context = any> {
        user?: UserResolver<CurrentUser, any, Context>;
    }

    export type UserResolver<R = CurrentUser, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace ImportInfoResolvers {
    export interface Resolvers<Context = any> {
        errors?: ErrorsResolver<string[] | null, any, Context>;
        processed?: ProcessedResolver<number, any, Context>;
        imported?: ImportedResolver<number, any, Context>;
    }

    export type ErrorsResolver<R = string[] | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type ProcessedResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type ImportedResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace GetAdministrators {
    export type Variables = {
        options?: AdministratorListOptions | null;
    };

    export type Query = {
        __typename?: 'Query';
        administrators: Administrators;
    };

    export type Administrators = {
        __typename?: 'AdministratorList';
        items: Items[];
        totalItems: number;
    };

    export type Items = Administrator.Fragment;
}

export namespace GetAdministrator {
    export type Variables = {
        id: string;
    };

    export type Query = {
        __typename?: 'Query';
        administrator?: Administrator | null;
    };

    export type Administrator = Administrator.Fragment;
}

export namespace CreateAdministrator {
    export type Variables = {
        input: CreateAdministratorInput;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        createAdministrator: CreateAdministrator;
    };

    export type CreateAdministrator = Administrator.Fragment;
}

export namespace UpdateAdministrator {
    export type Variables = {
        input: UpdateAdministratorInput;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        updateAdministrator: UpdateAdministrator;
    };

    export type UpdateAdministrator = Administrator.Fragment;
}

export namespace GetRoles {
    export type Variables = {
        options?: RoleListOptions | null;
    };

    export type Query = {
        __typename?: 'Query';
        roles: Roles;
    };

    export type Roles = {
        __typename?: 'RoleList';
        items: Items[];
        totalItems: number;
    };

    export type Items = Role.Fragment;
}

export namespace GetRole {
    export type Variables = {
        id: string;
    };

    export type Query = {
        __typename?: 'Query';
        role?: Role | null;
    };

    export type Role = Role.Fragment;
}

export namespace CreateRole {
    export type Variables = {
        input: CreateRoleInput;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        createRole: CreateRole;
    };

    export type CreateRole = Role.Fragment;
}

export namespace UpdateRole {
    export type Variables = {
        input: UpdateRoleInput;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        updateRole: UpdateRole;
    };

    export type UpdateRole = Role.Fragment;
}

export namespace AssignRoleToAdministrator {
    export type Variables = {
        administratorId: string;
        roleId: string;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        assignRoleToAdministrator: AssignRoleToAdministrator;
    };

    export type AssignRoleToAdministrator = Administrator.Fragment;
}

export namespace AttemptLogin {
    export type Variables = {
        username: string;
        password: string;
        rememberMe: boolean;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        login: Login;
    };

    export type Login = {
        __typename?: 'LoginResult';
        user: User;
    };

    export type User = CurrentUser.Fragment;
}

export namespace LogOut {
    export type Variables = {};

    export type Mutation = {
        __typename?: 'Mutation';
        logout: boolean;
    };
}

export namespace GetCurrentUser {
    export type Variables = {};

    export type Query = {
        __typename?: 'Query';
        me?: Me | null;
    };

    export type Me = CurrentUser.Fragment;
}

export namespace RequestStarted {
    export type Variables = {};

    export type Mutation = {
        __typename?: 'Mutation';
        requestStarted: number;
    };
}

export namespace RequestCompleted {
    export type Variables = {};

    export type Mutation = {
        __typename?: 'Mutation';
        requestCompleted: number;
    };
}

export namespace SetAsLoggedIn {
    export type Variables = {
        username: string;
        loginTime: string;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        setAsLoggedIn: SetAsLoggedIn;
    };

    export type SetAsLoggedIn = {
        __typename?: 'UserStatus';
        username: string;
        isLoggedIn: boolean;
        loginTime: string;
    };
}

export namespace SetAsLoggedOut {
    export type Variables = {};

    export type Mutation = {
        __typename?: 'Mutation';
        setAsLoggedOut: SetAsLoggedOut;
    };

    export type SetAsLoggedOut = {
        __typename?: 'UserStatus';
        username: string;
        isLoggedIn: boolean;
        loginTime: string;
    };
}

export namespace SetUiLanguage {
    export type Variables = {
        languageCode: LanguageCode;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        setUiLanguage?: LanguageCode | null;
    };
}

export namespace GetNetworkStatus {
    export type Variables = {};

    export type Query = {
        __typename?: 'Query';
        networkStatus: NetworkStatus;
    };

    export type NetworkStatus = {
        __typename?: 'NetworkStatus';
        inFlightRequests: number;
    };
}

export namespace GetUserStatus {
    export type Variables = {};

    export type Query = {
        __typename?: 'Query';
        userStatus: UserStatus;
    };

    export type UserStatus = {
        __typename?: 'UserStatus';
        username: string;
        isLoggedIn: boolean;
        loginTime: string;
    };
}

export namespace GetUiState {
    export type Variables = {};

    export type Query = {
        __typename?: 'Query';
        uiState: UiState;
    };

    export type UiState = {
        __typename?: 'UiState';
        language: LanguageCode;
    };
}

export namespace GetServerConfig {
    export type Variables = {};

    export type Query = {
        __typename?: 'Query';
        config: Config;
    };

    export type Config = {
        __typename?: 'Config';
        customFields?: Json | null;
    };
}

export namespace GetCustomerList {
    export type Variables = {
        options: CustomerListOptions;
    };

    export type Query = {
        __typename?: 'Query';
        customers: Customers;
    };

    export type Customers = {
        __typename?: 'CustomerList';
        items: Items[];
        totalItems: number;
    };

    export type Items = {
        __typename?: 'Customer';
        id: string;
        title?: string | null;
        firstName: string;
        lastName: string;
        emailAddress: string;
        user?: User | null;
    };

    export type User = {
        __typename?: 'User';
        id: string;
        verified: boolean;
    };
}

export namespace GetCustomer {
    export type Variables = {
        id: string;
    };

    export type Query = {
        __typename?: 'Query';
        customer?: Customer | null;
    };

    export type Customer = Customer.Fragment;
}

export namespace CreateCustomer {
    export type Variables = {
        input: CreateCustomerInput;
        password?: string | null;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        createCustomer: CreateCustomer;
    };

    export type CreateCustomer = Customer.Fragment;
}

export namespace UpdateCustomer {
    export type Variables = {
        input: UpdateCustomerInput;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        updateCustomer: UpdateCustomer;
    };

    export type UpdateCustomer = Customer.Fragment;
}

export namespace UpdateCustomerAddress {
    export type Variables = {
        input: UpdateAddressInput;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        updateCustomerAddress: UpdateCustomerAddress;
    };

    export type UpdateCustomerAddress = Address.Fragment;
}

export namespace CreateFacet {
    export type Variables = {
        input: CreateFacetInput;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        createFacet: CreateFacet;
    };

    export type CreateFacet = FacetWithValues.Fragment;
}

export namespace UpdateFacet {
    export type Variables = {
        input: UpdateFacetInput;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        updateFacet: UpdateFacet;
    };

    export type UpdateFacet = FacetWithValues.Fragment;
}

export namespace CreateFacetValues {
    export type Variables = {
        input: CreateFacetValueInput[];
    };

    export type Mutation = {
        __typename?: 'Mutation';
        createFacetValues: CreateFacetValues[];
    };

    export type CreateFacetValues = FacetValue.Fragment;
}

export namespace UpdateFacetValues {
    export type Variables = {
        input: UpdateFacetValueInput[];
    };

    export type Mutation = {
        __typename?: 'Mutation';
        updateFacetValues: UpdateFacetValues[];
    };

    export type UpdateFacetValues = FacetValue.Fragment;
}

export namespace GetFacetList {
    export type Variables = {
        options?: FacetListOptions | null;
        languageCode?: LanguageCode | null;
    };

    export type Query = {
        __typename?: 'Query';
        facets: Facets;
    };

    export type Facets = {
        __typename?: 'FacetList';
        items: Items[];
        totalItems: number;
    };

    export type Items = FacetWithValues.Fragment;
}

export namespace GetFacetWithValues {
    export type Variables = {
        id: string;
        languageCode?: LanguageCode | null;
    };

    export type Query = {
        __typename?: 'Query';
        facet?: Facet | null;
    };

    export type Facet = FacetWithValues.Fragment;
}

export namespace GetOrderList {
    export type Variables = {
        options?: OrderListOptions | null;
    };

    export type Query = {
        __typename?: 'Query';
        orders: Orders;
    };

    export type Orders = {
        __typename?: 'OrderList';
        items: Items[];
        totalItems: number;
    };

    export type Items = Order.Fragment;
}

export namespace GetOrder {
    export type Variables = {
        id: string;
    };

    export type Query = {
        __typename?: 'Query';
        order?: Order | null;
    };

    export type Order = OrderWithLines.Fragment;
}

export namespace UpdateProduct {
    export type Variables = {
        input: UpdateProductInput;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        updateProduct: UpdateProduct;
    };

    export type UpdateProduct = ProductWithVariants.Fragment;
}

export namespace CreateProduct {
    export type Variables = {
        input: CreateProductInput;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        createProduct: CreateProduct;
    };

    export type CreateProduct = ProductWithVariants.Fragment;
}

export namespace GenerateProductVariants {
    export type Variables = {
        productId: string;
        defaultTaxCategoryId?: string | null;
        defaultPrice?: number | null;
        defaultSku?: string | null;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        generateVariantsForProduct: GenerateVariantsForProduct;
    };

    export type GenerateVariantsForProduct = ProductWithVariants.Fragment;
}

export namespace UpdateProductVariants {
    export type Variables = {
        input: UpdateProductVariantInput[];
    };

    export type Mutation = {
        __typename?: 'Mutation';
        updateProductVariants: (UpdateProductVariants | null)[];
    };

    export type UpdateProductVariants = ProductVariant.Fragment;
}

export namespace CreateProductOptionGroup {
    export type Variables = {
        input: CreateProductOptionGroupInput;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        createProductOptionGroup: CreateProductOptionGroup;
    };

    export type CreateProductOptionGroup = ProductOptionGroup.Fragment;
}

export namespace AddOptionGroupToProduct {
    export type Variables = {
        productId: string;
        optionGroupId: string;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        addOptionGroupToProduct: AddOptionGroupToProduct;
    };

    export type AddOptionGroupToProduct = {
        __typename?: 'Product';
        id: string;
        optionGroups: OptionGroups[];
    };

    export type OptionGroups = {
        __typename?: 'ProductOptionGroup';
        id: string;
        code: string;
        options: Options[];
    };

    export type Options = {
        __typename?: 'ProductOption';
        id: string;
        code?: string | null;
    };
}

export namespace RemoveOptionGroupFromProduct {
    export type Variables = {
        productId: string;
        optionGroupId: string;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        removeOptionGroupFromProduct: RemoveOptionGroupFromProduct;
    };

    export type RemoveOptionGroupFromProduct = {
        __typename?: 'Product';
        id: string;
        optionGroups: OptionGroups[];
    };

    export type OptionGroups = {
        __typename?: 'ProductOptionGroup';
        id: string;
        code: string;
        options: Options[];
    };

    export type Options = {
        __typename?: 'ProductOption';
        id: string;
        code?: string | null;
    };
}

export namespace GetProductWithVariants {
    export type Variables = {
        id: string;
        languageCode?: LanguageCode | null;
    };

    export type Query = {
        __typename?: 'Query';
        product?: Product | null;
    };

    export type Product = ProductWithVariants.Fragment;
}

export namespace GetProductList {
    export type Variables = {
        options?: ProductListOptions | null;
        languageCode?: LanguageCode | null;
    };

    export type Query = {
        __typename?: 'Query';
        products: Products;
    };

    export type Products = {
        __typename?: 'ProductList';
        items: Items[];
        totalItems: number;
    };

    export type Items = {
        __typename?: 'Product';
        id: string;
        languageCode: LanguageCode;
        name: string;
        slug: string;
        description: string;
    };
}

export namespace GetProductOptionGroups {
    export type Variables = {
        filterTerm?: string | null;
        languageCode?: LanguageCode | null;
    };

    export type Query = {
        __typename?: 'Query';
        productOptionGroups: ProductOptionGroups[];
    };

    export type ProductOptionGroups = {
        __typename?: 'ProductOptionGroup';
        id: string;
        languageCode: LanguageCode;
        code: string;
        name: string;
        options: Options[];
    };

    export type Options = {
        __typename?: 'ProductOption';
        id: string;
        languageCode?: LanguageCode | null;
        code?: string | null;
        name?: string | null;
    };
}

export namespace GetAssetList {
    export type Variables = {
        options?: AssetListOptions | null;
    };

    export type Query = {
        __typename?: 'Query';
        assets: Assets;
    };

    export type Assets = {
        __typename?: 'AssetList';
        items: Items[];
        totalItems: number;
    };

    export type Items = Asset.Fragment;
}

export namespace CreateAssets {
    export type Variables = {
        input: CreateAssetInput[];
    };

    export type Mutation = {
        __typename?: 'Mutation';
        createAssets: CreateAssets[];
    };

    export type CreateAssets = Asset.Fragment;
}

export namespace GetProductCategoryList {
    export type Variables = {
        options?: ProductCategoryListOptions | null;
        languageCode?: LanguageCode | null;
    };

    export type Query = {
        __typename?: 'Query';
        productCategories: ProductCategories;
    };

    export type ProductCategories = {
        __typename?: 'ProductCategoryList';
        items: Items[];
        totalItems: number;
    };

    export type Items = {
        __typename?: 'ProductCategory';
        id: string;
        name: string;
        description: string;
        featuredAsset?: FeaturedAsset | null;
        facetValues: FacetValues[];
        parent: Parent;
    };

    export type FeaturedAsset = Asset.Fragment;

    export type FacetValues = {
        __typename?: 'FacetValue';
        id: string;
        code: string;
        name: string;
        facet: Facet;
    };

    export type Facet = {
        __typename?: 'Facet';
        id: string;
        name: string;
    };

    export type Parent = {
        __typename?: 'ProductCategory';
        id: string;
    };
}

export namespace GetProductCategory {
    export type Variables = {
        id: string;
        languageCode?: LanguageCode | null;
    };

    export type Query = {
        __typename?: 'Query';
        productCategory?: ProductCategory | null;
    };

    export type ProductCategory = ProductCategory.Fragment;
}

export namespace CreateProductCategory {
    export type Variables = {
        input: CreateProductCategoryInput;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        createProductCategory: CreateProductCategory;
    };

    export type CreateProductCategory = ProductCategory.Fragment;
}

export namespace UpdateProductCategory {
    export type Variables = {
        input: UpdateProductCategoryInput;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        updateProductCategory: UpdateProductCategory;
    };

    export type UpdateProductCategory = ProductCategory.Fragment;
}

export namespace MoveProductCategory {
    export type Variables = {
        input: MoveProductCategoryInput;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        moveProductCategory: MoveProductCategory;
    };

    export type MoveProductCategory = ProductCategory.Fragment;
}

export namespace GetPromotionList {
    export type Variables = {
        options?: PromotionListOptions | null;
    };

    export type Query = {
        __typename?: 'Query';
        promotions: Promotions;
    };

    export type Promotions = {
        __typename?: 'PromotionList';
        items: Items[];
        totalItems: number;
    };

    export type Items = Promotion.Fragment;
}

export namespace GetPromotion {
    export type Variables = {
        id: string;
    };

    export type Query = {
        __typename?: 'Query';
        promotion?: Promotion | null;
    };

    export type Promotion = Promotion.Fragment;
}

export namespace GetAdjustmentOperations {
    export type Variables = {};

    export type Query = {
        __typename?: 'Query';
        adjustmentOperations: AdjustmentOperations;
    };

    export type AdjustmentOperations = {
        __typename?: 'AdjustmentOperations';
        actions: Actions[];
        conditions: Conditions[];
    };

    export type Actions = AdjustmentOperation.Fragment;

    export type Conditions = AdjustmentOperation.Fragment;
}

export namespace CreatePromotion {
    export type Variables = {
        input: CreatePromotionInput;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        createPromotion: CreatePromotion;
    };

    export type CreatePromotion = Promotion.Fragment;
}

export namespace UpdatePromotion {
    export type Variables = {
        input: UpdatePromotionInput;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        updatePromotion: UpdatePromotion;
    };

    export type UpdatePromotion = Promotion.Fragment;
}

export namespace GetCountryList {
    export type Variables = {
        options?: CountryListOptions | null;
    };

    export type Query = {
        __typename?: 'Query';
        countries: Countries;
    };

    export type Countries = {
        __typename?: 'CountryList';
        items: Items[];
        totalItems: number;
    };

    export type Items = {
        __typename?: 'Country';
        id: string;
        code: string;
        name: string;
        enabled: boolean;
    };
}

export namespace GetCountry {
    export type Variables = {
        id: string;
    };

    export type Query = {
        __typename?: 'Query';
        country?: Country | null;
    };

    export type Country = Country.Fragment;
}

export namespace CreateCountry {
    export type Variables = {
        input: CreateCountryInput;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        createCountry: CreateCountry;
    };

    export type CreateCountry = Country.Fragment;
}

export namespace UpdateCountry {
    export type Variables = {
        input: UpdateCountryInput;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        updateCountry: UpdateCountry;
    };

    export type UpdateCountry = Country.Fragment;
}

export namespace GetZones {
    export type Variables = {};

    export type Query = {
        __typename?: 'Query';
        zones: Zones[];
    };

    export type Zones = {
        __typename?: 'Zone';
        id: string;
        name: string;
        members: Members[];
    };

    export type Members = {
        __typename?: 'Country';
        id: string;
        name: string;
        code: string;
    };
}

export namespace GetZone {
    export type Variables = {
        id: string;
    };

    export type Query = {
        __typename?: 'Query';
        zone?: Zone | null;
    };

    export type Zone = Zone.Fragment;
}

export namespace CreateZone {
    export type Variables = {
        input: CreateZoneInput;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        createZone: CreateZone;
    };

    export type CreateZone = Zone.Fragment;
}

export namespace UpdateZone {
    export type Variables = {
        input: UpdateZoneInput;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        updateZone: UpdateZone;
    };

    export type UpdateZone = Zone.Fragment;
}

export namespace AddMembersToZone {
    export type Variables = {
        zoneId: string;
        memberIds: string[];
    };

    export type Mutation = {
        __typename?: 'Mutation';
        addMembersToZone: AddMembersToZone;
    };

    export type AddMembersToZone = Zone.Fragment;
}

export namespace RemoveMembersFromZone {
    export type Variables = {
        zoneId: string;
        memberIds: string[];
    };

    export type Mutation = {
        __typename?: 'Mutation';
        removeMembersFromZone: RemoveMembersFromZone;
    };

    export type RemoveMembersFromZone = Zone.Fragment;
}

export namespace GetTaxCategories {
    export type Variables = {};

    export type Query = {
        __typename?: 'Query';
        taxCategories: TaxCategories[];
    };

    export type TaxCategories = TaxCategory.Fragment;
}

export namespace GetTaxCategory {
    export type Variables = {
        id: string;
    };

    export type Query = {
        __typename?: 'Query';
        taxCategory?: TaxCategory | null;
    };

    export type TaxCategory = TaxCategory.Fragment;
}

export namespace CreateTaxCategory {
    export type Variables = {
        input: CreateTaxCategoryInput;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        createTaxCategory: CreateTaxCategory;
    };

    export type CreateTaxCategory = TaxCategory.Fragment;
}

export namespace UpdateTaxCategory {
    export type Variables = {
        input: UpdateTaxCategoryInput;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        updateTaxCategory: UpdateTaxCategory;
    };

    export type UpdateTaxCategory = TaxCategory.Fragment;
}

export namespace GetTaxRateList {
    export type Variables = {
        options?: TaxRateListOptions | null;
    };

    export type Query = {
        __typename?: 'Query';
        taxRates: TaxRates;
    };

    export type TaxRates = {
        __typename?: 'TaxRateList';
        items: Items[];
        totalItems: number;
    };

    export type Items = TaxRate.Fragment;
}

export namespace GetTaxRate {
    export type Variables = {
        id: string;
    };

    export type Query = {
        __typename?: 'Query';
        taxRate?: TaxRate | null;
    };

    export type TaxRate = TaxRate.Fragment;
}

export namespace CreateTaxRate {
    export type Variables = {
        input: CreateTaxRateInput;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        createTaxRate: CreateTaxRate;
    };

    export type CreateTaxRate = TaxRate.Fragment;
}

export namespace UpdateTaxRate {
    export type Variables = {
        input: UpdateTaxRateInput;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        updateTaxRate: UpdateTaxRate;
    };

    export type UpdateTaxRate = TaxRate.Fragment;
}

export namespace GetChannels {
    export type Variables = {};

    export type Query = {
        __typename?: 'Query';
        channels: Channels[];
    };

    export type Channels = Channel.Fragment;
}

export namespace GetChannel {
    export type Variables = {
        id: string;
    };

    export type Query = {
        __typename?: 'Query';
        channel?: Channel | null;
    };

    export type Channel = Channel.Fragment;
}

export namespace GetActiveChannel {
    export type Variables = {};

    export type Query = {
        __typename?: 'Query';
        activeChannel: ActiveChannel;
    };

    export type ActiveChannel = Channel.Fragment;
}

export namespace CreateChannel {
    export type Variables = {
        input: CreateChannelInput;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        createChannel: CreateChannel;
    };

    export type CreateChannel = Channel.Fragment;
}

export namespace UpdateChannel {
    export type Variables = {
        input: UpdateChannelInput;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        updateChannel: UpdateChannel;
    };

    export type UpdateChannel = Channel.Fragment;
}

export namespace GetPaymentMethodList {
    export type Variables = {
        options: PaymentMethodListOptions;
    };

    export type Query = {
        __typename?: 'Query';
        paymentMethods: PaymentMethods;
    };

    export type PaymentMethods = {
        __typename?: 'PaymentMethodList';
        items: Items[];
        totalItems: number;
    };

    export type Items = PaymentMethod.Fragment;
}

export namespace GetPaymentMethod {
    export type Variables = {
        id: string;
    };

    export type Query = {
        __typename?: 'Query';
        paymentMethod?: PaymentMethod | null;
    };

    export type PaymentMethod = PaymentMethod.Fragment;
}

export namespace UpdatePaymentMethod {
    export type Variables = {
        input: UpdatePaymentMethodInput;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        updatePaymentMethod: UpdatePaymentMethod;
    };

    export type UpdatePaymentMethod = PaymentMethod.Fragment;
}

export namespace GetShippingMethodList {
    export type Variables = {
        options?: ShippingMethodListOptions | null;
    };

    export type Query = {
        __typename?: 'Query';
        shippingMethods: ShippingMethods;
    };

    export type ShippingMethods = {
        __typename?: 'ShippingMethodList';
        items: Items[];
        totalItems: number;
    };

    export type Items = ShippingMethod.Fragment;
}

export namespace GetShippingMethod {
    export type Variables = {
        id: string;
    };

    export type Query = {
        __typename?: 'Query';
        shippingMethod?: ShippingMethod | null;
    };

    export type ShippingMethod = ShippingMethod.Fragment;
}

export namespace GetShippingMethodOperations {
    export type Variables = {};

    export type Query = {
        __typename?: 'Query';
        shippingEligibilityCheckers: ShippingEligibilityCheckers[];
        shippingCalculators: ShippingCalculators[];
    };

    export type ShippingEligibilityCheckers = AdjustmentOperation.Fragment;

    export type ShippingCalculators = AdjustmentOperation.Fragment;
}

export namespace CreateShippingMethod {
    export type Variables = {
        input: CreateShippingMethodInput;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        createShippingMethod: CreateShippingMethod;
    };

    export type CreateShippingMethod = ShippingMethod.Fragment;
}

export namespace UpdateShippingMethod {
    export type Variables = {
        input: UpdateShippingMethodInput;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        updateShippingMethod: UpdateShippingMethod;
    };

    export type UpdateShippingMethod = ShippingMethod.Fragment;
}

export namespace Administrator {
    export type Fragment = {
        __typename?: 'Administrator';
        id: string;
        firstName: string;
        lastName: string;
        emailAddress: string;
        user: User;
    };

    export type User = {
        __typename?: 'User';
        id: string;
        identifier: string;
        lastLogin?: string | null;
        roles: Roles[];
    };

    export type Roles = {
        __typename?: 'Role';
        id: string;
        code: string;
        description: string;
        permissions: Permission[];
    };
}

export namespace Role {
    export type Fragment = {
        __typename?: 'Role';
        id: string;
        code: string;
        description: string;
        permissions: Permission[];
        channels: Channels[];
    };

    export type Channels = {
        __typename?: 'Channel';
        id: string;
        code: string;
        token: string;
    };
}

export namespace CurrentUser {
    export type Fragment = {
        __typename?: 'CurrentUser';
        id: string;
        identifier: string;
        channelTokens: string[];
    };
}

export namespace Address {
    export type Fragment = {
        __typename?: 'Address';
        id: string;
        fullName?: string | null;
        streetLine1?: string | null;
        streetLine2?: string | null;
        city?: string | null;
        province?: string | null;
        postalCode?: string | null;
        country?: string | null;
        phoneNumber?: string | null;
        defaultShippingAddress?: boolean | null;
        defaultBillingAddress?: boolean | null;
    };
}

export namespace Customer {
    export type Fragment = {
        __typename?: 'Customer';
        id: string;
        title?: string | null;
        firstName: string;
        lastName: string;
        phoneNumber?: string | null;
        emailAddress: string;
        user?: User | null;
        addresses?: Addresses[] | null;
    };

    export type User = {
        __typename?: 'User';
        id: string;
        identifier: string;
        verified: boolean;
        lastLogin?: string | null;
    };

    export type Addresses = Address.Fragment;
}

export namespace FacetValue {
    export type Fragment = {
        __typename?: 'FacetValue';
        id: string;
        languageCode: LanguageCode;
        code: string;
        name: string;
        translations: Translations[];
        facet: Facet;
    };

    export type Translations = {
        __typename?: 'FacetValueTranslation';
        id: string;
        languageCode: LanguageCode;
        name: string;
    };

    export type Facet = {
        __typename?: 'Facet';
        id: string;
        name: string;
    };
}

export namespace FacetWithValues {
    export type Fragment = {
        __typename?: 'Facet';
        id: string;
        languageCode: LanguageCode;
        code: string;
        name: string;
        translations: Translations[];
        values: Values[];
    };

    export type Translations = {
        __typename?: 'FacetTranslation';
        id: string;
        languageCode: LanguageCode;
        name: string;
    };

    export type Values = FacetValue.Fragment;
}

export namespace Adjustment {
    export type Fragment = {
        __typename?: 'Adjustment';
        adjustmentSource: string;
        amount: number;
        description: string;
        type: AdjustmentType;
    };
}

export namespace ShippingAddress {
    export type Fragment = {
        __typename?: 'ShippingAddress';
        fullName?: string | null;
        company?: string | null;
        streetLine1?: string | null;
        streetLine2?: string | null;
        city?: string | null;
        province?: string | null;
        postalCode?: string | null;
        country?: string | null;
        phoneNumber?: string | null;
    };
}

export namespace Order {
    export type Fragment = {
        __typename?: 'Order';
        id: string;
        createdAt: DateTime;
        updatedAt: DateTime;
        code: string;
        state: string;
        total: number;
        customer?: Customer | null;
    };

    export type Customer = {
        __typename?: 'Customer';
        id: string;
        firstName: string;
        lastName: string;
    };
}

export namespace OrderWithLines {
    export type Fragment = {
        __typename?: 'Order';
        id: string;
        createdAt: DateTime;
        updatedAt: DateTime;
        code: string;
        state: string;
        active: boolean;
        customer?: Customer | null;
        lines: Lines[];
        adjustments: Adjustments[];
        subTotal: number;
        subTotalBeforeTax: number;
        totalBeforeTax: number;
        shipping: number;
        shippingMethod?: ShippingMethod | null;
        shippingAddress?: ShippingAddress | null;
        payments?: Payments[] | null;
        total: number;
    };

    export type Customer = {
        __typename?: 'Customer';
        id: string;
        firstName: string;
        lastName: string;
    };

    export type Lines = {
        __typename?: 'OrderLine';
        id: string;
        featuredAsset?: FeaturedAsset | null;
        productVariant: ProductVariant;
        unitPrice: number;
        unitPriceWithTax: number;
        quantity: number;
        items: Items[];
        totalPrice: number;
    };

    export type FeaturedAsset = {
        __typename?: 'Asset';
        preview: string;
    };

    export type ProductVariant = {
        __typename?: 'ProductVariant';
        id: string;
        name: string;
        sku: string;
    };

    export type Items = {
        __typename?: 'OrderItem';
        id: string;
        unitPrice: number;
        unitPriceIncludesTax: boolean;
        unitPriceWithTax: number;
        taxRate: number;
    };

    export type Adjustments = Adjustment.Fragment;

    export type ShippingMethod = {
        __typename?: 'ShippingMethod';
        id: string;
        code: string;
        description: string;
    };

    export type ShippingAddress = ShippingAddress.Fragment;

    export type Payments = {
        __typename?: 'Payment';
        id: string;
        amount: number;
        method: string;
        state: string;
        metadata?: Json | null;
    };
}

export namespace Asset {
    export type Fragment = {
        __typename?: 'Asset';
        id: string;
        name: string;
        fileSize: number;
        mimeType: string;
        type: AssetType;
        preview: string;
        source: string;
    };
}

export namespace ProductVariant {
    export type Fragment = {
        __typename?: 'ProductVariant';
        id: string;
        languageCode: LanguageCode;
        name: string;
        price: number;
        priceIncludesTax: boolean;
        priceWithTax: number;
        taxRateApplied: TaxRateApplied;
        taxCategory: TaxCategory;
        sku: string;
        options: Options[];
        facetValues: FacetValues[];
        featuredAsset?: FeaturedAsset | null;
        assets: Assets[];
        translations: Translations[];
    };

    export type TaxRateApplied = {
        __typename?: 'TaxRate';
        id: string;
        name: string;
        value: number;
    };

    export type TaxCategory = {
        __typename?: 'TaxCategory';
        id: string;
        name: string;
    };

    export type Options = {
        __typename?: 'ProductOption';
        id: string;
        code?: string | null;
        languageCode?: LanguageCode | null;
        name?: string | null;
    };

    export type FacetValues = {
        __typename?: 'FacetValue';
        id: string;
        code: string;
        name: string;
        facet: Facet;
    };

    export type Facet = {
        __typename?: 'Facet';
        id: string;
        name: string;
    };

    export type FeaturedAsset = Asset.Fragment;

    export type Assets = Asset.Fragment;

    export type Translations = {
        __typename?: 'ProductVariantTranslation';
        id: string;
        languageCode: LanguageCode;
        name: string;
    };
}

export namespace ProductWithVariants {
    export type Fragment = {
        __typename?: 'Product';
        id: string;
        languageCode: LanguageCode;
        name: string;
        slug: string;
        description: string;
        featuredAsset?: FeaturedAsset | null;
        assets: Assets[];
        translations: Translations[];
        optionGroups: OptionGroups[];
        variants: Variants[];
    };

    export type FeaturedAsset = Asset.Fragment;

    export type Assets = Asset.Fragment;

    export type Translations = {
        __typename?: 'ProductTranslation';
        languageCode: LanguageCode;
        name: string;
        slug: string;
        description: string;
    };

    export type OptionGroups = {
        __typename?: 'ProductOptionGroup';
        id: string;
        languageCode: LanguageCode;
        code: string;
        name: string;
    };

    export type Variants = ProductVariant.Fragment;
}

export namespace ProductOptionGroup {
    export type Fragment = {
        __typename?: 'ProductOptionGroup';
        id: string;
        languageCode: LanguageCode;
        code: string;
        name: string;
        translations: Translations[];
        options: Options[];
    };

    export type Translations = {
        __typename?: 'ProductOptionGroupTranslation';
        name: string;
    };

    export type Options = {
        __typename?: 'ProductOption';
        id: string;
        languageCode?: LanguageCode | null;
        name?: string | null;
        code?: string | null;
        translations: _Translations[];
    };

    export type _Translations = {
        __typename?: 'ProductOptionTranslation';
        name: string;
    };
}

export namespace ProductCategory {
    export type Fragment = {
        __typename?: 'ProductCategory';
        id: string;
        name: string;
        description: string;
        languageCode?: LanguageCode | null;
        featuredAsset?: FeaturedAsset | null;
        assets: Assets[];
        facetValues: FacetValues[];
        translations: Translations[];
        parent: Parent;
        children?: Children[] | null;
    };

    export type FeaturedAsset = Asset.Fragment;

    export type Assets = Asset.Fragment;

    export type FacetValues = {
        __typename?: 'FacetValue';
        id: string;
        name: string;
        code: string;
    };

    export type Translations = {
        __typename?: 'ProductCategoryTranslation';
        id: string;
        languageCode: LanguageCode;
        name: string;
        description: string;
    };

    export type Parent = {
        __typename?: 'ProductCategory';
        id: string;
        name: string;
    };

    export type Children = {
        __typename?: 'ProductCategory';
        id: string;
        name: string;
    };
}

export namespace AdjustmentOperation {
    export type Fragment = {
        __typename?: 'AdjustmentOperation';
        args: Args[];
        code: string;
        description: string;
    };

    export type Args = {
        __typename?: 'ConfigArg';
        name: string;
        type: string;
        value?: string | null;
    };
}

export namespace Promotion {
    export type Fragment = {
        __typename?: 'Promotion';
        id: string;
        createdAt: DateTime;
        updatedAt: DateTime;
        name: string;
        enabled: boolean;
        conditions: Conditions[];
        actions: Actions[];
    };

    export type Conditions = AdjustmentOperation.Fragment;

    export type Actions = AdjustmentOperation.Fragment;
}

export namespace Country {
    export type Fragment = {
        __typename?: 'Country';
        id: string;
        code: string;
        name: string;
        enabled: boolean;
        translations: Translations[];
    };

    export type Translations = {
        __typename?: 'CountryTranslation';
        id: string;
        languageCode: LanguageCode;
        name: string;
    };
}

export namespace Zone {
    export type Fragment = {
        __typename?: 'Zone';
        id: string;
        name: string;
        members: Members[];
    };

    export type Members = Country.Fragment;
}

export namespace TaxCategory {
    export type Fragment = {
        __typename?: 'TaxCategory';
        id: string;
        name: string;
    };
}

export namespace TaxRate {
    export type Fragment = {
        __typename?: 'TaxRate';
        id: string;
        name: string;
        enabled: boolean;
        value: number;
        category: Category;
        zone: Zone;
        customerGroup?: CustomerGroup | null;
    };

    export type Category = {
        __typename?: 'TaxCategory';
        id: string;
        name: string;
    };

    export type Zone = {
        __typename?: 'Zone';
        id: string;
        name: string;
    };

    export type CustomerGroup = {
        __typename?: 'CustomerGroup';
        id: string;
        name: string;
    };
}

export namespace Channel {
    export type Fragment = {
        __typename?: 'Channel';
        id: string;
        code: string;
        token: string;
        pricesIncludeTax: boolean;
        defaultLanguageCode: LanguageCode;
        defaultShippingZone?: DefaultShippingZone | null;
        defaultTaxZone?: DefaultTaxZone | null;
    };

    export type DefaultShippingZone = {
        __typename?: 'Zone';
        id: string;
        name: string;
    };

    export type DefaultTaxZone = {
        __typename?: 'Zone';
        id: string;
        name: string;
    };
}

export namespace PaymentMethod {
    export type Fragment = {
        __typename?: 'PaymentMethod';
        id: string;
        code: string;
        enabled: boolean;
        configArgs: ConfigArgs[];
    };

    export type ConfigArgs = {
        __typename?: 'ConfigArg';
        name: string;
        type: string;
        value?: string | null;
    };
}

export namespace ShippingMethod {
    export type Fragment = {
        __typename?: 'ShippingMethod';
        id: string;
        createdAt: DateTime;
        updatedAt: DateTime;
        code: string;
        description: string;
        checker: Checker;
        calculator: Calculator;
    };

    export type Checker = AdjustmentOperation.Fragment;

    export type Calculator = AdjustmentOperation.Fragment;
}
