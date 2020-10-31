// tslint:disable
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
    JSON: any;
    /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
    DateTime: any;
    /** The `Upload` scalar type represents a file upload. */
    Upload: any;
};

export type Query = {
    administrators: AdministratorList;
    administrator?: Maybe<Administrator>;
    /** Get a list of Assets */
    assets: AssetList;
    /** Get a single Asset by id */
    asset?: Maybe<Asset>;
    me?: Maybe<CurrentUser>;
    channels: Array<Channel>;
    channel?: Maybe<Channel>;
    activeChannel: Channel;
    collections: CollectionList;
    /** Get a Collection either by id or slug. If neither id nor slug is speicified, an error will result. */
    collection?: Maybe<Collection>;
    collectionFilters: Array<ConfigurableOperationDefinition>;
    countries: CountryList;
    country?: Maybe<Country>;
    customerGroups: CustomerGroupList;
    customerGroup?: Maybe<CustomerGroup>;
    customers: CustomerList;
    customer?: Maybe<Customer>;
    facets: FacetList;
    facet?: Maybe<Facet>;
    globalSettings: GlobalSettings;
    job?: Maybe<Job>;
    jobs: JobList;
    jobsById: Array<Job>;
    jobQueues: Array<JobQueue>;
    order?: Maybe<Order>;
    orders: OrderList;
    paymentMethods: PaymentMethodList;
    paymentMethod?: Maybe<PaymentMethod>;
    productOptionGroups: Array<ProductOptionGroup>;
    productOptionGroup?: Maybe<ProductOptionGroup>;
    search: SearchResponse;
    products: ProductList;
    /** Get a Product either by id or slug. If neither id nor slug is speicified, an error will result. */
    product?: Maybe<Product>;
    /** Get a ProductVariant by id */
    productVariant?: Maybe<ProductVariant>;
    promotion?: Maybe<Promotion>;
    promotions: PromotionList;
    promotionConditions: Array<ConfigurableOperationDefinition>;
    promotionActions: Array<ConfigurableOperationDefinition>;
    roles: RoleList;
    role?: Maybe<Role>;
    shippingMethods: ShippingMethodList;
    shippingMethod?: Maybe<ShippingMethod>;
    shippingEligibilityCheckers: Array<ConfigurableOperationDefinition>;
    shippingCalculators: Array<ConfigurableOperationDefinition>;
    testShippingMethod: TestShippingMethodResult;
    testEligibleShippingMethods: Array<ShippingMethodQuote>;
    taxCategories: Array<TaxCategory>;
    taxCategory?: Maybe<TaxCategory>;
    taxRates: TaxRateList;
    taxRate?: Maybe<TaxRate>;
    zones: Array<Zone>;
    zone?: Maybe<Zone>;
};

export type QueryAdministratorsArgs = {
    options?: Maybe<AdministratorListOptions>;
};

export type QueryAdministratorArgs = {
    id: Scalars['ID'];
};

export type QueryAssetsArgs = {
    options?: Maybe<AssetListOptions>;
};

export type QueryAssetArgs = {
    id: Scalars['ID'];
};

export type QueryChannelArgs = {
    id: Scalars['ID'];
};

export type QueryCollectionsArgs = {
    options?: Maybe<CollectionListOptions>;
};

export type QueryCollectionArgs = {
    id?: Maybe<Scalars['ID']>;
    slug?: Maybe<Scalars['String']>;
};

export type QueryCountriesArgs = {
    options?: Maybe<CountryListOptions>;
};

export type QueryCountryArgs = {
    id: Scalars['ID'];
};

export type QueryCustomerGroupsArgs = {
    options?: Maybe<CustomerGroupListOptions>;
};

export type QueryCustomerGroupArgs = {
    id: Scalars['ID'];
};

export type QueryCustomersArgs = {
    options?: Maybe<CustomerListOptions>;
};

export type QueryCustomerArgs = {
    id: Scalars['ID'];
};

export type QueryFacetsArgs = {
    options?: Maybe<FacetListOptions>;
};

export type QueryFacetArgs = {
    id: Scalars['ID'];
};

export type QueryJobArgs = {
    jobId: Scalars['ID'];
};

export type QueryJobsArgs = {
    options?: Maybe<JobListOptions>;
};

export type QueryJobsByIdArgs = {
    jobIds: Array<Scalars['ID']>;
};

export type QueryOrderArgs = {
    id: Scalars['ID'];
};

export type QueryOrdersArgs = {
    options?: Maybe<OrderListOptions>;
};

export type QueryPaymentMethodsArgs = {
    options?: Maybe<PaymentMethodListOptions>;
};

export type QueryPaymentMethodArgs = {
    id: Scalars['ID'];
};

export type QueryProductOptionGroupsArgs = {
    filterTerm?: Maybe<Scalars['String']>;
};

export type QueryProductOptionGroupArgs = {
    id: Scalars['ID'];
};

export type QuerySearchArgs = {
    input: SearchInput;
};

export type QueryProductsArgs = {
    options?: Maybe<ProductListOptions>;
};

export type QueryProductArgs = {
    id?: Maybe<Scalars['ID']>;
    slug?: Maybe<Scalars['String']>;
};

export type QueryProductVariantArgs = {
    id: Scalars['ID'];
};

export type QueryPromotionArgs = {
    id: Scalars['ID'];
};

export type QueryPromotionsArgs = {
    options?: Maybe<PromotionListOptions>;
};

export type QueryRolesArgs = {
    options?: Maybe<RoleListOptions>;
};

export type QueryRoleArgs = {
    id: Scalars['ID'];
};

export type QueryShippingMethodsArgs = {
    options?: Maybe<ShippingMethodListOptions>;
};

export type QueryShippingMethodArgs = {
    id: Scalars['ID'];
};

export type QueryTestShippingMethodArgs = {
    input: TestShippingMethodInput;
};

export type QueryTestEligibleShippingMethodsArgs = {
    input: TestEligibleShippingMethodsInput;
};

export type QueryTaxCategoryArgs = {
    id: Scalars['ID'];
};

export type QueryTaxRatesArgs = {
    options?: Maybe<TaxRateListOptions>;
};

export type QueryTaxRateArgs = {
    id: Scalars['ID'];
};

export type QueryZoneArgs = {
    id: Scalars['ID'];
};

export type Mutation = {
    /** Create a new Administrator */
    createAdministrator: Administrator;
    /** Update an existing Administrator */
    updateAdministrator: Administrator;
    /** Delete an Administrator */
    deleteAdministrator: DeletionResponse;
    /** Assign a Role to an Administrator */
    assignRoleToAdministrator: Administrator;
    /** Create a new Asset */
    createAssets: Array<CreateAssetResult>;
    /** Update an existing Asset */
    updateAsset: Asset;
    /** Delete an Asset */
    deleteAsset: DeletionResponse;
    /** Delete multiple Assets */
    deleteAssets: DeletionResponse;
    /** Authenticates the user using the native authentication strategy. This mutation is an alias for `authenticate({ native: { ... }})` */
    login: NativeAuthenticationResult;
    /** Authenticates the user using a named authentication strategy */
    authenticate: AuthenticationResult;
    logout: Success;
    /** Create a new Channel */
    createChannel: CreateChannelResult;
    /** Update an existing Channel */
    updateChannel: UpdateChannelResult;
    /** Delete a Channel */
    deleteChannel: DeletionResponse;
    /** Create a new Collection */
    createCollection: Collection;
    /** Update an existing Collection */
    updateCollection: Collection;
    /** Delete a Collection and all of its descendants */
    deleteCollection: DeletionResponse;
    /** Move a Collection to a different parent or index */
    moveCollection: Collection;
    /** Create a new Country */
    createCountry: Country;
    /** Update an existing Country */
    updateCountry: Country;
    /** Delete a Country */
    deleteCountry: DeletionResponse;
    /** Create a new CustomerGroup */
    createCustomerGroup: CustomerGroup;
    /** Update an existing CustomerGroup */
    updateCustomerGroup: CustomerGroup;
    /** Delete a CustomerGroup */
    deleteCustomerGroup: DeletionResponse;
    /** Add Customers to a CustomerGroup */
    addCustomersToGroup: CustomerGroup;
    /** Remove Customers from a CustomerGroup */
    removeCustomersFromGroup: CustomerGroup;
    /** Create a new Customer. If a password is provided, a new User will also be created an linked to the Customer. */
    createCustomer: CreateCustomerResult;
    /** Update an existing Customer */
    updateCustomer: UpdateCustomerResult;
    /** Delete a Customer */
    deleteCustomer: DeletionResponse;
    /** Create a new Address and associate it with the Customer specified by customerId */
    createCustomerAddress: Address;
    /** Update an existing Address */
    updateCustomerAddress: Address;
    /** Update an existing Address */
    deleteCustomerAddress: Success;
    addNoteToCustomer: Customer;
    updateCustomerNote: HistoryEntry;
    deleteCustomerNote: DeletionResponse;
    /** Create a new Facet */
    createFacet: Facet;
    /** Update an existing Facet */
    updateFacet: Facet;
    /** Delete an existing Facet */
    deleteFacet: DeletionResponse;
    /** Create one or more FacetValues */
    createFacetValues: Array<FacetValue>;
    /** Update one or more FacetValues */
    updateFacetValues: Array<FacetValue>;
    /** Delete one or more FacetValues */
    deleteFacetValues: Array<DeletionResponse>;
    updateGlobalSettings: UpdateGlobalSettingsResult;
    importProducts?: Maybe<ImportInfo>;
    /** Remove all settled jobs in the given queues olfer than the given date. Returns the number of jobs deleted. */
    removeSettledJobs: Scalars['Int'];
    settlePayment: SettlePaymentResult;
    addFulfillmentToOrder: AddFulfillmentToOrderResult;
    cancelOrder: CancelOrderResult;
    refundOrder: RefundOrderResult;
    settleRefund: SettleRefundResult;
    addNoteToOrder: Order;
    updateOrderNote: HistoryEntry;
    deleteOrderNote: DeletionResponse;
    transitionOrderToState?: Maybe<TransitionOrderToStateResult>;
    transitionFulfillmentToState: TransitionFulfillmentToStateResult;
    setOrderCustomFields?: Maybe<Order>;
    /** Update an existing PaymentMethod */
    updatePaymentMethod: PaymentMethod;
    /** Create a new ProductOptionGroup */
    createProductOptionGroup: ProductOptionGroup;
    /** Update an existing ProductOptionGroup */
    updateProductOptionGroup: ProductOptionGroup;
    /** Create a new ProductOption within a ProductOptionGroup */
    createProductOption: ProductOption;
    /** Create a new ProductOption within a ProductOptionGroup */
    updateProductOption: ProductOption;
    reindex: Job;
    /** Create a new Product */
    createProduct: Product;
    /** Update an existing Product */
    updateProduct: Product;
    /** Delete a Product */
    deleteProduct: DeletionResponse;
    /** Add an OptionGroup to a Product */
    addOptionGroupToProduct: Product;
    /** Remove an OptionGroup from a Product */
    removeOptionGroupFromProduct: RemoveOptionGroupFromProductResult;
    /** Create a set of ProductVariants based on the OptionGroups assigned to the given Product */
    createProductVariants: Array<Maybe<ProductVariant>>;
    /** Update existing ProductVariants */
    updateProductVariants: Array<Maybe<ProductVariant>>;
    /** Delete a ProductVariant */
    deleteProductVariant: DeletionResponse;
    /** Assigns Products to the specified Channel */
    assignProductsToChannel: Array<Product>;
    /** Removes Products from the specified Channel */
    removeProductsFromChannel: Array<Product>;
    createPromotion: CreatePromotionResult;
    updatePromotion: UpdatePromotionResult;
    deletePromotion: DeletionResponse;
    /** Create a new Role */
    createRole: Role;
    /** Update an existing Role */
    updateRole: Role;
    /** Delete an existing Role */
    deleteRole: DeletionResponse;
    /** Create a new ShippingMethod */
    createShippingMethod: ShippingMethod;
    /** Update an existing ShippingMethod */
    updateShippingMethod: ShippingMethod;
    /** Delete a ShippingMethod */
    deleteShippingMethod: DeletionResponse;
    /** Create a new TaxCategory */
    createTaxCategory: TaxCategory;
    /** Update an existing TaxCategory */
    updateTaxCategory: TaxCategory;
    /** Deletes a TaxCategory */
    deleteTaxCategory: DeletionResponse;
    /** Create a new TaxRate */
    createTaxRate: TaxRate;
    /** Update an existing TaxRate */
    updateTaxRate: TaxRate;
    /** Delete a TaxRate */
    deleteTaxRate: DeletionResponse;
    /** Create a new Zone */
    createZone: Zone;
    /** Update an existing Zone */
    updateZone: Zone;
    /** Delete a Zone */
    deleteZone: DeletionResponse;
    /** Add members to a Zone */
    addMembersToZone: Zone;
    /** Remove members from a Zone */
    removeMembersFromZone: Zone;
};

export type MutationCreateAdministratorArgs = {
    input: CreateAdministratorInput;
};

export type MutationUpdateAdministratorArgs = {
    input: UpdateAdministratorInput;
};

export type MutationDeleteAdministratorArgs = {
    id: Scalars['ID'];
};

export type MutationAssignRoleToAdministratorArgs = {
    administratorId: Scalars['ID'];
    roleId: Scalars['ID'];
};

export type MutationCreateAssetsArgs = {
    input: Array<CreateAssetInput>;
};

export type MutationUpdateAssetArgs = {
    input: UpdateAssetInput;
};

export type MutationDeleteAssetArgs = {
    id: Scalars['ID'];
    force?: Maybe<Scalars['Boolean']>;
};

export type MutationDeleteAssetsArgs = {
    ids: Array<Scalars['ID']>;
    force?: Maybe<Scalars['Boolean']>;
};

export type MutationLoginArgs = {
    username: Scalars['String'];
    password: Scalars['String'];
    rememberMe?: Maybe<Scalars['Boolean']>;
};

export type MutationAuthenticateArgs = {
    input: AuthenticationInput;
    rememberMe?: Maybe<Scalars['Boolean']>;
};

export type MutationCreateChannelArgs = {
    input: CreateChannelInput;
};

export type MutationUpdateChannelArgs = {
    input: UpdateChannelInput;
};

export type MutationDeleteChannelArgs = {
    id: Scalars['ID'];
};

export type MutationCreateCollectionArgs = {
    input: CreateCollectionInput;
};

export type MutationUpdateCollectionArgs = {
    input: UpdateCollectionInput;
};

export type MutationDeleteCollectionArgs = {
    id: Scalars['ID'];
};

export type MutationMoveCollectionArgs = {
    input: MoveCollectionInput;
};

export type MutationCreateCountryArgs = {
    input: CreateCountryInput;
};

export type MutationUpdateCountryArgs = {
    input: UpdateCountryInput;
};

export type MutationDeleteCountryArgs = {
    id: Scalars['ID'];
};

export type MutationCreateCustomerGroupArgs = {
    input: CreateCustomerGroupInput;
};

export type MutationUpdateCustomerGroupArgs = {
    input: UpdateCustomerGroupInput;
};

export type MutationDeleteCustomerGroupArgs = {
    id: Scalars['ID'];
};

export type MutationAddCustomersToGroupArgs = {
    customerGroupId: Scalars['ID'];
    customerIds: Array<Scalars['ID']>;
};

export type MutationRemoveCustomersFromGroupArgs = {
    customerGroupId: Scalars['ID'];
    customerIds: Array<Scalars['ID']>;
};

export type MutationCreateCustomerArgs = {
    input: CreateCustomerInput;
    password?: Maybe<Scalars['String']>;
};

export type MutationUpdateCustomerArgs = {
    input: UpdateCustomerInput;
};

export type MutationDeleteCustomerArgs = {
    id: Scalars['ID'];
};

export type MutationCreateCustomerAddressArgs = {
    customerId: Scalars['ID'];
    input: CreateAddressInput;
};

export type MutationUpdateCustomerAddressArgs = {
    input: UpdateAddressInput;
};

export type MutationDeleteCustomerAddressArgs = {
    id: Scalars['ID'];
};

export type MutationAddNoteToCustomerArgs = {
    input: AddNoteToCustomerInput;
};

export type MutationUpdateCustomerNoteArgs = {
    input: UpdateCustomerNoteInput;
};

export type MutationDeleteCustomerNoteArgs = {
    id: Scalars['ID'];
};

export type MutationCreateFacetArgs = {
    input: CreateFacetInput;
};

export type MutationUpdateFacetArgs = {
    input: UpdateFacetInput;
};

export type MutationDeleteFacetArgs = {
    id: Scalars['ID'];
    force?: Maybe<Scalars['Boolean']>;
};

export type MutationCreateFacetValuesArgs = {
    input: Array<CreateFacetValueInput>;
};

export type MutationUpdateFacetValuesArgs = {
    input: Array<UpdateFacetValueInput>;
};

export type MutationDeleteFacetValuesArgs = {
    ids: Array<Scalars['ID']>;
    force?: Maybe<Scalars['Boolean']>;
};

export type MutationUpdateGlobalSettingsArgs = {
    input: UpdateGlobalSettingsInput;
};

export type MutationImportProductsArgs = {
    csvFile: Scalars['Upload'];
};

export type MutationRemoveSettledJobsArgs = {
    queueNames?: Maybe<Array<Scalars['String']>>;
    olderThan?: Maybe<Scalars['DateTime']>;
};

export type MutationSettlePaymentArgs = {
    id: Scalars['ID'];
};

export type MutationAddFulfillmentToOrderArgs = {
    input: FulfillOrderInput;
};

export type MutationCancelOrderArgs = {
    input: CancelOrderInput;
};

export type MutationRefundOrderArgs = {
    input: RefundOrderInput;
};

export type MutationSettleRefundArgs = {
    input: SettleRefundInput;
};

export type MutationAddNoteToOrderArgs = {
    input: AddNoteToOrderInput;
};

export type MutationUpdateOrderNoteArgs = {
    input: UpdateOrderNoteInput;
};

export type MutationDeleteOrderNoteArgs = {
    id: Scalars['ID'];
};

export type MutationTransitionOrderToStateArgs = {
    id: Scalars['ID'];
    state: Scalars['String'];
};

export type MutationTransitionFulfillmentToStateArgs = {
    id: Scalars['ID'];
    state: Scalars['String'];
};

export type MutationSetOrderCustomFieldsArgs = {
    input: UpdateOrderInput;
};

export type MutationUpdatePaymentMethodArgs = {
    input: UpdatePaymentMethodInput;
};

export type MutationCreateProductOptionGroupArgs = {
    input: CreateProductOptionGroupInput;
};

export type MutationUpdateProductOptionGroupArgs = {
    input: UpdateProductOptionGroupInput;
};

export type MutationCreateProductOptionArgs = {
    input: CreateProductOptionInput;
};

export type MutationUpdateProductOptionArgs = {
    input: UpdateProductOptionInput;
};

export type MutationCreateProductArgs = {
    input: CreateProductInput;
};

export type MutationUpdateProductArgs = {
    input: UpdateProductInput;
};

export type MutationDeleteProductArgs = {
    id: Scalars['ID'];
};

export type MutationAddOptionGroupToProductArgs = {
    productId: Scalars['ID'];
    optionGroupId: Scalars['ID'];
};

export type MutationRemoveOptionGroupFromProductArgs = {
    productId: Scalars['ID'];
    optionGroupId: Scalars['ID'];
};

export type MutationCreateProductVariantsArgs = {
    input: Array<CreateProductVariantInput>;
};

export type MutationUpdateProductVariantsArgs = {
    input: Array<UpdateProductVariantInput>;
};

export type MutationDeleteProductVariantArgs = {
    id: Scalars['ID'];
};

export type MutationAssignProductsToChannelArgs = {
    input: AssignProductsToChannelInput;
};

export type MutationRemoveProductsFromChannelArgs = {
    input: RemoveProductsFromChannelInput;
};

export type MutationCreatePromotionArgs = {
    input: CreatePromotionInput;
};

export type MutationUpdatePromotionArgs = {
    input: UpdatePromotionInput;
};

export type MutationDeletePromotionArgs = {
    id: Scalars['ID'];
};

export type MutationCreateRoleArgs = {
    input: CreateRoleInput;
};

export type MutationUpdateRoleArgs = {
    input: UpdateRoleInput;
};

export type MutationDeleteRoleArgs = {
    id: Scalars['ID'];
};

export type MutationCreateShippingMethodArgs = {
    input: CreateShippingMethodInput;
};

export type MutationUpdateShippingMethodArgs = {
    input: UpdateShippingMethodInput;
};

export type MutationDeleteShippingMethodArgs = {
    id: Scalars['ID'];
};

export type MutationCreateTaxCategoryArgs = {
    input: CreateTaxCategoryInput;
};

export type MutationUpdateTaxCategoryArgs = {
    input: UpdateTaxCategoryInput;
};

export type MutationDeleteTaxCategoryArgs = {
    id: Scalars['ID'];
};

export type MutationCreateTaxRateArgs = {
    input: CreateTaxRateInput;
};

export type MutationUpdateTaxRateArgs = {
    input: UpdateTaxRateInput;
};

export type MutationDeleteTaxRateArgs = {
    id: Scalars['ID'];
};

export type MutationCreateZoneArgs = {
    input: CreateZoneInput;
};

export type MutationUpdateZoneArgs = {
    input: UpdateZoneInput;
};

export type MutationDeleteZoneArgs = {
    id: Scalars['ID'];
};

export type MutationAddMembersToZoneArgs = {
    zoneId: Scalars['ID'];
    memberIds: Array<Scalars['ID']>;
};

export type MutationRemoveMembersFromZoneArgs = {
    zoneId: Scalars['ID'];
    memberIds: Array<Scalars['ID']>;
};

export type CreateAdministratorInput = {
    firstName: Scalars['String'];
    lastName: Scalars['String'];
    emailAddress: Scalars['String'];
    password: Scalars['String'];
    roleIds: Array<Scalars['ID']>;
};

export type UpdateAdministratorInput = {
    id: Scalars['ID'];
    firstName?: Maybe<Scalars['String']>;
    lastName?: Maybe<Scalars['String']>;
    emailAddress?: Maybe<Scalars['String']>;
    password?: Maybe<Scalars['String']>;
    roleIds?: Maybe<Array<Scalars['ID']>>;
};

export type MimeTypeError = ErrorResult & {
    errorCode: ErrorCode;
    message: Scalars['String'];
    fileName: Scalars['String'];
    mimeType: Scalars['String'];
};

export type CreateAssetResult = Asset | MimeTypeError;

export type CreateAssetInput = {
    file: Scalars['Upload'];
};

export type CoordinateInput = {
    x: Scalars['Float'];
    y: Scalars['Float'];
};

export type UpdateAssetInput = {
    id: Scalars['ID'];
    name?: Maybe<Scalars['String']>;
    focalPoint?: Maybe<CoordinateInput>;
};

export type NativeAuthenticationResult = CurrentUser | InvalidCredentialsError | NativeAuthStrategyError;

export type AuthenticationResult = CurrentUser | InvalidCredentialsError;

export type CreateChannelInput = {
    code: Scalars['String'];
    token: Scalars['String'];
    defaultLanguageCode: LanguageCode;
    pricesIncludeTax: Scalars['Boolean'];
    currencyCode: CurrencyCode;
    defaultTaxZoneId: Scalars['ID'];
    defaultShippingZoneId: Scalars['ID'];
};

export type UpdateChannelInput = {
    id: Scalars['ID'];
    code?: Maybe<Scalars['String']>;
    token?: Maybe<Scalars['String']>;
    defaultLanguageCode?: Maybe<LanguageCode>;
    pricesIncludeTax?: Maybe<Scalars['Boolean']>;
    currencyCode?: Maybe<CurrencyCode>;
    defaultTaxZoneId?: Maybe<Scalars['ID']>;
    defaultShippingZoneId?: Maybe<Scalars['ID']>;
};

/** Returned if attempting to set a Channel's defaultLanguageCode to a language which is not enabled in GlobalSettings */
export type LanguageNotAvailableError = ErrorResult & {
    errorCode: ErrorCode;
    message: Scalars['String'];
    languageCode: Scalars['String'];
};

export type CreateChannelResult = Channel | LanguageNotAvailableError;

export type UpdateChannelResult = Channel | LanguageNotAvailableError;

export type Collection = Node & {
    isPrivate: Scalars['Boolean'];
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    languageCode?: Maybe<LanguageCode>;
    name: Scalars['String'];
    slug: Scalars['String'];
    breadcrumbs: Array<CollectionBreadcrumb>;
    position: Scalars['Int'];
    description: Scalars['String'];
    featuredAsset?: Maybe<Asset>;
    assets: Array<Asset>;
    parent?: Maybe<Collection>;
    children?: Maybe<Array<Collection>>;
    filters: Array<ConfigurableOperation>;
    translations: Array<CollectionTranslation>;
    productVariants: ProductVariantList;
    customFields?: Maybe<Scalars['JSON']>;
};

export type CollectionProductVariantsArgs = {
    options?: Maybe<ProductVariantListOptions>;
};

export type MoveCollectionInput = {
    collectionId: Scalars['ID'];
    parentId: Scalars['ID'];
    index: Scalars['Int'];
};

export type CreateCollectionTranslationInput = {
    languageCode: LanguageCode;
    name: Scalars['String'];
    slug: Scalars['String'];
    description: Scalars['String'];
    customFields?: Maybe<Scalars['JSON']>;
};

export type UpdateCollectionTranslationInput = {
    id?: Maybe<Scalars['ID']>;
    languageCode: LanguageCode;
    name?: Maybe<Scalars['String']>;
    slug?: Maybe<Scalars['String']>;
    description?: Maybe<Scalars['String']>;
    customFields?: Maybe<Scalars['JSON']>;
};

export type CreateCollectionInput = {
    isPrivate?: Maybe<Scalars['Boolean']>;
    featuredAssetId?: Maybe<Scalars['ID']>;
    assetIds?: Maybe<Array<Scalars['ID']>>;
    parentId?: Maybe<Scalars['ID']>;
    filters: Array<ConfigurableOperationInput>;
    translations: Array<CreateCollectionTranslationInput>;
    customFields?: Maybe<Scalars['JSON']>;
};

export type UpdateCollectionInput = {
    id: Scalars['ID'];
    isPrivate?: Maybe<Scalars['Boolean']>;
    featuredAssetId?: Maybe<Scalars['ID']>;
    parentId?: Maybe<Scalars['ID']>;
    assetIds?: Maybe<Array<Scalars['ID']>>;
    filters?: Maybe<Array<ConfigurableOperationInput>>;
    translations?: Maybe<Array<UpdateCollectionTranslationInput>>;
    customFields?: Maybe<Scalars['JSON']>;
};

export type CountryTranslationInput = {
    id?: Maybe<Scalars['ID']>;
    languageCode: LanguageCode;
    name?: Maybe<Scalars['String']>;
};

export type CreateCountryInput = {
    code: Scalars['String'];
    translations: Array<CountryTranslationInput>;
    enabled: Scalars['Boolean'];
};

export type UpdateCountryInput = {
    id: Scalars['ID'];
    code?: Maybe<Scalars['String']>;
    translations?: Maybe<Array<CountryTranslationInput>>;
    enabled?: Maybe<Scalars['Boolean']>;
};

export type CustomerGroupList = PaginatedList & {
    items: Array<CustomerGroup>;
    totalItems: Scalars['Int'];
};

export type CreateCustomerGroupInput = {
    name: Scalars['String'];
    customerIds?: Maybe<Array<Scalars['ID']>>;
};

export type UpdateCustomerGroupInput = {
    id: Scalars['ID'];
    name?: Maybe<Scalars['String']>;
};

export type Customer = Node & {
    groups: Array<CustomerGroup>;
    history: HistoryEntryList;
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    title?: Maybe<Scalars['String']>;
    firstName: Scalars['String'];
    lastName: Scalars['String'];
    phoneNumber?: Maybe<Scalars['String']>;
    emailAddress: Scalars['String'];
    addresses?: Maybe<Array<Address>>;
    orders: OrderList;
    user?: Maybe<User>;
    customFields?: Maybe<Scalars['JSON']>;
};

export type CustomerHistoryArgs = {
    options?: Maybe<HistoryEntryListOptions>;
};

export type CustomerOrdersArgs = {
    options?: Maybe<OrderListOptions>;
};

export type UpdateCustomerInput = {
    id: Scalars['ID'];
    title?: Maybe<Scalars['String']>;
    firstName?: Maybe<Scalars['String']>;
    lastName?: Maybe<Scalars['String']>;
    phoneNumber?: Maybe<Scalars['String']>;
    emailAddress?: Maybe<Scalars['String']>;
    customFields?: Maybe<Scalars['JSON']>;
};

export type AddNoteToCustomerInput = {
    id: Scalars['ID'];
    note: Scalars['String'];
    isPublic: Scalars['Boolean'];
};

export type UpdateCustomerNoteInput = {
    noteId: Scalars['ID'];
    note: Scalars['String'];
};

export type CreateCustomerResult = Customer | EmailAddressConflictError;

export type UpdateCustomerResult = Customer | EmailAddressConflictError;

export type Facet = Node & {
    isPrivate: Scalars['Boolean'];
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    languageCode: LanguageCode;
    name: Scalars['String'];
    code: Scalars['String'];
    values: Array<FacetValue>;
    translations: Array<FacetTranslation>;
    customFields?: Maybe<Scalars['JSON']>;
};

export type FacetTranslationInput = {
    id?: Maybe<Scalars['ID']>;
    languageCode: LanguageCode;
    name?: Maybe<Scalars['String']>;
    customFields?: Maybe<Scalars['JSON']>;
};

export type CreateFacetInput = {
    code: Scalars['String'];
    isPrivate: Scalars['Boolean'];
    translations: Array<FacetTranslationInput>;
    values?: Maybe<Array<CreateFacetValueWithFacetInput>>;
    customFields?: Maybe<Scalars['JSON']>;
};

export type UpdateFacetInput = {
    id: Scalars['ID'];
    isPrivate?: Maybe<Scalars['Boolean']>;
    code?: Maybe<Scalars['String']>;
    translations?: Maybe<Array<FacetTranslationInput>>;
    customFields?: Maybe<Scalars['JSON']>;
};

export type FacetValueTranslationInput = {
    id?: Maybe<Scalars['ID']>;
    languageCode: LanguageCode;
    name?: Maybe<Scalars['String']>;
    customFields?: Maybe<Scalars['JSON']>;
};

export type CreateFacetValueWithFacetInput = {
    code: Scalars['String'];
    translations: Array<FacetValueTranslationInput>;
};

export type CreateFacetValueInput = {
    facetId: Scalars['ID'];
    code: Scalars['String'];
    translations: Array<FacetValueTranslationInput>;
    customFields?: Maybe<Scalars['JSON']>;
};

export type UpdateFacetValueInput = {
    id: Scalars['ID'];
    code?: Maybe<Scalars['String']>;
    translations?: Maybe<Array<FacetValueTranslationInput>>;
    customFields?: Maybe<Scalars['JSON']>;
};

export type Fulfillment = Node & {
    nextStates: Array<Scalars['String']>;
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    orderItems: Array<OrderItem>;
    state: Scalars['String'];
    method: Scalars['String'];
    trackingCode?: Maybe<Scalars['String']>;
    customFields?: Maybe<Scalars['JSON']>;
};

export type UpdateGlobalSettingsInput = {
    availableLanguages?: Maybe<Array<LanguageCode>>;
    trackInventory?: Maybe<Scalars['Boolean']>;
    outOfStockThreshold?: Maybe<Scalars['Int']>;
    customFields?: Maybe<Scalars['JSON']>;
};

/**
 * Returned when the default LanguageCode of a Channel is no longer found in the `availableLanguages`
 * of the GlobalSettings
 */
export type ChannelDefaultLanguageError = ErrorResult & {
    errorCode: ErrorCode;
    message: Scalars['String'];
    language: Scalars['String'];
    channelCode: Scalars['String'];
};

export type UpdateGlobalSettingsResult = GlobalSettings | ChannelDefaultLanguageError;

/**
 * @description
 * The state of a Job in the JobQueue
 *
 * @docsCategory common
 */
export enum JobState {
    PENDING = 'PENDING',
    RUNNING = 'RUNNING',
    COMPLETED = 'COMPLETED',
    RETRYING = 'RETRYING',
    FAILED = 'FAILED',
}

export type JobList = PaginatedList & {
    items: Array<Job>;
    totalItems: Scalars['Int'];
};

export type Job = Node & {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    startedAt?: Maybe<Scalars['DateTime']>;
    settledAt?: Maybe<Scalars['DateTime']>;
    queueName: Scalars['String'];
    state: JobState;
    progress: Scalars['Float'];
    data?: Maybe<Scalars['JSON']>;
    result?: Maybe<Scalars['JSON']>;
    error?: Maybe<Scalars['JSON']>;
    isSettled: Scalars['Boolean'];
    duration: Scalars['Int'];
};

export type JobQueue = {
    name: Scalars['String'];
    running: Scalars['Boolean'];
};

export type Order = Node & {
    nextStates: Array<Scalars['String']>;
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    /** A unique code for the Order */
    code: Scalars['String'];
    state: Scalars['String'];
    /** An order is active as long as the payment process has not been completed */
    active: Scalars['Boolean'];
    customer?: Maybe<Customer>;
    shippingAddress?: Maybe<OrderAddress>;
    billingAddress?: Maybe<OrderAddress>;
    lines: Array<OrderLine>;
    /** Order-level adjustments to the order total, such as discounts from promotions */
    adjustments: Array<Adjustment>;
    couponCodes: Array<Scalars['String']>;
    /** Promotions applied to the order. Only gets populated after the payment process has completed. */
    promotions: Array<Promotion>;
    payments?: Maybe<Array<Payment>>;
    fulfillments?: Maybe<Array<Fulfillment>>;
    totalQuantity: Scalars['Int'];
    subTotalBeforeTax: Scalars['Int'];
    /** The subTotal is the total of the OrderLines, before order-level promotions and shipping has been applied. */
    subTotal: Scalars['Int'];
    currencyCode: CurrencyCode;
    shipping: Scalars['Int'];
    shippingWithTax: Scalars['Int'];
    shippingMethod?: Maybe<ShippingMethod>;
    totalBeforeTax: Scalars['Int'];
    total: Scalars['Int'];
    taxSummary: Array<OrderTaxSummary>;
    history: HistoryEntryList;
    customFields?: Maybe<Scalars['JSON']>;
};

export type OrderHistoryArgs = {
    options?: Maybe<HistoryEntryListOptions>;
};

export type UpdateOrderInput = {
    id: Scalars['ID'];
    customFields?: Maybe<Scalars['JSON']>;
};

export type FulfillOrderInput = {
    lines: Array<OrderLineInput>;
    method: Scalars['String'];
    trackingCode?: Maybe<Scalars['String']>;
};

export type CancelOrderInput = {
    /** The id of the order to be cancelled */
    orderId: Scalars['ID'];
    /** Optionally specify which OrderLines to cancel. If not provided, all OrderLines will be cancelled */
    lines?: Maybe<Array<OrderLineInput>>;
    reason?: Maybe<Scalars['String']>;
};

export type RefundOrderInput = {
    lines: Array<OrderLineInput>;
    shipping: Scalars['Int'];
    adjustment: Scalars['Int'];
    paymentId: Scalars['ID'];
    reason?: Maybe<Scalars['String']>;
};

export type OrderLineInput = {
    orderLineId: Scalars['ID'];
    quantity: Scalars['Int'];
};

export type SettleRefundInput = {
    id: Scalars['ID'];
    transactionId: Scalars['String'];
};

export type AddNoteToOrderInput = {
    id: Scalars['ID'];
    note: Scalars['String'];
    isPublic: Scalars['Boolean'];
};

export type UpdateOrderNoteInput = {
    noteId: Scalars['ID'];
    note?: Maybe<Scalars['String']>;
    isPublic?: Maybe<Scalars['Boolean']>;
};

/** Returned if the Payment settlement fails */
export type SettlePaymentError = ErrorResult & {
    errorCode: ErrorCode;
    message: Scalars['String'];
    paymentErrorMessage: Scalars['String'];
};

/** Returned if no OrderLines have been specified for the operation */
export type EmptyOrderLineSelectionError = ErrorResult & {
    errorCode: ErrorCode;
    message: Scalars['String'];
};

/** Returned if the specified items are already part of a Fulfillment */
export type ItemsAlreadyFulfilledError = ErrorResult & {
    errorCode: ErrorCode;
    message: Scalars['String'];
};

/**
 * Returned if attempting to create a Fulfillment when there is insufficient
 * stockOnHand of a ProductVariant to satisfy the requested quantity.
 */
export type InsufficientStockOnHandError = ErrorResult & {
    errorCode: ErrorCode;
    message: Scalars['String'];
    productVariantId: Scalars['ID'];
    productVariantName: Scalars['String'];
    stockOnHand: Scalars['Int'];
};

/** Returned if an operation has specified OrderLines from multiple Orders */
export type MultipleOrderError = ErrorResult & {
    errorCode: ErrorCode;
    message: Scalars['String'];
};

/** Returned if an attempting to cancel lines from an Order which is still active */
export type CancelActiveOrderError = ErrorResult & {
    errorCode: ErrorCode;
    message: Scalars['String'];
    orderState: Scalars['String'];
};

/** Returned if an attempting to refund a Payment against OrderLines from a different Order */
export type PaymentOrderMismatchError = ErrorResult & {
    errorCode: ErrorCode;
    message: Scalars['String'];
};

/** Returned if an attempting to refund an Order which is not in the expected state */
export type RefundOrderStateError = ErrorResult & {
    errorCode: ErrorCode;
    message: Scalars['String'];
    orderState: Scalars['String'];
};

/** Returned if an attempting to refund an Order but neither items nor shipping refund was specified */
export type NothingToRefundError = ErrorResult & {
    errorCode: ErrorCode;
    message: Scalars['String'];
};

/** Returned if an attempting to refund an OrderItem which has already been refunded */
export type AlreadyRefundedError = ErrorResult & {
    errorCode: ErrorCode;
    message: Scalars['String'];
    refundId: Scalars['ID'];
};

/** Returned if the specified quantity of an OrderLine is greater than the number of items in that line */
export type QuantityTooGreatError = ErrorResult & {
    errorCode: ErrorCode;
    message: Scalars['String'];
};

/** Returned when there is an error in transitioning the Refund state */
export type RefundStateTransitionError = ErrorResult & {
    errorCode: ErrorCode;
    message: Scalars['String'];
    transitionError: Scalars['String'];
    fromState: Scalars['String'];
    toState: Scalars['String'];
};

/** Returned when there is an error in transitioning the Payment state */
export type PaymentStateTransitionError = ErrorResult & {
    errorCode: ErrorCode;
    message: Scalars['String'];
    transitionError: Scalars['String'];
    fromState: Scalars['String'];
    toState: Scalars['String'];
};

/** Returned when there is an error in transitioning the Fulfillment state */
export type FulfillmentStateTransitionError = ErrorResult & {
    errorCode: ErrorCode;
    message: Scalars['String'];
    transitionError: Scalars['String'];
    fromState: Scalars['String'];
    toState: Scalars['String'];
};

export type TransitionOrderToStateResult = Order | OrderStateTransitionError;

export type SettlePaymentResult =
    | Payment
    | SettlePaymentError
    | PaymentStateTransitionError
    | OrderStateTransitionError;

export type AddFulfillmentToOrderResult =
    | Fulfillment
    | EmptyOrderLineSelectionError
    | ItemsAlreadyFulfilledError
    | InsufficientStockOnHandError;

export type CancelOrderResult =
    | Order
    | EmptyOrderLineSelectionError
    | QuantityTooGreatError
    | MultipleOrderError
    | CancelActiveOrderError
    | OrderStateTransitionError;

export type RefundOrderResult =
    | Refund
    | QuantityTooGreatError
    | NothingToRefundError
    | OrderStateTransitionError
    | MultipleOrderError
    | PaymentOrderMismatchError
    | RefundOrderStateError
    | AlreadyRefundedError
    | RefundStateTransitionError;

export type SettleRefundResult = Refund | RefundStateTransitionError;

export type TransitionFulfillmentToStateResult = Fulfillment | FulfillmentStateTransitionError;

export type PaymentMethodList = PaginatedList & {
    items: Array<PaymentMethod>;
    totalItems: Scalars['Int'];
};

export type UpdatePaymentMethodInput = {
    id: Scalars['ID'];
    code?: Maybe<Scalars['String']>;
    enabled?: Maybe<Scalars['Boolean']>;
    configArgs?: Maybe<Array<ConfigArgInput>>;
};

export type ProductOptionGroupTranslationInput = {
    id?: Maybe<Scalars['ID']>;
    languageCode: LanguageCode;
    name?: Maybe<Scalars['String']>;
    customFields?: Maybe<Scalars['JSON']>;
};

export type CreateProductOptionGroupInput = {
    code: Scalars['String'];
    translations: Array<ProductOptionGroupTranslationInput>;
    options: Array<CreateGroupOptionInput>;
    customFields?: Maybe<Scalars['JSON']>;
};

export type UpdateProductOptionGroupInput = {
    id: Scalars['ID'];
    code?: Maybe<Scalars['String']>;
    translations?: Maybe<Array<ProductOptionGroupTranslationInput>>;
    customFields?: Maybe<Scalars['JSON']>;
};

export type ProductOptionTranslationInput = {
    id?: Maybe<Scalars['ID']>;
    languageCode: LanguageCode;
    name?: Maybe<Scalars['String']>;
    customFields?: Maybe<Scalars['JSON']>;
};

export type CreateGroupOptionInput = {
    code: Scalars['String'];
    translations: Array<ProductOptionGroupTranslationInput>;
};

export type CreateProductOptionInput = {
    productOptionGroupId: Scalars['ID'];
    code: Scalars['String'];
    translations: Array<ProductOptionGroupTranslationInput>;
    customFields?: Maybe<Scalars['JSON']>;
};

export type UpdateProductOptionInput = {
    id: Scalars['ID'];
    code?: Maybe<Scalars['String']>;
    translations?: Maybe<Array<ProductOptionGroupTranslationInput>>;
    customFields?: Maybe<Scalars['JSON']>;
};

export type SearchResult = {
    enabled: Scalars['Boolean'];
    /** An array of ids of the Collections in which this result appears */
    channelIds: Array<Scalars['ID']>;
    sku: Scalars['String'];
    slug: Scalars['String'];
    productId: Scalars['ID'];
    productName: Scalars['String'];
    /** @deprecated Use `productAsset.preview` instead */
    productPreview: Scalars['String'];
    productAsset?: Maybe<SearchResultAsset>;
    productVariantId: Scalars['ID'];
    productVariantName: Scalars['String'];
    /** @deprecated Use `productVariantAsset.preview` instead */
    productVariantPreview: Scalars['String'];
    productVariantAsset?: Maybe<SearchResultAsset>;
    price: SearchResultPrice;
    priceWithTax: SearchResultPrice;
    currencyCode: CurrencyCode;
    description: Scalars['String'];
    facetIds: Array<Scalars['ID']>;
    facetValueIds: Array<Scalars['ID']>;
    /** An array of ids of the Collections in which this result appears */
    collectionIds: Array<Scalars['ID']>;
    /** A relevence score for the result. Differs between database implementations */
    score: Scalars['Float'];
};

export type Product = Node & {
    enabled: Scalars['Boolean'];
    channels: Array<Channel>;
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    languageCode: LanguageCode;
    name: Scalars['String'];
    slug: Scalars['String'];
    description: Scalars['String'];
    featuredAsset?: Maybe<Asset>;
    assets: Array<Asset>;
    variants: Array<ProductVariant>;
    optionGroups: Array<ProductOptionGroup>;
    facetValues: Array<FacetValue>;
    translations: Array<ProductTranslation>;
    collections: Array<Collection>;
    customFields?: Maybe<Scalars['JSON']>;
};

export type ProductVariant = Node & {
    enabled: Scalars['Boolean'];
    trackInventory: GlobalFlag;
    stockOnHand: Scalars['Int'];
    stockAllocated: Scalars['Int'];
    outOfStockThreshold: Scalars['Int'];
    useGlobalOutOfStockThreshold: Scalars['Boolean'];
    stockMovements: StockMovementList;
    id: Scalars['ID'];
    product: Product;
    productId: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    languageCode: LanguageCode;
    sku: Scalars['String'];
    name: Scalars['String'];
    featuredAsset?: Maybe<Asset>;
    assets: Array<Asset>;
    price: Scalars['Int'];
    currencyCode: CurrencyCode;
    priceIncludesTax: Scalars['Boolean'];
    priceWithTax: Scalars['Int'];
    taxRateApplied: TaxRate;
    taxCategory: TaxCategory;
    options: Array<ProductOption>;
    facetValues: Array<FacetValue>;
    translations: Array<ProductVariantTranslation>;
    customFields?: Maybe<Scalars['JSON']>;
};

export type ProductVariantStockMovementsArgs = {
    options?: Maybe<StockMovementListOptions>;
};

export type StockMovementListOptions = {
    type?: Maybe<StockMovementType>;
    skip?: Maybe<Scalars['Int']>;
    take?: Maybe<Scalars['Int']>;
};

export type ProductTranslationInput = {
    id?: Maybe<Scalars['ID']>;
    languageCode: LanguageCode;
    name?: Maybe<Scalars['String']>;
    slug?: Maybe<Scalars['String']>;
    description?: Maybe<Scalars['String']>;
    customFields?: Maybe<Scalars['JSON']>;
};

export type CreateProductInput = {
    featuredAssetId?: Maybe<Scalars['ID']>;
    assetIds?: Maybe<Array<Scalars['ID']>>;
    facetValueIds?: Maybe<Array<Scalars['ID']>>;
    translations: Array<ProductTranslationInput>;
    customFields?: Maybe<Scalars['JSON']>;
};

export type UpdateProductInput = {
    id: Scalars['ID'];
    enabled?: Maybe<Scalars['Boolean']>;
    featuredAssetId?: Maybe<Scalars['ID']>;
    assetIds?: Maybe<Array<Scalars['ID']>>;
    facetValueIds?: Maybe<Array<Scalars['ID']>>;
    translations?: Maybe<Array<ProductTranslationInput>>;
    customFields?: Maybe<Scalars['JSON']>;
};

export type ProductVariantTranslationInput = {
    id?: Maybe<Scalars['ID']>;
    languageCode: LanguageCode;
    name?: Maybe<Scalars['String']>;
    customFields?: Maybe<Scalars['JSON']>;
};

export type CreateProductVariantOptionInput = {
    optionGroupId: Scalars['ID'];
    code: Scalars['String'];
    translations: Array<ProductOptionTranslationInput>;
};

export type CreateProductVariantInput = {
    productId: Scalars['ID'];
    translations: Array<ProductVariantTranslationInput>;
    facetValueIds?: Maybe<Array<Scalars['ID']>>;
    sku: Scalars['String'];
    price?: Maybe<Scalars['Int']>;
    taxCategoryId?: Maybe<Scalars['ID']>;
    optionIds?: Maybe<Array<Scalars['ID']>>;
    featuredAssetId?: Maybe<Scalars['ID']>;
    assetIds?: Maybe<Array<Scalars['ID']>>;
    stockOnHand?: Maybe<Scalars['Int']>;
    outOfStockThreshold?: Maybe<Scalars['Int']>;
    useGlobalOutOfStockThreshold?: Maybe<Scalars['Boolean']>;
    trackInventory?: Maybe<GlobalFlag>;
    customFields?: Maybe<Scalars['JSON']>;
};

export type UpdateProductVariantInput = {
    id: Scalars['ID'];
    enabled?: Maybe<Scalars['Boolean']>;
    translations?: Maybe<Array<ProductVariantTranslationInput>>;
    facetValueIds?: Maybe<Array<Scalars['ID']>>;
    sku?: Maybe<Scalars['String']>;
    taxCategoryId?: Maybe<Scalars['ID']>;
    price?: Maybe<Scalars['Int']>;
    featuredAssetId?: Maybe<Scalars['ID']>;
    assetIds?: Maybe<Array<Scalars['ID']>>;
    stockOnHand?: Maybe<Scalars['Int']>;
    outOfStockThreshold?: Maybe<Scalars['Int']>;
    useGlobalOutOfStockThreshold?: Maybe<Scalars['Boolean']>;
    trackInventory?: Maybe<GlobalFlag>;
    customFields?: Maybe<Scalars['JSON']>;
};

export type AssignProductsToChannelInput = {
    productIds: Array<Scalars['ID']>;
    channelId: Scalars['ID'];
    priceFactor?: Maybe<Scalars['Float']>;
};

export type RemoveProductsFromChannelInput = {
    productIds: Array<Scalars['ID']>;
    channelId: Scalars['ID'];
};

export type ProductOptionInUseError = ErrorResult & {
    errorCode: ErrorCode;
    message: Scalars['String'];
    optionGroupCode: Scalars['String'];
    productVariantCount: Scalars['Int'];
};

export type RemoveOptionGroupFromProductResult = Product | ProductOptionInUseError;

export type CreatePromotionInput = {
    name: Scalars['String'];
    enabled: Scalars['Boolean'];
    startsAt?: Maybe<Scalars['DateTime']>;
    endsAt?: Maybe<Scalars['DateTime']>;
    couponCode?: Maybe<Scalars['String']>;
    perCustomerUsageLimit?: Maybe<Scalars['Int']>;
    conditions: Array<ConfigurableOperationInput>;
    actions: Array<ConfigurableOperationInput>;
};

export type UpdatePromotionInput = {
    id: Scalars['ID'];
    name?: Maybe<Scalars['String']>;
    enabled?: Maybe<Scalars['Boolean']>;
    startsAt?: Maybe<Scalars['DateTime']>;
    endsAt?: Maybe<Scalars['DateTime']>;
    couponCode?: Maybe<Scalars['String']>;
    perCustomerUsageLimit?: Maybe<Scalars['Int']>;
    conditions?: Maybe<Array<ConfigurableOperationInput>>;
    actions?: Maybe<Array<ConfigurableOperationInput>>;
};

/** Returned if a PromotionCondition has neither a couponCode nor any conditions set */
export type MissingConditionsError = ErrorResult & {
    errorCode: ErrorCode;
    message: Scalars['String'];
};

export type CreatePromotionResult = Promotion | MissingConditionsError;

export type UpdatePromotionResult = Promotion | MissingConditionsError;

export type CreateRoleInput = {
    code: Scalars['String'];
    description: Scalars['String'];
    permissions: Array<Permission>;
    channelIds?: Maybe<Array<Scalars['ID']>>;
};

export type UpdateRoleInput = {
    id: Scalars['ID'];
    code?: Maybe<Scalars['String']>;
    description?: Maybe<Scalars['String']>;
    permissions?: Maybe<Array<Permission>>;
    channelIds?: Maybe<Array<Scalars['ID']>>;
};

export type CreateShippingMethodInput = {
    code: Scalars['String'];
    description: Scalars['String'];
    checker: ConfigurableOperationInput;
    calculator: ConfigurableOperationInput;
    customFields?: Maybe<Scalars['JSON']>;
};

export type UpdateShippingMethodInput = {
    id: Scalars['ID'];
    code?: Maybe<Scalars['String']>;
    description?: Maybe<Scalars['String']>;
    checker?: Maybe<ConfigurableOperationInput>;
    calculator?: Maybe<ConfigurableOperationInput>;
    customFields?: Maybe<Scalars['JSON']>;
};

export type TestShippingMethodInput = {
    checker: ConfigurableOperationInput;
    calculator: ConfigurableOperationInput;
    shippingAddress: CreateAddressInput;
    lines: Array<TestShippingMethodOrderLineInput>;
};

export type TestEligibleShippingMethodsInput = {
    shippingAddress: CreateAddressInput;
    lines: Array<TestShippingMethodOrderLineInput>;
};

export type TestShippingMethodOrderLineInput = {
    productVariantId: Scalars['ID'];
    quantity: Scalars['Int'];
};

export type TestShippingMethodResult = {
    eligible: Scalars['Boolean'];
    quote?: Maybe<TestShippingMethodQuote>;
};

export type TestShippingMethodQuote = {
    price: Scalars['Int'];
    priceWithTax: Scalars['Int'];
    description: Scalars['String'];
    metadata?: Maybe<Scalars['JSON']>;
};

export type CreateTaxCategoryInput = {
    name: Scalars['String'];
};

export type UpdateTaxCategoryInput = {
    id: Scalars['ID'];
    name?: Maybe<Scalars['String']>;
};

export type CreateTaxRateInput = {
    name: Scalars['String'];
    enabled: Scalars['Boolean'];
    value: Scalars['Float'];
    categoryId: Scalars['ID'];
    zoneId: Scalars['ID'];
    customerGroupId?: Maybe<Scalars['ID']>;
};

export type UpdateTaxRateInput = {
    id: Scalars['ID'];
    name?: Maybe<Scalars['String']>;
    value?: Maybe<Scalars['Float']>;
    enabled?: Maybe<Scalars['Boolean']>;
    categoryId?: Maybe<Scalars['ID']>;
    zoneId?: Maybe<Scalars['ID']>;
    customerGroupId?: Maybe<Scalars['ID']>;
};

export type CreateZoneInput = {
    name: Scalars['String'];
    memberIds?: Maybe<Array<Scalars['ID']>>;
};

export type UpdateZoneInput = {
    id: Scalars['ID'];
    name?: Maybe<Scalars['String']>;
};

export enum GlobalFlag {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
    INHERIT = 'INHERIT',
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

export type Adjustment = {
    adjustmentSource: Scalars['String'];
    type: AdjustmentType;
    description: Scalars['String'];
    amount: Scalars['Int'];
};

export type ConfigArg = {
    name: Scalars['String'];
    value: Scalars['String'];
};

export type ConfigArgDefinition = {
    name: Scalars['String'];
    type: Scalars['String'];
    list: Scalars['Boolean'];
    label?: Maybe<Scalars['String']>;
    description?: Maybe<Scalars['String']>;
    ui?: Maybe<Scalars['JSON']>;
};

export type ConfigurableOperation = {
    code: Scalars['String'];
    args: Array<ConfigArg>;
};

export type ConfigurableOperationDefinition = {
    code: Scalars['String'];
    args: Array<ConfigArgDefinition>;
    description: Scalars['String'];
};

export enum DeletionResult {
    /** The entity was successfully deleted */
    DELETED = 'DELETED',
    /** Deletion did not take place, reason given in message */
    NOT_DELETED = 'NOT_DELETED',
}

/**
 * @description
 * Permissions for administrators and customers. Used to control access to
 * GraphQL resolvers via the {@link Allow} decorator.
 *
 * @docsCategory common
 */
export enum Permission {
    /** Authenticated means simply that the user is logged in */
    Authenticated = 'Authenticated',
    /** SuperAdmin has unrestricted access to all operations */
    SuperAdmin = 'SuperAdmin',
    /** Owner means the user owns this entity, e.g. a Customer's own Order */
    Owner = 'Owner',
    /** Public means any unauthenticated user may perform the operation */
    Public = 'Public',
    /** Grants permission to create Catalog */
    CreateCatalog = 'CreateCatalog',
    /** Grants permission to read Catalog */
    ReadCatalog = 'ReadCatalog',
    /** Grants permission to update Catalog */
    UpdateCatalog = 'UpdateCatalog',
    /** Grants permission to delete Catalog */
    DeleteCatalog = 'DeleteCatalog',
    /** Grants permission to create Customer */
    CreateCustomer = 'CreateCustomer',
    /** Grants permission to read Customer */
    ReadCustomer = 'ReadCustomer',
    /** Grants permission to update Customer */
    UpdateCustomer = 'UpdateCustomer',
    /** Grants permission to delete Customer */
    DeleteCustomer = 'DeleteCustomer',
    /** Grants permission to create Administrator */
    CreateAdministrator = 'CreateAdministrator',
    /** Grants permission to read Administrator */
    ReadAdministrator = 'ReadAdministrator',
    /** Grants permission to update Administrator */
    UpdateAdministrator = 'UpdateAdministrator',
    /** Grants permission to delete Administrator */
    DeleteAdministrator = 'DeleteAdministrator',
    /** Grants permission to create Order */
    CreateOrder = 'CreateOrder',
    /** Grants permission to read Order */
    ReadOrder = 'ReadOrder',
    /** Grants permission to update Order */
    UpdateOrder = 'UpdateOrder',
    /** Grants permission to delete Order */
    DeleteOrder = 'DeleteOrder',
    /** Grants permission to create Promotion */
    CreatePromotion = 'CreatePromotion',
    /** Grants permission to read Promotion */
    ReadPromotion = 'ReadPromotion',
    /** Grants permission to update Promotion */
    UpdatePromotion = 'UpdatePromotion',
    /** Grants permission to delete Promotion */
    DeletePromotion = 'DeletePromotion',
    /** Grants permission to create Settings */
    CreateSettings = 'CreateSettings',
    /** Grants permission to read Settings */
    ReadSettings = 'ReadSettings',
    /** Grants permission to update Settings */
    UpdateSettings = 'UpdateSettings',
    /** Grants permission to delete Settings */
    DeleteSettings = 'DeleteSettings',
}

export type DeletionResponse = {
    result: DeletionResult;
    message?: Maybe<Scalars['String']>;
};

export type ConfigArgInput = {
    name: Scalars['String'];
    value: Scalars['String'];
};

export type ConfigurableOperationInput = {
    code: Scalars['String'];
    arguments: Array<ConfigArgInput>;
};

export type PaginatedList = {
    items: Array<Node>;
    totalItems: Scalars['Int'];
};

export type Node = {
    id: Scalars['ID'];
};

export enum SortOrder {
    ASC = 'ASC',
    DESC = 'DESC',
}

export enum ErrorCode {
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
    MIME_TYPE_ERROR = 'MIME_TYPE_ERROR',
    LANGUAGE_NOT_AVAILABLE_ERROR = 'LANGUAGE_NOT_AVAILABLE_ERROR',
    CHANNEL_DEFAULT_LANGUAGE_ERROR = 'CHANNEL_DEFAULT_LANGUAGE_ERROR',
    SETTLE_PAYMENT_ERROR = 'SETTLE_PAYMENT_ERROR',
    EMPTY_ORDER_LINE_SELECTION_ERROR = 'EMPTY_ORDER_LINE_SELECTION_ERROR',
    ITEMS_ALREADY_FULFILLED_ERROR = 'ITEMS_ALREADY_FULFILLED_ERROR',
    INSUFFICIENT_STOCK_ON_HAND_ERROR = 'INSUFFICIENT_STOCK_ON_HAND_ERROR',
    MULTIPLE_ORDER_ERROR = 'MULTIPLE_ORDER_ERROR',
    CANCEL_ACTIVE_ORDER_ERROR = 'CANCEL_ACTIVE_ORDER_ERROR',
    PAYMENT_ORDER_MISMATCH_ERROR = 'PAYMENT_ORDER_MISMATCH_ERROR',
    REFUND_ORDER_STATE_ERROR = 'REFUND_ORDER_STATE_ERROR',
    NOTHING_TO_REFUND_ERROR = 'NOTHING_TO_REFUND_ERROR',
    ALREADY_REFUNDED_ERROR = 'ALREADY_REFUNDED_ERROR',
    QUANTITY_TOO_GREAT_ERROR = 'QUANTITY_TOO_GREAT_ERROR',
    REFUND_STATE_TRANSITION_ERROR = 'REFUND_STATE_TRANSITION_ERROR',
    PAYMENT_STATE_TRANSITION_ERROR = 'PAYMENT_STATE_TRANSITION_ERROR',
    FULFILLMENT_STATE_TRANSITION_ERROR = 'FULFILLMENT_STATE_TRANSITION_ERROR',
    PRODUCT_OPTION_IN_USE_ERROR = 'PRODUCT_OPTION_IN_USE_ERROR',
    MISSING_CONDITIONS_ERROR = 'MISSING_CONDITIONS_ERROR',
    NATIVE_AUTH_STRATEGY_ERROR = 'NATIVE_AUTH_STRATEGY_ERROR',
    INVALID_CREDENTIALS_ERROR = 'INVALID_CREDENTIALS_ERROR',
    ORDER_STATE_TRANSITION_ERROR = 'ORDER_STATE_TRANSITION_ERROR',
    EMAIL_ADDRESS_CONFLICT_ERROR = 'EMAIL_ADDRESS_CONFLICT_ERROR',
}

export type ErrorResult = {
    errorCode: ErrorCode;
    message: Scalars['String'];
};

export type StringOperators = {
    eq?: Maybe<Scalars['String']>;
    contains?: Maybe<Scalars['String']>;
};

export type BooleanOperators = {
    eq?: Maybe<Scalars['Boolean']>;
};

export type NumberRange = {
    start: Scalars['Float'];
    end: Scalars['Float'];
};

export type NumberOperators = {
    eq?: Maybe<Scalars['Float']>;
    lt?: Maybe<Scalars['Float']>;
    lte?: Maybe<Scalars['Float']>;
    gt?: Maybe<Scalars['Float']>;
    gte?: Maybe<Scalars['Float']>;
    between?: Maybe<NumberRange>;
};

export type DateRange = {
    start: Scalars['DateTime'];
    end: Scalars['DateTime'];
};

export type DateOperators = {
    eq?: Maybe<Scalars['DateTime']>;
    before?: Maybe<Scalars['DateTime']>;
    after?: Maybe<Scalars['DateTime']>;
    between?: Maybe<DateRange>;
};

export enum LogicalOperator {
    AND = 'AND',
    OR = 'OR',
}

export type SearchInput = {
    term?: Maybe<Scalars['String']>;
    facetValueIds?: Maybe<Array<Scalars['ID']>>;
    facetValueOperator?: Maybe<LogicalOperator>;
    collectionId?: Maybe<Scalars['ID']>;
    collectionSlug?: Maybe<Scalars['String']>;
    groupByProduct?: Maybe<Scalars['Boolean']>;
    take?: Maybe<Scalars['Int']>;
    skip?: Maybe<Scalars['Int']>;
    sort?: Maybe<SearchResultSortParameter>;
};

export type SearchResultSortParameter = {
    name?: Maybe<SortOrder>;
    price?: Maybe<SortOrder>;
};

export type CreateCustomerInput = {
    title?: Maybe<Scalars['String']>;
    firstName: Scalars['String'];
    lastName: Scalars['String'];
    phoneNumber?: Maybe<Scalars['String']>;
    emailAddress: Scalars['String'];
    customFields?: Maybe<Scalars['JSON']>;
};

export type CreateAddressInput = {
    fullName?: Maybe<Scalars['String']>;
    company?: Maybe<Scalars['String']>;
    streetLine1: Scalars['String'];
    streetLine2?: Maybe<Scalars['String']>;
    city?: Maybe<Scalars['String']>;
    province?: Maybe<Scalars['String']>;
    postalCode?: Maybe<Scalars['String']>;
    countryCode: Scalars['String'];
    phoneNumber?: Maybe<Scalars['String']>;
    defaultShippingAddress?: Maybe<Scalars['Boolean']>;
    defaultBillingAddress?: Maybe<Scalars['Boolean']>;
    customFields?: Maybe<Scalars['JSON']>;
};

export type UpdateAddressInput = {
    id: Scalars['ID'];
    fullName?: Maybe<Scalars['String']>;
    company?: Maybe<Scalars['String']>;
    streetLine1?: Maybe<Scalars['String']>;
    streetLine2?: Maybe<Scalars['String']>;
    city?: Maybe<Scalars['String']>;
    province?: Maybe<Scalars['String']>;
    postalCode?: Maybe<Scalars['String']>;
    countryCode?: Maybe<Scalars['String']>;
    phoneNumber?: Maybe<Scalars['String']>;
    defaultShippingAddress?: Maybe<Scalars['Boolean']>;
    defaultBillingAddress?: Maybe<Scalars['Boolean']>;
    customFields?: Maybe<Scalars['JSON']>;
};

/** Indicates that an operation succeeded, where we do not want to return any more specific information. */
export type Success = {
    success: Scalars['Boolean'];
};

/** Retured when attempting an operation that relies on the NativeAuthStrategy, if that strategy is not configured. */
export type NativeAuthStrategyError = ErrorResult & {
    errorCode: ErrorCode;
    message: Scalars['String'];
};

/** Returned if the user authentication credentials are not valid */
export type InvalidCredentialsError = ErrorResult & {
    errorCode: ErrorCode;
    message: Scalars['String'];
    authenticationError: Scalars['String'];
};

/** Returned if there is an error in transitioning the Order state */
export type OrderStateTransitionError = ErrorResult & {
    errorCode: ErrorCode;
    message: Scalars['String'];
    transitionError: Scalars['String'];
    fromState: Scalars['String'];
    toState: Scalars['String'];
};

/** Retured when attemting to create a Customer with an email address already registered to an existing User. */
export type EmailAddressConflictError = ErrorResult & {
    errorCode: ErrorCode;
    message: Scalars['String'];
};

/**
 * @description
 * ISO 4217 currency code
 *
 * @docsCategory common
 */
export enum CurrencyCode {
    /** United Arab Emirates dirham */
    AED = 'AED',
    /** Afghan afghani */
    AFN = 'AFN',
    /** Albanian lek */
    ALL = 'ALL',
    /** Armenian dram */
    AMD = 'AMD',
    /** Netherlands Antillean guilder */
    ANG = 'ANG',
    /** Angolan kwanza */
    AOA = 'AOA',
    /** Argentine peso */
    ARS = 'ARS',
    /** Australian dollar */
    AUD = 'AUD',
    /** Aruban florin */
    AWG = 'AWG',
    /** Azerbaijani manat */
    AZN = 'AZN',
    /** Bosnia and Herzegovina convertible mark */
    BAM = 'BAM',
    /** Barbados dollar */
    BBD = 'BBD',
    /** Bangladeshi taka */
    BDT = 'BDT',
    /** Bulgarian lev */
    BGN = 'BGN',
    /** Bahraini dinar */
    BHD = 'BHD',
    /** Burundian franc */
    BIF = 'BIF',
    /** Bermudian dollar */
    BMD = 'BMD',
    /** Brunei dollar */
    BND = 'BND',
    /** Boliviano */
    BOB = 'BOB',
    /** Brazilian real */
    BRL = 'BRL',
    /** Bahamian dollar */
    BSD = 'BSD',
    /** Bhutanese ngultrum */
    BTN = 'BTN',
    /** Botswana pula */
    BWP = 'BWP',
    /** Belarusian ruble */
    BYN = 'BYN',
    /** Belize dollar */
    BZD = 'BZD',
    /** Canadian dollar */
    CAD = 'CAD',
    /** Congolese franc */
    CDF = 'CDF',
    /** Swiss franc */
    CHF = 'CHF',
    /** Chilean peso */
    CLP = 'CLP',
    /** Renminbi (Chinese) yuan */
    CNY = 'CNY',
    /** Colombian peso */
    COP = 'COP',
    /** Costa Rican colon */
    CRC = 'CRC',
    /** Cuban convertible peso */
    CUC = 'CUC',
    /** Cuban peso */
    CUP = 'CUP',
    /** Cape Verde escudo */
    CVE = 'CVE',
    /** Czech koruna */
    CZK = 'CZK',
    /** Djiboutian franc */
    DJF = 'DJF',
    /** Danish krone */
    DKK = 'DKK',
    /** Dominican peso */
    DOP = 'DOP',
    /** Algerian dinar */
    DZD = 'DZD',
    /** Egyptian pound */
    EGP = 'EGP',
    /** Eritrean nakfa */
    ERN = 'ERN',
    /** Ethiopian birr */
    ETB = 'ETB',
    /** Euro */
    EUR = 'EUR',
    /** Fiji dollar */
    FJD = 'FJD',
    /** Falkland Islands pound */
    FKP = 'FKP',
    /** Pound sterling */
    GBP = 'GBP',
    /** Georgian lari */
    GEL = 'GEL',
    /** Ghanaian cedi */
    GHS = 'GHS',
    /** Gibraltar pound */
    GIP = 'GIP',
    /** Gambian dalasi */
    GMD = 'GMD',
    /** Guinean franc */
    GNF = 'GNF',
    /** Guatemalan quetzal */
    GTQ = 'GTQ',
    /** Guyanese dollar */
    GYD = 'GYD',
    /** Hong Kong dollar */
    HKD = 'HKD',
    /** Honduran lempira */
    HNL = 'HNL',
    /** Croatian kuna */
    HRK = 'HRK',
    /** Haitian gourde */
    HTG = 'HTG',
    /** Hungarian forint */
    HUF = 'HUF',
    /** Indonesian rupiah */
    IDR = 'IDR',
    /** Israeli new shekel */
    ILS = 'ILS',
    /** Indian rupee */
    INR = 'INR',
    /** Iraqi dinar */
    IQD = 'IQD',
    /** Iranian rial */
    IRR = 'IRR',
    /** Icelandic króna */
    ISK = 'ISK',
    /** Jamaican dollar */
    JMD = 'JMD',
    /** Jordanian dinar */
    JOD = 'JOD',
    /** Japanese yen */
    JPY = 'JPY',
    /** Kenyan shilling */
    KES = 'KES',
    /** Kyrgyzstani som */
    KGS = 'KGS',
    /** Cambodian riel */
    KHR = 'KHR',
    /** Comoro franc */
    KMF = 'KMF',
    /** North Korean won */
    KPW = 'KPW',
    /** South Korean won */
    KRW = 'KRW',
    /** Kuwaiti dinar */
    KWD = 'KWD',
    /** Cayman Islands dollar */
    KYD = 'KYD',
    /** Kazakhstani tenge */
    KZT = 'KZT',
    /** Lao kip */
    LAK = 'LAK',
    /** Lebanese pound */
    LBP = 'LBP',
    /** Sri Lankan rupee */
    LKR = 'LKR',
    /** Liberian dollar */
    LRD = 'LRD',
    /** Lesotho loti */
    LSL = 'LSL',
    /** Libyan dinar */
    LYD = 'LYD',
    /** Moroccan dirham */
    MAD = 'MAD',
    /** Moldovan leu */
    MDL = 'MDL',
    /** Malagasy ariary */
    MGA = 'MGA',
    /** Macedonian denar */
    MKD = 'MKD',
    /** Myanmar kyat */
    MMK = 'MMK',
    /** Mongolian tögrög */
    MNT = 'MNT',
    /** Macanese pataca */
    MOP = 'MOP',
    /** Mauritanian ouguiya */
    MRU = 'MRU',
    /** Mauritian rupee */
    MUR = 'MUR',
    /** Maldivian rufiyaa */
    MVR = 'MVR',
    /** Malawian kwacha */
    MWK = 'MWK',
    /** Mexican peso */
    MXN = 'MXN',
    /** Malaysian ringgit */
    MYR = 'MYR',
    /** Mozambican metical */
    MZN = 'MZN',
    /** Namibian dollar */
    NAD = 'NAD',
    /** Nigerian naira */
    NGN = 'NGN',
    /** Nicaraguan córdoba */
    NIO = 'NIO',
    /** Norwegian krone */
    NOK = 'NOK',
    /** Nepalese rupee */
    NPR = 'NPR',
    /** New Zealand dollar */
    NZD = 'NZD',
    /** Omani rial */
    OMR = 'OMR',
    /** Panamanian balboa */
    PAB = 'PAB',
    /** Peruvian sol */
    PEN = 'PEN',
    /** Papua New Guinean kina */
    PGK = 'PGK',
    /** Philippine peso */
    PHP = 'PHP',
    /** Pakistani rupee */
    PKR = 'PKR',
    /** Polish złoty */
    PLN = 'PLN',
    /** Paraguayan guaraní */
    PYG = 'PYG',
    /** Qatari riyal */
    QAR = 'QAR',
    /** Romanian leu */
    RON = 'RON',
    /** Serbian dinar */
    RSD = 'RSD',
    /** Russian ruble */
    RUB = 'RUB',
    /** Rwandan franc */
    RWF = 'RWF',
    /** Saudi riyal */
    SAR = 'SAR',
    /** Solomon Islands dollar */
    SBD = 'SBD',
    /** Seychelles rupee */
    SCR = 'SCR',
    /** Sudanese pound */
    SDG = 'SDG',
    /** Swedish krona/kronor */
    SEK = 'SEK',
    /** Singapore dollar */
    SGD = 'SGD',
    /** Saint Helena pound */
    SHP = 'SHP',
    /** Sierra Leonean leone */
    SLL = 'SLL',
    /** Somali shilling */
    SOS = 'SOS',
    /** Surinamese dollar */
    SRD = 'SRD',
    /** South Sudanese pound */
    SSP = 'SSP',
    /** São Tomé and Príncipe dobra */
    STN = 'STN',
    /** Salvadoran colón */
    SVC = 'SVC',
    /** Syrian pound */
    SYP = 'SYP',
    /** Swazi lilangeni */
    SZL = 'SZL',
    /** Thai baht */
    THB = 'THB',
    /** Tajikistani somoni */
    TJS = 'TJS',
    /** Turkmenistan manat */
    TMT = 'TMT',
    /** Tunisian dinar */
    TND = 'TND',
    /** Tongan paʻanga */
    TOP = 'TOP',
    /** Turkish lira */
    TRY = 'TRY',
    /** Trinidad and Tobago dollar */
    TTD = 'TTD',
    /** New Taiwan dollar */
    TWD = 'TWD',
    /** Tanzanian shilling */
    TZS = 'TZS',
    /** Ukrainian hryvnia */
    UAH = 'UAH',
    /** Ugandan shilling */
    UGX = 'UGX',
    /** United States dollar */
    USD = 'USD',
    /** Uruguayan peso */
    UYU = 'UYU',
    /** Uzbekistan som */
    UZS = 'UZS',
    /** Venezuelan bolívar soberano */
    VES = 'VES',
    /** Vietnamese đồng */
    VND = 'VND',
    /** Vanuatu vatu */
    VUV = 'VUV',
    /** Samoan tala */
    WST = 'WST',
    /** CFA franc BEAC */
    XAF = 'XAF',
    /** East Caribbean dollar */
    XCD = 'XCD',
    /** CFA franc BCEAO */
    XOF = 'XOF',
    /** CFP franc (franc Pacifique) */
    XPF = 'XPF',
    /** Yemeni rial */
    YER = 'YER',
    /** South African rand */
    ZAR = 'ZAR',
    /** Zambian kwacha */
    ZMW = 'ZMW',
    /** Zimbabwean dollar */
    ZWL = 'ZWL',
}

export type CustomField = {
    name: Scalars['String'];
    type: Scalars['String'];
    list: Scalars['Boolean'];
    label?: Maybe<Array<LocalizedString>>;
    description?: Maybe<Array<LocalizedString>>;
    readonly?: Maybe<Scalars['Boolean']>;
    internal?: Maybe<Scalars['Boolean']>;
};

export type StringCustomFieldConfig = CustomField & {
    name: Scalars['String'];
    type: Scalars['String'];
    list: Scalars['Boolean'];
    length?: Maybe<Scalars['Int']>;
    label?: Maybe<Array<LocalizedString>>;
    description?: Maybe<Array<LocalizedString>>;
    readonly?: Maybe<Scalars['Boolean']>;
    internal?: Maybe<Scalars['Boolean']>;
    pattern?: Maybe<Scalars['String']>;
    options?: Maybe<Array<StringFieldOption>>;
};

export type StringFieldOption = {
    value: Scalars['String'];
    label?: Maybe<Array<LocalizedString>>;
};

export type LocaleStringCustomFieldConfig = CustomField & {
    name: Scalars['String'];
    type: Scalars['String'];
    list: Scalars['Boolean'];
    length?: Maybe<Scalars['Int']>;
    label?: Maybe<Array<LocalizedString>>;
    description?: Maybe<Array<LocalizedString>>;
    readonly?: Maybe<Scalars['Boolean']>;
    internal?: Maybe<Scalars['Boolean']>;
    pattern?: Maybe<Scalars['String']>;
};

export type IntCustomFieldConfig = CustomField & {
    name: Scalars['String'];
    type: Scalars['String'];
    list: Scalars['Boolean'];
    label?: Maybe<Array<LocalizedString>>;
    description?: Maybe<Array<LocalizedString>>;
    readonly?: Maybe<Scalars['Boolean']>;
    internal?: Maybe<Scalars['Boolean']>;
    min?: Maybe<Scalars['Int']>;
    max?: Maybe<Scalars['Int']>;
    step?: Maybe<Scalars['Int']>;
};

export type FloatCustomFieldConfig = CustomField & {
    name: Scalars['String'];
    type: Scalars['String'];
    list: Scalars['Boolean'];
    label?: Maybe<Array<LocalizedString>>;
    description?: Maybe<Array<LocalizedString>>;
    readonly?: Maybe<Scalars['Boolean']>;
    internal?: Maybe<Scalars['Boolean']>;
    min?: Maybe<Scalars['Float']>;
    max?: Maybe<Scalars['Float']>;
    step?: Maybe<Scalars['Float']>;
};

export type BooleanCustomFieldConfig = CustomField & {
    name: Scalars['String'];
    type: Scalars['String'];
    list: Scalars['Boolean'];
    label?: Maybe<Array<LocalizedString>>;
    description?: Maybe<Array<LocalizedString>>;
    readonly?: Maybe<Scalars['Boolean']>;
    internal?: Maybe<Scalars['Boolean']>;
};

/**
 * Expects the same validation formats as the `<input type="datetime-local">` HTML element.
 * See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local#Additional_attributes
 */
export type DateTimeCustomFieldConfig = CustomField & {
    name: Scalars['String'];
    type: Scalars['String'];
    list: Scalars['Boolean'];
    label?: Maybe<Array<LocalizedString>>;
    description?: Maybe<Array<LocalizedString>>;
    readonly?: Maybe<Scalars['Boolean']>;
    internal?: Maybe<Scalars['Boolean']>;
    min?: Maybe<Scalars['String']>;
    max?: Maybe<Scalars['String']>;
    step?: Maybe<Scalars['Int']>;
};

export type LocalizedString = {
    languageCode: LanguageCode;
    value: Scalars['String'];
};

export type CustomFieldConfig =
    | StringCustomFieldConfig
    | LocaleStringCustomFieldConfig
    | IntCustomFieldConfig
    | FloatCustomFieldConfig
    | BooleanCustomFieldConfig
    | DateTimeCustomFieldConfig;

/**
 * @description
 * Languages in the form of a ISO 639-1 language code with optional
 * region or script modifier (e.g. de_AT). The selection available is based
 * on the [Unicode CLDR summary list](https://unicode-org.github.io/cldr-staging/charts/37/summary/root.html)
 * and includes the major spoken languages of the world and any widely-used variants.
 *
 * @docsCategory common
 */
export enum LanguageCode {
    /** Afrikaans */
    af = 'af',
    /** Akan */
    ak = 'ak',
    /** Albanian */
    sq = 'sq',
    /** Amharic */
    am = 'am',
    /** Arabic */
    ar = 'ar',
    /** Armenian */
    hy = 'hy',
    /** Assamese */
    as = 'as',
    /** Azerbaijani */
    az = 'az',
    /** Bambara */
    bm = 'bm',
    /** Bangla */
    bn = 'bn',
    /** Basque */
    eu = 'eu',
    /** Belarusian */
    be = 'be',
    /** Bosnian */
    bs = 'bs',
    /** Breton */
    br = 'br',
    /** Bulgarian */
    bg = 'bg',
    /** Burmese */
    my = 'my',
    /** Catalan */
    ca = 'ca',
    /** Chechen */
    ce = 'ce',
    /** Chinese */
    zh = 'zh',
    /** Simplified Chinese */
    zh_Hans = 'zh_Hans',
    /** Traditional Chinese */
    zh_Hant = 'zh_Hant',
    /** Church Slavic */
    cu = 'cu',
    /** Cornish */
    kw = 'kw',
    /** Corsican */
    co = 'co',
    /** Croatian */
    hr = 'hr',
    /** Czech */
    cs = 'cs',
    /** Danish */
    da = 'da',
    /** Dutch */
    nl = 'nl',
    /** Flemish */
    nl_BE = 'nl_BE',
    /** Dzongkha */
    dz = 'dz',
    /** English */
    en = 'en',
    /** Australian English */
    en_AU = 'en_AU',
    /** Canadian English */
    en_CA = 'en_CA',
    /** British English */
    en_GB = 'en_GB',
    /** American English */
    en_US = 'en_US',
    /** Esperanto */
    eo = 'eo',
    /** Estonian */
    et = 'et',
    /** Ewe */
    ee = 'ee',
    /** Faroese */
    fo = 'fo',
    /** Finnish */
    fi = 'fi',
    /** French */
    fr = 'fr',
    /** Canadian French */
    fr_CA = 'fr_CA',
    /** Swiss French */
    fr_CH = 'fr_CH',
    /** Fulah */
    ff = 'ff',
    /** Galician */
    gl = 'gl',
    /** Ganda */
    lg = 'lg',
    /** Georgian */
    ka = 'ka',
    /** German */
    de = 'de',
    /** Austrian German */
    de_AT = 'de_AT',
    /** Swiss High German */
    de_CH = 'de_CH',
    /** Greek */
    el = 'el',
    /** Gujarati */
    gu = 'gu',
    /** Haitian Creole */
    ht = 'ht',
    /** Hausa */
    ha = 'ha',
    /** Hebrew */
    he = 'he',
    /** Hindi */
    hi = 'hi',
    /** Hungarian */
    hu = 'hu',
    /** Icelandic */
    is = 'is',
    /** Igbo */
    ig = 'ig',
    /** Indonesian */
    id = 'id',
    /** Interlingua */
    ia = 'ia',
    /** Irish */
    ga = 'ga',
    /** Italian */
    it = 'it',
    /** Japanese */
    ja = 'ja',
    /** Javanese */
    jv = 'jv',
    /** Kalaallisut */
    kl = 'kl',
    /** Kannada */
    kn = 'kn',
    /** Kashmiri */
    ks = 'ks',
    /** Kazakh */
    kk = 'kk',
    /** Khmer */
    km = 'km',
    /** Kikuyu */
    ki = 'ki',
    /** Kinyarwanda */
    rw = 'rw',
    /** Korean */
    ko = 'ko',
    /** Kurdish */
    ku = 'ku',
    /** Kyrgyz */
    ky = 'ky',
    /** Lao */
    lo = 'lo',
    /** Latin */
    la = 'la',
    /** Latvian */
    lv = 'lv',
    /** Lingala */
    ln = 'ln',
    /** Lithuanian */
    lt = 'lt',
    /** Luba-Katanga */
    lu = 'lu',
    /** Luxembourgish */
    lb = 'lb',
    /** Macedonian */
    mk = 'mk',
    /** Malagasy */
    mg = 'mg',
    /** Malay */
    ms = 'ms',
    /** Malayalam */
    ml = 'ml',
    /** Maltese */
    mt = 'mt',
    /** Manx */
    gv = 'gv',
    /** Maori */
    mi = 'mi',
    /** Marathi */
    mr = 'mr',
    /** Mongolian */
    mn = 'mn',
    /** Nepali */
    ne = 'ne',
    /** North Ndebele */
    nd = 'nd',
    /** Northern Sami */
    se = 'se',
    /** Norwegian Bokmål */
    nb = 'nb',
    /** Norwegian Nynorsk */
    nn = 'nn',
    /** Nyanja */
    ny = 'ny',
    /** Odia */
    or = 'or',
    /** Oromo */
    om = 'om',
    /** Ossetic */
    os = 'os',
    /** Pashto */
    ps = 'ps',
    /** Persian */
    fa = 'fa',
    /** Dari */
    fa_AF = 'fa_AF',
    /** Polish */
    pl = 'pl',
    /** Portuguese */
    pt = 'pt',
    /** Brazilian Portuguese */
    pt_BR = 'pt_BR',
    /** European Portuguese */
    pt_PT = 'pt_PT',
    /** Punjabi */
    pa = 'pa',
    /** Quechua */
    qu = 'qu',
    /** Romanian */
    ro = 'ro',
    /** Moldavian */
    ro_MD = 'ro_MD',
    /** Romansh */
    rm = 'rm',
    /** Rundi */
    rn = 'rn',
    /** Russian */
    ru = 'ru',
    /** Samoan */
    sm = 'sm',
    /** Sango */
    sg = 'sg',
    /** Sanskrit */
    sa = 'sa',
    /** Scottish Gaelic */
    gd = 'gd',
    /** Serbian */
    sr = 'sr',
    /** Shona */
    sn = 'sn',
    /** Sichuan Yi */
    ii = 'ii',
    /** Sindhi */
    sd = 'sd',
    /** Sinhala */
    si = 'si',
    /** Slovak */
    sk = 'sk',
    /** Slovenian */
    sl = 'sl',
    /** Somali */
    so = 'so',
    /** Southern Sotho */
    st = 'st',
    /** Spanish */
    es = 'es',
    /** European Spanish */
    es_ES = 'es_ES',
    /** Mexican Spanish */
    es_MX = 'es_MX',
    /** Sundanese */
    su = 'su',
    /** Swahili */
    sw = 'sw',
    /** Congo Swahili */
    sw_CD = 'sw_CD',
    /** Swedish */
    sv = 'sv',
    /** Tajik */
    tg = 'tg',
    /** Tamil */
    ta = 'ta',
    /** Tatar */
    tt = 'tt',
    /** Telugu */
    te = 'te',
    /** Thai */
    th = 'th',
    /** Tibetan */
    bo = 'bo',
    /** Tigrinya */
    ti = 'ti',
    /** Tongan */
    to = 'to',
    /** Turkish */
    tr = 'tr',
    /** Turkmen */
    tk = 'tk',
    /** Ukrainian */
    uk = 'uk',
    /** Urdu */
    ur = 'ur',
    /** Uyghur */
    ug = 'ug',
    /** Uzbek */
    uz = 'uz',
    /** Vietnamese */
    vi = 'vi',
    /** Volapük */
    vo = 'vo',
    /** Welsh */
    cy = 'cy',
    /** Western Frisian */
    fy = 'fy',
    /** Wolof */
    wo = 'wo',
    /** Xhosa */
    xh = 'xh',
    /** Yiddish */
    yi = 'yi',
    /** Yoruba */
    yo = 'yo',
    /** Zulu */
    zu = 'zu',
}

export type Address = Node & {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    fullName?: Maybe<Scalars['String']>;
    company?: Maybe<Scalars['String']>;
    streetLine1: Scalars['String'];
    streetLine2?: Maybe<Scalars['String']>;
    city?: Maybe<Scalars['String']>;
    province?: Maybe<Scalars['String']>;
    postalCode?: Maybe<Scalars['String']>;
    country: Country;
    phoneNumber?: Maybe<Scalars['String']>;
    defaultShippingAddress?: Maybe<Scalars['Boolean']>;
    defaultBillingAddress?: Maybe<Scalars['Boolean']>;
    customFields?: Maybe<Scalars['JSON']>;
};

export type Administrator = Node & {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    firstName: Scalars['String'];
    lastName: Scalars['String'];
    emailAddress: Scalars['String'];
    user: User;
};

export type AdministratorList = PaginatedList & {
    items: Array<Administrator>;
    totalItems: Scalars['Int'];
};

export type Asset = Node & {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    name: Scalars['String'];
    type: AssetType;
    fileSize: Scalars['Int'];
    mimeType: Scalars['String'];
    width: Scalars['Int'];
    height: Scalars['Int'];
    source: Scalars['String'];
    preview: Scalars['String'];
    focalPoint?: Maybe<Coordinate>;
};

export type Coordinate = {
    x: Scalars['Float'];
    y: Scalars['Float'];
};

export type AssetList = PaginatedList & {
    items: Array<Asset>;
    totalItems: Scalars['Int'];
};

export enum AssetType {
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO',
    BINARY = 'BINARY',
}

export type CurrentUser = {
    id: Scalars['ID'];
    identifier: Scalars['String'];
    channels: Array<CurrentUserChannel>;
};

export type CurrentUserChannel = {
    id: Scalars['ID'];
    token: Scalars['String'];
    code: Scalars['String'];
    permissions: Array<Permission>;
};

export type Channel = Node & {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    code: Scalars['String'];
    token: Scalars['String'];
    defaultTaxZone?: Maybe<Zone>;
    defaultShippingZone?: Maybe<Zone>;
    defaultLanguageCode: LanguageCode;
    currencyCode: CurrencyCode;
    pricesIncludeTax: Scalars['Boolean'];
};

export type CollectionBreadcrumb = {
    id: Scalars['ID'];
    name: Scalars['String'];
    slug: Scalars['String'];
};

export type CollectionTranslation = {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    languageCode: LanguageCode;
    name: Scalars['String'];
    slug: Scalars['String'];
    description: Scalars['String'];
};

export type CollectionList = PaginatedList & {
    items: Array<Collection>;
    totalItems: Scalars['Int'];
};

export type ProductVariantList = PaginatedList & {
    items: Array<ProductVariant>;
    totalItems: Scalars['Int'];
};

export type Country = Node & {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    languageCode: LanguageCode;
    code: Scalars['String'];
    name: Scalars['String'];
    enabled: Scalars['Boolean'];
    translations: Array<CountryTranslation>;
};

export type CountryTranslation = {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    languageCode: LanguageCode;
    name: Scalars['String'];
};

export type CountryList = PaginatedList & {
    items: Array<Country>;
    totalItems: Scalars['Int'];
};

export type CustomerGroup = Node & {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    name: Scalars['String'];
    customers: CustomerList;
};

export type CustomerGroupCustomersArgs = {
    options?: Maybe<CustomerListOptions>;
};

export type CustomerList = PaginatedList & {
    items: Array<Customer>;
    totalItems: Scalars['Int'];
};

export type FacetValue = Node & {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    languageCode: LanguageCode;
    facet: Facet;
    name: Scalars['String'];
    code: Scalars['String'];
    translations: Array<FacetValueTranslation>;
    customFields?: Maybe<Scalars['JSON']>;
};

export type FacetValueTranslation = {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    languageCode: LanguageCode;
    name: Scalars['String'];
};

export type FacetTranslation = {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    languageCode: LanguageCode;
    name: Scalars['String'];
};

export type FacetList = PaginatedList & {
    items: Array<Facet>;
    totalItems: Scalars['Int'];
};

export type GlobalSettings = {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    availableLanguages: Array<LanguageCode>;
    trackInventory: Scalars['Boolean'];
    outOfStockThreshold: Scalars['Int'];
    serverConfig: ServerConfig;
    customFields?: Maybe<Scalars['JSON']>;
};

export type OrderProcessState = {
    name: Scalars['String'];
    to: Array<Scalars['String']>;
};

export type PermissionDefinition = {
    name: Scalars['String'];
    description: Scalars['String'];
    assignable: Scalars['Boolean'];
};

export type ServerConfig = {
    orderProcess: Array<OrderProcessState>;
    permittedAssetTypes: Array<Scalars['String']>;
    permissions: Array<PermissionDefinition>;
    customFieldConfig: CustomFields;
};

export type HistoryEntry = Node & {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    isPublic: Scalars['Boolean'];
    type: HistoryEntryType;
    administrator?: Maybe<Administrator>;
    data: Scalars['JSON'];
};

export enum HistoryEntryType {
    CUSTOMER_REGISTERED = 'CUSTOMER_REGISTERED',
    CUSTOMER_VERIFIED = 'CUSTOMER_VERIFIED',
    CUSTOMER_DETAIL_UPDATED = 'CUSTOMER_DETAIL_UPDATED',
    CUSTOMER_ADDED_TO_GROUP = 'CUSTOMER_ADDED_TO_GROUP',
    CUSTOMER_REMOVED_FROM_GROUP = 'CUSTOMER_REMOVED_FROM_GROUP',
    CUSTOMER_ADDRESS_CREATED = 'CUSTOMER_ADDRESS_CREATED',
    CUSTOMER_ADDRESS_UPDATED = 'CUSTOMER_ADDRESS_UPDATED',
    CUSTOMER_ADDRESS_DELETED = 'CUSTOMER_ADDRESS_DELETED',
    CUSTOMER_PASSWORD_UPDATED = 'CUSTOMER_PASSWORD_UPDATED',
    CUSTOMER_PASSWORD_RESET_REQUESTED = 'CUSTOMER_PASSWORD_RESET_REQUESTED',
    CUSTOMER_PASSWORD_RESET_VERIFIED = 'CUSTOMER_PASSWORD_RESET_VERIFIED',
    CUSTOMER_EMAIL_UPDATE_REQUESTED = 'CUSTOMER_EMAIL_UPDATE_REQUESTED',
    CUSTOMER_EMAIL_UPDATE_VERIFIED = 'CUSTOMER_EMAIL_UPDATE_VERIFIED',
    CUSTOMER_NOTE = 'CUSTOMER_NOTE',
    ORDER_STATE_TRANSITION = 'ORDER_STATE_TRANSITION',
    ORDER_PAYMENT_TRANSITION = 'ORDER_PAYMENT_TRANSITION',
    ORDER_FULFILLMENT = 'ORDER_FULFILLMENT',
    ORDER_CANCELLATION = 'ORDER_CANCELLATION',
    ORDER_REFUND_TRANSITION = 'ORDER_REFUND_TRANSITION',
    ORDER_FULFILLMENT_TRANSITION = 'ORDER_FULFILLMENT_TRANSITION',
    ORDER_NOTE = 'ORDER_NOTE',
    ORDER_COUPON_APPLIED = 'ORDER_COUPON_APPLIED',
    ORDER_COUPON_REMOVED = 'ORDER_COUPON_REMOVED',
}

export type HistoryEntryList = PaginatedList & {
    items: Array<HistoryEntry>;
    totalItems: Scalars['Int'];
};

export type ImportInfo = {
    errors?: Maybe<Array<Scalars['String']>>;
    processed: Scalars['Int'];
    imported: Scalars['Int'];
};

/**
 * A summary of the taxes being applied to this order, grouped
 * by taxRate.
 */
export type OrderTaxSummary = {
    /** The taxRate as a percentage */
    taxRate: Scalars['Float'];
    /** The total net price or OrderItems to which this taxRate applies */
    taxBase: Scalars['Int'];
    /** The total tax being applied to the Order at this taxRate */
    taxTotal: Scalars['Int'];
};

export type OrderAddress = {
    fullName?: Maybe<Scalars['String']>;
    company?: Maybe<Scalars['String']>;
    streetLine1?: Maybe<Scalars['String']>;
    streetLine2?: Maybe<Scalars['String']>;
    city?: Maybe<Scalars['String']>;
    province?: Maybe<Scalars['String']>;
    postalCode?: Maybe<Scalars['String']>;
    country?: Maybe<Scalars['String']>;
    countryCode?: Maybe<Scalars['String']>;
    phoneNumber?: Maybe<Scalars['String']>;
};

export type OrderList = PaginatedList & {
    items: Array<Order>;
    totalItems: Scalars['Int'];
};

export type ShippingMethodQuote = {
    id: Scalars['ID'];
    price: Scalars['Int'];
    priceWithTax: Scalars['Int'];
    description: Scalars['String'];
    metadata?: Maybe<Scalars['JSON']>;
};

export type OrderItem = Node & {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    cancelled: Scalars['Boolean'];
    /** The price of a single unit, excluding tax */
    unitPrice: Scalars['Int'];
    /** The price of a single unit, including tax */
    unitPriceWithTax: Scalars['Int'];
    /** @deprecated `unitPrice` is now always without tax */
    unitPriceIncludesTax: Scalars['Boolean'];
    taxRate: Scalars['Float'];
    adjustments: Array<Adjustment>;
    fulfillment?: Maybe<Fulfillment>;
    refundId?: Maybe<Scalars['ID']>;
};

export type OrderLine = Node & {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    productVariant: ProductVariant;
    featuredAsset?: Maybe<Asset>;
    unitPrice: Scalars['Int'];
    unitPriceWithTax: Scalars['Int'];
    quantity: Scalars['Int'];
    items: Array<OrderItem>;
    /** @deprecated Use `linePriceWithTax` instead */
    totalPrice: Scalars['Int'];
    taxRate: Scalars['Float'];
    /** The total price of the line excluding tax */
    linePrice: Scalars['Int'];
    /** The total tax on this line */
    lineTax: Scalars['Int'];
    /** The total price of the line including tax */
    linePriceWithTax: Scalars['Int'];
    adjustments: Array<Adjustment>;
    order: Order;
    customFields?: Maybe<Scalars['JSON']>;
};

export type Payment = Node & {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    method: Scalars['String'];
    amount: Scalars['Int'];
    state: Scalars['String'];
    transactionId?: Maybe<Scalars['String']>;
    errorMessage?: Maybe<Scalars['String']>;
    refunds: Array<Refund>;
    metadata?: Maybe<Scalars['JSON']>;
};

export type Refund = Node & {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    items: Scalars['Int'];
    shipping: Scalars['Int'];
    adjustment: Scalars['Int'];
    total: Scalars['Int'];
    method?: Maybe<Scalars['String']>;
    state: Scalars['String'];
    transactionId?: Maybe<Scalars['String']>;
    reason?: Maybe<Scalars['String']>;
    orderItems: Array<OrderItem>;
    paymentId: Scalars['ID'];
    metadata?: Maybe<Scalars['JSON']>;
};

export type PaymentMethod = Node & {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    code: Scalars['String'];
    enabled: Scalars['Boolean'];
    configArgs: Array<ConfigArg>;
    definition: ConfigurableOperationDefinition;
};

export type ProductOptionGroup = Node & {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    languageCode: LanguageCode;
    code: Scalars['String'];
    name: Scalars['String'];
    options: Array<ProductOption>;
    translations: Array<ProductOptionGroupTranslation>;
    customFields?: Maybe<Scalars['JSON']>;
};

export type ProductOptionGroupTranslation = {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    languageCode: LanguageCode;
    name: Scalars['String'];
};

export type ProductOption = Node & {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    languageCode: LanguageCode;
    code: Scalars['String'];
    name: Scalars['String'];
    groupId: Scalars['ID'];
    group: ProductOptionGroup;
    translations: Array<ProductOptionTranslation>;
    customFields?: Maybe<Scalars['JSON']>;
};

export type ProductOptionTranslation = {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    languageCode: LanguageCode;
    name: Scalars['String'];
};

export type SearchReindexResponse = {
    success: Scalars['Boolean'];
};

export type SearchResponse = {
    items: Array<SearchResult>;
    totalItems: Scalars['Int'];
    facetValues: Array<FacetValueResult>;
};

/**
 * Which FacetValues are present in the products returned
 * by the search, and in what quantity.
 */
export type FacetValueResult = {
    facetValue: FacetValue;
    count: Scalars['Int'];
};

export type SearchResultAsset = {
    id: Scalars['ID'];
    preview: Scalars['String'];
    focalPoint?: Maybe<Coordinate>;
};

/** The price of a search result product, either as a range or as a single price */
export type SearchResultPrice = PriceRange | SinglePrice;

/** The price value where the result has a single price */
export type SinglePrice = {
    value: Scalars['Int'];
};

/** The price range where the result has more than one price */
export type PriceRange = {
    min: Scalars['Int'];
    max: Scalars['Int'];
};

export type ProductTranslation = {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    languageCode: LanguageCode;
    name: Scalars['String'];
    slug: Scalars['String'];
    description: Scalars['String'];
};

export type ProductList = PaginatedList & {
    items: Array<Product>;
    totalItems: Scalars['Int'];
};

export type ProductVariantTranslation = {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    languageCode: LanguageCode;
    name: Scalars['String'];
};

export type Promotion = Node & {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    startsAt?: Maybe<Scalars['DateTime']>;
    endsAt?: Maybe<Scalars['DateTime']>;
    couponCode?: Maybe<Scalars['String']>;
    perCustomerUsageLimit?: Maybe<Scalars['Int']>;
    name: Scalars['String'];
    enabled: Scalars['Boolean'];
    conditions: Array<ConfigurableOperation>;
    actions: Array<ConfigurableOperation>;
};

export type PromotionList = PaginatedList & {
    items: Array<Promotion>;
    totalItems: Scalars['Int'];
};

export type Role = Node & {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    code: Scalars['String'];
    description: Scalars['String'];
    permissions: Array<Permission>;
    channels: Array<Channel>;
};

export type RoleList = PaginatedList & {
    items: Array<Role>;
    totalItems: Scalars['Int'];
};

export type ShippingMethod = Node & {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    code: Scalars['String'];
    description: Scalars['String'];
    checker: ConfigurableOperation;
    calculator: ConfigurableOperation;
    customFields?: Maybe<Scalars['JSON']>;
};

export type ShippingMethodList = PaginatedList & {
    items: Array<ShippingMethod>;
    totalItems: Scalars['Int'];
};

export enum StockMovementType {
    ADJUSTMENT = 'ADJUSTMENT',
    ALLOCATION = 'ALLOCATION',
    RELEASE = 'RELEASE',
    SALE = 'SALE',
    CANCELLATION = 'CANCELLATION',
    RETURN = 'RETURN',
}

export type StockMovement = {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    productVariant: ProductVariant;
    type: StockMovementType;
    quantity: Scalars['Int'];
};

export type StockAdjustment = Node &
    StockMovement & {
        id: Scalars['ID'];
        createdAt: Scalars['DateTime'];
        updatedAt: Scalars['DateTime'];
        productVariant: ProductVariant;
        type: StockMovementType;
        quantity: Scalars['Int'];
    };

export type Allocation = Node &
    StockMovement & {
        id: Scalars['ID'];
        createdAt: Scalars['DateTime'];
        updatedAt: Scalars['DateTime'];
        productVariant: ProductVariant;
        type: StockMovementType;
        quantity: Scalars['Int'];
        orderLine: OrderLine;
    };

export type Sale = Node &
    StockMovement & {
        id: Scalars['ID'];
        createdAt: Scalars['DateTime'];
        updatedAt: Scalars['DateTime'];
        productVariant: ProductVariant;
        type: StockMovementType;
        quantity: Scalars['Int'];
        orderItem: OrderItem;
    };

export type Cancellation = Node &
    StockMovement & {
        id: Scalars['ID'];
        createdAt: Scalars['DateTime'];
        updatedAt: Scalars['DateTime'];
        productVariant: ProductVariant;
        type: StockMovementType;
        quantity: Scalars['Int'];
        orderLine: OrderLine;
    };

export type Return = Node &
    StockMovement & {
        id: Scalars['ID'];
        createdAt: Scalars['DateTime'];
        updatedAt: Scalars['DateTime'];
        productVariant: ProductVariant;
        type: StockMovementType;
        quantity: Scalars['Int'];
        orderItem: OrderItem;
    };

export type Release = Node &
    StockMovement & {
        id: Scalars['ID'];
        createdAt: Scalars['DateTime'];
        updatedAt: Scalars['DateTime'];
        productVariant: ProductVariant;
        type: StockMovementType;
        quantity: Scalars['Int'];
        orderItem: OrderItem;
    };

export type StockMovementItem = StockAdjustment | Allocation | Sale | Cancellation | Return | Release;

export type StockMovementList = {
    items: Array<StockMovementItem>;
    totalItems: Scalars['Int'];
};

export type TaxCategory = Node & {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    name: Scalars['String'];
};

export type TaxRate = Node & {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    name: Scalars['String'];
    enabled: Scalars['Boolean'];
    value: Scalars['Float'];
    category: TaxCategory;
    zone: Zone;
    customerGroup?: Maybe<CustomerGroup>;
};

export type TaxRateList = PaginatedList & {
    items: Array<TaxRate>;
    totalItems: Scalars['Int'];
};

export type User = Node & {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    identifier: Scalars['String'];
    verified: Scalars['Boolean'];
    roles: Array<Role>;
    lastLogin?: Maybe<Scalars['DateTime']>;
    authenticationMethods: Array<AuthenticationMethod>;
    customFields?: Maybe<Scalars['JSON']>;
};

export type AuthenticationMethod = Node & {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    strategy: Scalars['String'];
};

export type Zone = Node & {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    name: Scalars['String'];
    members: Array<Country>;
};

export type AdministratorListOptions = {
    skip?: Maybe<Scalars['Int']>;
    take?: Maybe<Scalars['Int']>;
    sort?: Maybe<AdministratorSortParameter>;
    filter?: Maybe<AdministratorFilterParameter>;
};

export type AssetListOptions = {
    skip?: Maybe<Scalars['Int']>;
    take?: Maybe<Scalars['Int']>;
    sort?: Maybe<AssetSortParameter>;
    filter?: Maybe<AssetFilterParameter>;
};

export type CollectionListOptions = {
    skip?: Maybe<Scalars['Int']>;
    take?: Maybe<Scalars['Int']>;
    sort?: Maybe<CollectionSortParameter>;
    filter?: Maybe<CollectionFilterParameter>;
};

export type CountryListOptions = {
    skip?: Maybe<Scalars['Int']>;
    take?: Maybe<Scalars['Int']>;
    sort?: Maybe<CountrySortParameter>;
    filter?: Maybe<CountryFilterParameter>;
};

export type CustomerGroupListOptions = {
    skip?: Maybe<Scalars['Int']>;
    take?: Maybe<Scalars['Int']>;
    sort?: Maybe<CustomerGroupSortParameter>;
    filter?: Maybe<CustomerGroupFilterParameter>;
};

export type CustomerListOptions = {
    skip?: Maybe<Scalars['Int']>;
    take?: Maybe<Scalars['Int']>;
    sort?: Maybe<CustomerSortParameter>;
    filter?: Maybe<CustomerFilterParameter>;
};

export type FacetListOptions = {
    skip?: Maybe<Scalars['Int']>;
    take?: Maybe<Scalars['Int']>;
    sort?: Maybe<FacetSortParameter>;
    filter?: Maybe<FacetFilterParameter>;
};

export type JobListOptions = {
    skip?: Maybe<Scalars['Int']>;
    take?: Maybe<Scalars['Int']>;
    sort?: Maybe<JobSortParameter>;
    filter?: Maybe<JobFilterParameter>;
};

export type OrderListOptions = {
    skip?: Maybe<Scalars['Int']>;
    take?: Maybe<Scalars['Int']>;
    sort?: Maybe<OrderSortParameter>;
    filter?: Maybe<OrderFilterParameter>;
};

export type PaymentMethodListOptions = {
    skip?: Maybe<Scalars['Int']>;
    take?: Maybe<Scalars['Int']>;
    sort?: Maybe<PaymentMethodSortParameter>;
    filter?: Maybe<PaymentMethodFilterParameter>;
};

export type ProductListOptions = {
    skip?: Maybe<Scalars['Int']>;
    take?: Maybe<Scalars['Int']>;
    sort?: Maybe<ProductSortParameter>;
    filter?: Maybe<ProductFilterParameter>;
};

export type PromotionListOptions = {
    skip?: Maybe<Scalars['Int']>;
    take?: Maybe<Scalars['Int']>;
    sort?: Maybe<PromotionSortParameter>;
    filter?: Maybe<PromotionFilterParameter>;
};

export type RoleListOptions = {
    skip?: Maybe<Scalars['Int']>;
    take?: Maybe<Scalars['Int']>;
    sort?: Maybe<RoleSortParameter>;
    filter?: Maybe<RoleFilterParameter>;
};

export type ShippingMethodListOptions = {
    skip?: Maybe<Scalars['Int']>;
    take?: Maybe<Scalars['Int']>;
    sort?: Maybe<ShippingMethodSortParameter>;
    filter?: Maybe<ShippingMethodFilterParameter>;
};

export type TaxRateListOptions = {
    skip?: Maybe<Scalars['Int']>;
    take?: Maybe<Scalars['Int']>;
    sort?: Maybe<TaxRateSortParameter>;
    filter?: Maybe<TaxRateFilterParameter>;
};

export type ProductVariantListOptions = {
    skip?: Maybe<Scalars['Int']>;
    take?: Maybe<Scalars['Int']>;
    sort?: Maybe<ProductVariantSortParameter>;
    filter?: Maybe<ProductVariantFilterParameter>;
};

export type HistoryEntryListOptions = {
    skip?: Maybe<Scalars['Int']>;
    take?: Maybe<Scalars['Int']>;
    sort?: Maybe<HistoryEntrySortParameter>;
    filter?: Maybe<HistoryEntryFilterParameter>;
};

export type AdministratorFilterParameter = {
    createdAt?: Maybe<DateOperators>;
    updatedAt?: Maybe<DateOperators>;
    firstName?: Maybe<StringOperators>;
    lastName?: Maybe<StringOperators>;
    emailAddress?: Maybe<StringOperators>;
};

export type AdministratorSortParameter = {
    id?: Maybe<SortOrder>;
    createdAt?: Maybe<SortOrder>;
    updatedAt?: Maybe<SortOrder>;
    firstName?: Maybe<SortOrder>;
    lastName?: Maybe<SortOrder>;
    emailAddress?: Maybe<SortOrder>;
};

export type AssetFilterParameter = {
    createdAt?: Maybe<DateOperators>;
    updatedAt?: Maybe<DateOperators>;
    name?: Maybe<StringOperators>;
    type?: Maybe<StringOperators>;
    fileSize?: Maybe<NumberOperators>;
    mimeType?: Maybe<StringOperators>;
    width?: Maybe<NumberOperators>;
    height?: Maybe<NumberOperators>;
    source?: Maybe<StringOperators>;
    preview?: Maybe<StringOperators>;
};

export type AssetSortParameter = {
    id?: Maybe<SortOrder>;
    createdAt?: Maybe<SortOrder>;
    updatedAt?: Maybe<SortOrder>;
    name?: Maybe<SortOrder>;
    fileSize?: Maybe<SortOrder>;
    mimeType?: Maybe<SortOrder>;
    width?: Maybe<SortOrder>;
    height?: Maybe<SortOrder>;
    source?: Maybe<SortOrder>;
    preview?: Maybe<SortOrder>;
};

export type CollectionFilterParameter = {
    isPrivate?: Maybe<BooleanOperators>;
    createdAt?: Maybe<DateOperators>;
    updatedAt?: Maybe<DateOperators>;
    languageCode?: Maybe<StringOperators>;
    name?: Maybe<StringOperators>;
    slug?: Maybe<StringOperators>;
    position?: Maybe<NumberOperators>;
    description?: Maybe<StringOperators>;
};

export type CollectionSortParameter = {
    id?: Maybe<SortOrder>;
    createdAt?: Maybe<SortOrder>;
    updatedAt?: Maybe<SortOrder>;
    name?: Maybe<SortOrder>;
    slug?: Maybe<SortOrder>;
    position?: Maybe<SortOrder>;
    description?: Maybe<SortOrder>;
};

export type CountryFilterParameter = {
    createdAt?: Maybe<DateOperators>;
    updatedAt?: Maybe<DateOperators>;
    languageCode?: Maybe<StringOperators>;
    code?: Maybe<StringOperators>;
    name?: Maybe<StringOperators>;
    enabled?: Maybe<BooleanOperators>;
};

export type CountrySortParameter = {
    id?: Maybe<SortOrder>;
    createdAt?: Maybe<SortOrder>;
    updatedAt?: Maybe<SortOrder>;
    code?: Maybe<SortOrder>;
    name?: Maybe<SortOrder>;
};

export type CustomerGroupFilterParameter = {
    createdAt?: Maybe<DateOperators>;
    updatedAt?: Maybe<DateOperators>;
    name?: Maybe<StringOperators>;
};

export type CustomerGroupSortParameter = {
    id?: Maybe<SortOrder>;
    createdAt?: Maybe<SortOrder>;
    updatedAt?: Maybe<SortOrder>;
    name?: Maybe<SortOrder>;
};

export type CustomerFilterParameter = {
    createdAt?: Maybe<DateOperators>;
    updatedAt?: Maybe<DateOperators>;
    title?: Maybe<StringOperators>;
    firstName?: Maybe<StringOperators>;
    lastName?: Maybe<StringOperators>;
    phoneNumber?: Maybe<StringOperators>;
    emailAddress?: Maybe<StringOperators>;
};

export type CustomerSortParameter = {
    id?: Maybe<SortOrder>;
    createdAt?: Maybe<SortOrder>;
    updatedAt?: Maybe<SortOrder>;
    title?: Maybe<SortOrder>;
    firstName?: Maybe<SortOrder>;
    lastName?: Maybe<SortOrder>;
    phoneNumber?: Maybe<SortOrder>;
    emailAddress?: Maybe<SortOrder>;
};

export type FacetFilterParameter = {
    isPrivate?: Maybe<BooleanOperators>;
    createdAt?: Maybe<DateOperators>;
    updatedAt?: Maybe<DateOperators>;
    languageCode?: Maybe<StringOperators>;
    name?: Maybe<StringOperators>;
    code?: Maybe<StringOperators>;
};

export type FacetSortParameter = {
    id?: Maybe<SortOrder>;
    createdAt?: Maybe<SortOrder>;
    updatedAt?: Maybe<SortOrder>;
    name?: Maybe<SortOrder>;
    code?: Maybe<SortOrder>;
};

export type JobFilterParameter = {
    createdAt?: Maybe<DateOperators>;
    startedAt?: Maybe<DateOperators>;
    settledAt?: Maybe<DateOperators>;
    queueName?: Maybe<StringOperators>;
    state?: Maybe<StringOperators>;
    progress?: Maybe<NumberOperators>;
    isSettled?: Maybe<BooleanOperators>;
    duration?: Maybe<NumberOperators>;
};

export type JobSortParameter = {
    id?: Maybe<SortOrder>;
    createdAt?: Maybe<SortOrder>;
    startedAt?: Maybe<SortOrder>;
    settledAt?: Maybe<SortOrder>;
    queueName?: Maybe<SortOrder>;
    progress?: Maybe<SortOrder>;
    duration?: Maybe<SortOrder>;
};

export type OrderFilterParameter = {
    createdAt?: Maybe<DateOperators>;
    updatedAt?: Maybe<DateOperators>;
    code?: Maybe<StringOperators>;
    state?: Maybe<StringOperators>;
    active?: Maybe<BooleanOperators>;
    totalQuantity?: Maybe<NumberOperators>;
    subTotalBeforeTax?: Maybe<NumberOperators>;
    subTotal?: Maybe<NumberOperators>;
    currencyCode?: Maybe<StringOperators>;
    shipping?: Maybe<NumberOperators>;
    shippingWithTax?: Maybe<NumberOperators>;
    totalBeforeTax?: Maybe<NumberOperators>;
    total?: Maybe<NumberOperators>;
};

export type OrderSortParameter = {
    id?: Maybe<SortOrder>;
    createdAt?: Maybe<SortOrder>;
    updatedAt?: Maybe<SortOrder>;
    code?: Maybe<SortOrder>;
    state?: Maybe<SortOrder>;
    totalQuantity?: Maybe<SortOrder>;
    subTotalBeforeTax?: Maybe<SortOrder>;
    subTotal?: Maybe<SortOrder>;
    shipping?: Maybe<SortOrder>;
    shippingWithTax?: Maybe<SortOrder>;
    totalBeforeTax?: Maybe<SortOrder>;
    total?: Maybe<SortOrder>;
};

export type PaymentMethodFilterParameter = {
    createdAt?: Maybe<DateOperators>;
    updatedAt?: Maybe<DateOperators>;
    code?: Maybe<StringOperators>;
    enabled?: Maybe<BooleanOperators>;
};

export type PaymentMethodSortParameter = {
    id?: Maybe<SortOrder>;
    createdAt?: Maybe<SortOrder>;
    updatedAt?: Maybe<SortOrder>;
    code?: Maybe<SortOrder>;
};

export type ProductFilterParameter = {
    enabled?: Maybe<BooleanOperators>;
    createdAt?: Maybe<DateOperators>;
    updatedAt?: Maybe<DateOperators>;
    languageCode?: Maybe<StringOperators>;
    name?: Maybe<StringOperators>;
    slug?: Maybe<StringOperators>;
    description?: Maybe<StringOperators>;
};

export type ProductSortParameter = {
    id?: Maybe<SortOrder>;
    createdAt?: Maybe<SortOrder>;
    updatedAt?: Maybe<SortOrder>;
    name?: Maybe<SortOrder>;
    slug?: Maybe<SortOrder>;
    description?: Maybe<SortOrder>;
};

export type PromotionFilterParameter = {
    createdAt?: Maybe<DateOperators>;
    updatedAt?: Maybe<DateOperators>;
    startsAt?: Maybe<DateOperators>;
    endsAt?: Maybe<DateOperators>;
    couponCode?: Maybe<StringOperators>;
    perCustomerUsageLimit?: Maybe<NumberOperators>;
    name?: Maybe<StringOperators>;
    enabled?: Maybe<BooleanOperators>;
};

export type PromotionSortParameter = {
    id?: Maybe<SortOrder>;
    createdAt?: Maybe<SortOrder>;
    updatedAt?: Maybe<SortOrder>;
    startsAt?: Maybe<SortOrder>;
    endsAt?: Maybe<SortOrder>;
    couponCode?: Maybe<SortOrder>;
    perCustomerUsageLimit?: Maybe<SortOrder>;
    name?: Maybe<SortOrder>;
};

export type RoleFilterParameter = {
    createdAt?: Maybe<DateOperators>;
    updatedAt?: Maybe<DateOperators>;
    code?: Maybe<StringOperators>;
    description?: Maybe<StringOperators>;
};

export type RoleSortParameter = {
    id?: Maybe<SortOrder>;
    createdAt?: Maybe<SortOrder>;
    updatedAt?: Maybe<SortOrder>;
    code?: Maybe<SortOrder>;
    description?: Maybe<SortOrder>;
};

export type ShippingMethodFilterParameter = {
    createdAt?: Maybe<DateOperators>;
    updatedAt?: Maybe<DateOperators>;
    code?: Maybe<StringOperators>;
    description?: Maybe<StringOperators>;
};

export type ShippingMethodSortParameter = {
    id?: Maybe<SortOrder>;
    createdAt?: Maybe<SortOrder>;
    updatedAt?: Maybe<SortOrder>;
    code?: Maybe<SortOrder>;
    description?: Maybe<SortOrder>;
};

export type TaxRateFilterParameter = {
    createdAt?: Maybe<DateOperators>;
    updatedAt?: Maybe<DateOperators>;
    name?: Maybe<StringOperators>;
    enabled?: Maybe<BooleanOperators>;
    value?: Maybe<NumberOperators>;
};

export type TaxRateSortParameter = {
    id?: Maybe<SortOrder>;
    createdAt?: Maybe<SortOrder>;
    updatedAt?: Maybe<SortOrder>;
    name?: Maybe<SortOrder>;
    value?: Maybe<SortOrder>;
};

export type ProductVariantFilterParameter = {
    enabled?: Maybe<BooleanOperators>;
    trackInventory?: Maybe<StringOperators>;
    stockOnHand?: Maybe<NumberOperators>;
    stockAllocated?: Maybe<NumberOperators>;
    outOfStockThreshold?: Maybe<NumberOperators>;
    useGlobalOutOfStockThreshold?: Maybe<BooleanOperators>;
    createdAt?: Maybe<DateOperators>;
    updatedAt?: Maybe<DateOperators>;
    languageCode?: Maybe<StringOperators>;
    sku?: Maybe<StringOperators>;
    name?: Maybe<StringOperators>;
    price?: Maybe<NumberOperators>;
    currencyCode?: Maybe<StringOperators>;
    priceIncludesTax?: Maybe<BooleanOperators>;
    priceWithTax?: Maybe<NumberOperators>;
};

export type ProductVariantSortParameter = {
    stockOnHand?: Maybe<SortOrder>;
    stockAllocated?: Maybe<SortOrder>;
    outOfStockThreshold?: Maybe<SortOrder>;
    id?: Maybe<SortOrder>;
    productId?: Maybe<SortOrder>;
    createdAt?: Maybe<SortOrder>;
    updatedAt?: Maybe<SortOrder>;
    sku?: Maybe<SortOrder>;
    name?: Maybe<SortOrder>;
    price?: Maybe<SortOrder>;
    priceWithTax?: Maybe<SortOrder>;
};

export type HistoryEntryFilterParameter = {
    createdAt?: Maybe<DateOperators>;
    updatedAt?: Maybe<DateOperators>;
    isPublic?: Maybe<BooleanOperators>;
    type?: Maybe<StringOperators>;
};

export type HistoryEntrySortParameter = {
    id?: Maybe<SortOrder>;
    createdAt?: Maybe<SortOrder>;
    updatedAt?: Maybe<SortOrder>;
};

export type CustomFields = {
    Address: Array<CustomFieldConfig>;
    Collection: Array<CustomFieldConfig>;
    Customer: Array<CustomFieldConfig>;
    Facet: Array<CustomFieldConfig>;
    FacetValue: Array<CustomFieldConfig>;
    Fulfillment: Array<CustomFieldConfig>;
    GlobalSettings: Array<CustomFieldConfig>;
    Order: Array<CustomFieldConfig>;
    OrderLine: Array<CustomFieldConfig>;
    Product: Array<CustomFieldConfig>;
    ProductOption: Array<CustomFieldConfig>;
    ProductOptionGroup: Array<CustomFieldConfig>;
    ProductVariant: Array<CustomFieldConfig>;
    User: Array<CustomFieldConfig>;
    ShippingMethod: Array<CustomFieldConfig>;
};

export type AuthenticationInput = {
    native?: Maybe<NativeAuthInput>;
};

export type NativeAuthInput = {
    username: Scalars['String'];
    password: Scalars['String'];
};

export type CreateAssetsMutationVariables = Exact<{
    input: Array<CreateAssetInput>;
}>;

export type CreateAssetsMutation = {
    createAssets: Array<
        Pick<Asset, 'id' | 'name' | 'source' | 'preview'> & {
            focalPoint?: Maybe<Pick<Coordinate, 'x' | 'y'>>;
        }
    >;
};

export type DeleteAssetMutationVariables = Exact<{
    id: Scalars['ID'];
    force: Scalars['Boolean'];
}>;

export type DeleteAssetMutation = { deleteAsset: Pick<DeletionResponse, 'result'> };

type DiscriminateUnion<T, U> = T extends U ? T : never;

export namespace CreateAssets {
    export type Variables = CreateAssetsMutationVariables;
    export type Mutation = CreateAssetsMutation;
    export type CreateAssets = NonNullable<NonNullable<CreateAssetsMutation['createAssets']>[number]>;
    export type AssetInlineFragment = DiscriminateUnion<
        NonNullable<NonNullable<CreateAssetsMutation['createAssets']>[number]>,
        { __typename?: 'Asset' }
    >;
    export type FocalPoint = NonNullable<
        DiscriminateUnion<
            NonNullable<NonNullable<CreateAssetsMutation['createAssets']>[number]>,
            { __typename?: 'Asset' }
        >['focalPoint']
    >;
}

export namespace DeleteAsset {
    export type Variables = DeleteAssetMutationVariables;
    export type Mutation = DeleteAssetMutation;
    export type DeleteAsset = NonNullable<DeleteAssetMutation['deleteAsset']>;
}
