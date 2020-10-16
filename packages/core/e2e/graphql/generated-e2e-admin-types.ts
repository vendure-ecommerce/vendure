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
};

export type UpdateGlobalSettingsInput = {
  availableLanguages?: Maybe<Array<LanguageCode>>;
  trackInventory?: Maybe<Scalars['Boolean']>;
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
  FAILED = 'FAILED'
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

export type SettlePaymentResult = Payment | SettlePaymentError | PaymentStateTransitionError | OrderStateTransitionError;

export type AddFulfillmentToOrderResult = Fulfillment | EmptyOrderLineSelectionError | ItemsAlreadyFulfilledError;

export type CancelOrderResult = Order | EmptyOrderLineSelectionError | QuantityTooGreatError | MultipleOrderError | CancelActiveOrderError | OrderStateTransitionError;

export type RefundOrderResult = Refund | QuantityTooGreatError | NothingToRefundError | OrderStateTransitionError | MultipleOrderError | PaymentOrderMismatchError | RefundOrderStateError | AlreadyRefundedError | RefundStateTransitionError;

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
  stockOnHand: Scalars['Int'];
  trackInventory: Scalars['Boolean'];
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
  trackInventory?: Maybe<Scalars['Boolean']>;
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
  trackInventory?: Maybe<Scalars['Boolean']>;
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




export enum AdjustmentType {
  TAX = 'TAX',
  PROMOTION = 'PROMOTION',
  SHIPPING = 'SHIPPING',
  REFUND = 'REFUND',
  TAX_REFUND = 'TAX_REFUND',
  PROMOTION_REFUND = 'PROMOTION_REFUND',
  SHIPPING_REFUND = 'SHIPPING_REFUND'
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
  NOT_DELETED = 'NOT_DELETED'
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
  DESC = 'DESC'
}

export enum ErrorCode {
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  MIME_TYPE_ERROR = 'MIME_TYPE_ERROR',
  LANGUAGE_NOT_AVAILABLE_ERROR = 'LANGUAGE_NOT_AVAILABLE_ERROR',
  CHANNEL_DEFAULT_LANGUAGE_ERROR = 'CHANNEL_DEFAULT_LANGUAGE_ERROR',
  SETTLE_PAYMENT_ERROR = 'SETTLE_PAYMENT_ERROR',
  EMPTY_ORDER_LINE_SELECTION_ERROR = 'EMPTY_ORDER_LINE_SELECTION_ERROR',
  ITEMS_ALREADY_FULFILLED_ERROR = 'ITEMS_ALREADY_FULFILLED_ERROR',
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
  EMAIL_ADDRESS_CONFLICT_ERROR = 'EMAIL_ADDRESS_CONFLICT_ERROR'
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
  OR = 'OR'
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
  ZWL = 'ZWL'
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

export type CustomFieldConfig = StringCustomFieldConfig | LocaleStringCustomFieldConfig | IntCustomFieldConfig | FloatCustomFieldConfig | BooleanCustomFieldConfig | DateTimeCustomFieldConfig;

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
  zu = 'zu'
}

/**
 * "
 * @description
 * Permissions for administrators and customers. Used to control access to
 * GraphQL resolvers via the {@link Allow} decorator.
 * 
 * @docsCategory common
 */
export enum Permission {
  /**  The Authenticated role means simply that the user is logged in  */
  Authenticated = 'Authenticated',
  /**  SuperAdmin can perform the most sensitive tasks */
  SuperAdmin = 'SuperAdmin',
  /**  Owner means the user owns this entity, e.g. a Customer's own Order */
  Owner = 'Owner',
  /**  Public means any unauthenticated user may perform the operation  */
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
  CreatePromotion = 'CreatePromotion',
  ReadPromotion = 'ReadPromotion',
  UpdatePromotion = 'UpdatePromotion',
  DeletePromotion = 'DeletePromotion',
  CreateSettings = 'CreateSettings',
  ReadSettings = 'ReadSettings',
  UpdateSettings = 'UpdateSettings',
  DeleteSettings = 'DeleteSettings'
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
  BINARY = 'BINARY'
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
  serverConfig: ServerConfig;
  customFields?: Maybe<Scalars['JSON']>;
};

export type OrderProcessState = {
  name: Scalars['String'];
  to: Array<Scalars['String']>;
};

export type ServerConfig = {
  orderProcess: Array<OrderProcessState>;
  permittedAssetTypes: Array<Scalars['String']>;
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
  ORDER_COUPON_REMOVED = 'ORDER_COUPON_REMOVED'
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
  unitPrice: Scalars['Int'];
  unitPriceWithTax: Scalars['Int'];
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
  totalPrice: Scalars['Int'];
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
  SALE = 'SALE',
  CANCELLATION = 'CANCELLATION',
  RETURN = 'RETURN'
}

export type StockMovement = {
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  productVariant: ProductVariant;
  type: StockMovementType;
  quantity: Scalars['Int'];
};

export type StockAdjustment = Node & StockMovement & {
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  productVariant: ProductVariant;
  type: StockMovementType;
  quantity: Scalars['Int'];
};

export type Sale = Node & StockMovement & {
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  productVariant: ProductVariant;
  type: StockMovementType;
  quantity: Scalars['Int'];
  orderLine: OrderLine;
};

export type Cancellation = Node & StockMovement & {
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  productVariant: ProductVariant;
  type: StockMovementType;
  quantity: Scalars['Int'];
  orderLine: OrderLine;
};

export type Return = Node & StockMovement & {
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  productVariant: ProductVariant;
  type: StockMovementType;
  quantity: Scalars['Int'];
  orderItem: OrderItem;
};

export type StockMovementItem = StockAdjustment | Sale | Cancellation | Return;

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
  stockOnHand?: Maybe<NumberOperators>;
  trackInventory?: Maybe<BooleanOperators>;
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

export type GetAdministratorsQueryVariables = Exact<{
  options?: Maybe<AdministratorListOptions>;
}>;


export type GetAdministratorsQuery = { administrators: (
    Pick<AdministratorList, 'totalItems'>
    & { items: Array<AdministratorFragment> }
  ) };

export type GetAdministratorQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetAdministratorQuery = { administrator?: Maybe<AdministratorFragment> };

export type UpdateAdministratorMutationVariables = Exact<{
  input: UpdateAdministratorInput;
}>;


export type UpdateAdministratorMutation = { updateAdministrator: AdministratorFragment };

export type DeleteAdministratorMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteAdministratorMutation = { deleteAdministrator: Pick<DeletionResponse, 'message' | 'result'> };

export type Q1QueryVariables = Exact<{ [key: string]: never; }>;


export type Q1Query = { product?: Maybe<Pick<Product, 'id' | 'name'>> };

export type Q2QueryVariables = Exact<{ [key: string]: never; }>;


export type Q2Query = { product?: Maybe<Pick<Product, 'id' | 'name'>> };

export type GetAssetQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetAssetQuery = { asset?: Maybe<(
    Pick<Asset, 'width' | 'height'>
    & AssetFragment
  )> };

export type AssetFragFirstFragment = Pick<Asset, 'id' | 'preview'>;

export type GetAssetFragmentFirstQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetAssetFragmentFirstQuery = { asset?: Maybe<AssetFragFirstFragment> };

export type CreateAssetsMutationVariables = Exact<{
  input: Array<CreateAssetInput>;
}>;


export type CreateAssetsMutation = { createAssets: Array<(
    { focalPoint?: Maybe<Pick<Coordinate, 'x' | 'y'>> }
    & AssetFragment
  ) | Pick<MimeTypeError, 'message' | 'fileName' | 'mimeType'>> };

export type CanCreateCustomerMutationVariables = Exact<{
  input: CreateCustomerInput;
}>;


export type CanCreateCustomerMutation = { createCustomer: Pick<Customer, 'id'> };

export type GetCustomerCountQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCustomerCountQuery = { customers: Pick<CustomerList, 'totalItems'> };

export type AuthenticateMutationVariables = Exact<{
  input: AuthenticationInput;
}>;


export type AuthenticateMutation = { authenticate: CurrentUserFragment | Pick<InvalidCredentialsError, 'authenticationError' | 'errorCode' | 'message'> };

export type GetCustomersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCustomersQuery = { customers: (
    Pick<CustomerList, 'totalItems'>
    & { items: Array<Pick<Customer, 'id' | 'emailAddress'>> }
  ) };

export type GetCustomerUserAuthQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetCustomerUserAuthQuery = { customer?: Maybe<(
    Pick<Customer, 'id'>
    & { user?: Maybe<(
      Pick<User, 'id' | 'verified'>
      & { authenticationMethods: Array<Pick<AuthenticationMethod, 'id' | 'strategy'>> }
    )> }
  )> };

export type GetChannelsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetChannelsQuery = { channels: Array<Pick<Channel, 'id' | 'code' | 'token'>> };

export type DeleteChannelMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteChannelMutation = { deleteChannel: Pick<DeletionResponse, 'message' | 'result'> };

export type UpdateGlobalLanguagesMutationVariables = Exact<{
  input: UpdateGlobalSettingsInput;
}>;


export type UpdateGlobalLanguagesMutation = { updateGlobalSettings: Pick<GlobalSettings, 'id' | 'availableLanguages'> };

export type GetCollectionsWithAssetsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCollectionsWithAssetsQuery = { collections: { items: Array<{ assets: Array<Pick<Asset, 'name'>> }> } };

export type GetProductsWithVariantIdsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProductsWithVariantIdsQuery = { products: { items: Array<(
      Pick<Product, 'id' | 'name'>
      & { variants: Array<Pick<ProductVariant, 'id' | 'name'>> }
    )> } };

export type GetCollectionQueryVariables = Exact<{
  id?: Maybe<Scalars['ID']>;
  slug?: Maybe<Scalars['String']>;
}>;


export type GetCollectionQuery = { collection?: Maybe<(
    { productVariants: { items: Array<Pick<ProductVariant, 'id' | 'name'>> } }
    & CollectionFragment
  )> };

export type MoveCollectionMutationVariables = Exact<{
  input: MoveCollectionInput;
}>;


export type MoveCollectionMutation = { moveCollection: CollectionFragment };

export type GetFacetValuesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFacetValuesQuery = { facets: { items: Array<{ values: Array<FacetValueFragment> }> } };

export type GetCollectionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCollectionsQuery = { collections: { items: Array<(
      Pick<Collection, 'id' | 'name' | 'position'>
      & { parent?: Maybe<Pick<Collection, 'id' | 'name'>> }
    )> } };

export type GetCollectionProductsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetCollectionProductsQuery = { collection?: Maybe<{ productVariants: { items: Array<(
        Pick<ProductVariant, 'id' | 'name' | 'productId'>
        & { facetValues: Array<Pick<FacetValue, 'code'>> }
      )> } }> };

export type CreateCollectionSelectVariantsMutationVariables = Exact<{
  input: CreateCollectionInput;
}>;


export type CreateCollectionSelectVariantsMutation = { createCollection: (
    Pick<Collection, 'id'>
    & { productVariants: (
      Pick<ProductVariantList, 'totalItems'>
      & { items: Array<Pick<ProductVariant, 'name'>> }
    ) }
  ) };

export type GetCollectionBreadcrumbsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetCollectionBreadcrumbsQuery = { collection?: Maybe<{ breadcrumbs: Array<Pick<CollectionBreadcrumb, 'id' | 'name' | 'slug'>> }> };

export type GetCollectionsForProductsQueryVariables = Exact<{
  term: Scalars['String'];
}>;


export type GetCollectionsForProductsQuery = { products: { items: Array<(
      Pick<Product, 'id' | 'name'>
      & { collections: Array<Pick<Collection, 'id' | 'name'>> }
    )> } };

export type DeleteCollectionMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteCollectionMutation = { deleteCollection: Pick<DeletionResponse, 'result' | 'message'> };

export type GetProductCollectionsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetProductCollectionsQuery = { product?: Maybe<(
    Pick<Product, 'id'>
    & { collections: Array<Pick<Collection, 'id' | 'name'>> }
  )> };

export type GetProductCollectionsWithParentQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetProductCollectionsWithParentQuery = { product?: Maybe<(
    Pick<Product, 'id'>
    & { collections: Array<(
      Pick<Collection, 'id' | 'name'>
      & { parent?: Maybe<Pick<Collection, 'id' | 'name'>> }
    )> }
  )> };

export type DeleteCountryMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteCountryMutation = { deleteCountry: Pick<DeletionResponse, 'result' | 'message'> };

export type GetCountryQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetCountryQuery = { country?: Maybe<CountryFragment> };

export type CreateCountryMutationVariables = Exact<{
  input: CreateCountryInput;
}>;


export type CreateCountryMutation = { createCountry: CountryFragment };

export type DeleteCustomerAddressMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteCustomerAddressMutation = { deleteCustomerAddress: Pick<Success, 'success'> };

export type GetCustomerWithUserQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetCustomerWithUserQuery = { customer?: Maybe<(
    Pick<Customer, 'id'>
    & { user?: Maybe<Pick<User, 'id' | 'identifier' | 'verified'>> }
  )> };

export type GetCustomerOrdersQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetCustomerOrdersQuery = { customer?: Maybe<{ orders: (
      Pick<OrderList, 'totalItems'>
      & { items: Array<Pick<Order, 'id'>> }
    ) }> };

export type AddNoteToCustomerMutationVariables = Exact<{
  input: AddNoteToCustomerInput;
}>;


export type AddNoteToCustomerMutation = { addNoteToCustomer: CustomerFragment };

export type ReindexMutationVariables = Exact<{ [key: string]: never; }>;


export type ReindexMutation = { reindex: Pick<Job, 'id'> };

export type SearchProductsAdminQueryVariables = Exact<{
  input: SearchInput;
}>;


export type SearchProductsAdminQuery = { search: (
    Pick<SearchResponse, 'totalItems'>
    & { items: Array<Pick<SearchResult, 'enabled' | 'productId' | 'productName' | 'slug' | 'description' | 'productPreview' | 'productVariantId' | 'productVariantName' | 'productVariantPreview' | 'sku'>> }
  ) };

export type SearchFacetValuesQueryVariables = Exact<{
  input: SearchInput;
}>;


export type SearchFacetValuesQuery = { search: (
    Pick<SearchResponse, 'totalItems'>
    & { facetValues: Array<(
      Pick<FacetValueResult, 'count'>
      & { facetValue: Pick<FacetValue, 'id' | 'name'> }
    )> }
  ) };

export type SearchGetAssetsQueryVariables = Exact<{
  input: SearchInput;
}>;


export type SearchGetAssetsQuery = { search: (
    Pick<SearchResponse, 'totalItems'>
    & { items: Array<(
      Pick<SearchResult, 'productId' | 'productName' | 'productVariantName'>
      & { productAsset?: Maybe<(
        Pick<SearchResultAsset, 'id' | 'preview'>
        & { focalPoint?: Maybe<Pick<Coordinate, 'x' | 'y'>> }
      )>, productVariantAsset?: Maybe<(
        Pick<SearchResultAsset, 'id' | 'preview'>
        & { focalPoint?: Maybe<Pick<Coordinate, 'x' | 'y'>> }
      )> }
    )> }
  ) };

export type SearchGetPricesQueryVariables = Exact<{
  input: SearchInput;
}>;


export type SearchGetPricesQuery = { search: { items: Array<{ price: Pick<PriceRange, 'min' | 'max'> | Pick<SinglePrice, 'value'>, priceWithTax: Pick<PriceRange, 'min' | 'max'> | Pick<SinglePrice, 'value'> }> } };

export type IdTest1QueryVariables = Exact<{ [key: string]: never; }>;


export type IdTest1Query = { products: { items: Array<Pick<Product, 'id'>> } };

export type IdTest2QueryVariables = Exact<{ [key: string]: never; }>;


export type IdTest2Query = { products: { items: Array<(
      Pick<Product, 'id'>
      & { variants: Array<(
        Pick<ProductVariant, 'id'>
        & { options: Array<Pick<ProductOption, 'id' | 'name'>> }
      )> }
    )> } };

export type IdTest3QueryVariables = Exact<{ [key: string]: never; }>;


export type IdTest3Query = { product?: Maybe<Pick<Product, 'id'>> };

export type IdTest4MutationVariables = Exact<{ [key: string]: never; }>;


export type IdTest4Mutation = { updateProduct: (
    Pick<Product, 'id'>
    & { featuredAsset?: Maybe<Pick<Asset, 'id'>> }
  ) };

export type IdTest5MutationVariables = Exact<{ [key: string]: never; }>;


export type IdTest5Mutation = { updateProduct: Pick<Product, 'id' | 'name'> };

export type IdTest6QueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type IdTest6Query = { product?: Maybe<Pick<Product, 'id'>> };

export type IdTest7MutationVariables = Exact<{
  input: UpdateProductInput;
}>;


export type IdTest7Mutation = { updateProduct: (
    Pick<Product, 'id'>
    & { featuredAsset?: Maybe<Pick<Asset, 'id'>> }
  ) };

export type IdTest8MutationVariables = Exact<{
  input: UpdateProductInput;
}>;


export type IdTest8Mutation = { updateProduct: Pick<Product, 'id' | 'name'> };

export type IdTest9QueryVariables = Exact<{ [key: string]: never; }>;


export type IdTest9Query = { products: { items: Array<ProdFragmentFragment> } };

export type ProdFragmentFragment = (
  Pick<Product, 'id'>
  & { featuredAsset?: Maybe<Pick<Asset, 'id'>> }
);

export type GetFacetWithValuesQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetFacetWithValuesQuery = { facet?: Maybe<FacetWithValuesFragment> };

export type DeleteFacetValuesMutationVariables = Exact<{
  ids: Array<Scalars['ID']>;
  force?: Maybe<Scalars['Boolean']>;
}>;


export type DeleteFacetValuesMutation = { deleteFacetValues: Array<Pick<DeletionResponse, 'result' | 'message'>> };

export type DeleteFacetMutationVariables = Exact<{
  id: Scalars['ID'];
  force?: Maybe<Scalars['Boolean']>;
}>;


export type DeleteFacetMutation = { deleteFacet: Pick<DeletionResponse, 'result' | 'message'> };

export type GetProductListWithVariantsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProductListWithVariantsQuery = { products: (
    Pick<ProductList, 'totalItems'>
    & { items: Array<(
      Pick<Product, 'id' | 'name'>
      & { variants: Array<Pick<ProductVariant, 'id' | 'name'>> }
    )> }
  ) };

export type CreateFacetValuesMutationVariables = Exact<{
  input: Array<CreateFacetValueInput>;
}>;


export type CreateFacetValuesMutation = { createFacetValues: Array<FacetValueFragment> };

export type UpdateFacetValuesMutationVariables = Exact<{
  input: Array<UpdateFacetValueInput>;
}>;


export type UpdateFacetValuesMutation = { updateFacetValues: Array<FacetValueFragment> };

export type GlobalSettingsFragment = (
  Pick<GlobalSettings, 'id' | 'availableLanguages' | 'trackInventory'>
  & { serverConfig: (
    Pick<ServerConfig, 'permittedAssetTypes'>
    & { orderProcess: Array<Pick<OrderProcessState, 'name' | 'to'>>, customFieldConfig: { Customer: Array<Pick<StringCustomFieldConfig, 'name'> | Pick<LocaleStringCustomFieldConfig, 'name'> | Pick<IntCustomFieldConfig, 'name'> | Pick<FloatCustomFieldConfig, 'name'> | Pick<BooleanCustomFieldConfig, 'name'> | Pick<DateTimeCustomFieldConfig, 'name'>> } }
  ) }
);

export type GetGlobalSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGlobalSettingsQuery = { globalSettings: GlobalSettingsFragment };

export type UpdateGlobalSettingsMutationVariables = Exact<{
  input: UpdateGlobalSettingsInput;
}>;


export type UpdateGlobalSettingsMutation = { updateGlobalSettings: GlobalSettingsFragment | Pick<ChannelDefaultLanguageError, 'errorCode' | 'message'> };

export type AdministratorFragment = (
  Pick<Administrator, 'id' | 'firstName' | 'lastName' | 'emailAddress'>
  & { user: (
    Pick<User, 'id' | 'identifier' | 'lastLogin'>
    & { roles: Array<Pick<Role, 'id' | 'code' | 'description' | 'permissions'>> }
  ) }
);

export type AssetFragment = Pick<Asset, 'id' | 'name' | 'fileSize' | 'mimeType' | 'type' | 'preview' | 'source'>;

export type ProductVariantFragment = (
  Pick<ProductVariant, 'id' | 'enabled' | 'languageCode' | 'name' | 'price' | 'currencyCode' | 'priceIncludesTax' | 'priceWithTax' | 'stockOnHand' | 'trackInventory' | 'sku'>
  & { taxRateApplied: Pick<TaxRate, 'id' | 'name' | 'value'>, taxCategory: Pick<TaxCategory, 'id' | 'name'>, options: Array<Pick<ProductOption, 'id' | 'code' | 'languageCode' | 'name'>>, facetValues: Array<(
    Pick<FacetValue, 'id' | 'code' | 'name'>
    & { facet: Pick<Facet, 'id' | 'name'> }
  )>, featuredAsset?: Maybe<AssetFragment>, assets: Array<AssetFragment>, translations: Array<Pick<ProductVariantTranslation, 'id' | 'languageCode' | 'name'>> }
);

export type ProductWithVariantsFragment = (
  Pick<Product, 'id' | 'enabled' | 'languageCode' | 'name' | 'slug' | 'description'>
  & { featuredAsset?: Maybe<AssetFragment>, assets: Array<AssetFragment>, translations: Array<Pick<ProductTranslation, 'languageCode' | 'name' | 'slug' | 'description'>>, optionGroups: Array<Pick<ProductOptionGroup, 'id' | 'languageCode' | 'code' | 'name'>>, variants: Array<ProductVariantFragment>, facetValues: Array<(
    Pick<FacetValue, 'id' | 'code' | 'name'>
    & { facet: Pick<Facet, 'id' | 'name'> }
  )>, channels: Array<Pick<Channel, 'id' | 'code'>> }
);

export type RoleFragment = (
  Pick<Role, 'id' | 'code' | 'description' | 'permissions'>
  & { channels: Array<Pick<Channel, 'id' | 'code' | 'token'>> }
);

export type ConfigurableOperationFragment = (
  Pick<ConfigurableOperation, 'code'>
  & { args: Array<Pick<ConfigArg, 'name' | 'value'>> }
);

export type CollectionFragment = (
  Pick<Collection, 'id' | 'name' | 'slug' | 'description' | 'isPrivate' | 'languageCode'>
  & { featuredAsset?: Maybe<AssetFragment>, assets: Array<AssetFragment>, filters: Array<ConfigurableOperationFragment>, translations: Array<Pick<CollectionTranslation, 'id' | 'languageCode' | 'name' | 'slug' | 'description'>>, parent?: Maybe<Pick<Collection, 'id' | 'name'>>, children?: Maybe<Array<Pick<Collection, 'id' | 'name'>>> }
);

export type FacetValueFragment = (
  Pick<FacetValue, 'id' | 'languageCode' | 'code' | 'name'>
  & { translations: Array<Pick<FacetValueTranslation, 'id' | 'languageCode' | 'name'>>, facet: Pick<Facet, 'id' | 'name'> }
);

export type FacetWithValuesFragment = (
  Pick<Facet, 'id' | 'languageCode' | 'isPrivate' | 'code' | 'name'>
  & { translations: Array<Pick<FacetTranslation, 'id' | 'languageCode' | 'name'>>, values: Array<FacetValueFragment> }
);

export type CountryFragment = (
  Pick<Country, 'id' | 'code' | 'name' | 'enabled'>
  & { translations: Array<Pick<CountryTranslation, 'id' | 'languageCode' | 'name'>> }
);

export type AddressFragment = (
  Pick<Address, 'id' | 'fullName' | 'company' | 'streetLine1' | 'streetLine2' | 'city' | 'province' | 'postalCode' | 'phoneNumber' | 'defaultShippingAddress' | 'defaultBillingAddress'>
  & { country: Pick<Country, 'id' | 'code' | 'name'> }
);

export type CustomerFragment = (
  Pick<Customer, 'id' | 'title' | 'firstName' | 'lastName' | 'phoneNumber' | 'emailAddress'>
  & { user?: Maybe<Pick<User, 'id' | 'identifier' | 'verified' | 'lastLogin'>>, addresses?: Maybe<Array<AddressFragment>> }
);

export type AdjustmentFragment = Pick<Adjustment, 'adjustmentSource' | 'amount' | 'description' | 'type'>;

export type ShippingAddressFragment = Pick<OrderAddress, 'fullName' | 'company' | 'streetLine1' | 'streetLine2' | 'city' | 'province' | 'postalCode' | 'country' | 'phoneNumber'>;

export type OrderFragment = (
  Pick<Order, 'id' | 'createdAt' | 'updatedAt' | 'code' | 'state' | 'total' | 'currencyCode'>
  & { customer?: Maybe<Pick<Customer, 'id' | 'firstName' | 'lastName'>> }
);

export type OrderItemFragment = (
  Pick<OrderItem, 'id' | 'cancelled' | 'unitPrice' | 'unitPriceIncludesTax' | 'unitPriceWithTax' | 'taxRate'>
  & { fulfillment?: Maybe<Pick<Fulfillment, 'id'>> }
);

export type OrderWithLinesFragment = (
  Pick<Order, 'id' | 'createdAt' | 'updatedAt' | 'code' | 'state' | 'active' | 'subTotal' | 'subTotalBeforeTax' | 'totalBeforeTax' | 'currencyCode' | 'shipping' | 'total'>
  & { customer?: Maybe<Pick<Customer, 'id' | 'firstName' | 'lastName'>>, lines: Array<(
    Pick<OrderLine, 'id' | 'unitPrice' | 'unitPriceWithTax' | 'quantity' | 'totalPrice'>
    & { featuredAsset?: Maybe<Pick<Asset, 'preview'>>, productVariant: Pick<ProductVariant, 'id' | 'name' | 'sku'>, items: Array<OrderItemFragment> }
  )>, adjustments: Array<AdjustmentFragment>, shippingMethod?: Maybe<Pick<ShippingMethod, 'id' | 'code' | 'description'>>, shippingAddress?: Maybe<ShippingAddressFragment>, payments?: Maybe<Array<Pick<Payment, 'id' | 'transactionId' | 'amount' | 'method' | 'state' | 'metadata'>>> }
);

export type PromotionFragment = (
  Pick<Promotion, 'id' | 'createdAt' | 'updatedAt' | 'couponCode' | 'startsAt' | 'endsAt' | 'name' | 'enabled'>
  & { conditions: Array<ConfigurableOperationFragment>, actions: Array<ConfigurableOperationFragment> }
);

export type ZoneFragment = (
  Pick<Zone, 'id' | 'name'>
  & { members: Array<CountryFragment> }
);

export type TaxRateFragment = (
  Pick<TaxRate, 'id' | 'name' | 'enabled' | 'value'>
  & { category: Pick<TaxCategory, 'id' | 'name'>, zone: Pick<Zone, 'id' | 'name'>, customerGroup?: Maybe<Pick<CustomerGroup, 'id' | 'name'>> }
);

export type CurrentUserFragment = (
  Pick<CurrentUser, 'id' | 'identifier'>
  & { channels: Array<Pick<CurrentUserChannel, 'code' | 'token' | 'permissions'>> }
);

export type VariantWithStockFragment = (
  Pick<ProductVariant, 'id' | 'stockOnHand'>
  & { stockMovements: (
    Pick<StockMovementList, 'totalItems'>
    & { items: Array<Pick<StockAdjustment, 'id' | 'type' | 'quantity'> | Pick<Sale, 'id' | 'type' | 'quantity'> | Pick<Cancellation, 'id' | 'type' | 'quantity'> | Pick<Return, 'id' | 'type' | 'quantity'>> }
  ) }
);

export type FulfillmentFragment = (
  Pick<Fulfillment, 'id' | 'state' | 'nextStates' | 'method' | 'trackingCode'>
  & { orderItems: Array<Pick<OrderItem, 'id'>> }
);

export type ChannelFragment = (
  Pick<Channel, 'id' | 'code' | 'token' | 'currencyCode' | 'defaultLanguageCode' | 'pricesIncludeTax'>
  & { defaultShippingZone?: Maybe<Pick<Zone, 'id'>>, defaultTaxZone?: Maybe<Pick<Zone, 'id'>> }
);

export type CreateAdministratorMutationVariables = Exact<{
  input: CreateAdministratorInput;
}>;


export type CreateAdministratorMutation = { createAdministrator: AdministratorFragment };

export type UpdateProductMutationVariables = Exact<{
  input: UpdateProductInput;
}>;


export type UpdateProductMutation = { updateProduct: ProductWithVariantsFragment };

export type CreateProductMutationVariables = Exact<{
  input: CreateProductInput;
}>;


export type CreateProductMutation = { createProduct: ProductWithVariantsFragment };

export type GetProductWithVariantsQueryVariables = Exact<{
  id?: Maybe<Scalars['ID']>;
  slug?: Maybe<Scalars['String']>;
}>;


export type GetProductWithVariantsQuery = { product?: Maybe<ProductWithVariantsFragment> };

export type GetProductListQueryVariables = Exact<{
  options?: Maybe<ProductListOptions>;
}>;


export type GetProductListQuery = { products: (
    Pick<ProductList, 'totalItems'>
    & { items: Array<(
      Pick<Product, 'id' | 'languageCode' | 'name' | 'slug'>
      & { featuredAsset?: Maybe<Pick<Asset, 'id' | 'preview'>> }
    )> }
  ) };

export type CreateProductVariantsMutationVariables = Exact<{
  input: Array<CreateProductVariantInput>;
}>;


export type CreateProductVariantsMutation = { createProductVariants: Array<Maybe<ProductVariantFragment>> };

export type UpdateProductVariantsMutationVariables = Exact<{
  input: Array<UpdateProductVariantInput>;
}>;


export type UpdateProductVariantsMutation = { updateProductVariants: Array<Maybe<ProductVariantFragment>> };

export type UpdateTaxRateMutationVariables = Exact<{
  input: UpdateTaxRateInput;
}>;


export type UpdateTaxRateMutation = { updateTaxRate: TaxRateFragment };

export type CreateFacetMutationVariables = Exact<{
  input: CreateFacetInput;
}>;


export type CreateFacetMutation = { createFacet: FacetWithValuesFragment };

export type UpdateFacetMutationVariables = Exact<{
  input: UpdateFacetInput;
}>;


export type UpdateFacetMutation = { updateFacet: FacetWithValuesFragment };

export type GetCustomerListQueryVariables = Exact<{
  options?: Maybe<CustomerListOptions>;
}>;


export type GetCustomerListQuery = { customers: (
    Pick<CustomerList, 'totalItems'>
    & { items: Array<(
      Pick<Customer, 'id' | 'title' | 'firstName' | 'lastName' | 'emailAddress' | 'phoneNumber'>
      & { user?: Maybe<Pick<User, 'id' | 'verified'>> }
    )> }
  ) };

export type GetAssetListQueryVariables = Exact<{
  options?: Maybe<AssetListOptions>;
}>;


export type GetAssetListQuery = { assets: (
    Pick<AssetList, 'totalItems'>
    & { items: Array<AssetFragment> }
  ) };

export type CreateRoleMutationVariables = Exact<{
  input: CreateRoleInput;
}>;


export type CreateRoleMutation = { createRole: RoleFragment };

export type CreateCollectionMutationVariables = Exact<{
  input: CreateCollectionInput;
}>;


export type CreateCollectionMutation = { createCollection: CollectionFragment };

export type UpdateCollectionMutationVariables = Exact<{
  input: UpdateCollectionInput;
}>;


export type UpdateCollectionMutation = { updateCollection: CollectionFragment };

export type GetCustomerQueryVariables = Exact<{
  id: Scalars['ID'];
  orderListOptions?: Maybe<OrderListOptions>;
}>;


export type GetCustomerQuery = { customer?: Maybe<(
    { orders: (
      Pick<OrderList, 'totalItems'>
      & { items: Array<Pick<Order, 'id' | 'code' | 'state' | 'total' | 'currencyCode' | 'updatedAt'>> }
    ) }
    & CustomerFragment
  )> };

export type AttemptLoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
  rememberMe?: Maybe<Scalars['Boolean']>;
}>;


export type AttemptLoginMutation = { login: CurrentUserFragment };

export type GetCountryListQueryVariables = Exact<{
  options?: Maybe<CountryListOptions>;
}>;


export type GetCountryListQuery = { countries: (
    Pick<CountryList, 'totalItems'>
    & { items: Array<Pick<Country, 'id' | 'code' | 'name' | 'enabled'>> }
  ) };

export type UpdateCountryMutationVariables = Exact<{
  input: UpdateCountryInput;
}>;


export type UpdateCountryMutation = { updateCountry: CountryFragment };

export type GetFacetListQueryVariables = Exact<{
  options?: Maybe<FacetListOptions>;
}>;


export type GetFacetListQuery = { facets: (
    Pick<FacetList, 'totalItems'>
    & { items: Array<FacetWithValuesFragment> }
  ) };

export type DeleteProductMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteProductMutation = { deleteProduct: Pick<DeletionResponse, 'result'> };

export type GetProductSimpleQueryVariables = Exact<{
  id?: Maybe<Scalars['ID']>;
  slug?: Maybe<Scalars['String']>;
}>;


export type GetProductSimpleQuery = { product?: Maybe<Pick<Product, 'id' | 'slug'>> };

export type GetStockMovementQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetStockMovementQuery = { product?: Maybe<(
    Pick<Product, 'id'>
    & { variants: Array<VariantWithStockFragment> }
  )> };

export type GetRunningJobsQueryVariables = Exact<{
  options?: Maybe<JobListOptions>;
}>;


export type GetRunningJobsQuery = { jobs: (
    Pick<JobList, 'totalItems'>
    & { items: Array<Pick<Job, 'id' | 'queueName' | 'state' | 'isSettled' | 'duration'>> }
  ) };

export type CreatePromotionMutationVariables = Exact<{
  input: CreatePromotionInput;
}>;


export type CreatePromotionMutation = { createPromotion: PromotionFragment | Pick<MissingConditionsError, 'errorCode' | 'message'> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me?: Maybe<CurrentUserFragment> };

export type CreateChannelMutationVariables = Exact<{
  input: CreateChannelInput;
}>;


export type CreateChannelMutation = { createChannel: ChannelFragment | Pick<LanguageNotAvailableError, 'errorCode' | 'message' | 'languageCode'> };

export type DeleteProductVariantMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteProductVariantMutation = { deleteProductVariant: Pick<DeletionResponse, 'result' | 'message'> };

export type AssignProductsToChannelMutationVariables = Exact<{
  input: AssignProductsToChannelInput;
}>;


export type AssignProductsToChannelMutation = { assignProductsToChannel: Array<ProductWithVariantsFragment> };

export type RemoveProductsFromChannelMutationVariables = Exact<{
  input: RemoveProductsFromChannelInput;
}>;


export type RemoveProductsFromChannelMutation = { removeProductsFromChannel: Array<ProductWithVariantsFragment> };

export type UpdateAssetMutationVariables = Exact<{
  input: UpdateAssetInput;
}>;


export type UpdateAssetMutation = { updateAsset: (
    { focalPoint?: Maybe<Pick<Coordinate, 'x' | 'y'>> }
    & AssetFragment
  ) };

export type DeleteAssetMutationVariables = Exact<{
  id: Scalars['ID'];
  force?: Maybe<Scalars['Boolean']>;
}>;


export type DeleteAssetMutation = { deleteAsset: Pick<DeletionResponse, 'result' | 'message'> };

export type UpdateChannelMutationVariables = Exact<{
  input: UpdateChannelInput;
}>;


export type UpdateChannelMutation = { updateChannel: ChannelFragment | Pick<LanguageNotAvailableError, 'errorCode' | 'message' | 'languageCode'> };

export type GetCustomerHistoryQueryVariables = Exact<{
  id: Scalars['ID'];
  options?: Maybe<HistoryEntryListOptions>;
}>;


export type GetCustomerHistoryQuery = { customer?: Maybe<(
    Pick<Customer, 'id'>
    & { history: (
      Pick<HistoryEntryList, 'totalItems'>
      & { items: Array<(
        Pick<HistoryEntry, 'id' | 'type' | 'data'>
        & { administrator?: Maybe<Pick<Administrator, 'id'>> }
      )> }
    ) }
  )> };

export type GetOrderQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetOrderQuery = { order?: Maybe<OrderWithLinesFragment> };

export type CustomerGroupFragment = (
  Pick<CustomerGroup, 'id' | 'name'>
  & { customers: (
    Pick<CustomerList, 'totalItems'>
    & { items: Array<Pick<Customer, 'id'>> }
  ) }
);

export type CreateCustomerGroupMutationVariables = Exact<{
  input: CreateCustomerGroupInput;
}>;


export type CreateCustomerGroupMutation = { createCustomerGroup: CustomerGroupFragment };

export type RemoveCustomersFromGroupMutationVariables = Exact<{
  groupId: Scalars['ID'];
  customerIds: Array<Scalars['ID']>;
}>;


export type RemoveCustomersFromGroupMutation = { removeCustomersFromGroup: CustomerGroupFragment };

export type CreateFulfillmentMutationVariables = Exact<{
  input: FulfillOrderInput;
}>;


export type CreateFulfillmentMutation = { addFulfillmentToOrder: FulfillmentFragment | Pick<EmptyOrderLineSelectionError, 'errorCode' | 'message'> | Pick<ItemsAlreadyFulfilledError, 'errorCode' | 'message'> };

export type TransitFulfillmentMutationVariables = Exact<{
  id: Scalars['ID'];
  state: Scalars['String'];
}>;


export type TransitFulfillmentMutation = { transitionFulfillmentToState: FulfillmentFragment | Pick<FulfillmentStateTransitionError, 'errorCode' | 'message' | 'transitionError' | 'fromState' | 'toState'> };

export type GetOrderFulfillmentsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetOrderFulfillmentsQuery = { order?: Maybe<(
    Pick<Order, 'id' | 'state'>
    & { fulfillments?: Maybe<Array<Pick<Fulfillment, 'id' | 'state' | 'nextStates' | 'method'>>> }
  )> };

export type GetOrderListQueryVariables = Exact<{
  options?: Maybe<OrderListOptions>;
}>;


export type GetOrderListQuery = { orders: (
    Pick<OrderList, 'totalItems'>
    & { items: Array<OrderFragment> }
  ) };

export type CreateAddressMutationVariables = Exact<{
  id: Scalars['ID'];
  input: CreateAddressInput;
}>;


export type CreateAddressMutation = { createCustomerAddress: (
    Pick<Address, 'id' | 'fullName' | 'company' | 'streetLine1' | 'streetLine2' | 'city' | 'province' | 'postalCode' | 'phoneNumber' | 'defaultShippingAddress' | 'defaultBillingAddress'>
    & { country: Pick<Country, 'code' | 'name'> }
  ) };

export type UpdateAddressMutationVariables = Exact<{
  input: UpdateAddressInput;
}>;


export type UpdateAddressMutation = { updateCustomerAddress: (
    Pick<Address, 'id' | 'defaultShippingAddress' | 'defaultBillingAddress'>
    & { country: Pick<Country, 'code' | 'name'> }
  ) };

export type CreateCustomerMutationVariables = Exact<{
  input: CreateCustomerInput;
  password?: Maybe<Scalars['String']>;
}>;


export type CreateCustomerMutation = { createCustomer: CustomerFragment | Pick<EmailAddressConflictError, 'errorCode' | 'message'> };

export type UpdateCustomerMutationVariables = Exact<{
  input: UpdateCustomerInput;
}>;


export type UpdateCustomerMutation = { updateCustomer: CustomerFragment | Pick<EmailAddressConflictError, 'errorCode' | 'message'> };

export type DeleteCustomerMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteCustomerMutation = { deleteCustomer: Pick<DeletionResponse, 'result'> };

export type UpdateCustomerNoteMutationVariables = Exact<{
  input: UpdateCustomerNoteInput;
}>;


export type UpdateCustomerNoteMutation = { updateCustomerNote: Pick<HistoryEntry, 'id' | 'data' | 'isPublic'> };

export type DeleteCustomerNoteMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteCustomerNoteMutation = { deleteCustomerNote: Pick<DeletionResponse, 'result' | 'message'> };

export type UpdateCustomerGroupMutationVariables = Exact<{
  input: UpdateCustomerGroupInput;
}>;


export type UpdateCustomerGroupMutation = { updateCustomerGroup: CustomerGroupFragment };

export type DeleteCustomerGroupMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteCustomerGroupMutation = { deleteCustomerGroup: Pick<DeletionResponse, 'result' | 'message'> };

export type GetCustomerGroupsQueryVariables = Exact<{
  options?: Maybe<CustomerGroupListOptions>;
}>;


export type GetCustomerGroupsQuery = { customerGroups: (
    Pick<CustomerGroupList, 'totalItems'>
    & { items: Array<Pick<CustomerGroup, 'id' | 'name'>> }
  ) };

export type GetCustomerGroupQueryVariables = Exact<{
  id: Scalars['ID'];
  options?: Maybe<CustomerListOptions>;
}>;


export type GetCustomerGroupQuery = { customerGroup?: Maybe<(
    Pick<CustomerGroup, 'id' | 'name'>
    & { customers: (
      Pick<CustomerList, 'totalItems'>
      & { items: Array<Pick<Customer, 'id'>> }
    ) }
  )> };

export type AddCustomersToGroupMutationVariables = Exact<{
  groupId: Scalars['ID'];
  customerIds: Array<Scalars['ID']>;
}>;


export type AddCustomersToGroupMutation = { addCustomersToGroup: CustomerGroupFragment };

export type GetCustomerWithGroupsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetCustomerWithGroupsQuery = { customer?: Maybe<(
    Pick<Customer, 'id'>
    & { groups: Array<Pick<CustomerGroup, 'id' | 'name'>> }
  )> };

export type AdminTransitionMutationVariables = Exact<{
  id: Scalars['ID'];
  state: Scalars['String'];
}>;


export type AdminTransitionMutation = { transitionOrderToState?: Maybe<OrderFragment | Pick<OrderStateTransitionError, 'errorCode' | 'message' | 'transitionError' | 'fromState' | 'toState'>> };

export type UpdateOptionGroupMutationVariables = Exact<{
  input: UpdateProductOptionGroupInput;
}>;


export type UpdateOptionGroupMutation = { updateProductOptionGroup: Pick<ProductOptionGroup, 'id'> };

export type DeletePromotionAdHoc1MutationVariables = Exact<{ [key: string]: never; }>;


export type DeletePromotionAdHoc1Mutation = { deletePromotion: Pick<DeletionResponse, 'result'> };

export type GetPromoProductsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPromoProductsQuery = { products: { items: Array<(
      Pick<Product, 'id' | 'slug'>
      & { variants: Array<(
        Pick<ProductVariant, 'id' | 'price' | 'priceWithTax' | 'sku'>
        & { facetValues: Array<Pick<FacetValue, 'id' | 'code'>> }
      )> }
    )> } };

export type SettlePaymentMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type SettlePaymentMutation = { settlePayment: PaymentFragment | Pick<SettlePaymentError, 'errorCode' | 'message' | 'paymentErrorMessage'> | Pick<PaymentStateTransitionError, 'errorCode' | 'message'> | Pick<OrderStateTransitionError, 'errorCode' | 'message'> };

export type PaymentFragment = Pick<Payment, 'id' | 'state' | 'metadata'>;

export type GetOrderListFulfillmentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOrderListFulfillmentsQuery = { orders: { items: Array<(
      Pick<Order, 'id' | 'state'>
      & { fulfillments?: Maybe<Array<Pick<Fulfillment, 'id' | 'state' | 'nextStates' | 'method'>>> }
    )> } };

export type GetOrderFulfillmentItemsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetOrderFulfillmentItemsQuery = { order?: Maybe<(
    Pick<Order, 'id' | 'state'>
    & { fulfillments?: Maybe<Array<FulfillmentFragment>> }
  )> };

export type CancelOrderMutationVariables = Exact<{
  input: CancelOrderInput;
}>;


export type CancelOrderMutation = { cancelOrder: CanceledOrderFragment | Pick<EmptyOrderLineSelectionError, 'errorCode' | 'message'> | Pick<QuantityTooGreatError, 'errorCode' | 'message'> | Pick<MultipleOrderError, 'errorCode' | 'message'> | Pick<CancelActiveOrderError, 'errorCode' | 'message'> | Pick<OrderStateTransitionError, 'errorCode' | 'message'> };

export type CanceledOrderFragment = (
  Pick<Order, 'id'>
  & { lines: Array<(
    Pick<OrderLine, 'quantity'>
    & { items: Array<Pick<OrderItem, 'id' | 'cancelled'>> }
  )> }
);

export type RefundFragment = Pick<Refund, 'id' | 'state' | 'items' | 'transactionId' | 'shipping' | 'total' | 'metadata'>;

export type RefundOrderMutationVariables = Exact<{
  input: RefundOrderInput;
}>;


export type RefundOrderMutation = { refundOrder: RefundFragment | Pick<QuantityTooGreatError, 'errorCode' | 'message'> | Pick<NothingToRefundError, 'errorCode' | 'message'> | Pick<OrderStateTransitionError, 'errorCode' | 'message'> | Pick<MultipleOrderError, 'errorCode' | 'message'> | Pick<PaymentOrderMismatchError, 'errorCode' | 'message'> | Pick<RefundOrderStateError, 'errorCode' | 'message'> | Pick<AlreadyRefundedError, 'errorCode' | 'message'> | Pick<RefundStateTransitionError, 'errorCode' | 'message'> };

export type SettleRefundMutationVariables = Exact<{
  input: SettleRefundInput;
}>;


export type SettleRefundMutation = { settleRefund: RefundFragment | Pick<RefundStateTransitionError, 'errorCode' | 'message'> };

export type GetOrderHistoryQueryVariables = Exact<{
  id: Scalars['ID'];
  options?: Maybe<HistoryEntryListOptions>;
}>;


export type GetOrderHistoryQuery = { order?: Maybe<(
    Pick<Order, 'id'>
    & { history: (
      Pick<HistoryEntryList, 'totalItems'>
      & { items: Array<(
        Pick<HistoryEntry, 'id' | 'type' | 'data'>
        & { administrator?: Maybe<Pick<Administrator, 'id'>> }
      )> }
    ) }
  )> };

export type AddNoteToOrderMutationVariables = Exact<{
  input: AddNoteToOrderInput;
}>;


export type AddNoteToOrderMutation = { addNoteToOrder: Pick<Order, 'id'> };

export type UpdateOrderNoteMutationVariables = Exact<{
  input: UpdateOrderNoteInput;
}>;


export type UpdateOrderNoteMutation = { updateOrderNote: Pick<HistoryEntry, 'id' | 'data' | 'isPublic'> };

export type DeleteOrderNoteMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteOrderNoteMutation = { deleteOrderNote: Pick<DeletionResponse, 'result' | 'message'> };

export type GetOrderWithPaymentsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetOrderWithPaymentsQuery = { order?: Maybe<(
    Pick<Order, 'id'>
    & { payments?: Maybe<Array<Pick<Payment, 'id' | 'errorMessage' | 'metadata'>>> }
  )> };

export type ProductOptionGroupFragment = (
  Pick<ProductOptionGroup, 'id' | 'code' | 'name'>
  & { options: Array<Pick<ProductOption, 'id' | 'code' | 'name'>>, translations: Array<Pick<ProductOptionGroupTranslation, 'id' | 'languageCode' | 'name'>> }
);

export type CreateProductOptionGroupMutationVariables = Exact<{
  input: CreateProductOptionGroupInput;
}>;


export type CreateProductOptionGroupMutation = { createProductOptionGroup: ProductOptionGroupFragment };

export type UpdateProductOptionGroupMutationVariables = Exact<{
  input: UpdateProductOptionGroupInput;
}>;


export type UpdateProductOptionGroupMutation = { updateProductOptionGroup: ProductOptionGroupFragment };

export type CreateProductOptionMutationVariables = Exact<{
  input: CreateProductOptionInput;
}>;


export type CreateProductOptionMutation = { createProductOption: (
    Pick<ProductOption, 'id' | 'code' | 'name' | 'groupId'>
    & { translations: Array<Pick<ProductOptionTranslation, 'id' | 'languageCode' | 'name'>> }
  ) };

export type UpdateProductOptionMutationVariables = Exact<{
  input: UpdateProductOptionInput;
}>;


export type UpdateProductOptionMutation = { updateProductOption: Pick<ProductOption, 'id' | 'code' | 'name' | 'groupId'> };

export type ProductWithOptionsFragment = (
  Pick<Product, 'id'>
  & { optionGroups: Array<(
    Pick<ProductOptionGroup, 'id' | 'code'>
    & { options: Array<Pick<ProductOption, 'id' | 'code'>> }
  )> }
);

export type AddOptionGroupToProductMutationVariables = Exact<{
  productId: Scalars['ID'];
  optionGroupId: Scalars['ID'];
}>;


export type AddOptionGroupToProductMutation = { addOptionGroupToProduct: ProductWithOptionsFragment };

export type RemoveOptionGroupFromProductMutationVariables = Exact<{
  productId: Scalars['ID'];
  optionGroupId: Scalars['ID'];
}>;


export type RemoveOptionGroupFromProductMutation = { removeOptionGroupFromProduct: ProductWithOptionsFragment | Pick<ProductOptionInUseError, 'errorCode' | 'message' | 'optionGroupCode' | 'productVariantCount'> };

export type GetOptionGroupQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetOptionGroupQuery = { productOptionGroup?: Maybe<(
    Pick<ProductOptionGroup, 'id' | 'code'>
    & { options: Array<Pick<ProductOption, 'id' | 'code'>> }
  )> };

export type GetProductVariantQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetProductVariantQuery = { productVariant?: Maybe<Pick<ProductVariant, 'id' | 'name'>> };

export type DeletePromotionMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeletePromotionMutation = { deletePromotion: Pick<DeletionResponse, 'result'> };

export type GetPromotionListQueryVariables = Exact<{
  options?: Maybe<PromotionListOptions>;
}>;


export type GetPromotionListQuery = { promotions: (
    Pick<PromotionList, 'totalItems'>
    & { items: Array<PromotionFragment> }
  ) };

export type GetPromotionQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetPromotionQuery = { promotion?: Maybe<PromotionFragment> };

export type UpdatePromotionMutationVariables = Exact<{
  input: UpdatePromotionInput;
}>;


export type UpdatePromotionMutation = { updatePromotion: PromotionFragment | Pick<MissingConditionsError, 'errorCode' | 'message'> };

export type ConfigurableOperationDefFragment = (
  Pick<ConfigurableOperationDefinition, 'code' | 'description'>
  & { args: Array<Pick<ConfigArgDefinition, 'name' | 'type' | 'ui'>> }
);

export type GetAdjustmentOperationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdjustmentOperationsQuery = { promotionActions: Array<ConfigurableOperationDefFragment>, promotionConditions: Array<ConfigurableOperationDefFragment> };

export type GetRolesQueryVariables = Exact<{
  options?: Maybe<RoleListOptions>;
}>;


export type GetRolesQuery = { roles: (
    Pick<RoleList, 'totalItems'>
    & { items: Array<RoleFragment> }
  ) };

export type GetRoleQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetRoleQuery = { role?: Maybe<RoleFragment> };

export type UpdateRoleMutationVariables = Exact<{
  input: UpdateRoleInput;
}>;


export type UpdateRoleMutation = { updateRole: RoleFragment };

export type DeleteRoleMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteRoleMutation = { deleteRole: Pick<DeletionResponse, 'result' | 'message'> };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { logout: Pick<Success, 'success'> };

export type ShippingMethodFragment = (
  Pick<ShippingMethod, 'id' | 'code' | 'description'>
  & { calculator: Pick<ConfigurableOperation, 'code'>, checker: Pick<ConfigurableOperation, 'code'> }
);

export type GetShippingMethodListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetShippingMethodListQuery = { shippingMethods: (
    Pick<ShippingMethodList, 'totalItems'>
    & { items: Array<ShippingMethodFragment> }
  ) };

export type GetShippingMethodQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetShippingMethodQuery = { shippingMethod?: Maybe<ShippingMethodFragment> };

export type CreateShippingMethodMutationVariables = Exact<{
  input: CreateShippingMethodInput;
}>;


export type CreateShippingMethodMutation = { createShippingMethod: ShippingMethodFragment };

export type UpdateShippingMethodMutationVariables = Exact<{
  input: UpdateShippingMethodInput;
}>;


export type UpdateShippingMethodMutation = { updateShippingMethod: ShippingMethodFragment };

export type DeleteShippingMethodMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteShippingMethodMutation = { deleteShippingMethod: Pick<DeletionResponse, 'result' | 'message'> };

export type GetEligibilityCheckersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEligibilityCheckersQuery = { shippingEligibilityCheckers: Array<(
    Pick<ConfigurableOperationDefinition, 'code' | 'description'>
    & { args: Array<Pick<ConfigArgDefinition, 'name' | 'type' | 'description' | 'label' | 'ui'>> }
  )> };

export type GetCalculatorsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCalculatorsQuery = { shippingCalculators: Array<(
    Pick<ConfigurableOperationDefinition, 'code' | 'description'>
    & { args: Array<Pick<ConfigArgDefinition, 'name' | 'type' | 'description' | 'label' | 'ui'>> }
  )> };

export type TestShippingMethodQueryVariables = Exact<{
  input: TestShippingMethodInput;
}>;


export type TestShippingMethodQuery = { testShippingMethod: (
    Pick<TestShippingMethodResult, 'eligible'>
    & { quote?: Maybe<Pick<TestShippingMethodQuote, 'price' | 'priceWithTax' | 'metadata'>> }
  ) };

export type TestEligibleMethodsQueryVariables = Exact<{
  input: TestEligibleShippingMethodsInput;
}>;


export type TestEligibleMethodsQuery = { testEligibleShippingMethods: Array<Pick<ShippingMethodQuote, 'id' | 'description' | 'price' | 'priceWithTax' | 'metadata'>> };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { me?: Maybe<Pick<CurrentUser, 'identifier'>> };

export type GetProductsTake3QueryVariables = Exact<{ [key: string]: never; }>;


export type GetProductsTake3Query = { products: { items: Array<Pick<Product, 'id'>> } };

export type GetProduct1QueryVariables = Exact<{ [key: string]: never; }>;


export type GetProduct1Query = { product?: Maybe<Pick<Product, 'id'>> };

export type GetProduct2VariantsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProduct2VariantsQuery = { product?: Maybe<(
    Pick<Product, 'id'>
    & { variants: Array<Pick<ProductVariant, 'id' | 'name'>> }
  )> };

export type GetProductCollectionQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProductCollectionQuery = { product?: Maybe<{ collections: Array<Pick<Collection, 'id' | 'name'>> }> };

export type DisableProductMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DisableProductMutation = { updateProduct: Pick<Product, 'id'> };

export type GetCollectionVariantsQueryVariables = Exact<{
  id?: Maybe<Scalars['ID']>;
  slug?: Maybe<Scalars['String']>;
}>;


export type GetCollectionVariantsQuery = { collection?: Maybe<(
    Pick<Collection, 'id'>
    & { productVariants: { items: Array<Pick<ProductVariant, 'id' | 'name'>> } }
  )> };

export type GetCollectionListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCollectionListQuery = { collections: { items: Array<Pick<Collection, 'id' | 'name'>> } };

export type GetProductFacetValuesQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetProductFacetValuesQuery = { product?: Maybe<(
    Pick<Product, 'id' | 'name'>
    & { facetValues: Array<Pick<FacetValue, 'name'>> }
  )> };

export type GetVariantFacetValuesQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetVariantFacetValuesQuery = { product?: Maybe<(
    Pick<Product, 'id' | 'name'>
    & { variants: Array<(
      Pick<ProductVariant, 'id'>
      & { facetValues: Array<Pick<FacetValue, 'name'>> }
    )> }
  )> };

export type GetCustomerIdsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCustomerIdsQuery = { customers: { items: Array<Pick<Customer, 'id'>> } };

export type UpdateStockMutationVariables = Exact<{
  input: Array<UpdateProductVariantInput>;
}>;


export type UpdateStockMutation = { updateProductVariants: Array<Maybe<VariantWithStockFragment>> };

export type GetTaxCategoryListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTaxCategoryListQuery = { taxCategories: Array<Pick<TaxCategory, 'id' | 'name'>> };

export type GetTaxCategoryQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetTaxCategoryQuery = { taxCategory?: Maybe<Pick<TaxCategory, 'id' | 'name'>> };

export type CreateTaxCategoryMutationVariables = Exact<{
  input: CreateTaxCategoryInput;
}>;


export type CreateTaxCategoryMutation = { createTaxCategory: Pick<TaxCategory, 'id' | 'name'> };

export type UpdateTaxCategoryMutationVariables = Exact<{
  input: UpdateTaxCategoryInput;
}>;


export type UpdateTaxCategoryMutation = { updateTaxCategory: Pick<TaxCategory, 'id' | 'name'> };

export type DeleteTaxCategoryMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteTaxCategoryMutation = { deleteTaxCategory: Pick<DeletionResponse, 'result' | 'message'> };

export type GetTaxRatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTaxRatesQuery = { taxRates: (
    Pick<TaxRateList, 'totalItems'>
    & { items: Array<TaxRateFragment> }
  ) };

export type GetTaxRateQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetTaxRateQuery = { taxRate?: Maybe<TaxRateFragment> };

export type CreateTaxRateMutationVariables = Exact<{
  input: CreateTaxRateInput;
}>;


export type CreateTaxRateMutation = { createTaxRate: TaxRateFragment };

export type DeleteTaxRateMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteTaxRateMutation = { deleteTaxRate: Pick<DeletionResponse, 'result' | 'message'> };

export type DeleteZoneMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteZoneMutation = { deleteZone: Pick<DeletionResponse, 'result' | 'message'> };

export type GetZonesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetZonesQuery = { zones: Array<Pick<Zone, 'id' | 'name'>> };

export type GetZoneQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetZoneQuery = { zone?: Maybe<ZoneFragment> };

export type CreateZoneMutationVariables = Exact<{
  input: CreateZoneInput;
}>;


export type CreateZoneMutation = { createZone: ZoneFragment };

export type UpdateZoneMutationVariables = Exact<{
  input: UpdateZoneInput;
}>;


export type UpdateZoneMutation = { updateZone: ZoneFragment };

export type AddMembersToZoneMutationVariables = Exact<{
  zoneId: Scalars['ID'];
  memberIds: Array<Scalars['ID']>;
}>;


export type AddMembersToZoneMutation = { addMembersToZone: ZoneFragment };

export type RemoveMembersFromZoneMutationVariables = Exact<{
  zoneId: Scalars['ID'];
  memberIds: Array<Scalars['ID']>;
}>;


export type RemoveMembersFromZoneMutation = { removeMembersFromZone: ZoneFragment };

type DiscriminateUnion<T, U> = T extends U ? T : never;

export namespace GetAdministrators {
  export type Variables = GetAdministratorsQueryVariables;
  export type Query = GetAdministratorsQuery;
  export type Administrators = (NonNullable<GetAdministratorsQuery['administrators']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetAdministratorsQuery['administrators']>)['items']>)[number]>;
}

export namespace GetAdministrator {
  export type Variables = GetAdministratorQueryVariables;
  export type Query = GetAdministratorQuery;
  export type Administrator = (NonNullable<GetAdministratorQuery['administrator']>);
}

export namespace UpdateAdministrator {
  export type Variables = UpdateAdministratorMutationVariables;
  export type Mutation = UpdateAdministratorMutation;
  export type UpdateAdministrator = (NonNullable<UpdateAdministratorMutation['updateAdministrator']>);
}

export namespace DeleteAdministrator {
  export type Variables = DeleteAdministratorMutationVariables;
  export type Mutation = DeleteAdministratorMutation;
  export type DeleteAdministrator = (NonNullable<DeleteAdministratorMutation['deleteAdministrator']>);
}

export namespace Q1 {
  export type Variables = Q1QueryVariables;
  export type Query = Q1Query;
  export type Product = (NonNullable<Q1Query['product']>);
}

export namespace Q2 {
  export type Variables = Q2QueryVariables;
  export type Query = Q2Query;
  export type Product = (NonNullable<Q2Query['product']>);
}

export namespace GetAsset {
  export type Variables = GetAssetQueryVariables;
  export type Query = GetAssetQuery;
  export type Asset = (NonNullable<GetAssetQuery['asset']>);
}

export namespace AssetFragFirst {
  export type Fragment = AssetFragFirstFragment;
}

export namespace GetAssetFragmentFirst {
  export type Variables = GetAssetFragmentFirstQueryVariables;
  export type Query = GetAssetFragmentFirstQuery;
  export type Asset = (NonNullable<GetAssetFragmentFirstQuery['asset']>);
}

export namespace CreateAssets {
  export type Variables = CreateAssetsMutationVariables;
  export type Mutation = CreateAssetsMutation;
  export type CreateAssets = NonNullable<(NonNullable<CreateAssetsMutation['createAssets']>)[number]>;
  export type AssetInlineFragment = (DiscriminateUnion<NonNullable<(NonNullable<CreateAssetsMutation['createAssets']>)[number]>, { __typename?: 'Asset' }>);
  export type FocalPoint = (NonNullable<(DiscriminateUnion<NonNullable<(NonNullable<CreateAssetsMutation['createAssets']>)[number]>, { __typename?: 'Asset' }>)['focalPoint']>);
  export type MimeTypeErrorInlineFragment = (DiscriminateUnion<NonNullable<(NonNullable<CreateAssetsMutation['createAssets']>)[number]>, { __typename?: 'MimeTypeError' }>);
}

export namespace CanCreateCustomer {
  export type Variables = CanCreateCustomerMutationVariables;
  export type Mutation = CanCreateCustomerMutation;
  export type CreateCustomer = (NonNullable<CanCreateCustomerMutation['createCustomer']>);
  export type CustomerInlineFragment = (DiscriminateUnion<(NonNullable<CanCreateCustomerMutation['createCustomer']>), { __typename?: 'Customer' }>);
}

export namespace GetCustomerCount {
  export type Variables = GetCustomerCountQueryVariables;
  export type Query = GetCustomerCountQuery;
  export type Customers = (NonNullable<GetCustomerCountQuery['customers']>);
}

export namespace Authenticate {
  export type Variables = AuthenticateMutationVariables;
  export type Mutation = AuthenticateMutation;
  export type Authenticate = (NonNullable<AuthenticateMutation['authenticate']>);
  export type InvalidCredentialsErrorInlineFragment = (DiscriminateUnion<(NonNullable<AuthenticateMutation['authenticate']>), { __typename?: 'InvalidCredentialsError' }>);
}

export namespace GetCustomers {
  export type Variables = GetCustomersQueryVariables;
  export type Query = GetCustomersQuery;
  export type Customers = (NonNullable<GetCustomersQuery['customers']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetCustomersQuery['customers']>)['items']>)[number]>;
}

export namespace GetCustomerUserAuth {
  export type Variables = GetCustomerUserAuthQueryVariables;
  export type Query = GetCustomerUserAuthQuery;
  export type Customer = (NonNullable<GetCustomerUserAuthQuery['customer']>);
  export type User = (NonNullable<(NonNullable<GetCustomerUserAuthQuery['customer']>)['user']>);
  export type AuthenticationMethods = NonNullable<(NonNullable<(NonNullable<(NonNullable<GetCustomerUserAuthQuery['customer']>)['user']>)['authenticationMethods']>)[number]>;
}

export namespace GetChannels {
  export type Variables = GetChannelsQueryVariables;
  export type Query = GetChannelsQuery;
  export type Channels = NonNullable<(NonNullable<GetChannelsQuery['channels']>)[number]>;
}

export namespace DeleteChannel {
  export type Variables = DeleteChannelMutationVariables;
  export type Mutation = DeleteChannelMutation;
  export type DeleteChannel = (NonNullable<DeleteChannelMutation['deleteChannel']>);
}

export namespace UpdateGlobalLanguages {
  export type Variables = UpdateGlobalLanguagesMutationVariables;
  export type Mutation = UpdateGlobalLanguagesMutation;
  export type UpdateGlobalSettings = (NonNullable<UpdateGlobalLanguagesMutation['updateGlobalSettings']>);
  export type GlobalSettingsInlineFragment = (DiscriminateUnion<(NonNullable<UpdateGlobalLanguagesMutation['updateGlobalSettings']>), { __typename?: 'GlobalSettings' }>);
}

export namespace GetCollectionsWithAssets {
  export type Variables = GetCollectionsWithAssetsQueryVariables;
  export type Query = GetCollectionsWithAssetsQuery;
  export type Collections = (NonNullable<GetCollectionsWithAssetsQuery['collections']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetCollectionsWithAssetsQuery['collections']>)['items']>)[number]>;
  export type Assets = NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<GetCollectionsWithAssetsQuery['collections']>)['items']>)[number]>['assets']>)[number]>;
}

export namespace GetProductsWithVariantIds {
  export type Variables = GetProductsWithVariantIdsQueryVariables;
  export type Query = GetProductsWithVariantIdsQuery;
  export type Products = (NonNullable<GetProductsWithVariantIdsQuery['products']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetProductsWithVariantIdsQuery['products']>)['items']>)[number]>;
  export type Variants = NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<GetProductsWithVariantIdsQuery['products']>)['items']>)[number]>['variants']>)[number]>;
}

export namespace GetCollection {
  export type Variables = GetCollectionQueryVariables;
  export type Query = GetCollectionQuery;
  export type Collection = (NonNullable<GetCollectionQuery['collection']>);
  export type ProductVariants = (NonNullable<(NonNullable<GetCollectionQuery['collection']>)['productVariants']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<(NonNullable<GetCollectionQuery['collection']>)['productVariants']>)['items']>)[number]>;
}

export namespace MoveCollection {
  export type Variables = MoveCollectionMutationVariables;
  export type Mutation = MoveCollectionMutation;
  export type MoveCollection = (NonNullable<MoveCollectionMutation['moveCollection']>);
}

export namespace GetFacetValues {
  export type Variables = GetFacetValuesQueryVariables;
  export type Query = GetFacetValuesQuery;
  export type Facets = (NonNullable<GetFacetValuesQuery['facets']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetFacetValuesQuery['facets']>)['items']>)[number]>;
  export type Values = NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<GetFacetValuesQuery['facets']>)['items']>)[number]>['values']>)[number]>;
}

export namespace GetCollections {
  export type Variables = GetCollectionsQueryVariables;
  export type Query = GetCollectionsQuery;
  export type Collections = (NonNullable<GetCollectionsQuery['collections']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetCollectionsQuery['collections']>)['items']>)[number]>;
  export type Parent = (NonNullable<NonNullable<(NonNullable<(NonNullable<GetCollectionsQuery['collections']>)['items']>)[number]>['parent']>);
}

export namespace GetCollectionProducts {
  export type Variables = GetCollectionProductsQueryVariables;
  export type Query = GetCollectionProductsQuery;
  export type Collection = (NonNullable<GetCollectionProductsQuery['collection']>);
  export type ProductVariants = (NonNullable<(NonNullable<GetCollectionProductsQuery['collection']>)['productVariants']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<(NonNullable<GetCollectionProductsQuery['collection']>)['productVariants']>)['items']>)[number]>;
  export type FacetValues = NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<(NonNullable<GetCollectionProductsQuery['collection']>)['productVariants']>)['items']>)[number]>['facetValues']>)[number]>;
}

export namespace CreateCollectionSelectVariants {
  export type Variables = CreateCollectionSelectVariantsMutationVariables;
  export type Mutation = CreateCollectionSelectVariantsMutation;
  export type CreateCollection = (NonNullable<CreateCollectionSelectVariantsMutation['createCollection']>);
  export type ProductVariants = (NonNullable<(NonNullable<CreateCollectionSelectVariantsMutation['createCollection']>)['productVariants']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<(NonNullable<CreateCollectionSelectVariantsMutation['createCollection']>)['productVariants']>)['items']>)[number]>;
}

export namespace GetCollectionBreadcrumbs {
  export type Variables = GetCollectionBreadcrumbsQueryVariables;
  export type Query = GetCollectionBreadcrumbsQuery;
  export type Collection = (NonNullable<GetCollectionBreadcrumbsQuery['collection']>);
  export type Breadcrumbs = NonNullable<(NonNullable<(NonNullable<GetCollectionBreadcrumbsQuery['collection']>)['breadcrumbs']>)[number]>;
}

export namespace GetCollectionsForProducts {
  export type Variables = GetCollectionsForProductsQueryVariables;
  export type Query = GetCollectionsForProductsQuery;
  export type Products = (NonNullable<GetCollectionsForProductsQuery['products']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetCollectionsForProductsQuery['products']>)['items']>)[number]>;
  export type Collections = NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<GetCollectionsForProductsQuery['products']>)['items']>)[number]>['collections']>)[number]>;
}

export namespace DeleteCollection {
  export type Variables = DeleteCollectionMutationVariables;
  export type Mutation = DeleteCollectionMutation;
  export type DeleteCollection = (NonNullable<DeleteCollectionMutation['deleteCollection']>);
}

export namespace GetProductCollections {
  export type Variables = GetProductCollectionsQueryVariables;
  export type Query = GetProductCollectionsQuery;
  export type Product = (NonNullable<GetProductCollectionsQuery['product']>);
  export type Collections = NonNullable<(NonNullable<(NonNullable<GetProductCollectionsQuery['product']>)['collections']>)[number]>;
}

export namespace GetProductCollectionsWithParent {
  export type Variables = GetProductCollectionsWithParentQueryVariables;
  export type Query = GetProductCollectionsWithParentQuery;
  export type Product = (NonNullable<GetProductCollectionsWithParentQuery['product']>);
  export type Collections = NonNullable<(NonNullable<(NonNullable<GetProductCollectionsWithParentQuery['product']>)['collections']>)[number]>;
  export type Parent = (NonNullable<NonNullable<(NonNullable<(NonNullable<GetProductCollectionsWithParentQuery['product']>)['collections']>)[number]>['parent']>);
}

export namespace DeleteCountry {
  export type Variables = DeleteCountryMutationVariables;
  export type Mutation = DeleteCountryMutation;
  export type DeleteCountry = (NonNullable<DeleteCountryMutation['deleteCountry']>);
}

export namespace GetCountry {
  export type Variables = GetCountryQueryVariables;
  export type Query = GetCountryQuery;
  export type Country = (NonNullable<GetCountryQuery['country']>);
}

export namespace CreateCountry {
  export type Variables = CreateCountryMutationVariables;
  export type Mutation = CreateCountryMutation;
  export type CreateCountry = (NonNullable<CreateCountryMutation['createCountry']>);
}

export namespace DeleteCustomerAddress {
  export type Variables = DeleteCustomerAddressMutationVariables;
  export type Mutation = DeleteCustomerAddressMutation;
  export type DeleteCustomerAddress = (NonNullable<DeleteCustomerAddressMutation['deleteCustomerAddress']>);
}

export namespace GetCustomerWithUser {
  export type Variables = GetCustomerWithUserQueryVariables;
  export type Query = GetCustomerWithUserQuery;
  export type Customer = (NonNullable<GetCustomerWithUserQuery['customer']>);
  export type User = (NonNullable<(NonNullable<GetCustomerWithUserQuery['customer']>)['user']>);
}

export namespace GetCustomerOrders {
  export type Variables = GetCustomerOrdersQueryVariables;
  export type Query = GetCustomerOrdersQuery;
  export type Customer = (NonNullable<GetCustomerOrdersQuery['customer']>);
  export type Orders = (NonNullable<(NonNullable<GetCustomerOrdersQuery['customer']>)['orders']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<(NonNullable<GetCustomerOrdersQuery['customer']>)['orders']>)['items']>)[number]>;
}

export namespace AddNoteToCustomer {
  export type Variables = AddNoteToCustomerMutationVariables;
  export type Mutation = AddNoteToCustomerMutation;
  export type AddNoteToCustomer = (NonNullable<AddNoteToCustomerMutation['addNoteToCustomer']>);
}

export namespace Reindex {
  export type Variables = ReindexMutationVariables;
  export type Mutation = ReindexMutation;
  export type Reindex = (NonNullable<ReindexMutation['reindex']>);
}

export namespace SearchProductsAdmin {
  export type Variables = SearchProductsAdminQueryVariables;
  export type Query = SearchProductsAdminQuery;
  export type Search = (NonNullable<SearchProductsAdminQuery['search']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<SearchProductsAdminQuery['search']>)['items']>)[number]>;
}

export namespace SearchFacetValues {
  export type Variables = SearchFacetValuesQueryVariables;
  export type Query = SearchFacetValuesQuery;
  export type Search = (NonNullable<SearchFacetValuesQuery['search']>);
  export type FacetValues = NonNullable<(NonNullable<(NonNullable<SearchFacetValuesQuery['search']>)['facetValues']>)[number]>;
  export type FacetValue = (NonNullable<NonNullable<(NonNullable<(NonNullable<SearchFacetValuesQuery['search']>)['facetValues']>)[number]>['facetValue']>);
}

export namespace SearchGetAssets {
  export type Variables = SearchGetAssetsQueryVariables;
  export type Query = SearchGetAssetsQuery;
  export type Search = (NonNullable<SearchGetAssetsQuery['search']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<SearchGetAssetsQuery['search']>)['items']>)[number]>;
  export type ProductAsset = (NonNullable<NonNullable<(NonNullable<(NonNullable<SearchGetAssetsQuery['search']>)['items']>)[number]>['productAsset']>);
  export type FocalPoint = (NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<SearchGetAssetsQuery['search']>)['items']>)[number]>['productAsset']>)['focalPoint']>);
  export type ProductVariantAsset = (NonNullable<NonNullable<(NonNullable<(NonNullable<SearchGetAssetsQuery['search']>)['items']>)[number]>['productVariantAsset']>);
  export type _FocalPoint = (NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<SearchGetAssetsQuery['search']>)['items']>)[number]>['productVariantAsset']>)['focalPoint']>);
}

export namespace SearchGetPrices {
  export type Variables = SearchGetPricesQueryVariables;
  export type Query = SearchGetPricesQuery;
  export type Search = (NonNullable<SearchGetPricesQuery['search']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<SearchGetPricesQuery['search']>)['items']>)[number]>;
  export type Price = (NonNullable<NonNullable<(NonNullable<(NonNullable<SearchGetPricesQuery['search']>)['items']>)[number]>['price']>);
  export type PriceRangeInlineFragment = (DiscriminateUnion<(NonNullable<NonNullable<(NonNullable<(NonNullable<SearchGetPricesQuery['search']>)['items']>)[number]>['price']>), { __typename?: 'PriceRange' }>);
  export type SinglePriceInlineFragment = (DiscriminateUnion<(NonNullable<NonNullable<(NonNullable<(NonNullable<SearchGetPricesQuery['search']>)['items']>)[number]>['price']>), { __typename?: 'SinglePrice' }>);
  export type PriceWithTax = (NonNullable<NonNullable<(NonNullable<(NonNullable<SearchGetPricesQuery['search']>)['items']>)[number]>['priceWithTax']>);
  export type _PriceRangeInlineFragment = (DiscriminateUnion<(NonNullable<NonNullable<(NonNullable<(NonNullable<SearchGetPricesQuery['search']>)['items']>)[number]>['priceWithTax']>), { __typename?: 'PriceRange' }>);
  export type _SinglePriceInlineFragment = (DiscriminateUnion<(NonNullable<NonNullable<(NonNullable<(NonNullable<SearchGetPricesQuery['search']>)['items']>)[number]>['priceWithTax']>), { __typename?: 'SinglePrice' }>);
}

export namespace IdTest1 {
  export type Variables = IdTest1QueryVariables;
  export type Query = IdTest1Query;
  export type Products = (NonNullable<IdTest1Query['products']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<IdTest1Query['products']>)['items']>)[number]>;
}

export namespace IdTest2 {
  export type Variables = IdTest2QueryVariables;
  export type Query = IdTest2Query;
  export type Products = (NonNullable<IdTest2Query['products']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<IdTest2Query['products']>)['items']>)[number]>;
  export type Variants = NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<IdTest2Query['products']>)['items']>)[number]>['variants']>)[number]>;
  export type Options = NonNullable<(NonNullable<NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<IdTest2Query['products']>)['items']>)[number]>['variants']>)[number]>['options']>)[number]>;
}

export namespace IdTest3 {
  export type Variables = IdTest3QueryVariables;
  export type Query = IdTest3Query;
  export type Product = (NonNullable<IdTest3Query['product']>);
}

export namespace IdTest4 {
  export type Variables = IdTest4MutationVariables;
  export type Mutation = IdTest4Mutation;
  export type UpdateProduct = (NonNullable<IdTest4Mutation['updateProduct']>);
  export type FeaturedAsset = (NonNullable<(NonNullable<IdTest4Mutation['updateProduct']>)['featuredAsset']>);
}

export namespace IdTest5 {
  export type Variables = IdTest5MutationVariables;
  export type Mutation = IdTest5Mutation;
  export type UpdateProduct = (NonNullable<IdTest5Mutation['updateProduct']>);
}

export namespace IdTest6 {
  export type Variables = IdTest6QueryVariables;
  export type Query = IdTest6Query;
  export type Product = (NonNullable<IdTest6Query['product']>);
}

export namespace IdTest7 {
  export type Variables = IdTest7MutationVariables;
  export type Mutation = IdTest7Mutation;
  export type UpdateProduct = (NonNullable<IdTest7Mutation['updateProduct']>);
  export type FeaturedAsset = (NonNullable<(NonNullable<IdTest7Mutation['updateProduct']>)['featuredAsset']>);
}

export namespace IdTest8 {
  export type Variables = IdTest8MutationVariables;
  export type Mutation = IdTest8Mutation;
  export type UpdateProduct = (NonNullable<IdTest8Mutation['updateProduct']>);
}

export namespace IdTest9 {
  export type Variables = IdTest9QueryVariables;
  export type Query = IdTest9Query;
  export type Products = (NonNullable<IdTest9Query['products']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<IdTest9Query['products']>)['items']>)[number]>;
}

export namespace ProdFragment {
  export type Fragment = ProdFragmentFragment;
  export type FeaturedAsset = (NonNullable<ProdFragmentFragment['featuredAsset']>);
}

export namespace GetFacetWithValues {
  export type Variables = GetFacetWithValuesQueryVariables;
  export type Query = GetFacetWithValuesQuery;
  export type Facet = (NonNullable<GetFacetWithValuesQuery['facet']>);
}

export namespace DeleteFacetValues {
  export type Variables = DeleteFacetValuesMutationVariables;
  export type Mutation = DeleteFacetValuesMutation;
  export type DeleteFacetValues = NonNullable<(NonNullable<DeleteFacetValuesMutation['deleteFacetValues']>)[number]>;
}

export namespace DeleteFacet {
  export type Variables = DeleteFacetMutationVariables;
  export type Mutation = DeleteFacetMutation;
  export type DeleteFacet = (NonNullable<DeleteFacetMutation['deleteFacet']>);
}

export namespace GetProductListWithVariants {
  export type Variables = GetProductListWithVariantsQueryVariables;
  export type Query = GetProductListWithVariantsQuery;
  export type Products = (NonNullable<GetProductListWithVariantsQuery['products']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetProductListWithVariantsQuery['products']>)['items']>)[number]>;
  export type Variants = NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<GetProductListWithVariantsQuery['products']>)['items']>)[number]>['variants']>)[number]>;
}

export namespace CreateFacetValues {
  export type Variables = CreateFacetValuesMutationVariables;
  export type Mutation = CreateFacetValuesMutation;
  export type CreateFacetValues = NonNullable<(NonNullable<CreateFacetValuesMutation['createFacetValues']>)[number]>;
}

export namespace UpdateFacetValues {
  export type Variables = UpdateFacetValuesMutationVariables;
  export type Mutation = UpdateFacetValuesMutation;
  export type UpdateFacetValues = NonNullable<(NonNullable<UpdateFacetValuesMutation['updateFacetValues']>)[number]>;
}

export namespace GlobalSettings {
  export type Fragment = GlobalSettingsFragment;
  export type ServerConfig = (NonNullable<GlobalSettingsFragment['serverConfig']>);
  export type OrderProcess = NonNullable<(NonNullable<(NonNullable<GlobalSettingsFragment['serverConfig']>)['orderProcess']>)[number]>;
  export type CustomFieldConfig = (NonNullable<(NonNullable<GlobalSettingsFragment['serverConfig']>)['customFieldConfig']>);
  export type Customer = NonNullable<(NonNullable<(NonNullable<(NonNullable<GlobalSettingsFragment['serverConfig']>)['customFieldConfig']>)['Customer']>)[number]>;
  export type CustomFieldInlineFragment = (DiscriminateUnion<NonNullable<(NonNullable<(NonNullable<(NonNullable<GlobalSettingsFragment['serverConfig']>)['customFieldConfig']>)['Customer']>)[number]>, { __typename?: 'CustomField' }>);
}

export namespace GetGlobalSettings {
  export type Variables = GetGlobalSettingsQueryVariables;
  export type Query = GetGlobalSettingsQuery;
  export type GlobalSettings = (NonNullable<GetGlobalSettingsQuery['globalSettings']>);
}

export namespace UpdateGlobalSettings {
  export type Variables = UpdateGlobalSettingsMutationVariables;
  export type Mutation = UpdateGlobalSettingsMutation;
  export type UpdateGlobalSettings = (NonNullable<UpdateGlobalSettingsMutation['updateGlobalSettings']>);
  export type ErrorResultInlineFragment = (DiscriminateUnion<(NonNullable<UpdateGlobalSettingsMutation['updateGlobalSettings']>), { __typename?: 'ErrorResult' }>);
}

export namespace Administrator {
  export type Fragment = AdministratorFragment;
  export type User = (NonNullable<AdministratorFragment['user']>);
  export type Roles = NonNullable<(NonNullable<(NonNullable<AdministratorFragment['user']>)['roles']>)[number]>;
}

export namespace Asset {
  export type Fragment = AssetFragment;
}

export namespace ProductVariant {
  export type Fragment = ProductVariantFragment;
  export type TaxRateApplied = (NonNullable<ProductVariantFragment['taxRateApplied']>);
  export type TaxCategory = (NonNullable<ProductVariantFragment['taxCategory']>);
  export type Options = NonNullable<(NonNullable<ProductVariantFragment['options']>)[number]>;
  export type FacetValues = NonNullable<(NonNullable<ProductVariantFragment['facetValues']>)[number]>;
  export type Facet = (NonNullable<NonNullable<(NonNullable<ProductVariantFragment['facetValues']>)[number]>['facet']>);
  export type FeaturedAsset = (NonNullable<ProductVariantFragment['featuredAsset']>);
  export type Assets = NonNullable<(NonNullable<ProductVariantFragment['assets']>)[number]>;
  export type Translations = NonNullable<(NonNullable<ProductVariantFragment['translations']>)[number]>;
}

export namespace ProductWithVariants {
  export type Fragment = ProductWithVariantsFragment;
  export type FeaturedAsset = (NonNullable<ProductWithVariantsFragment['featuredAsset']>);
  export type Assets = NonNullable<(NonNullable<ProductWithVariantsFragment['assets']>)[number]>;
  export type Translations = NonNullable<(NonNullable<ProductWithVariantsFragment['translations']>)[number]>;
  export type OptionGroups = NonNullable<(NonNullable<ProductWithVariantsFragment['optionGroups']>)[number]>;
  export type Variants = NonNullable<(NonNullable<ProductWithVariantsFragment['variants']>)[number]>;
  export type FacetValues = NonNullable<(NonNullable<ProductWithVariantsFragment['facetValues']>)[number]>;
  export type Facet = (NonNullable<NonNullable<(NonNullable<ProductWithVariantsFragment['facetValues']>)[number]>['facet']>);
  export type Channels = NonNullable<(NonNullable<ProductWithVariantsFragment['channels']>)[number]>;
}

export namespace Role {
  export type Fragment = RoleFragment;
  export type Channels = NonNullable<(NonNullable<RoleFragment['channels']>)[number]>;
}

export namespace ConfigurableOperation {
  export type Fragment = ConfigurableOperationFragment;
  export type Args = NonNullable<(NonNullable<ConfigurableOperationFragment['args']>)[number]>;
}

export namespace Collection {
  export type Fragment = CollectionFragment;
  export type FeaturedAsset = (NonNullable<CollectionFragment['featuredAsset']>);
  export type Assets = NonNullable<(NonNullable<CollectionFragment['assets']>)[number]>;
  export type Filters = NonNullable<(NonNullable<CollectionFragment['filters']>)[number]>;
  export type Translations = NonNullable<(NonNullable<CollectionFragment['translations']>)[number]>;
  export type Parent = (NonNullable<CollectionFragment['parent']>);
  export type Children = NonNullable<(NonNullable<CollectionFragment['children']>)[number]>;
}

export namespace FacetValue {
  export type Fragment = FacetValueFragment;
  export type Translations = NonNullable<(NonNullable<FacetValueFragment['translations']>)[number]>;
  export type Facet = (NonNullable<FacetValueFragment['facet']>);
}

export namespace FacetWithValues {
  export type Fragment = FacetWithValuesFragment;
  export type Translations = NonNullable<(NonNullable<FacetWithValuesFragment['translations']>)[number]>;
  export type Values = NonNullable<(NonNullable<FacetWithValuesFragment['values']>)[number]>;
}

export namespace Country {
  export type Fragment = CountryFragment;
  export type Translations = NonNullable<(NonNullable<CountryFragment['translations']>)[number]>;
}

export namespace Address {
  export type Fragment = AddressFragment;
  export type Country = (NonNullable<AddressFragment['country']>);
}

export namespace Customer {
  export type Fragment = CustomerFragment;
  export type User = (NonNullable<CustomerFragment['user']>);
  export type Addresses = NonNullable<(NonNullable<CustomerFragment['addresses']>)[number]>;
}

export namespace Adjustment {
  export type Fragment = AdjustmentFragment;
}

export namespace ShippingAddress {
  export type Fragment = ShippingAddressFragment;
}

export namespace Order {
  export type Fragment = OrderFragment;
  export type Customer = (NonNullable<OrderFragment['customer']>);
}

export namespace OrderItem {
  export type Fragment = OrderItemFragment;
  export type Fulfillment = (NonNullable<OrderItemFragment['fulfillment']>);
}

export namespace OrderWithLines {
  export type Fragment = OrderWithLinesFragment;
  export type Customer = (NonNullable<OrderWithLinesFragment['customer']>);
  export type Lines = NonNullable<(NonNullable<OrderWithLinesFragment['lines']>)[number]>;
  export type FeaturedAsset = (NonNullable<NonNullable<(NonNullable<OrderWithLinesFragment['lines']>)[number]>['featuredAsset']>);
  export type ProductVariant = (NonNullable<NonNullable<(NonNullable<OrderWithLinesFragment['lines']>)[number]>['productVariant']>);
  export type Items = NonNullable<(NonNullable<NonNullable<(NonNullable<OrderWithLinesFragment['lines']>)[number]>['items']>)[number]>;
  export type Adjustments = NonNullable<(NonNullable<OrderWithLinesFragment['adjustments']>)[number]>;
  export type ShippingMethod = (NonNullable<OrderWithLinesFragment['shippingMethod']>);
  export type ShippingAddress = (NonNullable<OrderWithLinesFragment['shippingAddress']>);
  export type Payments = NonNullable<(NonNullable<OrderWithLinesFragment['payments']>)[number]>;
}

export namespace Promotion {
  export type Fragment = PromotionFragment;
  export type Conditions = NonNullable<(NonNullable<PromotionFragment['conditions']>)[number]>;
  export type Actions = NonNullable<(NonNullable<PromotionFragment['actions']>)[number]>;
}

export namespace Zone {
  export type Fragment = ZoneFragment;
  export type Members = NonNullable<(NonNullable<ZoneFragment['members']>)[number]>;
}

export namespace TaxRate {
  export type Fragment = TaxRateFragment;
  export type Category = (NonNullable<TaxRateFragment['category']>);
  export type Zone = (NonNullable<TaxRateFragment['zone']>);
  export type CustomerGroup = (NonNullable<TaxRateFragment['customerGroup']>);
}

export namespace CurrentUser {
  export type Fragment = CurrentUserFragment;
  export type Channels = NonNullable<(NonNullable<CurrentUserFragment['channels']>)[number]>;
}

export namespace VariantWithStock {
  export type Fragment = VariantWithStockFragment;
  export type StockMovements = (NonNullable<VariantWithStockFragment['stockMovements']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<VariantWithStockFragment['stockMovements']>)['items']>)[number]>;
  export type StockMovementInlineFragment = (DiscriminateUnion<NonNullable<(NonNullable<(NonNullable<VariantWithStockFragment['stockMovements']>)['items']>)[number]>, { __typename?: 'StockMovement' }>);
}

export namespace Fulfillment {
  export type Fragment = FulfillmentFragment;
  export type OrderItems = NonNullable<(NonNullable<FulfillmentFragment['orderItems']>)[number]>;
}

export namespace Channel {
  export type Fragment = ChannelFragment;
  export type DefaultShippingZone = (NonNullable<ChannelFragment['defaultShippingZone']>);
  export type DefaultTaxZone = (NonNullable<ChannelFragment['defaultTaxZone']>);
}

export namespace CreateAdministrator {
  export type Variables = CreateAdministratorMutationVariables;
  export type Mutation = CreateAdministratorMutation;
  export type CreateAdministrator = (NonNullable<CreateAdministratorMutation['createAdministrator']>);
}

export namespace UpdateProduct {
  export type Variables = UpdateProductMutationVariables;
  export type Mutation = UpdateProductMutation;
  export type UpdateProduct = (NonNullable<UpdateProductMutation['updateProduct']>);
}

export namespace CreateProduct {
  export type Variables = CreateProductMutationVariables;
  export type Mutation = CreateProductMutation;
  export type CreateProduct = (NonNullable<CreateProductMutation['createProduct']>);
}

export namespace GetProductWithVariants {
  export type Variables = GetProductWithVariantsQueryVariables;
  export type Query = GetProductWithVariantsQuery;
  export type Product = (NonNullable<GetProductWithVariantsQuery['product']>);
}

export namespace GetProductList {
  export type Variables = GetProductListQueryVariables;
  export type Query = GetProductListQuery;
  export type Products = (NonNullable<GetProductListQuery['products']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetProductListQuery['products']>)['items']>)[number]>;
  export type FeaturedAsset = (NonNullable<NonNullable<(NonNullable<(NonNullable<GetProductListQuery['products']>)['items']>)[number]>['featuredAsset']>);
}

export namespace CreateProductVariants {
  export type Variables = CreateProductVariantsMutationVariables;
  export type Mutation = CreateProductVariantsMutation;
  export type CreateProductVariants = NonNullable<(NonNullable<CreateProductVariantsMutation['createProductVariants']>)[number]>;
}

export namespace UpdateProductVariants {
  export type Variables = UpdateProductVariantsMutationVariables;
  export type Mutation = UpdateProductVariantsMutation;
  export type UpdateProductVariants = NonNullable<(NonNullable<UpdateProductVariantsMutation['updateProductVariants']>)[number]>;
}

export namespace UpdateTaxRate {
  export type Variables = UpdateTaxRateMutationVariables;
  export type Mutation = UpdateTaxRateMutation;
  export type UpdateTaxRate = (NonNullable<UpdateTaxRateMutation['updateTaxRate']>);
}

export namespace CreateFacet {
  export type Variables = CreateFacetMutationVariables;
  export type Mutation = CreateFacetMutation;
  export type CreateFacet = (NonNullable<CreateFacetMutation['createFacet']>);
}

export namespace UpdateFacet {
  export type Variables = UpdateFacetMutationVariables;
  export type Mutation = UpdateFacetMutation;
  export type UpdateFacet = (NonNullable<UpdateFacetMutation['updateFacet']>);
}

export namespace GetCustomerList {
  export type Variables = GetCustomerListQueryVariables;
  export type Query = GetCustomerListQuery;
  export type Customers = (NonNullable<GetCustomerListQuery['customers']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetCustomerListQuery['customers']>)['items']>)[number]>;
  export type User = (NonNullable<NonNullable<(NonNullable<(NonNullable<GetCustomerListQuery['customers']>)['items']>)[number]>['user']>);
}

export namespace GetAssetList {
  export type Variables = GetAssetListQueryVariables;
  export type Query = GetAssetListQuery;
  export type Assets = (NonNullable<GetAssetListQuery['assets']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetAssetListQuery['assets']>)['items']>)[number]>;
}

export namespace CreateRole {
  export type Variables = CreateRoleMutationVariables;
  export type Mutation = CreateRoleMutation;
  export type CreateRole = (NonNullable<CreateRoleMutation['createRole']>);
}

export namespace CreateCollection {
  export type Variables = CreateCollectionMutationVariables;
  export type Mutation = CreateCollectionMutation;
  export type CreateCollection = (NonNullable<CreateCollectionMutation['createCollection']>);
}

export namespace UpdateCollection {
  export type Variables = UpdateCollectionMutationVariables;
  export type Mutation = UpdateCollectionMutation;
  export type UpdateCollection = (NonNullable<UpdateCollectionMutation['updateCollection']>);
}

export namespace GetCustomer {
  export type Variables = GetCustomerQueryVariables;
  export type Query = GetCustomerQuery;
  export type Customer = (NonNullable<GetCustomerQuery['customer']>);
  export type Orders = (NonNullable<(NonNullable<GetCustomerQuery['customer']>)['orders']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<(NonNullable<GetCustomerQuery['customer']>)['orders']>)['items']>)[number]>;
}

export namespace AttemptLogin {
  export type Variables = AttemptLoginMutationVariables;
  export type Mutation = AttemptLoginMutation;
  export type Login = (NonNullable<AttemptLoginMutation['login']>);
}

export namespace GetCountryList {
  export type Variables = GetCountryListQueryVariables;
  export type Query = GetCountryListQuery;
  export type Countries = (NonNullable<GetCountryListQuery['countries']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetCountryListQuery['countries']>)['items']>)[number]>;
}

export namespace UpdateCountry {
  export type Variables = UpdateCountryMutationVariables;
  export type Mutation = UpdateCountryMutation;
  export type UpdateCountry = (NonNullable<UpdateCountryMutation['updateCountry']>);
}

export namespace GetFacetList {
  export type Variables = GetFacetListQueryVariables;
  export type Query = GetFacetListQuery;
  export type Facets = (NonNullable<GetFacetListQuery['facets']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetFacetListQuery['facets']>)['items']>)[number]>;
}

export namespace DeleteProduct {
  export type Variables = DeleteProductMutationVariables;
  export type Mutation = DeleteProductMutation;
  export type DeleteProduct = (NonNullable<DeleteProductMutation['deleteProduct']>);
}

export namespace GetProductSimple {
  export type Variables = GetProductSimpleQueryVariables;
  export type Query = GetProductSimpleQuery;
  export type Product = (NonNullable<GetProductSimpleQuery['product']>);
}

export namespace GetStockMovement {
  export type Variables = GetStockMovementQueryVariables;
  export type Query = GetStockMovementQuery;
  export type Product = (NonNullable<GetStockMovementQuery['product']>);
  export type Variants = NonNullable<(NonNullable<(NonNullable<GetStockMovementQuery['product']>)['variants']>)[number]>;
}

export namespace GetRunningJobs {
  export type Variables = GetRunningJobsQueryVariables;
  export type Query = GetRunningJobsQuery;
  export type Jobs = (NonNullable<GetRunningJobsQuery['jobs']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetRunningJobsQuery['jobs']>)['items']>)[number]>;
}

export namespace CreatePromotion {
  export type Variables = CreatePromotionMutationVariables;
  export type Mutation = CreatePromotionMutation;
  export type CreatePromotion = (NonNullable<CreatePromotionMutation['createPromotion']>);
  export type ErrorResultInlineFragment = (DiscriminateUnion<(NonNullable<CreatePromotionMutation['createPromotion']>), { __typename?: 'ErrorResult' }>);
}

export namespace Me {
  export type Variables = MeQueryVariables;
  export type Query = MeQuery;
  export type Me = (NonNullable<MeQuery['me']>);
}

export namespace CreateChannel {
  export type Variables = CreateChannelMutationVariables;
  export type Mutation = CreateChannelMutation;
  export type CreateChannel = (NonNullable<CreateChannelMutation['createChannel']>);
  export type LanguageNotAvailableErrorInlineFragment = (DiscriminateUnion<(NonNullable<CreateChannelMutation['createChannel']>), { __typename?: 'LanguageNotAvailableError' }>);
}

export namespace DeleteProductVariant {
  export type Variables = DeleteProductVariantMutationVariables;
  export type Mutation = DeleteProductVariantMutation;
  export type DeleteProductVariant = (NonNullable<DeleteProductVariantMutation['deleteProductVariant']>);
}

export namespace AssignProductsToChannel {
  export type Variables = AssignProductsToChannelMutationVariables;
  export type Mutation = AssignProductsToChannelMutation;
  export type AssignProductsToChannel = NonNullable<(NonNullable<AssignProductsToChannelMutation['assignProductsToChannel']>)[number]>;
}

export namespace RemoveProductsFromChannel {
  export type Variables = RemoveProductsFromChannelMutationVariables;
  export type Mutation = RemoveProductsFromChannelMutation;
  export type RemoveProductsFromChannel = NonNullable<(NonNullable<RemoveProductsFromChannelMutation['removeProductsFromChannel']>)[number]>;
}

export namespace UpdateAsset {
  export type Variables = UpdateAssetMutationVariables;
  export type Mutation = UpdateAssetMutation;
  export type UpdateAsset = (NonNullable<UpdateAssetMutation['updateAsset']>);
  export type AssetInlineFragment = ({ __typename: 'Asset' } & Pick<(NonNullable<UpdateAssetMutation['updateAsset']>), 'focalPoint'>);
  export type FocalPoint = (NonNullable<({ __typename: 'Asset' } & Pick<(NonNullable<UpdateAssetMutation['updateAsset']>), 'focalPoint'>)['focalPoint']>);
}

export namespace DeleteAsset {
  export type Variables = DeleteAssetMutationVariables;
  export type Mutation = DeleteAssetMutation;
  export type DeleteAsset = (NonNullable<DeleteAssetMutation['deleteAsset']>);
}

export namespace UpdateChannel {
  export type Variables = UpdateChannelMutationVariables;
  export type Mutation = UpdateChannelMutation;
  export type UpdateChannel = (NonNullable<UpdateChannelMutation['updateChannel']>);
  export type LanguageNotAvailableErrorInlineFragment = (DiscriminateUnion<(NonNullable<UpdateChannelMutation['updateChannel']>), { __typename?: 'LanguageNotAvailableError' }>);
}

export namespace GetCustomerHistory {
  export type Variables = GetCustomerHistoryQueryVariables;
  export type Query = GetCustomerHistoryQuery;
  export type Customer = (NonNullable<GetCustomerHistoryQuery['customer']>);
  export type History = (NonNullable<(NonNullable<GetCustomerHistoryQuery['customer']>)['history']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<(NonNullable<GetCustomerHistoryQuery['customer']>)['history']>)['items']>)[number]>;
  export type Administrator = (NonNullable<NonNullable<(NonNullable<(NonNullable<(NonNullable<GetCustomerHistoryQuery['customer']>)['history']>)['items']>)[number]>['administrator']>);
}

export namespace GetOrder {
  export type Variables = GetOrderQueryVariables;
  export type Query = GetOrderQuery;
  export type Order = (NonNullable<GetOrderQuery['order']>);
}

export namespace CustomerGroup {
  export type Fragment = CustomerGroupFragment;
  export type Customers = (NonNullable<CustomerGroupFragment['customers']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<CustomerGroupFragment['customers']>)['items']>)[number]>;
}

export namespace CreateCustomerGroup {
  export type Variables = CreateCustomerGroupMutationVariables;
  export type Mutation = CreateCustomerGroupMutation;
  export type CreateCustomerGroup = (NonNullable<CreateCustomerGroupMutation['createCustomerGroup']>);
}

export namespace RemoveCustomersFromGroup {
  export type Variables = RemoveCustomersFromGroupMutationVariables;
  export type Mutation = RemoveCustomersFromGroupMutation;
  export type RemoveCustomersFromGroup = (NonNullable<RemoveCustomersFromGroupMutation['removeCustomersFromGroup']>);
}

export namespace CreateFulfillment {
  export type Variables = CreateFulfillmentMutationVariables;
  export type Mutation = CreateFulfillmentMutation;
  export type AddFulfillmentToOrder = (NonNullable<CreateFulfillmentMutation['addFulfillmentToOrder']>);
  export type ErrorResultInlineFragment = (DiscriminateUnion<(NonNullable<CreateFulfillmentMutation['addFulfillmentToOrder']>), { __typename?: 'ErrorResult' }>);
}

export namespace TransitFulfillment {
  export type Variables = TransitFulfillmentMutationVariables;
  export type Mutation = TransitFulfillmentMutation;
  export type TransitionFulfillmentToState = (NonNullable<TransitFulfillmentMutation['transitionFulfillmentToState']>);
  export type FulfillmentStateTransitionErrorInlineFragment = (DiscriminateUnion<(NonNullable<TransitFulfillmentMutation['transitionFulfillmentToState']>), { __typename?: 'FulfillmentStateTransitionError' }>);
}

export namespace GetOrderFulfillments {
  export type Variables = GetOrderFulfillmentsQueryVariables;
  export type Query = GetOrderFulfillmentsQuery;
  export type Order = (NonNullable<GetOrderFulfillmentsQuery['order']>);
  export type Fulfillments = NonNullable<(NonNullable<(NonNullable<GetOrderFulfillmentsQuery['order']>)['fulfillments']>)[number]>;
}

export namespace GetOrderList {
  export type Variables = GetOrderListQueryVariables;
  export type Query = GetOrderListQuery;
  export type Orders = (NonNullable<GetOrderListQuery['orders']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetOrderListQuery['orders']>)['items']>)[number]>;
}

export namespace CreateAddress {
  export type Variables = CreateAddressMutationVariables;
  export type Mutation = CreateAddressMutation;
  export type CreateCustomerAddress = (NonNullable<CreateAddressMutation['createCustomerAddress']>);
  export type Country = (NonNullable<(NonNullable<CreateAddressMutation['createCustomerAddress']>)['country']>);
}

export namespace UpdateAddress {
  export type Variables = UpdateAddressMutationVariables;
  export type Mutation = UpdateAddressMutation;
  export type UpdateCustomerAddress = (NonNullable<UpdateAddressMutation['updateCustomerAddress']>);
  export type Country = (NonNullable<(NonNullable<UpdateAddressMutation['updateCustomerAddress']>)['country']>);
}

export namespace CreateCustomer {
  export type Variables = CreateCustomerMutationVariables;
  export type Mutation = CreateCustomerMutation;
  export type CreateCustomer = (NonNullable<CreateCustomerMutation['createCustomer']>);
  export type ErrorResultInlineFragment = (DiscriminateUnion<(NonNullable<CreateCustomerMutation['createCustomer']>), { __typename?: 'ErrorResult' }>);
}

export namespace UpdateCustomer {
  export type Variables = UpdateCustomerMutationVariables;
  export type Mutation = UpdateCustomerMutation;
  export type UpdateCustomer = (NonNullable<UpdateCustomerMutation['updateCustomer']>);
  export type ErrorResultInlineFragment = (DiscriminateUnion<(NonNullable<UpdateCustomerMutation['updateCustomer']>), { __typename?: 'ErrorResult' }>);
}

export namespace DeleteCustomer {
  export type Variables = DeleteCustomerMutationVariables;
  export type Mutation = DeleteCustomerMutation;
  export type DeleteCustomer = (NonNullable<DeleteCustomerMutation['deleteCustomer']>);
}

export namespace UpdateCustomerNote {
  export type Variables = UpdateCustomerNoteMutationVariables;
  export type Mutation = UpdateCustomerNoteMutation;
  export type UpdateCustomerNote = (NonNullable<UpdateCustomerNoteMutation['updateCustomerNote']>);
}

export namespace DeleteCustomerNote {
  export type Variables = DeleteCustomerNoteMutationVariables;
  export type Mutation = DeleteCustomerNoteMutation;
  export type DeleteCustomerNote = (NonNullable<DeleteCustomerNoteMutation['deleteCustomerNote']>);
}

export namespace UpdateCustomerGroup {
  export type Variables = UpdateCustomerGroupMutationVariables;
  export type Mutation = UpdateCustomerGroupMutation;
  export type UpdateCustomerGroup = (NonNullable<UpdateCustomerGroupMutation['updateCustomerGroup']>);
}

export namespace DeleteCustomerGroup {
  export type Variables = DeleteCustomerGroupMutationVariables;
  export type Mutation = DeleteCustomerGroupMutation;
  export type DeleteCustomerGroup = (NonNullable<DeleteCustomerGroupMutation['deleteCustomerGroup']>);
}

export namespace GetCustomerGroups {
  export type Variables = GetCustomerGroupsQueryVariables;
  export type Query = GetCustomerGroupsQuery;
  export type CustomerGroups = (NonNullable<GetCustomerGroupsQuery['customerGroups']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetCustomerGroupsQuery['customerGroups']>)['items']>)[number]>;
}

export namespace GetCustomerGroup {
  export type Variables = GetCustomerGroupQueryVariables;
  export type Query = GetCustomerGroupQuery;
  export type CustomerGroup = (NonNullable<GetCustomerGroupQuery['customerGroup']>);
  export type Customers = (NonNullable<(NonNullable<GetCustomerGroupQuery['customerGroup']>)['customers']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<(NonNullable<GetCustomerGroupQuery['customerGroup']>)['customers']>)['items']>)[number]>;
}

export namespace AddCustomersToGroup {
  export type Variables = AddCustomersToGroupMutationVariables;
  export type Mutation = AddCustomersToGroupMutation;
  export type AddCustomersToGroup = (NonNullable<AddCustomersToGroupMutation['addCustomersToGroup']>);
}

export namespace GetCustomerWithGroups {
  export type Variables = GetCustomerWithGroupsQueryVariables;
  export type Query = GetCustomerWithGroupsQuery;
  export type Customer = (NonNullable<GetCustomerWithGroupsQuery['customer']>);
  export type Groups = NonNullable<(NonNullable<(NonNullable<GetCustomerWithGroupsQuery['customer']>)['groups']>)[number]>;
}

export namespace AdminTransition {
  export type Variables = AdminTransitionMutationVariables;
  export type Mutation = AdminTransitionMutation;
  export type TransitionOrderToState = (NonNullable<AdminTransitionMutation['transitionOrderToState']>);
  export type OrderStateTransitionErrorInlineFragment = (DiscriminateUnion<(NonNullable<AdminTransitionMutation['transitionOrderToState']>), { __typename?: 'OrderStateTransitionError' }>);
}

export namespace UpdateOptionGroup {
  export type Variables = UpdateOptionGroupMutationVariables;
  export type Mutation = UpdateOptionGroupMutation;
  export type UpdateProductOptionGroup = (NonNullable<UpdateOptionGroupMutation['updateProductOptionGroup']>);
}

export namespace DeletePromotionAdHoc1 {
  export type Variables = DeletePromotionAdHoc1MutationVariables;
  export type Mutation = DeletePromotionAdHoc1Mutation;
  export type DeletePromotion = (NonNullable<DeletePromotionAdHoc1Mutation['deletePromotion']>);
}

export namespace GetPromoProducts {
  export type Variables = GetPromoProductsQueryVariables;
  export type Query = GetPromoProductsQuery;
  export type Products = (NonNullable<GetPromoProductsQuery['products']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetPromoProductsQuery['products']>)['items']>)[number]>;
  export type Variants = NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<GetPromoProductsQuery['products']>)['items']>)[number]>['variants']>)[number]>;
  export type FacetValues = NonNullable<(NonNullable<NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<GetPromoProductsQuery['products']>)['items']>)[number]>['variants']>)[number]>['facetValues']>)[number]>;
}

export namespace SettlePayment {
  export type Variables = SettlePaymentMutationVariables;
  export type Mutation = SettlePaymentMutation;
  export type SettlePayment = (NonNullable<SettlePaymentMutation['settlePayment']>);
  export type ErrorResultInlineFragment = (DiscriminateUnion<(NonNullable<SettlePaymentMutation['settlePayment']>), { __typename?: 'ErrorResult' }>);
  export type SettlePaymentErrorInlineFragment = (DiscriminateUnion<(NonNullable<SettlePaymentMutation['settlePayment']>), { __typename?: 'SettlePaymentError' }>);
}

export namespace Payment {
  export type Fragment = PaymentFragment;
}

export namespace GetOrderListFulfillments {
  export type Variables = GetOrderListFulfillmentsQueryVariables;
  export type Query = GetOrderListFulfillmentsQuery;
  export type Orders = (NonNullable<GetOrderListFulfillmentsQuery['orders']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetOrderListFulfillmentsQuery['orders']>)['items']>)[number]>;
  export type Fulfillments = NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<GetOrderListFulfillmentsQuery['orders']>)['items']>)[number]>['fulfillments']>)[number]>;
}

export namespace GetOrderFulfillmentItems {
  export type Variables = GetOrderFulfillmentItemsQueryVariables;
  export type Query = GetOrderFulfillmentItemsQuery;
  export type Order = (NonNullable<GetOrderFulfillmentItemsQuery['order']>);
  export type Fulfillments = NonNullable<(NonNullable<(NonNullable<GetOrderFulfillmentItemsQuery['order']>)['fulfillments']>)[number]>;
}

export namespace CancelOrder {
  export type Variables = CancelOrderMutationVariables;
  export type Mutation = CancelOrderMutation;
  export type CancelOrder = (NonNullable<CancelOrderMutation['cancelOrder']>);
  export type ErrorResultInlineFragment = (DiscriminateUnion<(NonNullable<CancelOrderMutation['cancelOrder']>), { __typename?: 'ErrorResult' }>);
}

export namespace CanceledOrder {
  export type Fragment = CanceledOrderFragment;
  export type Lines = NonNullable<(NonNullable<CanceledOrderFragment['lines']>)[number]>;
  export type Items = NonNullable<(NonNullable<NonNullable<(NonNullable<CanceledOrderFragment['lines']>)[number]>['items']>)[number]>;
}

export namespace Refund {
  export type Fragment = RefundFragment;
}

export namespace RefundOrder {
  export type Variables = RefundOrderMutationVariables;
  export type Mutation = RefundOrderMutation;
  export type RefundOrder = (NonNullable<RefundOrderMutation['refundOrder']>);
  export type ErrorResultInlineFragment = (DiscriminateUnion<(NonNullable<RefundOrderMutation['refundOrder']>), { __typename?: 'ErrorResult' }>);
}

export namespace SettleRefund {
  export type Variables = SettleRefundMutationVariables;
  export type Mutation = SettleRefundMutation;
  export type SettleRefund = (NonNullable<SettleRefundMutation['settleRefund']>);
  export type ErrorResultInlineFragment = (DiscriminateUnion<(NonNullable<SettleRefundMutation['settleRefund']>), { __typename?: 'ErrorResult' }>);
}

export namespace GetOrderHistory {
  export type Variables = GetOrderHistoryQueryVariables;
  export type Query = GetOrderHistoryQuery;
  export type Order = (NonNullable<GetOrderHistoryQuery['order']>);
  export type History = (NonNullable<(NonNullable<GetOrderHistoryQuery['order']>)['history']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<(NonNullable<GetOrderHistoryQuery['order']>)['history']>)['items']>)[number]>;
  export type Administrator = (NonNullable<NonNullable<(NonNullable<(NonNullable<(NonNullable<GetOrderHistoryQuery['order']>)['history']>)['items']>)[number]>['administrator']>);
}

export namespace AddNoteToOrder {
  export type Variables = AddNoteToOrderMutationVariables;
  export type Mutation = AddNoteToOrderMutation;
  export type AddNoteToOrder = (NonNullable<AddNoteToOrderMutation['addNoteToOrder']>);
}

export namespace UpdateOrderNote {
  export type Variables = UpdateOrderNoteMutationVariables;
  export type Mutation = UpdateOrderNoteMutation;
  export type UpdateOrderNote = (NonNullable<UpdateOrderNoteMutation['updateOrderNote']>);
}

export namespace DeleteOrderNote {
  export type Variables = DeleteOrderNoteMutationVariables;
  export type Mutation = DeleteOrderNoteMutation;
  export type DeleteOrderNote = (NonNullable<DeleteOrderNoteMutation['deleteOrderNote']>);
}

export namespace GetOrderWithPayments {
  export type Variables = GetOrderWithPaymentsQueryVariables;
  export type Query = GetOrderWithPaymentsQuery;
  export type Order = (NonNullable<GetOrderWithPaymentsQuery['order']>);
  export type Payments = NonNullable<(NonNullable<(NonNullable<GetOrderWithPaymentsQuery['order']>)['payments']>)[number]>;
}

export namespace ProductOptionGroup {
  export type Fragment = ProductOptionGroupFragment;
  export type Options = NonNullable<(NonNullable<ProductOptionGroupFragment['options']>)[number]>;
  export type Translations = NonNullable<(NonNullable<ProductOptionGroupFragment['translations']>)[number]>;
}

export namespace CreateProductOptionGroup {
  export type Variables = CreateProductOptionGroupMutationVariables;
  export type Mutation = CreateProductOptionGroupMutation;
  export type CreateProductOptionGroup = (NonNullable<CreateProductOptionGroupMutation['createProductOptionGroup']>);
}

export namespace UpdateProductOptionGroup {
  export type Variables = UpdateProductOptionGroupMutationVariables;
  export type Mutation = UpdateProductOptionGroupMutation;
  export type UpdateProductOptionGroup = (NonNullable<UpdateProductOptionGroupMutation['updateProductOptionGroup']>);
}

export namespace CreateProductOption {
  export type Variables = CreateProductOptionMutationVariables;
  export type Mutation = CreateProductOptionMutation;
  export type CreateProductOption = (NonNullable<CreateProductOptionMutation['createProductOption']>);
  export type Translations = NonNullable<(NonNullable<(NonNullable<CreateProductOptionMutation['createProductOption']>)['translations']>)[number]>;
}

export namespace UpdateProductOption {
  export type Variables = UpdateProductOptionMutationVariables;
  export type Mutation = UpdateProductOptionMutation;
  export type UpdateProductOption = (NonNullable<UpdateProductOptionMutation['updateProductOption']>);
}

export namespace ProductWithOptions {
  export type Fragment = ProductWithOptionsFragment;
  export type OptionGroups = NonNullable<(NonNullable<ProductWithOptionsFragment['optionGroups']>)[number]>;
  export type Options = NonNullable<(NonNullable<NonNullable<(NonNullable<ProductWithOptionsFragment['optionGroups']>)[number]>['options']>)[number]>;
}

export namespace AddOptionGroupToProduct {
  export type Variables = AddOptionGroupToProductMutationVariables;
  export type Mutation = AddOptionGroupToProductMutation;
  export type AddOptionGroupToProduct = (NonNullable<AddOptionGroupToProductMutation['addOptionGroupToProduct']>);
}

export namespace RemoveOptionGroupFromProduct {
  export type Variables = RemoveOptionGroupFromProductMutationVariables;
  export type Mutation = RemoveOptionGroupFromProductMutation;
  export type RemoveOptionGroupFromProduct = (NonNullable<RemoveOptionGroupFromProductMutation['removeOptionGroupFromProduct']>);
  export type ProductOptionInUseErrorInlineFragment = (DiscriminateUnion<(NonNullable<RemoveOptionGroupFromProductMutation['removeOptionGroupFromProduct']>), { __typename?: 'ProductOptionInUseError' }>);
}

export namespace GetOptionGroup {
  export type Variables = GetOptionGroupQueryVariables;
  export type Query = GetOptionGroupQuery;
  export type ProductOptionGroup = (NonNullable<GetOptionGroupQuery['productOptionGroup']>);
  export type Options = NonNullable<(NonNullable<(NonNullable<GetOptionGroupQuery['productOptionGroup']>)['options']>)[number]>;
}

export namespace GetProductVariant {
  export type Variables = GetProductVariantQueryVariables;
  export type Query = GetProductVariantQuery;
  export type ProductVariant = (NonNullable<GetProductVariantQuery['productVariant']>);
}

export namespace DeletePromotion {
  export type Variables = DeletePromotionMutationVariables;
  export type Mutation = DeletePromotionMutation;
  export type DeletePromotion = (NonNullable<DeletePromotionMutation['deletePromotion']>);
}

export namespace GetPromotionList {
  export type Variables = GetPromotionListQueryVariables;
  export type Query = GetPromotionListQuery;
  export type Promotions = (NonNullable<GetPromotionListQuery['promotions']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetPromotionListQuery['promotions']>)['items']>)[number]>;
}

export namespace GetPromotion {
  export type Variables = GetPromotionQueryVariables;
  export type Query = GetPromotionQuery;
  export type Promotion = (NonNullable<GetPromotionQuery['promotion']>);
}

export namespace UpdatePromotion {
  export type Variables = UpdatePromotionMutationVariables;
  export type Mutation = UpdatePromotionMutation;
  export type UpdatePromotion = (NonNullable<UpdatePromotionMutation['updatePromotion']>);
  export type ErrorResultInlineFragment = (DiscriminateUnion<(NonNullable<UpdatePromotionMutation['updatePromotion']>), { __typename?: 'ErrorResult' }>);
}

export namespace ConfigurableOperationDef {
  export type Fragment = ConfigurableOperationDefFragment;
  export type Args = NonNullable<(NonNullable<ConfigurableOperationDefFragment['args']>)[number]>;
}

export namespace GetAdjustmentOperations {
  export type Variables = GetAdjustmentOperationsQueryVariables;
  export type Query = GetAdjustmentOperationsQuery;
  export type PromotionActions = NonNullable<(NonNullable<GetAdjustmentOperationsQuery['promotionActions']>)[number]>;
  export type PromotionConditions = NonNullable<(NonNullable<GetAdjustmentOperationsQuery['promotionConditions']>)[number]>;
}

export namespace GetRoles {
  export type Variables = GetRolesQueryVariables;
  export type Query = GetRolesQuery;
  export type Roles = (NonNullable<GetRolesQuery['roles']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetRolesQuery['roles']>)['items']>)[number]>;
}

export namespace GetRole {
  export type Variables = GetRoleQueryVariables;
  export type Query = GetRoleQuery;
  export type Role = (NonNullable<GetRoleQuery['role']>);
}

export namespace UpdateRole {
  export type Variables = UpdateRoleMutationVariables;
  export type Mutation = UpdateRoleMutation;
  export type UpdateRole = (NonNullable<UpdateRoleMutation['updateRole']>);
}

export namespace DeleteRole {
  export type Variables = DeleteRoleMutationVariables;
  export type Mutation = DeleteRoleMutation;
  export type DeleteRole = (NonNullable<DeleteRoleMutation['deleteRole']>);
}

export namespace Logout {
  export type Variables = LogoutMutationVariables;
  export type Mutation = LogoutMutation;
  export type Logout = (NonNullable<LogoutMutation['logout']>);
}

export namespace ShippingMethod {
  export type Fragment = ShippingMethodFragment;
  export type Calculator = (NonNullable<ShippingMethodFragment['calculator']>);
  export type Checker = (NonNullable<ShippingMethodFragment['checker']>);
}

export namespace GetShippingMethodList {
  export type Variables = GetShippingMethodListQueryVariables;
  export type Query = GetShippingMethodListQuery;
  export type ShippingMethods = (NonNullable<GetShippingMethodListQuery['shippingMethods']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetShippingMethodListQuery['shippingMethods']>)['items']>)[number]>;
}

export namespace GetShippingMethod {
  export type Variables = GetShippingMethodQueryVariables;
  export type Query = GetShippingMethodQuery;
  export type ShippingMethod = (NonNullable<GetShippingMethodQuery['shippingMethod']>);
}

export namespace CreateShippingMethod {
  export type Variables = CreateShippingMethodMutationVariables;
  export type Mutation = CreateShippingMethodMutation;
  export type CreateShippingMethod = (NonNullable<CreateShippingMethodMutation['createShippingMethod']>);
}

export namespace UpdateShippingMethod {
  export type Variables = UpdateShippingMethodMutationVariables;
  export type Mutation = UpdateShippingMethodMutation;
  export type UpdateShippingMethod = (NonNullable<UpdateShippingMethodMutation['updateShippingMethod']>);
}

export namespace DeleteShippingMethod {
  export type Variables = DeleteShippingMethodMutationVariables;
  export type Mutation = DeleteShippingMethodMutation;
  export type DeleteShippingMethod = (NonNullable<DeleteShippingMethodMutation['deleteShippingMethod']>);
}

export namespace GetEligibilityCheckers {
  export type Variables = GetEligibilityCheckersQueryVariables;
  export type Query = GetEligibilityCheckersQuery;
  export type ShippingEligibilityCheckers = NonNullable<(NonNullable<GetEligibilityCheckersQuery['shippingEligibilityCheckers']>)[number]>;
  export type Args = NonNullable<(NonNullable<NonNullable<(NonNullable<GetEligibilityCheckersQuery['shippingEligibilityCheckers']>)[number]>['args']>)[number]>;
}

export namespace GetCalculators {
  export type Variables = GetCalculatorsQueryVariables;
  export type Query = GetCalculatorsQuery;
  export type ShippingCalculators = NonNullable<(NonNullable<GetCalculatorsQuery['shippingCalculators']>)[number]>;
  export type Args = NonNullable<(NonNullable<NonNullable<(NonNullable<GetCalculatorsQuery['shippingCalculators']>)[number]>['args']>)[number]>;
}

export namespace TestShippingMethod {
  export type Variables = TestShippingMethodQueryVariables;
  export type Query = TestShippingMethodQuery;
  export type TestShippingMethod = (NonNullable<TestShippingMethodQuery['testShippingMethod']>);
  export type Quote = (NonNullable<(NonNullable<TestShippingMethodQuery['testShippingMethod']>)['quote']>);
}

export namespace TestEligibleMethods {
  export type Variables = TestEligibleMethodsQueryVariables;
  export type Query = TestEligibleMethodsQuery;
  export type TestEligibleShippingMethods = NonNullable<(NonNullable<TestEligibleMethodsQuery['testEligibleShippingMethods']>)[number]>;
}

export namespace GetMe {
  export type Variables = GetMeQueryVariables;
  export type Query = GetMeQuery;
  export type Me = (NonNullable<GetMeQuery['me']>);
}

export namespace GetProductsTake3 {
  export type Variables = GetProductsTake3QueryVariables;
  export type Query = GetProductsTake3Query;
  export type Products = (NonNullable<GetProductsTake3Query['products']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetProductsTake3Query['products']>)['items']>)[number]>;
}

export namespace GetProduct1 {
  export type Variables = GetProduct1QueryVariables;
  export type Query = GetProduct1Query;
  export type Product = (NonNullable<GetProduct1Query['product']>);
}

export namespace GetProduct2Variants {
  export type Variables = GetProduct2VariantsQueryVariables;
  export type Query = GetProduct2VariantsQuery;
  export type Product = (NonNullable<GetProduct2VariantsQuery['product']>);
  export type Variants = NonNullable<(NonNullable<(NonNullable<GetProduct2VariantsQuery['product']>)['variants']>)[number]>;
}

export namespace GetProductCollection {
  export type Variables = GetProductCollectionQueryVariables;
  export type Query = GetProductCollectionQuery;
  export type Product = (NonNullable<GetProductCollectionQuery['product']>);
  export type Collections = NonNullable<(NonNullable<(NonNullable<GetProductCollectionQuery['product']>)['collections']>)[number]>;
}

export namespace DisableProduct {
  export type Variables = DisableProductMutationVariables;
  export type Mutation = DisableProductMutation;
  export type UpdateProduct = (NonNullable<DisableProductMutation['updateProduct']>);
}

export namespace GetCollectionVariants {
  export type Variables = GetCollectionVariantsQueryVariables;
  export type Query = GetCollectionVariantsQuery;
  export type Collection = (NonNullable<GetCollectionVariantsQuery['collection']>);
  export type ProductVariants = (NonNullable<(NonNullable<GetCollectionVariantsQuery['collection']>)['productVariants']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<(NonNullable<GetCollectionVariantsQuery['collection']>)['productVariants']>)['items']>)[number]>;
}

export namespace GetCollectionList {
  export type Variables = GetCollectionListQueryVariables;
  export type Query = GetCollectionListQuery;
  export type Collections = (NonNullable<GetCollectionListQuery['collections']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetCollectionListQuery['collections']>)['items']>)[number]>;
}

export namespace GetProductFacetValues {
  export type Variables = GetProductFacetValuesQueryVariables;
  export type Query = GetProductFacetValuesQuery;
  export type Product = (NonNullable<GetProductFacetValuesQuery['product']>);
  export type FacetValues = NonNullable<(NonNullable<(NonNullable<GetProductFacetValuesQuery['product']>)['facetValues']>)[number]>;
}

export namespace GetVariantFacetValues {
  export type Variables = GetVariantFacetValuesQueryVariables;
  export type Query = GetVariantFacetValuesQuery;
  export type Product = (NonNullable<GetVariantFacetValuesQuery['product']>);
  export type Variants = NonNullable<(NonNullable<(NonNullable<GetVariantFacetValuesQuery['product']>)['variants']>)[number]>;
  export type FacetValues = NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<GetVariantFacetValuesQuery['product']>)['variants']>)[number]>['facetValues']>)[number]>;
}

export namespace GetCustomerIds {
  export type Variables = GetCustomerIdsQueryVariables;
  export type Query = GetCustomerIdsQuery;
  export type Customers = (NonNullable<GetCustomerIdsQuery['customers']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetCustomerIdsQuery['customers']>)['items']>)[number]>;
}

export namespace UpdateStock {
  export type Variables = UpdateStockMutationVariables;
  export type Mutation = UpdateStockMutation;
  export type UpdateProductVariants = NonNullable<(NonNullable<UpdateStockMutation['updateProductVariants']>)[number]>;
}

export namespace GetTaxCategoryList {
  export type Variables = GetTaxCategoryListQueryVariables;
  export type Query = GetTaxCategoryListQuery;
  export type TaxCategories = NonNullable<(NonNullable<GetTaxCategoryListQuery['taxCategories']>)[number]>;
}

export namespace GetTaxCategory {
  export type Variables = GetTaxCategoryQueryVariables;
  export type Query = GetTaxCategoryQuery;
  export type TaxCategory = (NonNullable<GetTaxCategoryQuery['taxCategory']>);
}

export namespace CreateTaxCategory {
  export type Variables = CreateTaxCategoryMutationVariables;
  export type Mutation = CreateTaxCategoryMutation;
  export type CreateTaxCategory = (NonNullable<CreateTaxCategoryMutation['createTaxCategory']>);
}

export namespace UpdateTaxCategory {
  export type Variables = UpdateTaxCategoryMutationVariables;
  export type Mutation = UpdateTaxCategoryMutation;
  export type UpdateTaxCategory = (NonNullable<UpdateTaxCategoryMutation['updateTaxCategory']>);
}

export namespace DeleteTaxCategory {
  export type Variables = DeleteTaxCategoryMutationVariables;
  export type Mutation = DeleteTaxCategoryMutation;
  export type DeleteTaxCategory = (NonNullable<DeleteTaxCategoryMutation['deleteTaxCategory']>);
}

export namespace GetTaxRates {
  export type Variables = GetTaxRatesQueryVariables;
  export type Query = GetTaxRatesQuery;
  export type TaxRates = (NonNullable<GetTaxRatesQuery['taxRates']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetTaxRatesQuery['taxRates']>)['items']>)[number]>;
}

export namespace GetTaxRate {
  export type Variables = GetTaxRateQueryVariables;
  export type Query = GetTaxRateQuery;
  export type TaxRate = (NonNullable<GetTaxRateQuery['taxRate']>);
}

export namespace CreateTaxRate {
  export type Variables = CreateTaxRateMutationVariables;
  export type Mutation = CreateTaxRateMutation;
  export type CreateTaxRate = (NonNullable<CreateTaxRateMutation['createTaxRate']>);
}

export namespace DeleteTaxRate {
  export type Variables = DeleteTaxRateMutationVariables;
  export type Mutation = DeleteTaxRateMutation;
  export type DeleteTaxRate = (NonNullable<DeleteTaxRateMutation['deleteTaxRate']>);
}

export namespace DeleteZone {
  export type Variables = DeleteZoneMutationVariables;
  export type Mutation = DeleteZoneMutation;
  export type DeleteZone = (NonNullable<DeleteZoneMutation['deleteZone']>);
}

export namespace GetZones {
  export type Variables = GetZonesQueryVariables;
  export type Query = GetZonesQuery;
  export type Zones = NonNullable<(NonNullable<GetZonesQuery['zones']>)[number]>;
}

export namespace GetZone {
  export type Variables = GetZoneQueryVariables;
  export type Query = GetZoneQuery;
  export type Zone = (NonNullable<GetZoneQuery['zone']>);
}

export namespace CreateZone {
  export type Variables = CreateZoneMutationVariables;
  export type Mutation = CreateZoneMutation;
  export type CreateZone = (NonNullable<CreateZoneMutation['createZone']>);
}

export namespace UpdateZone {
  export type Variables = UpdateZoneMutationVariables;
  export type Mutation = UpdateZoneMutation;
  export type UpdateZone = (NonNullable<UpdateZoneMutation['updateZone']>);
}

export namespace AddMembersToZone {
  export type Variables = AddMembersToZoneMutationVariables;
  export type Mutation = AddMembersToZoneMutation;
  export type AddMembersToZone = (NonNullable<AddMembersToZoneMutation['addMembersToZone']>);
}

export namespace RemoveMembersFromZone {
  export type Variables = RemoveMembersFromZoneMutationVariables;
  export type Mutation = RemoveMembersFromZoneMutation;
  export type RemoveMembersFromZone = (NonNullable<RemoveMembersFromZoneMutation['removeMembersFromZone']>);
}
