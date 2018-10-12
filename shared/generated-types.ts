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

export interface Node {
    id: string;
}

export interface PaginatedList {
    items: Node[];
    totalItems: number;
}

export interface Query {
    adjustmentSource?: AdjustmentSource | null;
    adjustmentSources: AdjustmentSourceList;
    adjustmentOperations: AdjustmentOperations;
    administrators: AdministratorList;
    administrator?: Administrator | null;
    assets: AssetList;
    asset?: Asset | null;
    me?: CurrentUser | null;
    config: Config;
    countries: CountryList;
    country?: Country | null;
    customerGroups: CustomerGroup[];
    customerGroup?: CustomerGroup | null;
    customers: CustomerList;
    customer?: Customer | null;
    facets: FacetList;
    facet?: Facet | null;
    order?: Order | null;
    activeOrder?: Order | null;
    orders: OrderList;
    productOptionGroups: ProductOptionGroup[];
    productOptionGroup?: ProductOptionGroup | null;
    products: ProductList;
    product?: Product | null;
    roles: RoleList;
    role?: Role | null;
    taxCategories: TaxCategory[];
    taxCategory?: TaxCategory | null;
    zones: Zone[];
    zone?: Zone | null;
    networkStatus: NetworkStatus;
    userStatus: UserStatus;
    uiState: UiState;
}

export interface AdjustmentSource extends Node {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    name: string;
    type: AdjustmentType;
    enabled: boolean;
    conditions: AdjustmentOperation[];
    actions: AdjustmentOperation[];
}

export interface AdjustmentOperation {
    type: AdjustmentType;
    code: string;
    args: AdjustmentArg[];
    description: string;
}

export interface AdjustmentArg {
    name: string;
    type: string;
    value?: string | null;
}

export interface AdjustmentSourceList extends PaginatedList {
    items: AdjustmentSource[];
    totalItems: number;
}

export interface AdjustmentOperations {
    conditions: AdjustmentOperation[];
    actions: AdjustmentOperation[];
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
    roles: Role[];
    lastLogin?: string | null;
    customFields?: Json | null;
}

export interface Role extends Node {
    id: string;
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

export interface Country extends Node {
    id: string;
    code: string;
    name: string;
    enabled: boolean;
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
    customFields?: FacetCustomFields | null;
}

export interface FacetValue extends Node {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    languageCode?: LanguageCode | null;
    name: string;
    code: string;
    translations: FacetValueTranslation[];
    customFields?: FacetValueCustomFields | null;
}

export interface FacetValueTranslation {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    languageCode: LanguageCode;
    name: string;
}

export interface FacetValueCustomFields {
    link?: string | null;
    available?: boolean | null;
}

export interface FacetTranslation {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    languageCode: LanguageCode;
    name: string;
}

export interface FacetCustomFields {
    searchable?: boolean | null;
}

export interface Order extends Node {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    code: string;
    customer?: Customer | null;
    items: OrderItem[];
    adjustments: Adjustment[];
    totalPrice: number;
}

export interface OrderItem extends Node {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    productVariant: ProductVariant;
    adjustments: Adjustment[];
    featuredAsset?: Asset | null;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    order: Order;
}

export interface ProductVariant extends Node {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    languageCode: LanguageCode;
    sku: string;
    name: string;
    price: number;
    taxCategory: TaxCategory;
    options: ProductOption[];
    facetValues: FacetValue[];
    translations: ProductVariantTranslation[];
    customFields?: Json | null;
}

export interface TaxCategory extends Node {
    id: string;
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

export interface Adjustment {
    adjustmentSourceId: string;
    description: string;
    amount: number;
}

export interface OrderList extends PaginatedList {
    items: Order[];
    totalItems: number;
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
    customFields?: ProductCustomFields | null;
}

export interface ProductTranslation {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    languageCode: LanguageCode;
    name: string;
    slug: string;
    description: string;
    customFields?: ProductTranslationCustomFields | null;
}

export interface ProductTranslationCustomFields {
    nickname?: string | null;
}

export interface ProductCustomFields {
    infoUrl?: string | null;
    downloadable?: boolean | null;
    nickname?: string | null;
}

export interface RoleList extends PaginatedList {
    items: Role[];
    totalItems: number;
}

export interface Zone extends Node {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    name: string;
    members: Country[];
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
    createAdjustmentSource: AdjustmentSource;
    updateAdjustmentSource: AdjustmentSource;
    createAdministrator: Administrator;
    updateAdministrator: Administrator;
    assignRoleToAdministrator: Administrator;
    createAssets: Asset[];
    login: LoginResult;
    logout: boolean;
    createChannel: Channel;
    createCountry: Country;
    updateCountry: Country;
    createCustomerGroup: CustomerGroup;
    updateCustomerGroup: CustomerGroup;
    addCustomersToGroup: CustomerGroup;
    removeCustomersFromGroup: CustomerGroup;
    createCustomer: Customer;
    createCustomerAddress: Address;
    createFacet: Facet;
    updateFacet: Facet;
    createFacetValues: FacetValue[];
    updateFacetValues: FacetValue[];
    addItemToOrder?: Order | null;
    removeItemFromOrder?: Order | null;
    adjustItemQuantity?: Order | null;
    createProductOptionGroup: ProductOptionGroup;
    updateProductOptionGroup: ProductOptionGroup;
    createProduct: Product;
    updateProduct: Product;
    addOptionGroupToProduct: Product;
    removeOptionGroupFromProduct: Product;
    generateVariantsForProduct: Product;
    updateProductVariants: (ProductVariant | null)[];
    applyFacetValuesToProductVariants: ProductVariant[];
    createRole: Role;
    updateRole: Role;
    createTaxCategory: TaxCategory;
    updateTaxCategory: TaxCategory;
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

export interface AdjustmentSourceListOptions {
    take?: number | null;
    skip?: number | null;
    sort?: AdjustmentSourceSortParameter | null;
    filter?: AdjustmentSourceFilterParameter | null;
}

export interface AdjustmentSourceSortParameter {
    id?: SortOrder | null;
    createdAt?: SortOrder | null;
    updatedAt?: SortOrder | null;
    name?: SortOrder | null;
}

export interface AdjustmentSourceFilterParameter {
    name?: StringOperators | null;
    createdAt?: DateOperators | null;
    updatedAt?: DateOperators | null;
    type?: StringOperators | null;
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
    searchable?: SortOrder | null;
}

export interface FacetFilterParameter {
    name?: StringOperators | null;
    code?: StringOperators | null;
    createdAt?: DateOperators | null;
    updatedAt?: DateOperators | null;
    searchable?: BooleanOperators | null;
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
    infoUrl?: SortOrder | null;
    downloadable?: SortOrder | null;
    nickname?: SortOrder | null;
}

export interface ProductFilterParameter {
    name?: StringOperators | null;
    slug?: StringOperators | null;
    description?: StringOperators | null;
    createdAt?: DateOperators | null;
    updatedAt?: DateOperators | null;
    infoUrl?: StringOperators | null;
    downloadable?: BooleanOperators | null;
    nickname?: StringOperators | null;
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

export interface CreateAdjustmentSourceInput {
    name: string;
    type: AdjustmentType;
    enabled: boolean;
    conditions: AdjustmentOperationInput[];
    actions: AdjustmentOperationInput[];
}

export interface AdjustmentOperationInput {
    code: string;
    arguments: string[];
}

export interface UpdateAdjustmentSourceInput {
    id: string;
    name?: string | null;
    enabled?: boolean | null;
    conditions?: AdjustmentOperationInput[] | null;
    actions?: AdjustmentOperationInput[] | null;
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

export interface CreateCountryInput {
    code: string;
    name: string;
    enabled: boolean;
}

export interface UpdateCountryInput {
    id: string;
    code?: string | null;
    name?: string | null;
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
    firstName: string;
    lastName: string;
    phoneNumber?: string | null;
    emailAddress: string;
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

export interface CreateFacetInput {
    code: string;
    translations: FacetTranslationInput[];
    values?: CreateFacetValueWithFacetInput[] | null;
    customFields?: CreateFacetCustomFieldsInput | null;
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

export interface CreateFacetCustomFieldsInput {
    searchable?: boolean | null;
}

export interface UpdateFacetInput {
    id: string;
    code?: string | null;
    translations?: FacetTranslationInput[] | null;
    customFields?: UpdateFacetCustomFieldsInput | null;
}

export interface UpdateFacetCustomFieldsInput {
    searchable?: boolean | null;
}

export interface CreateFacetValueInput {
    facetId: string;
    code: string;
    translations: FacetValueTranslationInput[];
    customFields?: CreateFacetValueCustomFieldsInput | null;
}

export interface CreateFacetValueCustomFieldsInput {
    link?: string | null;
    available?: boolean | null;
}

export interface UpdateFacetValueInput {
    id: string;
    code?: string | null;
    translations?: FacetValueTranslationInput[] | null;
    customFields?: UpdateFacetValueCustomFieldsInput | null;
}

export interface UpdateFacetValueCustomFieldsInput {
    link?: string | null;
    available?: boolean | null;
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
    customFields?: CreateProductCustomFieldsInput | null;
}

export interface ProductTranslationInput {
    id?: string | null;
    languageCode: LanguageCode;
    name?: string | null;
    slug?: string | null;
    description?: string | null;
    customFields?: ProductTranslationCustomFieldsInput | null;
}

export interface ProductTranslationCustomFieldsInput {
    nickname?: string | null;
}

export interface CreateProductCustomFieldsInput {
    infoUrl?: string | null;
    downloadable?: boolean | null;
}

export interface UpdateProductInput {
    id: string;
    featuredAssetId?: string | null;
    assetIds?: string[] | null;
    translations?: ProductTranslationInput[] | null;
    customFields?: UpdateProductCustomFieldsInput | null;
}

export interface UpdateProductCustomFieldsInput {
    infoUrl?: string | null;
    downloadable?: boolean | null;
}

export interface UpdateProductVariantInput {
    id: string;
    translations?: ProductVariantTranslationInput[] | null;
    sku?: string | null;
    taxCategoryId?: string | null;
    price?: number | null;
    customFields?: Json | null;
}

export interface ProductVariantTranslationInput {
    id?: string | null;
    languageCode: LanguageCode;
    name?: string | null;
    customFields?: Json | null;
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

export interface CreateTaxCategoryInput {
    name: string;
}

export interface UpdateTaxCategoryInput {
    id: string;
    name?: string | null;
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
    optionCodes?: string[] | null;
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
export interface AdjustmentSourceQueryArgs {
    id: string;
}
export interface AdjustmentSourcesQueryArgs {
    type: AdjustmentType;
    options?: AdjustmentSourceListOptions | null;
}
export interface AdjustmentOperationsQueryArgs {
    type: AdjustmentType;
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
export interface OrdersQueryArgs {
    options?: OrderListOptions | null;
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
export interface RolesQueryArgs {
    options?: RoleListOptions | null;
}
export interface RoleQueryArgs {
    id: string;
}
export interface TaxCategoryQueryArgs {
    id: string;
}
export interface ZoneQueryArgs {
    id: string;
}
export interface CreateAdjustmentSourceMutationArgs {
    input: CreateAdjustmentSourceInput;
}
export interface UpdateAdjustmentSourceMutationArgs {
    input: UpdateAdjustmentSourceInput;
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
export interface CreateChannelMutationArgs {
    code: string;
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
export interface CreateCustomerAddressMutationArgs {
    customerId: string;
    input: CreateAddressInput;
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
export interface ApplyFacetValuesToProductVariantsMutationArgs {
    facetValueIds: string[];
    productVariantIds: string[];
}
export interface CreateRoleMutationArgs {
    input: CreateRoleInput;
}
export interface UpdateRoleMutationArgs {
    input: UpdateRoleInput;
}
export interface CreateTaxCategoryMutationArgs {
    input: CreateTaxCategoryInput;
}
export interface UpdateTaxCategoryMutationArgs {
    input: UpdateTaxCategoryInput;
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

export enum AdjustmentType {
    TAX = 'TAX',
    PROMOTION = 'PROMOTION',
    SHIPPING = 'SHIPPING',
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
    CreateAdjustmentSource = 'CreateAdjustmentSource',
    ReadAdjustmentSource = 'ReadAdjustmentSource',
    UpdateAdjustmentSource = 'UpdateAdjustmentSource',
    DeleteAdjustmentSource = 'DeleteAdjustmentSource',
    CreateSettings = 'CreateSettings',
    ReadSettings = 'ReadSettings',
    UpdateSettings = 'UpdateSettings',
    DeleteSettings = 'DeleteSettings',
}

export enum AssetType {
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO',
    BINARY = 'BINARY',
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

export namespace QueryResolvers {
    export interface Resolvers<Context = any> {
        adjustmentSource?: AdjustmentSourceResolver<AdjustmentSource | null, any, Context>;
        adjustmentSources?: AdjustmentSourcesResolver<AdjustmentSourceList, any, Context>;
        adjustmentOperations?: AdjustmentOperationsResolver<AdjustmentOperations, any, Context>;
        administrators?: AdministratorsResolver<AdministratorList, any, Context>;
        administrator?: AdministratorResolver<Administrator | null, any, Context>;
        assets?: AssetsResolver<AssetList, any, Context>;
        asset?: AssetResolver<Asset | null, any, Context>;
        me?: MeResolver<CurrentUser | null, any, Context>;
        config?: ConfigResolver<Config, any, Context>;
        countries?: CountriesResolver<CountryList, any, Context>;
        country?: CountryResolver<Country | null, any, Context>;
        customerGroups?: CustomerGroupsResolver<CustomerGroup[], any, Context>;
        customerGroup?: CustomerGroupResolver<CustomerGroup | null, any, Context>;
        customers?: CustomersResolver<CustomerList, any, Context>;
        customer?: CustomerResolver<Customer | null, any, Context>;
        facets?: FacetsResolver<FacetList, any, Context>;
        facet?: FacetResolver<Facet | null, any, Context>;
        order?: OrderResolver<Order | null, any, Context>;
        activeOrder?: ActiveOrderResolver<Order | null, any, Context>;
        orders?: OrdersResolver<OrderList, any, Context>;
        productOptionGroups?: ProductOptionGroupsResolver<ProductOptionGroup[], any, Context>;
        productOptionGroup?: ProductOptionGroupResolver<ProductOptionGroup | null, any, Context>;
        products?: ProductsResolver<ProductList, any, Context>;
        product?: ProductResolver<Product | null, any, Context>;
        roles?: RolesResolver<RoleList, any, Context>;
        role?: RoleResolver<Role | null, any, Context>;
        taxCategories?: TaxCategoriesResolver<TaxCategory[], any, Context>;
        taxCategory?: TaxCategoryResolver<TaxCategory | null, any, Context>;
        zones?: ZonesResolver<Zone[], any, Context>;
        zone?: ZoneResolver<Zone | null, any, Context>;
        networkStatus?: NetworkStatusResolver<NetworkStatus, any, Context>;
        userStatus?: UserStatusResolver<UserStatus, any, Context>;
        uiState?: UiStateResolver<UiState, any, Context>;
    }

    export type AdjustmentSourceResolver<R = AdjustmentSource | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        AdjustmentSourceArgs
    >;
    export interface AdjustmentSourceArgs {
        id: string;
    }

    export type AdjustmentSourcesResolver<R = AdjustmentSourceList, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        AdjustmentSourcesArgs
    >;
    export interface AdjustmentSourcesArgs {
        type: AdjustmentType;
        options?: AdjustmentSourceListOptions | null;
    }

    export type AdjustmentOperationsResolver<
        R = AdjustmentOperations,
        Parent = any,
        Context = any
    > = Resolver<R, Parent, Context, AdjustmentOperationsArgs>;
    export interface AdjustmentOperationsArgs {
        type: AdjustmentType;
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
    export type OrdersResolver<R = OrderList, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        OrdersArgs
    >;
    export interface OrdersArgs {
        options?: OrderListOptions | null;
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

export namespace AdjustmentSourceResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        createdAt?: CreatedAtResolver<DateTime, any, Context>;
        updatedAt?: UpdatedAtResolver<DateTime, any, Context>;
        name?: NameResolver<string, any, Context>;
        type?: TypeResolver<AdjustmentType, any, Context>;
        enabled?: EnabledResolver<boolean, any, Context>;
        conditions?: ConditionsResolver<AdjustmentOperation[], any, Context>;
        actions?: ActionsResolver<AdjustmentOperation[], any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CreatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UpdatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type NameResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type TypeResolver<R = AdjustmentType, Parent = any, Context = any> = Resolver<R, Parent, Context>;
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

export namespace AdjustmentOperationResolvers {
    export interface Resolvers<Context = any> {
        type?: TypeResolver<AdjustmentType, any, Context>;
        code?: CodeResolver<string, any, Context>;
        args?: ArgsResolver<AdjustmentArg[], any, Context>;
        description?: DescriptionResolver<string, any, Context>;
    }

    export type TypeResolver<R = AdjustmentType, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CodeResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type ArgsResolver<R = AdjustmentArg[], Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type DescriptionResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace AdjustmentArgResolvers {
    export interface Resolvers<Context = any> {
        name?: NameResolver<string, any, Context>;
        type?: TypeResolver<string, any, Context>;
        value?: ValueResolver<string | null, any, Context>;
    }

    export type NameResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type TypeResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type ValueResolver<R = string | null, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace AdjustmentSourceListResolvers {
    export interface Resolvers<Context = any> {
        items?: ItemsResolver<AdjustmentSource[], any, Context>;
        totalItems?: TotalItemsResolver<number, any, Context>;
    }

    export type ItemsResolver<R = AdjustmentSource[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
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
        roles?: RolesResolver<Role[], any, Context>;
        lastLogin?: LastLoginResolver<string | null, any, Context>;
        customFields?: CustomFieldsResolver<Json | null, any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CreatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UpdatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type IdentifierResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type PasswordHashResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
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
        code?: CodeResolver<string, any, Context>;
        description?: DescriptionResolver<string, any, Context>;
        permissions?: PermissionsResolver<Permission[], any, Context>;
        channels?: ChannelsResolver<Channel[], any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
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
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CreatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UpdatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CodeResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type TokenResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
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

export namespace CountryResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        code?: CodeResolver<string, any, Context>;
        name?: NameResolver<string, any, Context>;
        enabled?: EnabledResolver<boolean, any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CodeResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type NameResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type EnabledResolver<R = boolean, Parent = any, Context = any> = Resolver<R, Parent, Context>;
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
        customFields?: CustomFieldsResolver<FacetCustomFields | null, any, Context>;
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
    export type CustomFieldsResolver<R = FacetCustomFields | null, Parent = any, Context = any> = Resolver<
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
        languageCode?: LanguageCodeResolver<LanguageCode | null, any, Context>;
        name?: NameResolver<string, any, Context>;
        code?: CodeResolver<string, any, Context>;
        translations?: TranslationsResolver<FacetValueTranslation[], any, Context>;
        customFields?: CustomFieldsResolver<FacetValueCustomFields | null, any, Context>;
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
    export type CodeResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type TranslationsResolver<R = FacetValueTranslation[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type CustomFieldsResolver<
        R = FacetValueCustomFields | null,
        Parent = any,
        Context = any
    > = Resolver<R, Parent, Context>;
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

export namespace FacetValueCustomFieldsResolvers {
    export interface Resolvers<Context = any> {
        link?: LinkResolver<string | null, any, Context>;
        available?: AvailableResolver<boolean | null, any, Context>;
    }

    export type LinkResolver<R = string | null, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type AvailableResolver<R = boolean | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
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

export namespace FacetCustomFieldsResolvers {
    export interface Resolvers<Context = any> {
        searchable?: SearchableResolver<boolean | null, any, Context>;
    }

    export type SearchableResolver<R = boolean | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
}

export namespace OrderResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        createdAt?: CreatedAtResolver<DateTime, any, Context>;
        updatedAt?: UpdatedAtResolver<DateTime, any, Context>;
        code?: CodeResolver<string, any, Context>;
        customer?: CustomerResolver<Customer | null, any, Context>;
        items?: ItemsResolver<OrderItem[], any, Context>;
        adjustments?: AdjustmentsResolver<Adjustment[], any, Context>;
        totalPrice?: TotalPriceResolver<number, any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CreatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type UpdatedAtResolver<R = DateTime, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CodeResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type CustomerResolver<R = Customer | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type ItemsResolver<R = OrderItem[], Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type AdjustmentsResolver<R = Adjustment[], Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type TotalPriceResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace OrderItemResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        createdAt?: CreatedAtResolver<DateTime, any, Context>;
        updatedAt?: UpdatedAtResolver<DateTime, any, Context>;
        productVariant?: ProductVariantResolver<ProductVariant, any, Context>;
        adjustments?: AdjustmentsResolver<Adjustment[], any, Context>;
        featuredAsset?: FeaturedAssetResolver<Asset | null, any, Context>;
        unitPrice?: UnitPriceResolver<number, any, Context>;
        quantity?: QuantityResolver<number, any, Context>;
        totalPrice?: TotalPriceResolver<number, any, Context>;
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
    export type AdjustmentsResolver<R = Adjustment[], Parent = any, Context = any> = Resolver<
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
    export type QuantityResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type TotalPriceResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
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
        price?: PriceResolver<number, any, Context>;
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
    export type PriceResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
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

export namespace TaxCategoryResolvers {
    export interface Resolvers<Context = any> {
        id?: IdResolver<string, any, Context>;
        name?: NameResolver<string, any, Context>;
    }

    export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
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

export namespace AdjustmentResolvers {
    export interface Resolvers<Context = any> {
        adjustmentSourceId?: AdjustmentSourceIdResolver<string, any, Context>;
        description?: DescriptionResolver<string, any, Context>;
        amount?: AmountResolver<number, any, Context>;
    }

    export type AdjustmentSourceIdResolver<R = string, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type DescriptionResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type AmountResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}

export namespace OrderListResolvers {
    export interface Resolvers<Context = any> {
        items?: ItemsResolver<Order[], any, Context>;
        totalItems?: TotalItemsResolver<number, any, Context>;
    }

    export type ItemsResolver<R = Order[], Parent = any, Context = any> = Resolver<R, Parent, Context>;
    export type TotalItemsResolver<R = number, Parent = any, Context = any> = Resolver<R, Parent, Context>;
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
        customFields?: CustomFieldsResolver<ProductCustomFields | null, any, Context>;
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
    export type CustomFieldsResolver<R = ProductCustomFields | null, Parent = any, Context = any> = Resolver<
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
        customFields?: CustomFieldsResolver<ProductTranslationCustomFields | null, any, Context>;
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
    export type CustomFieldsResolver<
        R = ProductTranslationCustomFields | null,
        Parent = any,
        Context = any
    > = Resolver<R, Parent, Context>;
}

export namespace ProductTranslationCustomFieldsResolvers {
    export interface Resolvers<Context = any> {
        nickname?: NicknameResolver<string | null, any, Context>;
    }

    export type NicknameResolver<R = string | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
}

export namespace ProductCustomFieldsResolvers {
    export interface Resolvers<Context = any> {
        infoUrl?: InfoUrlResolver<string | null, any, Context>;
        downloadable?: DownloadableResolver<boolean | null, any, Context>;
        nickname?: NicknameResolver<string | null, any, Context>;
    }

    export type InfoUrlResolver<R = string | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type DownloadableResolver<R = boolean | null, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context
    >;
    export type NicknameResolver<R = string | null, Parent = any, Context = any> = Resolver<
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
        createAdjustmentSource?: CreateAdjustmentSourceResolver<AdjustmentSource, any, Context>;
        updateAdjustmentSource?: UpdateAdjustmentSourceResolver<AdjustmentSource, any, Context>;
        createAdministrator?: CreateAdministratorResolver<Administrator, any, Context>;
        updateAdministrator?: UpdateAdministratorResolver<Administrator, any, Context>;
        assignRoleToAdministrator?: AssignRoleToAdministratorResolver<Administrator, any, Context>;
        createAssets?: CreateAssetsResolver<Asset[], any, Context>;
        login?: LoginResolver<LoginResult, any, Context>;
        logout?: LogoutResolver<boolean, any, Context>;
        createChannel?: CreateChannelResolver<Channel, any, Context>;
        createCountry?: CreateCountryResolver<Country, any, Context>;
        updateCountry?: UpdateCountryResolver<Country, any, Context>;
        createCustomerGroup?: CreateCustomerGroupResolver<CustomerGroup, any, Context>;
        updateCustomerGroup?: UpdateCustomerGroupResolver<CustomerGroup, any, Context>;
        addCustomersToGroup?: AddCustomersToGroupResolver<CustomerGroup, any, Context>;
        removeCustomersFromGroup?: RemoveCustomersFromGroupResolver<CustomerGroup, any, Context>;
        createCustomer?: CreateCustomerResolver<Customer, any, Context>;
        createCustomerAddress?: CreateCustomerAddressResolver<Address, any, Context>;
        createFacet?: CreateFacetResolver<Facet, any, Context>;
        updateFacet?: UpdateFacetResolver<Facet, any, Context>;
        createFacetValues?: CreateFacetValuesResolver<FacetValue[], any, Context>;
        updateFacetValues?: UpdateFacetValuesResolver<FacetValue[], any, Context>;
        addItemToOrder?: AddItemToOrderResolver<Order | null, any, Context>;
        removeItemFromOrder?: RemoveItemFromOrderResolver<Order | null, any, Context>;
        adjustItemQuantity?: AdjustItemQuantityResolver<Order | null, any, Context>;
        createProductOptionGroup?: CreateProductOptionGroupResolver<ProductOptionGroup, any, Context>;
        updateProductOptionGroup?: UpdateProductOptionGroupResolver<ProductOptionGroup, any, Context>;
        createProduct?: CreateProductResolver<Product, any, Context>;
        updateProduct?: UpdateProductResolver<Product, any, Context>;
        addOptionGroupToProduct?: AddOptionGroupToProductResolver<Product, any, Context>;
        removeOptionGroupFromProduct?: RemoveOptionGroupFromProductResolver<Product, any, Context>;
        generateVariantsForProduct?: GenerateVariantsForProductResolver<Product, any, Context>;
        updateProductVariants?: UpdateProductVariantsResolver<(ProductVariant | null)[], any, Context>;
        applyFacetValuesToProductVariants?: ApplyFacetValuesToProductVariantsResolver<
            ProductVariant[],
            any,
            Context
        >;
        createRole?: CreateRoleResolver<Role, any, Context>;
        updateRole?: UpdateRoleResolver<Role, any, Context>;
        createTaxCategory?: CreateTaxCategoryResolver<TaxCategory, any, Context>;
        updateTaxCategory?: UpdateTaxCategoryResolver<TaxCategory, any, Context>;
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

    export type CreateAdjustmentSourceResolver<R = AdjustmentSource, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        CreateAdjustmentSourceArgs
    >;
    export interface CreateAdjustmentSourceArgs {
        input: CreateAdjustmentSourceInput;
    }

    export type UpdateAdjustmentSourceResolver<R = AdjustmentSource, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        UpdateAdjustmentSourceArgs
    >;
    export interface UpdateAdjustmentSourceArgs {
        input: UpdateAdjustmentSourceInput;
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
    export type CreateChannelResolver<R = Channel, Parent = any, Context = any> = Resolver<
        R,
        Parent,
        Context,
        CreateChannelArgs
    >;
    export interface CreateChannelArgs {
        code: string;
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

    export type ApplyFacetValuesToProductVariantsResolver<
        R = ProductVariant[],
        Parent = any,
        Context = any
    > = Resolver<R, Parent, Context, ApplyFacetValuesToProductVariantsArgs>;
    export interface ApplyFacetValuesToProductVariantsArgs {
        facetValueIds: string[];
        productVariantIds: string[];
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

export namespace GetAdjustmentSourceList {
    export type Variables = {
        type: AdjustmentType;
        options?: AdjustmentSourceListOptions | null;
    };

    export type Query = {
        __typename?: 'Query';
        adjustmentSources: AdjustmentSources;
    };

    export type AdjustmentSources = {
        __typename?: 'AdjustmentSourceList';
        items: Items[];
        totalItems: number;
    };

    export type Items = AdjustmentSource.Fragment;
}

export namespace GetAdjustmentSource {
    export type Variables = {
        id: string;
    };

    export type Query = {
        __typename?: 'Query';
        adjustmentSource?: AdjustmentSource | null;
    };

    export type AdjustmentSource = AdjustmentSource.Fragment;
}

export namespace GetAdjustmentOperations {
    export type Variables = {
        type: AdjustmentType;
    };

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

export namespace CreateAdjustmentSource {
    export type Variables = {
        input: CreateAdjustmentSourceInput;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        createAdjustmentSource: CreateAdjustmentSource;
    };

    export type CreateAdjustmentSource = AdjustmentSource.Fragment;
}

export namespace UpdateAdjustmentSource {
    export type Variables = {
        input: UpdateAdjustmentSourceInput;
    };

    export type Mutation = {
        __typename?: 'Mutation';
        updateAdjustmentSource: UpdateAdjustmentSource;
    };

    export type UpdateAdjustmentSource = AdjustmentSource.Fragment;
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

export namespace ApplyFacetValuesToProductVariants {
    export type Variables = {
        facetValueIds: string[];
        productVariantIds: string[];
    };

    export type Mutation = {
        __typename?: 'Mutation';
        applyFacetValuesToProductVariants: ApplyFacetValuesToProductVariants[];
    };

    export type ApplyFacetValuesToProductVariants = ProductVariant.Fragment;
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

    export type Items = Country.Fragment;
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

    export type Zones = Zone.Fragment;
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

export namespace AdjustmentOperation {
    export type Fragment = {
        __typename?: 'AdjustmentOperation';
        args: Args[];
        code: string;
        description: string;
        type: AdjustmentType;
    };

    export type Args = {
        __typename?: 'AdjustmentArg';
        name: string;
        type: string;
        value?: string | null;
    };
}

export namespace AdjustmentSource {
    export type Fragment = {
        __typename?: 'AdjustmentSource';
        id: string;
        createdAt: DateTime;
        updatedAt: DateTime;
        name: string;
        type: AdjustmentType;
        enabled: boolean;
        conditions: Conditions[];
        actions: Actions[];
    };

    export type Conditions = AdjustmentOperation.Fragment;

    export type Actions = AdjustmentOperation.Fragment;
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

export namespace FacetValue {
    export type Fragment = {
        __typename?: 'FacetValue';
        id: string;
        languageCode?: LanguageCode | null;
        code: string;
        name: string;
        translations: Translations[];
    };

    export type Translations = {
        __typename?: 'FacetValueTranslation';
        id: string;
        languageCode: LanguageCode;
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

export namespace Order {
    export type Fragment = {
        __typename?: 'Order';
        id: string;
        createdAt: DateTime;
        updatedAt: DateTime;
        code: string;
        customer?: Customer | null;
    };

    export type Customer = {
        __typename?: 'Customer';
        firstName: string;
        lastName: string;
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
        taxCategory: TaxCategory;
        sku: string;
        options: Options[];
        facetValues: FacetValues[];
        translations: Translations[];
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
    };

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

export namespace Country {
    export type Fragment = {
        __typename?: 'Country';
        id: string;
        code: string;
        name: string;
        enabled: boolean;
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
