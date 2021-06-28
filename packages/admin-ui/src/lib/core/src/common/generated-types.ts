// tslint:disable
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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
  __typename?: 'Query';
  activeAdministrator?: Maybe<Administrator>;
  activeChannel: Channel;
  administrator?: Maybe<Administrator>;
  administrators: AdministratorList;
  /** Get a single Asset by id */
  asset?: Maybe<Asset>;
  /** Get a list of Assets */
  assets: AssetList;
  channel?: Maybe<Channel>;
  channels: Array<Channel>;
  /** Get a Collection either by id or slug. If neither id nor slug is speicified, an error will result. */
  collection?: Maybe<Collection>;
  collectionFilters: Array<ConfigurableOperationDefinition>;
  collections: CollectionList;
  countries: CountryList;
  country?: Maybe<Country>;
  customer?: Maybe<Customer>;
  customerGroup?: Maybe<CustomerGroup>;
  customerGroups: CustomerGroupList;
  customers: CustomerList;
  facet?: Maybe<Facet>;
  facets: FacetList;
  fulfillmentHandlers: Array<ConfigurableOperationDefinition>;
  globalSettings: GlobalSettings;
  job?: Maybe<Job>;
  jobQueues: Array<JobQueue>;
  jobs: JobList;
  jobsById: Array<Job>;
  me?: Maybe<CurrentUser>;
  networkStatus: NetworkStatus;
  order?: Maybe<Order>;
  orders: OrderList;
  paymentMethod?: Maybe<PaymentMethod>;
  paymentMethodEligibilityCheckers: Array<ConfigurableOperationDefinition>;
  paymentMethodHandlers: Array<ConfigurableOperationDefinition>;
  paymentMethods: PaymentMethodList;
  /** Get a Product either by id or slug. If neither id nor slug is speicified, an error will result. */
  product?: Maybe<Product>;
  productOptionGroup?: Maybe<ProductOptionGroup>;
  productOptionGroups: Array<ProductOptionGroup>;
  /** Get a ProductVariant by id */
  productVariant?: Maybe<ProductVariant>;
  /** List ProductVariants either all or for the specific product. */
  productVariants: ProductVariantList;
  /** List Products */
  products: ProductList;
  promotion?: Maybe<Promotion>;
  promotionActions: Array<ConfigurableOperationDefinition>;
  promotionConditions: Array<ConfigurableOperationDefinition>;
  promotions: PromotionList;
  role?: Maybe<Role>;
  roles: RoleList;
  search: SearchResponse;
  shippingCalculators: Array<ConfigurableOperationDefinition>;
  shippingEligibilityCheckers: Array<ConfigurableOperationDefinition>;
  shippingMethod?: Maybe<ShippingMethod>;
  shippingMethods: ShippingMethodList;
  tag: Tag;
  tags: TagList;
  taxCategories: Array<TaxCategory>;
  taxCategory?: Maybe<TaxCategory>;
  taxRate?: Maybe<TaxRate>;
  taxRates: TaxRateList;
  testEligibleShippingMethods: Array<ShippingMethodQuote>;
  testShippingMethod: TestShippingMethodResult;
  uiState: UiState;
  userStatus: UserStatus;
  zone?: Maybe<Zone>;
  zones: Array<Zone>;
};


export type QueryAdministratorArgs = {
  id: Scalars['ID'];
};


export type QueryAdministratorsArgs = {
  options?: Maybe<AdministratorListOptions>;
};


export type QueryAssetArgs = {
  id: Scalars['ID'];
};


export type QueryAssetsArgs = {
  options?: Maybe<AssetListOptions>;
};


export type QueryChannelArgs = {
  id: Scalars['ID'];
};


export type QueryCollectionArgs = {
  id?: Maybe<Scalars['ID']>;
  slug?: Maybe<Scalars['String']>;
};


export type QueryCollectionsArgs = {
  options?: Maybe<CollectionListOptions>;
};


export type QueryCountriesArgs = {
  options?: Maybe<CountryListOptions>;
};


export type QueryCountryArgs = {
  id: Scalars['ID'];
};


export type QueryCustomerArgs = {
  id: Scalars['ID'];
};


export type QueryCustomerGroupArgs = {
  id: Scalars['ID'];
};


export type QueryCustomerGroupsArgs = {
  options?: Maybe<CustomerGroupListOptions>;
};


export type QueryCustomersArgs = {
  options?: Maybe<CustomerListOptions>;
};


export type QueryFacetArgs = {
  id: Scalars['ID'];
};


export type QueryFacetsArgs = {
  options?: Maybe<FacetListOptions>;
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


export type QueryPaymentMethodArgs = {
  id: Scalars['ID'];
};


export type QueryPaymentMethodsArgs = {
  options?: Maybe<PaymentMethodListOptions>;
};


export type QueryProductArgs = {
  id?: Maybe<Scalars['ID']>;
  slug?: Maybe<Scalars['String']>;
};


export type QueryProductOptionGroupArgs = {
  id: Scalars['ID'];
};


export type QueryProductOptionGroupsArgs = {
  filterTerm?: Maybe<Scalars['String']>;
};


export type QueryProductVariantArgs = {
  id: Scalars['ID'];
};


export type QueryProductVariantsArgs = {
  options?: Maybe<ProductVariantListOptions>;
  productId?: Maybe<Scalars['ID']>;
};


export type QueryProductsArgs = {
  options?: Maybe<ProductListOptions>;
};


export type QueryPromotionArgs = {
  id: Scalars['ID'];
};


export type QueryPromotionsArgs = {
  options?: Maybe<PromotionListOptions>;
};


export type QueryRoleArgs = {
  id: Scalars['ID'];
};


export type QueryRolesArgs = {
  options?: Maybe<RoleListOptions>;
};


export type QuerySearchArgs = {
  input: SearchInput;
};


export type QueryShippingMethodArgs = {
  id: Scalars['ID'];
};


export type QueryShippingMethodsArgs = {
  options?: Maybe<ShippingMethodListOptions>;
};


export type QueryTagArgs = {
  id: Scalars['ID'];
};


export type QueryTagsArgs = {
  options?: Maybe<TagListOptions>;
};


export type QueryTaxCategoryArgs = {
  id: Scalars['ID'];
};


export type QueryTaxRateArgs = {
  id: Scalars['ID'];
};


export type QueryTaxRatesArgs = {
  options?: Maybe<TaxRateListOptions>;
};


export type QueryTestEligibleShippingMethodsArgs = {
  input: TestEligibleShippingMethodsInput;
};


export type QueryTestShippingMethodArgs = {
  input: TestShippingMethodInput;
};


export type QueryZoneArgs = {
  id: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Add Customers to a CustomerGroup */
  addCustomersToGroup: CustomerGroup;
  addFulfillmentToOrder: AddFulfillmentToOrderResult;
  /**
   * Used to manually create a new Payment against an Order. This is used when a completed Order
   * has been modified (using `modifyOrder`) and the price has increased. The extra payment
   * can then be manually arranged by the administrator, and the details used to create a new
   * Payment.
   */
  addManualPaymentToOrder: AddManualPaymentToOrderResult;
  /** Add members to a Zone */
  addMembersToZone: Zone;
  addNoteToCustomer: Customer;
  addNoteToOrder: Order;
  /** Add an OptionGroup to a Product */
  addOptionGroupToProduct: Product;
  /** Assign assets to channel */
  assignAssetsToChannel: Array<Asset>;
  /** Assigns ProductVariants to the specified Channel */
  assignProductVariantsToChannel: Array<ProductVariant>;
  /** Assigns all ProductVariants of Product to the specified Channel */
  assignProductsToChannel: Array<Product>;
  /** Assigns Promotions to the specified Channel */
  assignPromotionsToChannel: Array<Promotion>;
  /** Assign a Role to an Administrator */
  assignRoleToAdministrator: Administrator;
  /** Authenticates the user using a named authentication strategy */
  authenticate: AuthenticationResult;
  cancelJob: Job;
  cancelOrder: CancelOrderResult;
  /** Create a new Administrator */
  createAdministrator: Administrator;
  /** Create a new Asset */
  createAssets: Array<CreateAssetResult>;
  /** Create a new Channel */
  createChannel: CreateChannelResult;
  /** Create a new Collection */
  createCollection: Collection;
  /** Create a new Country */
  createCountry: Country;
  /** Create a new Customer. If a password is provided, a new User will also be created an linked to the Customer. */
  createCustomer: CreateCustomerResult;
  /** Create a new Address and associate it with the Customer specified by customerId */
  createCustomerAddress: Address;
  /** Create a new CustomerGroup */
  createCustomerGroup: CustomerGroup;
  /** Create a new Facet */
  createFacet: Facet;
  /** Create one or more FacetValues */
  createFacetValues: Array<FacetValue>;
  /** Create existing PaymentMethod */
  createPaymentMethod: PaymentMethod;
  /** Create a new Product */
  createProduct: Product;
  /** Create a new ProductOption within a ProductOptionGroup */
  createProductOption: ProductOption;
  /** Create a new ProductOptionGroup */
  createProductOptionGroup: ProductOptionGroup;
  /** Create a set of ProductVariants based on the OptionGroups assigned to the given Product */
  createProductVariants: Array<Maybe<ProductVariant>>;
  createPromotion: CreatePromotionResult;
  /** Create a new Role */
  createRole: Role;
  /** Create a new ShippingMethod */
  createShippingMethod: ShippingMethod;
  /** Create a new Tag */
  createTag: Tag;
  /** Create a new TaxCategory */
  createTaxCategory: TaxCategory;
  /** Create a new TaxRate */
  createTaxRate: TaxRate;
  /** Create a new Zone */
  createZone: Zone;
  /** Delete an Administrator */
  deleteAdministrator: DeletionResponse;
  /** Delete an Asset */
  deleteAsset: DeletionResponse;
  /** Delete multiple Assets */
  deleteAssets: DeletionResponse;
  /** Delete a Channel */
  deleteChannel: DeletionResponse;
  /** Delete a Collection and all of its descendants */
  deleteCollection: DeletionResponse;
  /** Delete a Country */
  deleteCountry: DeletionResponse;
  /** Delete a Customer */
  deleteCustomer: DeletionResponse;
  /** Update an existing Address */
  deleteCustomerAddress: Success;
  /** Delete a CustomerGroup */
  deleteCustomerGroup: DeletionResponse;
  deleteCustomerNote: DeletionResponse;
  /** Delete an existing Facet */
  deleteFacet: DeletionResponse;
  /** Delete one or more FacetValues */
  deleteFacetValues: Array<DeletionResponse>;
  deleteOrderNote: DeletionResponse;
  /** Delete a PaymentMethod */
  deletePaymentMethod: DeletionResponse;
  /** Delete a Product */
  deleteProduct: DeletionResponse;
  /** Delete a ProductVariant */
  deleteProductVariant: DeletionResponse;
  deletePromotion: DeletionResponse;
  /** Delete an existing Role */
  deleteRole: DeletionResponse;
  /** Delete a ShippingMethod */
  deleteShippingMethod: DeletionResponse;
  /** Delete an existing Tag */
  deleteTag: DeletionResponse;
  /** Deletes a TaxCategory */
  deleteTaxCategory: DeletionResponse;
  /** Delete a TaxRate */
  deleteTaxRate: DeletionResponse;
  /** Delete a Zone */
  deleteZone: DeletionResponse;
  importProducts?: Maybe<ImportInfo>;
  /** Authenticates the user using the native authentication strategy. This mutation is an alias for `authenticate({ native: { ... }})` */
  login: NativeAuthenticationResult;
  logout: Success;
  /**
   * Allows an Order to be modified after it has been completed by the Customer. The Order must first
   * be in the `Modifying` state.
   */
  modifyOrder: ModifyOrderResult;
  /** Move a Collection to a different parent or index */
  moveCollection: Collection;
  refundOrder: RefundOrderResult;
  reindex: Job;
  /** Remove Customers from a CustomerGroup */
  removeCustomersFromGroup: CustomerGroup;
  /** Remove members from a Zone */
  removeMembersFromZone: Zone;
  /** Remove an OptionGroup from a Product */
  removeOptionGroupFromProduct: RemoveOptionGroupFromProductResult;
  /** Removes ProductVariants from the specified Channel */
  removeProductVariantsFromChannel: Array<ProductVariant>;
  /** Removes all ProductVariants of Product from the specified Channel */
  removeProductsFromChannel: Array<Product>;
  /** Removes Promotions from the specified Channel */
  removePromotionsFromChannel: Array<Promotion>;
  /** Remove all settled jobs in the given queues olfer than the given date. Returns the number of jobs deleted. */
  removeSettledJobs: Scalars['Int'];
  requestCompleted: Scalars['Int'];
  requestStarted: Scalars['Int'];
  setActiveChannel: UserStatus;
  setAsLoggedIn: UserStatus;
  setAsLoggedOut: UserStatus;
  setContentLanguage: LanguageCode;
  setOrderCustomFields?: Maybe<Order>;
  setUiLanguage: LanguageCode;
  setUiTheme: Scalars['String'];
  settlePayment: SettlePaymentResult;
  settleRefund: SettleRefundResult;
  transitionFulfillmentToState: TransitionFulfillmentToStateResult;
  transitionOrderToState?: Maybe<TransitionOrderToStateResult>;
  transitionPaymentToState: TransitionPaymentToStateResult;
  /** Update the active (currently logged-in) Administrator */
  updateActiveAdministrator: Administrator;
  /** Update an existing Administrator */
  updateAdministrator: Administrator;
  /** Update an existing Asset */
  updateAsset: Asset;
  /** Update an existing Channel */
  updateChannel: UpdateChannelResult;
  /** Update an existing Collection */
  updateCollection: Collection;
  /** Update an existing Country */
  updateCountry: Country;
  /** Update an existing Customer */
  updateCustomer: UpdateCustomerResult;
  /** Update an existing Address */
  updateCustomerAddress: Address;
  /** Update an existing CustomerGroup */
  updateCustomerGroup: CustomerGroup;
  updateCustomerNote: HistoryEntry;
  /** Update an existing Facet */
  updateFacet: Facet;
  /** Update one or more FacetValues */
  updateFacetValues: Array<FacetValue>;
  updateGlobalSettings: UpdateGlobalSettingsResult;
  updateOrderNote: HistoryEntry;
  /** Update an existing PaymentMethod */
  updatePaymentMethod: PaymentMethod;
  /** Update an existing Product */
  updateProduct: Product;
  /** Create a new ProductOption within a ProductOptionGroup */
  updateProductOption: ProductOption;
  /** Update an existing ProductOptionGroup */
  updateProductOptionGroup: ProductOptionGroup;
  /** Update existing ProductVariants */
  updateProductVariants: Array<Maybe<ProductVariant>>;
  updatePromotion: UpdatePromotionResult;
  /** Update an existing Role */
  updateRole: Role;
  /** Update an existing ShippingMethod */
  updateShippingMethod: ShippingMethod;
  /** Update an existing Tag */
  updateTag: Tag;
  /** Update an existing TaxCategory */
  updateTaxCategory: TaxCategory;
  /** Update an existing TaxRate */
  updateTaxRate: TaxRate;
  updateUserChannels: UserStatus;
  /** Update an existing Zone */
  updateZone: Zone;
};


export type MutationAddCustomersToGroupArgs = {
  customerGroupId: Scalars['ID'];
  customerIds: Array<Scalars['ID']>;
};


export type MutationAddFulfillmentToOrderArgs = {
  input: FulfillOrderInput;
};


export type MutationAddManualPaymentToOrderArgs = {
  input: ManualPaymentInput;
};


export type MutationAddMembersToZoneArgs = {
  zoneId: Scalars['ID'];
  memberIds: Array<Scalars['ID']>;
};


export type MutationAddNoteToCustomerArgs = {
  input: AddNoteToCustomerInput;
};


export type MutationAddNoteToOrderArgs = {
  input: AddNoteToOrderInput;
};


export type MutationAddOptionGroupToProductArgs = {
  productId: Scalars['ID'];
  optionGroupId: Scalars['ID'];
};


export type MutationAssignAssetsToChannelArgs = {
  input: AssignAssetsToChannelInput;
};


export type MutationAssignProductVariantsToChannelArgs = {
  input: AssignProductVariantsToChannelInput;
};


export type MutationAssignProductsToChannelArgs = {
  input: AssignProductsToChannelInput;
};


export type MutationAssignPromotionsToChannelArgs = {
  input: AssignPromotionsToChannelInput;
};


export type MutationAssignRoleToAdministratorArgs = {
  administratorId: Scalars['ID'];
  roleId: Scalars['ID'];
};


export type MutationAuthenticateArgs = {
  input: AuthenticationInput;
  rememberMe?: Maybe<Scalars['Boolean']>;
};


export type MutationCancelJobArgs = {
  jobId: Scalars['ID'];
};


export type MutationCancelOrderArgs = {
  input: CancelOrderInput;
};


export type MutationCreateAdministratorArgs = {
  input: CreateAdministratorInput;
};


export type MutationCreateAssetsArgs = {
  input: Array<CreateAssetInput>;
};


export type MutationCreateChannelArgs = {
  input: CreateChannelInput;
};


export type MutationCreateCollectionArgs = {
  input: CreateCollectionInput;
};


export type MutationCreateCountryArgs = {
  input: CreateCountryInput;
};


export type MutationCreateCustomerArgs = {
  input: CreateCustomerInput;
  password?: Maybe<Scalars['String']>;
};


export type MutationCreateCustomerAddressArgs = {
  customerId: Scalars['ID'];
  input: CreateAddressInput;
};


export type MutationCreateCustomerGroupArgs = {
  input: CreateCustomerGroupInput;
};


export type MutationCreateFacetArgs = {
  input: CreateFacetInput;
};


export type MutationCreateFacetValuesArgs = {
  input: Array<CreateFacetValueInput>;
};


export type MutationCreatePaymentMethodArgs = {
  input: CreatePaymentMethodInput;
};


export type MutationCreateProductArgs = {
  input: CreateProductInput;
};


export type MutationCreateProductOptionArgs = {
  input: CreateProductOptionInput;
};


export type MutationCreateProductOptionGroupArgs = {
  input: CreateProductOptionGroupInput;
};


export type MutationCreateProductVariantsArgs = {
  input: Array<CreateProductVariantInput>;
};


export type MutationCreatePromotionArgs = {
  input: CreatePromotionInput;
};


export type MutationCreateRoleArgs = {
  input: CreateRoleInput;
};


export type MutationCreateShippingMethodArgs = {
  input: CreateShippingMethodInput;
};


export type MutationCreateTagArgs = {
  input: CreateTagInput;
};


export type MutationCreateTaxCategoryArgs = {
  input: CreateTaxCategoryInput;
};


export type MutationCreateTaxRateArgs = {
  input: CreateTaxRateInput;
};


export type MutationCreateZoneArgs = {
  input: CreateZoneInput;
};


export type MutationDeleteAdministratorArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteAssetArgs = {
  input: DeleteAssetInput;
};


export type MutationDeleteAssetsArgs = {
  input: DeleteAssetsInput;
};


export type MutationDeleteChannelArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteCollectionArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteCountryArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteCustomerArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteCustomerAddressArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteCustomerGroupArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteCustomerNoteArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteFacetArgs = {
  id: Scalars['ID'];
  force?: Maybe<Scalars['Boolean']>;
};


export type MutationDeleteFacetValuesArgs = {
  ids: Array<Scalars['ID']>;
  force?: Maybe<Scalars['Boolean']>;
};


export type MutationDeleteOrderNoteArgs = {
  id: Scalars['ID'];
};


export type MutationDeletePaymentMethodArgs = {
  id: Scalars['ID'];
  force?: Maybe<Scalars['Boolean']>;
};


export type MutationDeleteProductArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteProductVariantArgs = {
  id: Scalars['ID'];
};


export type MutationDeletePromotionArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteRoleArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteShippingMethodArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteTagArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteTaxCategoryArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteTaxRateArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteZoneArgs = {
  id: Scalars['ID'];
};


export type MutationImportProductsArgs = {
  csvFile: Scalars['Upload'];
};


export type MutationLoginArgs = {
  username: Scalars['String'];
  password: Scalars['String'];
  rememberMe?: Maybe<Scalars['Boolean']>;
};


export type MutationModifyOrderArgs = {
  input: ModifyOrderInput;
};


export type MutationMoveCollectionArgs = {
  input: MoveCollectionInput;
};


export type MutationRefundOrderArgs = {
  input: RefundOrderInput;
};


export type MutationRemoveCustomersFromGroupArgs = {
  customerGroupId: Scalars['ID'];
  customerIds: Array<Scalars['ID']>;
};


export type MutationRemoveMembersFromZoneArgs = {
  zoneId: Scalars['ID'];
  memberIds: Array<Scalars['ID']>;
};


export type MutationRemoveOptionGroupFromProductArgs = {
  productId: Scalars['ID'];
  optionGroupId: Scalars['ID'];
};


export type MutationRemoveProductVariantsFromChannelArgs = {
  input: RemoveProductVariantsFromChannelInput;
};


export type MutationRemoveProductsFromChannelArgs = {
  input: RemoveProductsFromChannelInput;
};


export type MutationRemovePromotionsFromChannelArgs = {
  input: RemovePromotionsFromChannelInput;
};


export type MutationRemoveSettledJobsArgs = {
  queueNames?: Maybe<Array<Scalars['String']>>;
  olderThan?: Maybe<Scalars['DateTime']>;
};


export type MutationSetActiveChannelArgs = {
  channelId: Scalars['ID'];
};


export type MutationSetAsLoggedInArgs = {
  input: UserStatusInput;
};


export type MutationSetContentLanguageArgs = {
  languageCode: LanguageCode;
};


export type MutationSetOrderCustomFieldsArgs = {
  input: UpdateOrderInput;
};


export type MutationSetUiLanguageArgs = {
  languageCode: LanguageCode;
};


export type MutationSetUiThemeArgs = {
  theme: Scalars['String'];
};


export type MutationSettlePaymentArgs = {
  id: Scalars['ID'];
};


export type MutationSettleRefundArgs = {
  input: SettleRefundInput;
};


export type MutationTransitionFulfillmentToStateArgs = {
  id: Scalars['ID'];
  state: Scalars['String'];
};


export type MutationTransitionOrderToStateArgs = {
  id: Scalars['ID'];
  state: Scalars['String'];
};


export type MutationTransitionPaymentToStateArgs = {
  id: Scalars['ID'];
  state: Scalars['String'];
};


export type MutationUpdateActiveAdministratorArgs = {
  input: UpdateActiveAdministratorInput;
};


export type MutationUpdateAdministratorArgs = {
  input: UpdateAdministratorInput;
};


export type MutationUpdateAssetArgs = {
  input: UpdateAssetInput;
};


export type MutationUpdateChannelArgs = {
  input: UpdateChannelInput;
};


export type MutationUpdateCollectionArgs = {
  input: UpdateCollectionInput;
};


export type MutationUpdateCountryArgs = {
  input: UpdateCountryInput;
};


export type MutationUpdateCustomerArgs = {
  input: UpdateCustomerInput;
};


export type MutationUpdateCustomerAddressArgs = {
  input: UpdateAddressInput;
};


export type MutationUpdateCustomerGroupArgs = {
  input: UpdateCustomerGroupInput;
};


export type MutationUpdateCustomerNoteArgs = {
  input: UpdateCustomerNoteInput;
};


export type MutationUpdateFacetArgs = {
  input: UpdateFacetInput;
};


export type MutationUpdateFacetValuesArgs = {
  input: Array<UpdateFacetValueInput>;
};


export type MutationUpdateGlobalSettingsArgs = {
  input: UpdateGlobalSettingsInput;
};


export type MutationUpdateOrderNoteArgs = {
  input: UpdateOrderNoteInput;
};


export type MutationUpdatePaymentMethodArgs = {
  input: UpdatePaymentMethodInput;
};


export type MutationUpdateProductArgs = {
  input: UpdateProductInput;
};


export type MutationUpdateProductOptionArgs = {
  input: UpdateProductOptionInput;
};


export type MutationUpdateProductOptionGroupArgs = {
  input: UpdateProductOptionGroupInput;
};


export type MutationUpdateProductVariantsArgs = {
  input: Array<UpdateProductVariantInput>;
};


export type MutationUpdatePromotionArgs = {
  input: UpdatePromotionInput;
};


export type MutationUpdateRoleArgs = {
  input: UpdateRoleInput;
};


export type MutationUpdateShippingMethodArgs = {
  input: UpdateShippingMethodInput;
};


export type MutationUpdateTagArgs = {
  input: UpdateTagInput;
};


export type MutationUpdateTaxCategoryArgs = {
  input: UpdateTaxCategoryInput;
};


export type MutationUpdateTaxRateArgs = {
  input: UpdateTaxRateInput;
};


export type MutationUpdateUserChannelsArgs = {
  channels: Array<CurrentUserChannelInput>;
};


export type MutationUpdateZoneArgs = {
  input: UpdateZoneInput;
};

export type AdministratorListOptions = {
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
  sort?: Maybe<AdministratorSortParameter>;
  filter?: Maybe<AdministratorFilterParameter>;
};

export type CreateAdministratorInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  emailAddress: Scalars['String'];
  password: Scalars['String'];
  roleIds: Array<Scalars['ID']>;
  customFields?: Maybe<Scalars['JSON']>;
};

export type UpdateAdministratorInput = {
  id: Scalars['ID'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  emailAddress?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  roleIds?: Maybe<Array<Scalars['ID']>>;
  customFields?: Maybe<Scalars['JSON']>;
};

export type UpdateActiveAdministratorInput = {
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  emailAddress?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  customFields?: Maybe<Scalars['JSON']>;
};

export type Administrator = Node & {
  __typename?: 'Administrator';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  emailAddress: Scalars['String'];
  user: User;
  customFields?: Maybe<Scalars['JSON']>;
};

export type AdministratorList = PaginatedList & {
  __typename?: 'AdministratorList';
  items: Array<Administrator>;
  totalItems: Scalars['Int'];
};

export type Asset = Node & {
  __typename?: 'Asset';
  tags: Array<Tag>;
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
  customFields?: Maybe<Scalars['JSON']>;
};

export type MimeTypeError = ErrorResult & {
  __typename?: 'MimeTypeError';
  errorCode: ErrorCode;
  message: Scalars['String'];
  fileName: Scalars['String'];
  mimeType: Scalars['String'];
};

export type CreateAssetResult = Asset | MimeTypeError;

export type AssetListOptions = {
  tags?: Maybe<Array<Scalars['String']>>;
  tagsOperator?: Maybe<LogicalOperator>;
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
  sort?: Maybe<AssetSortParameter>;
  filter?: Maybe<AssetFilterParameter>;
};

export type CreateAssetInput = {
  file: Scalars['Upload'];
  tags?: Maybe<Array<Scalars['String']>>;
  customFields?: Maybe<Scalars['JSON']>;
};

export type CoordinateInput = {
  x: Scalars['Float'];
  y: Scalars['Float'];
};

export type DeleteAssetInput = {
  assetId: Scalars['ID'];
  force?: Maybe<Scalars['Boolean']>;
  deleteFromAllChannels?: Maybe<Scalars['Boolean']>;
};

export type DeleteAssetsInput = {
  assetIds: Array<Scalars['ID']>;
  force?: Maybe<Scalars['Boolean']>;
  deleteFromAllChannels?: Maybe<Scalars['Boolean']>;
};

export type UpdateAssetInput = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  focalPoint?: Maybe<CoordinateInput>;
  tags?: Maybe<Array<Scalars['String']>>;
  customFields?: Maybe<Scalars['JSON']>;
};

export type AssignAssetsToChannelInput = {
  assetIds: Array<Scalars['ID']>;
  channelId: Scalars['ID'];
};

export type AuthenticationInput = {
  native?: Maybe<NativeAuthInput>;
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
  customFields?: Maybe<Scalars['JSON']>;
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
  customFields?: Maybe<Scalars['JSON']>;
};

/** Returned if attempting to set a Channel's defaultLanguageCode to a language which is not enabled in GlobalSettings */
export type LanguageNotAvailableError = ErrorResult & {
  __typename?: 'LanguageNotAvailableError';
  errorCode: ErrorCode;
  message: Scalars['String'];
  languageCode: Scalars['String'];
};

export type CreateChannelResult = Channel | LanguageNotAvailableError;

export type UpdateChannelResult = Channel | LanguageNotAvailableError;

export type Collection = Node & {
  __typename?: 'Collection';
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

export type CollectionListOptions = {
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
  sort?: Maybe<CollectionSortParameter>;
  filter?: Maybe<CollectionFilterParameter>;
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

export type CountryListOptions = {
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
  sort?: Maybe<CountrySortParameter>;
  filter?: Maybe<CountryFilterParameter>;
};

export type Customer = Node & {
  __typename?: 'Customer';
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

export type CustomerGroupList = PaginatedList & {
  __typename?: 'CustomerGroupList';
  items: Array<CustomerGroup>;
  totalItems: Scalars['Int'];
};

export type CustomerGroupListOptions = {
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
  sort?: Maybe<CustomerGroupSortParameter>;
  filter?: Maybe<CustomerGroupFilterParameter>;
};

export type CreateCustomerGroupInput = {
  name: Scalars['String'];
  customerIds?: Maybe<Array<Scalars['ID']>>;
};

export type UpdateCustomerGroupInput = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
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

export type CustomerListOptions = {
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
  sort?: Maybe<CustomerSortParameter>;
  filter?: Maybe<CustomerFilterParameter>;
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
  __typename?: 'Facet';
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

export type FacetListOptions = {
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
  sort?: Maybe<FacetSortParameter>;
  filter?: Maybe<FacetFilterParameter>;
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
  __typename?: 'ChannelDefaultLanguageError';
  errorCode: ErrorCode;
  message: Scalars['String'];
  language: Scalars['String'];
  channelCode: Scalars['String'];
};

export type UpdateGlobalSettingsResult = GlobalSettings | ChannelDefaultLanguageError;

export type GlobalSettings = {
  __typename?: 'GlobalSettings';
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
  __typename?: 'OrderProcessState';
  name: Scalars['String'];
  to: Array<Scalars['String']>;
};

export type PermissionDefinition = {
  __typename?: 'PermissionDefinition';
  name: Scalars['String'];
  description: Scalars['String'];
  assignable: Scalars['Boolean'];
};

export type ServerConfig = {
  __typename?: 'ServerConfig';
  orderProcess: Array<OrderProcessState>;
  permittedAssetTypes: Array<Scalars['String']>;
  permissions: Array<PermissionDefinition>;
  customFieldConfig: CustomFields;
};

export type HistoryEntry = Node & {
  __typename?: 'HistoryEntry';
  isPublic: Scalars['Boolean'];
  administrator?: Maybe<Administrator>;
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  type: HistoryEntryType;
  data: Scalars['JSON'];
};

export type ImportInfo = {
  __typename?: 'ImportInfo';
  errors?: Maybe<Array<Scalars['String']>>;
  processed: Scalars['Int'];
  imported: Scalars['Int'];
};

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
  CANCELLED = 'CANCELLED'
}

export type JobListOptions = {
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
  sort?: Maybe<JobSortParameter>;
  filter?: Maybe<JobFilterParameter>;
};

export type JobList = PaginatedList & {
  __typename?: 'JobList';
  items: Array<Job>;
  totalItems: Scalars['Int'];
};

export type Job = Node & {
  __typename?: 'Job';
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
  __typename?: 'JobQueue';
  name: Scalars['String'];
  running: Scalars['Boolean'];
};

export type Order = Node & {
  __typename?: 'Order';
  nextStates: Array<Scalars['String']>;
  modifications: Array<OrderModification>;
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  /**
   * The date & time that the Order was placed, i.e. the Customer
   * completed the checkout and the Order is no longer "active"
   */
  orderPlacedAt?: Maybe<Scalars['DateTime']>;
  /** A unique code for the Order */
  code: Scalars['String'];
  state: Scalars['String'];
  /** An order is active as long as the payment process has not been completed */
  active: Scalars['Boolean'];
  customer?: Maybe<Customer>;
  shippingAddress?: Maybe<OrderAddress>;
  billingAddress?: Maybe<OrderAddress>;
  lines: Array<OrderLine>;
  /**
   * Surcharges are arbitrary modifications to the Order total which are neither
   * ProductVariants nor discounts resulting from applied Promotions. For example,
   * one-off discounts based on customer interaction, or surcharges based on payment
   * methods.
   */
  surcharges: Array<Surcharge>;
  discounts: Array<Discount>;
  /** An array of all coupon codes applied to the Order */
  couponCodes: Array<Scalars['String']>;
  /** Promotions applied to the order. Only gets populated after the payment process has completed. */
  promotions: Array<Promotion>;
  payments?: Maybe<Array<Payment>>;
  fulfillments?: Maybe<Array<Fulfillment>>;
  totalQuantity: Scalars['Int'];
  /**
   * The subTotal is the total of all OrderLines in the Order. This figure also includes any Order-level
   * discounts which have been prorated (proportionally distributed) amongst the OrderItems.
   * To get a total of all OrderLines which does not account for prorated discounts, use the
   * sum of `OrderLine.discountedLinePrice` values.
   */
  subTotal: Scalars['Int'];
  /** Same as subTotal, but inclusive of tax */
  subTotalWithTax: Scalars['Int'];
  currencyCode: CurrencyCode;
  shippingLines: Array<ShippingLine>;
  shipping: Scalars['Int'];
  shippingWithTax: Scalars['Int'];
  /** Equal to subTotal plus shipping */
  total: Scalars['Int'];
  /** The final payable amount. Equal to subTotalWithTax plus shippingWithTax */
  totalWithTax: Scalars['Int'];
  /** A summary of the taxes being applied to this Order */
  taxSummary: Array<OrderTaxSummary>;
  history: HistoryEntryList;
  customFields?: Maybe<Scalars['JSON']>;
};


export type OrderHistoryArgs = {
  options?: Maybe<HistoryEntryListOptions>;
};

export type Fulfillment = Node & {
  __typename?: 'Fulfillment';
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

export type Payment = Node & {
  __typename?: 'Payment';
  nextStates: Array<Scalars['String']>;
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

export type OrderModification = Node & {
  __typename?: 'OrderModification';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  priceChange: Scalars['Int'];
  note: Scalars['String'];
  orderItems?: Maybe<Array<OrderItem>>;
  surcharges?: Maybe<Array<Surcharge>>;
  payment?: Maybe<Payment>;
  refund?: Maybe<Refund>;
  isSettled: Scalars['Boolean'];
};

export type OrderFilterParameter = {
  customerLastName?: Maybe<StringOperators>;
  createdAt?: Maybe<DateOperators>;
  updatedAt?: Maybe<DateOperators>;
  orderPlacedAt?: Maybe<DateOperators>;
  code?: Maybe<StringOperators>;
  state?: Maybe<StringOperators>;
  active?: Maybe<BooleanOperators>;
  totalQuantity?: Maybe<NumberOperators>;
  subTotal?: Maybe<NumberOperators>;
  subTotalWithTax?: Maybe<NumberOperators>;
  currencyCode?: Maybe<StringOperators>;
  shipping?: Maybe<NumberOperators>;
  shippingWithTax?: Maybe<NumberOperators>;
  total?: Maybe<NumberOperators>;
  totalWithTax?: Maybe<NumberOperators>;
};

export type OrderSortParameter = {
  customerLastName?: Maybe<SortOrder>;
  id?: Maybe<SortOrder>;
  createdAt?: Maybe<SortOrder>;
  updatedAt?: Maybe<SortOrder>;
  orderPlacedAt?: Maybe<SortOrder>;
  code?: Maybe<SortOrder>;
  state?: Maybe<SortOrder>;
  totalQuantity?: Maybe<SortOrder>;
  subTotal?: Maybe<SortOrder>;
  subTotalWithTax?: Maybe<SortOrder>;
  shipping?: Maybe<SortOrder>;
  shippingWithTax?: Maybe<SortOrder>;
  total?: Maybe<SortOrder>;
  totalWithTax?: Maybe<SortOrder>;
};

export type OrderListOptions = {
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
  sort?: Maybe<OrderSortParameter>;
  filter?: Maybe<OrderFilterParameter>;
};

export type UpdateOrderInput = {
  id: Scalars['ID'];
  customFields?: Maybe<Scalars['JSON']>;
};

export type FulfillOrderInput = {
  lines: Array<OrderLineInput>;
  handler: ConfigurableOperationInput;
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

export type AdministratorPaymentInput = {
  paymentMethod?: Maybe<Scalars['String']>;
  metadata?: Maybe<Scalars['JSON']>;
};

export type AdministratorRefundInput = {
  paymentId: Scalars['ID'];
  reason?: Maybe<Scalars['String']>;
};

export type ModifyOrderOptions = {
  freezePromotions?: Maybe<Scalars['Boolean']>;
  recalculateShipping?: Maybe<Scalars['Boolean']>;
};

export type UpdateOrderAddressInput = {
  fullName?: Maybe<Scalars['String']>;
  company?: Maybe<Scalars['String']>;
  streetLine1?: Maybe<Scalars['String']>;
  streetLine2?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  province?: Maybe<Scalars['String']>;
  postalCode?: Maybe<Scalars['String']>;
  countryCode?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
};

export type ModifyOrderInput = {
  dryRun: Scalars['Boolean'];
  orderId: Scalars['ID'];
  addItems?: Maybe<Array<AddItemInput>>;
  adjustOrderLines?: Maybe<Array<AdjustOrderLineInput>>;
  surcharges?: Maybe<Array<SurchargeInput>>;
  updateShippingAddress?: Maybe<UpdateOrderAddressInput>;
  updateBillingAddress?: Maybe<UpdateOrderAddressInput>;
  note?: Maybe<Scalars['String']>;
  refund?: Maybe<AdministratorRefundInput>;
  options?: Maybe<ModifyOrderOptions>;
};

export type AddItemInput = {
  productVariantId: Scalars['ID'];
  quantity: Scalars['Int'];
};

export type AdjustOrderLineInput = {
  orderLineId: Scalars['ID'];
  quantity: Scalars['Int'];
};

export type SurchargeInput = {
  description: Scalars['String'];
  sku?: Maybe<Scalars['String']>;
  price: Scalars['Int'];
  priceIncludesTax: Scalars['Boolean'];
  taxRate?: Maybe<Scalars['Float']>;
  taxDescription?: Maybe<Scalars['String']>;
};

export type ManualPaymentInput = {
  orderId: Scalars['ID'];
  method: Scalars['String'];
  transactionId?: Maybe<Scalars['String']>;
  metadata?: Maybe<Scalars['JSON']>;
};

/** Returned if the Payment settlement fails */
export type SettlePaymentError = ErrorResult & {
  __typename?: 'SettlePaymentError';
  errorCode: ErrorCode;
  message: Scalars['String'];
  paymentErrorMessage: Scalars['String'];
};

/** Returned if no OrderLines have been specified for the operation */
export type EmptyOrderLineSelectionError = ErrorResult & {
  __typename?: 'EmptyOrderLineSelectionError';
  errorCode: ErrorCode;
  message: Scalars['String'];
};

/** Returned if the specified items are already part of a Fulfillment */
export type ItemsAlreadyFulfilledError = ErrorResult & {
  __typename?: 'ItemsAlreadyFulfilledError';
  errorCode: ErrorCode;
  message: Scalars['String'];
};

/** Returned if the specified FulfillmentHandler code is not valid */
export type InvalidFulfillmentHandlerError = ErrorResult & {
  __typename?: 'InvalidFulfillmentHandlerError';
  errorCode: ErrorCode;
  message: Scalars['String'];
};

/** Returned if an error is thrown in a FulfillmentHandler's createFulfillment method */
export type CreateFulfillmentError = ErrorResult & {
  __typename?: 'CreateFulfillmentError';
  errorCode: ErrorCode;
  message: Scalars['String'];
  fulfillmentHandlerError: Scalars['String'];
};

/**
 * Returned if attempting to create a Fulfillment when there is insufficient
 * stockOnHand of a ProductVariant to satisfy the requested quantity.
 */
export type InsufficientStockOnHandError = ErrorResult & {
  __typename?: 'InsufficientStockOnHandError';
  errorCode: ErrorCode;
  message: Scalars['String'];
  productVariantId: Scalars['ID'];
  productVariantName: Scalars['String'];
  stockOnHand: Scalars['Int'];
};

/** Returned if an operation has specified OrderLines from multiple Orders */
export type MultipleOrderError = ErrorResult & {
  __typename?: 'MultipleOrderError';
  errorCode: ErrorCode;
  message: Scalars['String'];
};

/** Returned if an attempting to cancel lines from an Order which is still active */
export type CancelActiveOrderError = ErrorResult & {
  __typename?: 'CancelActiveOrderError';
  errorCode: ErrorCode;
  message: Scalars['String'];
  orderState: Scalars['String'];
};

/** Returned if an attempting to refund a Payment against OrderLines from a different Order */
export type PaymentOrderMismatchError = ErrorResult & {
  __typename?: 'PaymentOrderMismatchError';
  errorCode: ErrorCode;
  message: Scalars['String'];
};

/** Returned if an attempting to refund an Order which is not in the expected state */
export type RefundOrderStateError = ErrorResult & {
  __typename?: 'RefundOrderStateError';
  errorCode: ErrorCode;
  message: Scalars['String'];
  orderState: Scalars['String'];
};

/** Returned if an attempting to refund an Order but neither items nor shipping refund was specified */
export type NothingToRefundError = ErrorResult & {
  __typename?: 'NothingToRefundError';
  errorCode: ErrorCode;
  message: Scalars['String'];
};

/** Returned if an attempting to refund an OrderItem which has already been refunded */
export type AlreadyRefundedError = ErrorResult & {
  __typename?: 'AlreadyRefundedError';
  errorCode: ErrorCode;
  message: Scalars['String'];
  refundId: Scalars['ID'];
};

/** Returned if the specified quantity of an OrderLine is greater than the number of items in that line */
export type QuantityTooGreatError = ErrorResult & {
  __typename?: 'QuantityTooGreatError';
  errorCode: ErrorCode;
  message: Scalars['String'];
};

/** Returned when there is an error in transitioning the Refund state */
export type RefundStateTransitionError = ErrorResult & {
  __typename?: 'RefundStateTransitionError';
  errorCode: ErrorCode;
  message: Scalars['String'];
  transitionError: Scalars['String'];
  fromState: Scalars['String'];
  toState: Scalars['String'];
};

/** Returned when there is an error in transitioning the Payment state */
export type PaymentStateTransitionError = ErrorResult & {
  __typename?: 'PaymentStateTransitionError';
  errorCode: ErrorCode;
  message: Scalars['String'];
  transitionError: Scalars['String'];
  fromState: Scalars['String'];
  toState: Scalars['String'];
};

/** Returned when there is an error in transitioning the Fulfillment state */
export type FulfillmentStateTransitionError = ErrorResult & {
  __typename?: 'FulfillmentStateTransitionError';
  errorCode: ErrorCode;
  message: Scalars['String'];
  transitionError: Scalars['String'];
  fromState: Scalars['String'];
  toState: Scalars['String'];
};

/** Returned when attempting to modify the contents of an Order that is not in the `Modifying` state. */
export type OrderModificationStateError = ErrorResult & {
  __typename?: 'OrderModificationStateError';
  errorCode: ErrorCode;
  message: Scalars['String'];
};

/** Returned when a call to modifyOrder fails to specify any changes */
export type NoChangesSpecifiedError = ErrorResult & {
  __typename?: 'NoChangesSpecifiedError';
  errorCode: ErrorCode;
  message: Scalars['String'];
};

/**
 * Returned when a call to modifyOrder fails to include a paymentMethod even
 * though the price has increased as a result of the changes.
 */
export type PaymentMethodMissingError = ErrorResult & {
  __typename?: 'PaymentMethodMissingError';
  errorCode: ErrorCode;
  message: Scalars['String'];
};

/**
 * Returned when a call to modifyOrder fails to include a refundPaymentId even
 * though the price has decreased as a result of the changes.
 */
export type RefundPaymentIdMissingError = ErrorResult & {
  __typename?: 'RefundPaymentIdMissingError';
  errorCode: ErrorCode;
  message: Scalars['String'];
};

/**
 * Returned when a call to addManualPaymentToOrder is made but the Order
 * is not in the required state.
 */
export type ManualPaymentStateError = ErrorResult & {
  __typename?: 'ManualPaymentStateError';
  errorCode: ErrorCode;
  message: Scalars['String'];
};

export type TransitionOrderToStateResult = Order | OrderStateTransitionError;

export type SettlePaymentResult = Payment | SettlePaymentError | PaymentStateTransitionError | OrderStateTransitionError;

export type AddFulfillmentToOrderResult = Fulfillment | EmptyOrderLineSelectionError | ItemsAlreadyFulfilledError | InsufficientStockOnHandError | InvalidFulfillmentHandlerError | FulfillmentStateTransitionError | CreateFulfillmentError;

export type CancelOrderResult = Order | EmptyOrderLineSelectionError | QuantityTooGreatError | MultipleOrderError | CancelActiveOrderError | OrderStateTransitionError;

export type RefundOrderResult = Refund | QuantityTooGreatError | NothingToRefundError | OrderStateTransitionError | MultipleOrderError | PaymentOrderMismatchError | RefundOrderStateError | AlreadyRefundedError | RefundStateTransitionError;

export type SettleRefundResult = Refund | RefundStateTransitionError;

export type TransitionFulfillmentToStateResult = Fulfillment | FulfillmentStateTransitionError;

export type TransitionPaymentToStateResult = Payment | PaymentStateTransitionError;

export type ModifyOrderResult = Order | NoChangesSpecifiedError | OrderModificationStateError | PaymentMethodMissingError | RefundPaymentIdMissingError | OrderLimitError | NegativeQuantityError | InsufficientStockError;

export type AddManualPaymentToOrderResult = Order | ManualPaymentStateError;

export type PaymentMethodList = PaginatedList & {
  __typename?: 'PaymentMethodList';
  items: Array<PaymentMethod>;
  totalItems: Scalars['Int'];
};

export type PaymentMethodListOptions = {
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
  sort?: Maybe<PaymentMethodSortParameter>;
  filter?: Maybe<PaymentMethodFilterParameter>;
};

export type CreatePaymentMethodInput = {
  name: Scalars['String'];
  code: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  enabled: Scalars['Boolean'];
  checker?: Maybe<ConfigurableOperationInput>;
  handler: ConfigurableOperationInput;
};

export type UpdatePaymentMethodInput = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  enabled?: Maybe<Scalars['Boolean']>;
  checker?: Maybe<ConfigurableOperationInput>;
  handler?: Maybe<ConfigurableOperationInput>;
};

export type PaymentMethod = Node & {
  __typename?: 'PaymentMethod';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  name: Scalars['String'];
  code: Scalars['String'];
  description: Scalars['String'];
  enabled: Scalars['Boolean'];
  checker?: Maybe<ConfigurableOperation>;
  handler: ConfigurableOperation;
};

export type Product = Node & {
  __typename?: 'Product';
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
  __typename?: 'ProductVariant';
  enabled: Scalars['Boolean'];
  trackInventory: GlobalFlag;
  stockOnHand: Scalars['Int'];
  stockAllocated: Scalars['Int'];
  outOfStockThreshold: Scalars['Int'];
  useGlobalOutOfStockThreshold: Scalars['Boolean'];
  stockMovements: StockMovementList;
  channels: Array<Channel>;
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
  priceWithTax: Scalars['Int'];
  stockLevel: Scalars['String'];
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
  __typename?: 'SearchResult';
  enabled: Scalars['Boolean'];
  /** An array of ids of the Channels in which this result appears */
  channelIds: Array<Scalars['ID']>;
  sku: Scalars['String'];
  slug: Scalars['String'];
  productId: Scalars['ID'];
  productName: Scalars['String'];
  productAsset?: Maybe<SearchResultAsset>;
  productVariantId: Scalars['ID'];
  productVariantName: Scalars['String'];
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

export type StockMovementListOptions = {
  type?: Maybe<StockMovementType>;
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
};

export type ProductListOptions = {
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
  sort?: Maybe<ProductSortParameter>;
  filter?: Maybe<ProductFilterParameter>;
};

export type ProductVariantListOptions = {
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
  sort?: Maybe<ProductVariantSortParameter>;
  filter?: Maybe<ProductVariantFilterParameter>;
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
  enabled?: Maybe<Scalars['Boolean']>;
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

export type AssignProductVariantsToChannelInput = {
  productVariantIds: Array<Scalars['ID']>;
  channelId: Scalars['ID'];
  priceFactor?: Maybe<Scalars['Float']>;
};

export type RemoveProductVariantsFromChannelInput = {
  productVariantIds: Array<Scalars['ID']>;
  channelId: Scalars['ID'];
};

export type ProductOptionInUseError = ErrorResult & {
  __typename?: 'ProductOptionInUseError';
  errorCode: ErrorCode;
  message: Scalars['String'];
  optionGroupCode: Scalars['String'];
  productVariantCount: Scalars['Int'];
};

export type RemoveOptionGroupFromProductResult = Product | ProductOptionInUseError;

export type PromotionListOptions = {
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
  sort?: Maybe<PromotionSortParameter>;
  filter?: Maybe<PromotionFilterParameter>;
};

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

export type AssignPromotionsToChannelInput = {
  promotionIds: Array<Scalars['ID']>;
  channelId: Scalars['ID'];
};

export type RemovePromotionsFromChannelInput = {
  promotionIds: Array<Scalars['ID']>;
  channelId: Scalars['ID'];
};

/** Returned if a PromotionCondition has neither a couponCode nor any conditions set */
export type MissingConditionsError = ErrorResult & {
  __typename?: 'MissingConditionsError';
  errorCode: ErrorCode;
  message: Scalars['String'];
};

export type CreatePromotionResult = Promotion | MissingConditionsError;

export type UpdatePromotionResult = Promotion | MissingConditionsError;

export type RoleListOptions = {
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
  sort?: Maybe<RoleSortParameter>;
  filter?: Maybe<RoleFilterParameter>;
};

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

export type ShippingMethodListOptions = {
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
  sort?: Maybe<ShippingMethodSortParameter>;
  filter?: Maybe<ShippingMethodFilterParameter>;
};

export type ShippingMethodTranslationInput = {
  id?: Maybe<Scalars['ID']>;
  languageCode: LanguageCode;
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  customFields?: Maybe<Scalars['JSON']>;
};

export type CreateShippingMethodInput = {
  code: Scalars['String'];
  fulfillmentHandler: Scalars['String'];
  checker: ConfigurableOperationInput;
  calculator: ConfigurableOperationInput;
  translations: Array<ShippingMethodTranslationInput>;
  customFields?: Maybe<Scalars['JSON']>;
};

export type UpdateShippingMethodInput = {
  id: Scalars['ID'];
  code?: Maybe<Scalars['String']>;
  fulfillmentHandler?: Maybe<Scalars['String']>;
  checker?: Maybe<ConfigurableOperationInput>;
  calculator?: Maybe<ConfigurableOperationInput>;
  translations: Array<ShippingMethodTranslationInput>;
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
  __typename?: 'TestShippingMethodResult';
  eligible: Scalars['Boolean'];
  quote?: Maybe<TestShippingMethodQuote>;
};

export type TestShippingMethodQuote = {
  __typename?: 'TestShippingMethodQuote';
  price: Scalars['Int'];
  priceWithTax: Scalars['Int'];
  metadata?: Maybe<Scalars['JSON']>;
};

export enum StockMovementType {
  ADJUSTMENT = 'ADJUSTMENT',
  ALLOCATION = 'ALLOCATION',
  RELEASE = 'RELEASE',
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
  __typename?: 'StockAdjustment';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  productVariant: ProductVariant;
  type: StockMovementType;
  quantity: Scalars['Int'];
};

export type Allocation = Node & StockMovement & {
  __typename?: 'Allocation';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  productVariant: ProductVariant;
  type: StockMovementType;
  quantity: Scalars['Int'];
  orderLine: OrderLine;
};

export type Sale = Node & StockMovement & {
  __typename?: 'Sale';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  productVariant: ProductVariant;
  type: StockMovementType;
  quantity: Scalars['Int'];
  orderItem: OrderItem;
};

export type Cancellation = Node & StockMovement & {
  __typename?: 'Cancellation';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  productVariant: ProductVariant;
  type: StockMovementType;
  quantity: Scalars['Int'];
  orderLine: OrderLine;
};

export type Return = Node & StockMovement & {
  __typename?: 'Return';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  productVariant: ProductVariant;
  type: StockMovementType;
  quantity: Scalars['Int'];
  orderItem: OrderItem;
};

export type Release = Node & StockMovement & {
  __typename?: 'Release';
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
  __typename?: 'StockMovementList';
  items: Array<StockMovementItem>;
  totalItems: Scalars['Int'];
};

export type TagListOptions = {
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
  sort?: Maybe<TagSortParameter>;
  filter?: Maybe<TagFilterParameter>;
};

export type CreateTagInput = {
  value: Scalars['String'];
};

export type UpdateTagInput = {
  id: Scalars['ID'];
  value?: Maybe<Scalars['String']>;
};

export type CreateTaxCategoryInput = {
  name: Scalars['String'];
  isDefault?: Maybe<Scalars['Boolean']>;
};

export type UpdateTaxCategoryInput = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  isDefault?: Maybe<Scalars['Boolean']>;
};

export type TaxRateListOptions = {
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
  sort?: Maybe<TaxRateSortParameter>;
  filter?: Maybe<TaxRateFilterParameter>;
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

export type Address = Node & {
  __typename?: 'Address';
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

export type Coordinate = {
  __typename?: 'Coordinate';
  x: Scalars['Float'];
  y: Scalars['Float'];
};

export type AssetList = PaginatedList & {
  __typename?: 'AssetList';
  items: Array<Asset>;
  totalItems: Scalars['Int'];
};

export enum AssetType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  BINARY = 'BINARY'
}

export type CurrentUser = {
  __typename?: 'CurrentUser';
  channels: Array<CurrentUserChannel>;
  id: Scalars['ID'];
  identifier: Scalars['String'];
};

export type CurrentUserChannel = {
  __typename?: 'CurrentUserChannel';
  code: Scalars['String'];
  id: Scalars['ID'];
  permissions: Array<Permission>;
  token: Scalars['String'];
};

export type Channel = Node & {
  __typename?: 'Channel';
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
  customFields?: Maybe<Scalars['JSON']>;
};

export type CollectionBreadcrumb = {
  __typename?: 'CollectionBreadcrumb';
  id: Scalars['ID'];
  name: Scalars['String'];
  slug: Scalars['String'];
};

export type CollectionTranslation = {
  __typename?: 'CollectionTranslation';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  languageCode: LanguageCode;
  name: Scalars['String'];
  slug: Scalars['String'];
  description: Scalars['String'];
};

export type CollectionList = PaginatedList & {
  __typename?: 'CollectionList';
  items: Array<Collection>;
  totalItems: Scalars['Int'];
};

export type ProductVariantList = PaginatedList & {
  __typename?: 'ProductVariantList';
  items: Array<ProductVariant>;
  totalItems: Scalars['Int'];
};

export enum GlobalFlag {
  TRUE = 'TRUE',
  FALSE = 'FALSE',
  INHERIT = 'INHERIT'
}

export enum AdjustmentType {
  PROMOTION = 'PROMOTION',
  DISTRIBUTED_ORDER_PROMOTION = 'DISTRIBUTED_ORDER_PROMOTION'
}

export enum DeletionResult {
  /** The entity was successfully deleted */
  DELETED = 'DELETED',
  /** Deletion did not take place, reason given in message */
  NOT_DELETED = 'NOT_DELETED'
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
  /** Grants permission to create Administrator */
  CreateAdministrator = 'CreateAdministrator',
  /** Grants permission to create Asset */
  CreateAsset = 'CreateAsset',
  /** Grants permission to create Products, Facets, Assets, Collections */
  CreateCatalog = 'CreateCatalog',
  /** Grants permission to create Channel */
  CreateChannel = 'CreateChannel',
  /** Grants permission to create Collection */
  CreateCollection = 'CreateCollection',
  /** Grants permission to create Country */
  CreateCountry = 'CreateCountry',
  /** Grants permission to create Customer */
  CreateCustomer = 'CreateCustomer',
  /** Grants permission to create CustomerGroup */
  CreateCustomerGroup = 'CreateCustomerGroup',
  /** Grants permission to create Facet */
  CreateFacet = 'CreateFacet',
  /** Grants permission to create Order */
  CreateOrder = 'CreateOrder',
  /** Grants permission to create PaymentMethod */
  CreatePaymentMethod = 'CreatePaymentMethod',
  /** Grants permission to create Product */
  CreateProduct = 'CreateProduct',
  /** Grants permission to create Promotion */
  CreatePromotion = 'CreatePromotion',
  /** Grants permission to create PaymentMethods, ShippingMethods, TaxCategories, TaxRates, Zones, Countries, System & GlobalSettings */
  CreateSettings = 'CreateSettings',
  /** Grants permission to create ShippingMethod */
  CreateShippingMethod = 'CreateShippingMethod',
  /** Grants permission to create System */
  CreateSystem = 'CreateSystem',
  /** Grants permission to create Tag */
  CreateTag = 'CreateTag',
  /** Grants permission to create TaxCategory */
  CreateTaxCategory = 'CreateTaxCategory',
  /** Grants permission to create TaxRate */
  CreateTaxRate = 'CreateTaxRate',
  /** Grants permission to create Zone */
  CreateZone = 'CreateZone',
  /** Grants permission to delete Administrator */
  DeleteAdministrator = 'DeleteAdministrator',
  /** Grants permission to delete Asset */
  DeleteAsset = 'DeleteAsset',
  /** Grants permission to delete Products, Facets, Assets, Collections */
  DeleteCatalog = 'DeleteCatalog',
  /** Grants permission to delete Channel */
  DeleteChannel = 'DeleteChannel',
  /** Grants permission to delete Collection */
  DeleteCollection = 'DeleteCollection',
  /** Grants permission to delete Country */
  DeleteCountry = 'DeleteCountry',
  /** Grants permission to delete Customer */
  DeleteCustomer = 'DeleteCustomer',
  /** Grants permission to delete CustomerGroup */
  DeleteCustomerGroup = 'DeleteCustomerGroup',
  /** Grants permission to delete Facet */
  DeleteFacet = 'DeleteFacet',
  /** Grants permission to delete Order */
  DeleteOrder = 'DeleteOrder',
  /** Grants permission to delete PaymentMethod */
  DeletePaymentMethod = 'DeletePaymentMethod',
  /** Grants permission to delete Product */
  DeleteProduct = 'DeleteProduct',
  /** Grants permission to delete Promotion */
  DeletePromotion = 'DeletePromotion',
  /** Grants permission to delete PaymentMethods, ShippingMethods, TaxCategories, TaxRates, Zones, Countries, System & GlobalSettings */
  DeleteSettings = 'DeleteSettings',
  /** Grants permission to delete ShippingMethod */
  DeleteShippingMethod = 'DeleteShippingMethod',
  /** Grants permission to delete System */
  DeleteSystem = 'DeleteSystem',
  /** Grants permission to delete Tag */
  DeleteTag = 'DeleteTag',
  /** Grants permission to delete TaxCategory */
  DeleteTaxCategory = 'DeleteTaxCategory',
  /** Grants permission to delete TaxRate */
  DeleteTaxRate = 'DeleteTaxRate',
  /** Grants permission to delete Zone */
  DeleteZone = 'DeleteZone',
  /** Owner means the user owns this entity, e.g. a Customer's own Order */
  Owner = 'Owner',
  Placeholder = 'Placeholder',
  /** Public means any unauthenticated user may perform the operation */
  Public = 'Public',
  /** Grants permission to read Administrator */
  ReadAdministrator = 'ReadAdministrator',
  /** Grants permission to read Asset */
  ReadAsset = 'ReadAsset',
  /** Grants permission to read Products, Facets, Assets, Collections */
  ReadCatalog = 'ReadCatalog',
  /** Grants permission to read Channel */
  ReadChannel = 'ReadChannel',
  /** Grants permission to read Collection */
  ReadCollection = 'ReadCollection',
  /** Grants permission to read Country */
  ReadCountry = 'ReadCountry',
  /** Grants permission to read Customer */
  ReadCustomer = 'ReadCustomer',
  /** Grants permission to read CustomerGroup */
  ReadCustomerGroup = 'ReadCustomerGroup',
  /** Grants permission to read Facet */
  ReadFacet = 'ReadFacet',
  /** Grants permission to read Order */
  ReadOrder = 'ReadOrder',
  /** Grants permission to read PaymentMethod */
  ReadPaymentMethod = 'ReadPaymentMethod',
  /** Grants permission to read Product */
  ReadProduct = 'ReadProduct',
  /** Grants permission to read Promotion */
  ReadPromotion = 'ReadPromotion',
  /** Grants permission to read PaymentMethods, ShippingMethods, TaxCategories, TaxRates, Zones, Countries, System & GlobalSettings */
  ReadSettings = 'ReadSettings',
  /** Grants permission to read ShippingMethod */
  ReadShippingMethod = 'ReadShippingMethod',
  /** Grants permission to read System */
  ReadSystem = 'ReadSystem',
  /** Grants permission to read Tag */
  ReadTag = 'ReadTag',
  /** Grants permission to read TaxCategory */
  ReadTaxCategory = 'ReadTaxCategory',
  /** Grants permission to read TaxRate */
  ReadTaxRate = 'ReadTaxRate',
  /** Grants permission to read Zone */
  ReadZone = 'ReadZone',
  /** SuperAdmin has unrestricted access to all operations */
  SuperAdmin = 'SuperAdmin',
  /** Grants permission to update Administrator */
  UpdateAdministrator = 'UpdateAdministrator',
  /** Grants permission to update Asset */
  UpdateAsset = 'UpdateAsset',
  /** Grants permission to update Products, Facets, Assets, Collections */
  UpdateCatalog = 'UpdateCatalog',
  /** Grants permission to update Channel */
  UpdateChannel = 'UpdateChannel',
  /** Grants permission to update Collection */
  UpdateCollection = 'UpdateCollection',
  /** Grants permission to update Country */
  UpdateCountry = 'UpdateCountry',
  /** Grants permission to update Customer */
  UpdateCustomer = 'UpdateCustomer',
  /** Grants permission to update CustomerGroup */
  UpdateCustomerGroup = 'UpdateCustomerGroup',
  /** Grants permission to update Facet */
  UpdateFacet = 'UpdateFacet',
  /** Grants permission to update GlobalSettings */
  UpdateGlobalSettings = 'UpdateGlobalSettings',
  /** Grants permission to update Order */
  UpdateOrder = 'UpdateOrder',
  /** Grants permission to update PaymentMethod */
  UpdatePaymentMethod = 'UpdatePaymentMethod',
  /** Grants permission to update Product */
  UpdateProduct = 'UpdateProduct',
  /** Grants permission to update Promotion */
  UpdatePromotion = 'UpdatePromotion',
  /** Grants permission to update PaymentMethods, ShippingMethods, TaxCategories, TaxRates, Zones, Countries, System & GlobalSettings */
  UpdateSettings = 'UpdateSettings',
  /** Grants permission to update ShippingMethod */
  UpdateShippingMethod = 'UpdateShippingMethod',
  /** Grants permission to update System */
  UpdateSystem = 'UpdateSystem',
  /** Grants permission to update Tag */
  UpdateTag = 'UpdateTag',
  /** Grants permission to update TaxCategory */
  UpdateTaxCategory = 'UpdateTaxCategory',
  /** Grants permission to update TaxRate */
  UpdateTaxRate = 'UpdateTaxRate',
  /** Grants permission to update Zone */
  UpdateZone = 'UpdateZone'
}

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
  INVALID_FULFILLMENT_HANDLER_ERROR = 'INVALID_FULFILLMENT_HANDLER_ERROR',
  CREATE_FULFILLMENT_ERROR = 'CREATE_FULFILLMENT_ERROR',
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
  ORDER_MODIFICATION_STATE_ERROR = 'ORDER_MODIFICATION_STATE_ERROR',
  NO_CHANGES_SPECIFIED_ERROR = 'NO_CHANGES_SPECIFIED_ERROR',
  PAYMENT_METHOD_MISSING_ERROR = 'PAYMENT_METHOD_MISSING_ERROR',
  REFUND_PAYMENT_ID_MISSING_ERROR = 'REFUND_PAYMENT_ID_MISSING_ERROR',
  MANUAL_PAYMENT_STATE_ERROR = 'MANUAL_PAYMENT_STATE_ERROR',
  PRODUCT_OPTION_IN_USE_ERROR = 'PRODUCT_OPTION_IN_USE_ERROR',
  MISSING_CONDITIONS_ERROR = 'MISSING_CONDITIONS_ERROR',
  NATIVE_AUTH_STRATEGY_ERROR = 'NATIVE_AUTH_STRATEGY_ERROR',
  INVALID_CREDENTIALS_ERROR = 'INVALID_CREDENTIALS_ERROR',
  ORDER_STATE_TRANSITION_ERROR = 'ORDER_STATE_TRANSITION_ERROR',
  EMAIL_ADDRESS_CONFLICT_ERROR = 'EMAIL_ADDRESS_CONFLICT_ERROR',
  ORDER_LIMIT_ERROR = 'ORDER_LIMIT_ERROR',
  NEGATIVE_QUANTITY_ERROR = 'NEGATIVE_QUANTITY_ERROR',
  INSUFFICIENT_STOCK_ERROR = 'INSUFFICIENT_STOCK_ERROR'
}

export enum LogicalOperator {
  AND = 'AND',
  OR = 'OR'
}

/** Retured when attempting an operation that relies on the NativeAuthStrategy, if that strategy is not configured. */
export type NativeAuthStrategyError = ErrorResult & {
  __typename?: 'NativeAuthStrategyError';
  errorCode: ErrorCode;
  message: Scalars['String'];
};

/** Returned if the user authentication credentials are not valid */
export type InvalidCredentialsError = ErrorResult & {
  __typename?: 'InvalidCredentialsError';
  errorCode: ErrorCode;
  message: Scalars['String'];
  authenticationError: Scalars['String'];
};

/** Returned if there is an error in transitioning the Order state */
export type OrderStateTransitionError = ErrorResult & {
  __typename?: 'OrderStateTransitionError';
  errorCode: ErrorCode;
  message: Scalars['String'];
  transitionError: Scalars['String'];
  fromState: Scalars['String'];
  toState: Scalars['String'];
};

/** Retured when attemting to create a Customer with an email address already registered to an existing User. */
export type EmailAddressConflictError = ErrorResult & {
  __typename?: 'EmailAddressConflictError';
  errorCode: ErrorCode;
  message: Scalars['String'];
};

/** Retured when the maximum order size limit has been reached. */
export type OrderLimitError = ErrorResult & {
  __typename?: 'OrderLimitError';
  errorCode: ErrorCode;
  message: Scalars['String'];
  maxItems: Scalars['Int'];
};

/** Retured when attemting to set a negative OrderLine quantity. */
export type NegativeQuantityError = ErrorResult & {
  __typename?: 'NegativeQuantityError';
  errorCode: ErrorCode;
  message: Scalars['String'];
};

/** Returned when attempting to add more items to the Order than are available */
export type InsufficientStockError = ErrorResult & {
  __typename?: 'InsufficientStockError';
  errorCode: ErrorCode;
  message: Scalars['String'];
  quantityAvailable: Scalars['Int'];
  order: Order;
};




export type PaginatedList = {
  items: Array<Node>;
  totalItems: Scalars['Int'];
};

export type Node = {
  id: Scalars['ID'];
};

export type ErrorResult = {
  errorCode: ErrorCode;
  message: Scalars['String'];
};

export type Adjustment = {
  __typename?: 'Adjustment';
  adjustmentSource: Scalars['String'];
  type: AdjustmentType;
  description: Scalars['String'];
  amount: Scalars['Int'];
};

export type TaxLine = {
  __typename?: 'TaxLine';
  description: Scalars['String'];
  taxRate: Scalars['Float'];
};

export type ConfigArg = {
  __typename?: 'ConfigArg';
  name: Scalars['String'];
  value: Scalars['String'];
};

export type ConfigArgDefinition = {
  __typename?: 'ConfigArgDefinition';
  name: Scalars['String'];
  type: Scalars['String'];
  list: Scalars['Boolean'];
  required: Scalars['Boolean'];
  defaultValue?: Maybe<Scalars['JSON']>;
  label?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  ui?: Maybe<Scalars['JSON']>;
};

export type ConfigurableOperation = {
  __typename?: 'ConfigurableOperation';
  code: Scalars['String'];
  args: Array<ConfigArg>;
};

export type ConfigurableOperationDefinition = {
  __typename?: 'ConfigurableOperationDefinition';
  code: Scalars['String'];
  args: Array<ConfigArgDefinition>;
  description: Scalars['String'];
};

export type DeletionResponse = {
  __typename?: 'DeletionResponse';
  result: DeletionResult;
  message?: Maybe<Scalars['String']>;
};

export type ConfigArgInput = {
  name: Scalars['String'];
  /** A JSON stringified representation of the actual value */
  value: Scalars['String'];
};

export type ConfigurableOperationInput = {
  code: Scalars['String'];
  arguments: Array<ConfigArgInput>;
};

export type StringOperators = {
  eq?: Maybe<Scalars['String']>;
  notEq?: Maybe<Scalars['String']>;
  contains?: Maybe<Scalars['String']>;
  notContains?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Scalars['String']>>;
  notIn?: Maybe<Array<Scalars['String']>>;
  regex?: Maybe<Scalars['String']>;
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

/**
 * Used to construct boolean expressions for filtering search results
 * by FacetValue ID. Examples:
 *
 * * ID=1 OR ID=2: `{ facetValueFilters: [{ or: [1,2] }] }`
 * * ID=1 AND ID=2: `{ facetValueFilters: [{ and: 1 }, { and: 2 }] }`
 * * ID=1 AND (ID=2 OR ID=3): `{ facetValueFilters: [{ and: 1 }, { or: [2,3] }] }`
 */
export type FacetValueFilterInput = {
  and?: Maybe<Scalars['ID']>;
  or?: Maybe<Array<Scalars['ID']>>;
};

export type SearchInput = {
  term?: Maybe<Scalars['String']>;
  facetValueIds?: Maybe<Array<Scalars['ID']>>;
  facetValueOperator?: Maybe<LogicalOperator>;
  facetValueFilters?: Maybe<Array<FacetValueFilterInput>>;
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
  __typename?: 'Success';
  success: Scalars['Boolean'];
};

export type ShippingMethodQuote = {
  __typename?: 'ShippingMethodQuote';
  id: Scalars['ID'];
  price: Scalars['Int'];
  priceWithTax: Scalars['Int'];
  code: Scalars['String'];
  name: Scalars['String'];
  description: Scalars['String'];
  /** Any optional metadata returned by the ShippingCalculator in the ShippingCalculationResult */
  metadata?: Maybe<Scalars['JSON']>;
};

export type PaymentMethodQuote = {
  __typename?: 'PaymentMethodQuote';
  id: Scalars['ID'];
  code: Scalars['String'];
  name: Scalars['String'];
  description: Scalars['String'];
  isEligible: Scalars['Boolean'];
  eligibilityMessage?: Maybe<Scalars['String']>;
};

export type Country = Node & {
  __typename?: 'Country';
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
  __typename?: 'CountryTranslation';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  languageCode: LanguageCode;
  name: Scalars['String'];
};

export type CountryList = PaginatedList & {
  __typename?: 'CountryList';
  items: Array<Country>;
  totalItems: Scalars['Int'];
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
  __typename?: 'StringCustomFieldConfig';
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
  __typename?: 'StringFieldOption';
  value: Scalars['String'];
  label?: Maybe<Array<LocalizedString>>;
};

export type LocaleStringCustomFieldConfig = CustomField & {
  __typename?: 'LocaleStringCustomFieldConfig';
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
  __typename?: 'IntCustomFieldConfig';
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
  __typename?: 'FloatCustomFieldConfig';
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
  __typename?: 'BooleanCustomFieldConfig';
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
  __typename?: 'DateTimeCustomFieldConfig';
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

export type RelationCustomFieldConfig = CustomField & {
  __typename?: 'RelationCustomFieldConfig';
  name: Scalars['String'];
  type: Scalars['String'];
  list: Scalars['Boolean'];
  label?: Maybe<Array<LocalizedString>>;
  description?: Maybe<Array<LocalizedString>>;
  readonly?: Maybe<Scalars['Boolean']>;
  internal?: Maybe<Scalars['Boolean']>;
  entity: Scalars['String'];
  scalarFields: Array<Scalars['String']>;
};

export type TextCustomFieldConfig = CustomField & {
  __typename?: 'TextCustomFieldConfig';
  name: Scalars['String'];
  type: Scalars['String'];
  list: Scalars['Boolean'];
  label?: Maybe<Array<LocalizedString>>;
  description?: Maybe<Array<LocalizedString>>;
  readonly?: Maybe<Scalars['Boolean']>;
  internal?: Maybe<Scalars['Boolean']>;
};

export type LocalizedString = {
  __typename?: 'LocalizedString';
  languageCode: LanguageCode;
  value: Scalars['String'];
};

export type CustomFieldConfig = StringCustomFieldConfig | LocaleStringCustomFieldConfig | IntCustomFieldConfig | FloatCustomFieldConfig | BooleanCustomFieldConfig | DateTimeCustomFieldConfig | RelationCustomFieldConfig | TextCustomFieldConfig;

export type CustomerGroup = Node & {
  __typename?: 'CustomerGroup';
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
  __typename?: 'CustomerList';
  items: Array<Customer>;
  totalItems: Scalars['Int'];
};

export type FacetValue = Node & {
  __typename?: 'FacetValue';
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
  __typename?: 'FacetValueTranslation';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  languageCode: LanguageCode;
  name: Scalars['String'];
};

export type FacetTranslation = {
  __typename?: 'FacetTranslation';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  languageCode: LanguageCode;
  name: Scalars['String'];
};

export type FacetList = PaginatedList & {
  __typename?: 'FacetList';
  items: Array<Facet>;
  totalItems: Scalars['Int'];
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
  ORDER_MODIFIED = 'ORDER_MODIFIED'
}

export type HistoryEntryList = PaginatedList & {
  __typename?: 'HistoryEntryList';
  items: Array<HistoryEntry>;
  totalItems: Scalars['Int'];
};

export type HistoryEntryListOptions = {
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
  sort?: Maybe<HistoryEntrySortParameter>;
  filter?: Maybe<HistoryEntryFilterParameter>;
};

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
  /** Amharic */
  am = 'am',
  /** Arabic */
  ar = 'ar',
  /** Assamese */
  as = 'as',
  /** Azerbaijani */
  az = 'az',
  /** Belarusian */
  be = 'be',
  /** Bulgarian */
  bg = 'bg',
  /** Bambara */
  bm = 'bm',
  /** Bangla */
  bn = 'bn',
  /** Tibetan */
  bo = 'bo',
  /** Breton */
  br = 'br',
  /** Bosnian */
  bs = 'bs',
  /** Catalan */
  ca = 'ca',
  /** Chechen */
  ce = 'ce',
  /** Corsican */
  co = 'co',
  /** Czech */
  cs = 'cs',
  /** Church Slavic */
  cu = 'cu',
  /** Welsh */
  cy = 'cy',
  /** Danish */
  da = 'da',
  /** German */
  de = 'de',
  /** Austrian German */
  de_AT = 'de_AT',
  /** Swiss High German */
  de_CH = 'de_CH',
  /** Dzongkha */
  dz = 'dz',
  /** Ewe */
  ee = 'ee',
  /** Greek */
  el = 'el',
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
  /** Spanish */
  es = 'es',
  /** European Spanish */
  es_ES = 'es_ES',
  /** Mexican Spanish */
  es_MX = 'es_MX',
  /** Estonian */
  et = 'et',
  /** Basque */
  eu = 'eu',
  /** Persian */
  fa = 'fa',
  /** Dari */
  fa_AF = 'fa_AF',
  /** Fulah */
  ff = 'ff',
  /** Finnish */
  fi = 'fi',
  /** Faroese */
  fo = 'fo',
  /** French */
  fr = 'fr',
  /** Canadian French */
  fr_CA = 'fr_CA',
  /** Swiss French */
  fr_CH = 'fr_CH',
  /** Western Frisian */
  fy = 'fy',
  /** Irish */
  ga = 'ga',
  /** Scottish Gaelic */
  gd = 'gd',
  /** Galician */
  gl = 'gl',
  /** Gujarati */
  gu = 'gu',
  /** Manx */
  gv = 'gv',
  /** Hausa */
  ha = 'ha',
  /** Hebrew */
  he = 'he',
  /** Hindi */
  hi = 'hi',
  /** Croatian */
  hr = 'hr',
  /** Haitian Creole */
  ht = 'ht',
  /** Hungarian */
  hu = 'hu',
  /** Armenian */
  hy = 'hy',
  /** Interlingua */
  ia = 'ia',
  /** Indonesian */
  id = 'id',
  /** Igbo */
  ig = 'ig',
  /** Sichuan Yi */
  ii = 'ii',
  /** Icelandic */
  is = 'is',
  /** Italian */
  it = 'it',
  /** Japanese */
  ja = 'ja',
  /** Javanese */
  jv = 'jv',
  /** Georgian */
  ka = 'ka',
  /** Kikuyu */
  ki = 'ki',
  /** Kazakh */
  kk = 'kk',
  /** Kalaallisut */
  kl = 'kl',
  /** Khmer */
  km = 'km',
  /** Kannada */
  kn = 'kn',
  /** Korean */
  ko = 'ko',
  /** Kashmiri */
  ks = 'ks',
  /** Kurdish */
  ku = 'ku',
  /** Cornish */
  kw = 'kw',
  /** Kyrgyz */
  ky = 'ky',
  /** Latin */
  la = 'la',
  /** Luxembourgish */
  lb = 'lb',
  /** Ganda */
  lg = 'lg',
  /** Lingala */
  ln = 'ln',
  /** Lao */
  lo = 'lo',
  /** Lithuanian */
  lt = 'lt',
  /** Luba-Katanga */
  lu = 'lu',
  /** Latvian */
  lv = 'lv',
  /** Malagasy */
  mg = 'mg',
  /** Maori */
  mi = 'mi',
  /** Macedonian */
  mk = 'mk',
  /** Malayalam */
  ml = 'ml',
  /** Mongolian */
  mn = 'mn',
  /** Marathi */
  mr = 'mr',
  /** Malay */
  ms = 'ms',
  /** Maltese */
  mt = 'mt',
  /** Burmese */
  my = 'my',
  /** Norwegian Bokmål */
  nb = 'nb',
  /** North Ndebele */
  nd = 'nd',
  /** Nepali */
  ne = 'ne',
  /** Dutch */
  nl = 'nl',
  /** Flemish */
  nl_BE = 'nl_BE',
  /** Norwegian Nynorsk */
  nn = 'nn',
  /** Nyanja */
  ny = 'ny',
  /** Oromo */
  om = 'om',
  /** Odia */
  or = 'or',
  /** Ossetic */
  os = 'os',
  /** Punjabi */
  pa = 'pa',
  /** Polish */
  pl = 'pl',
  /** Pashto */
  ps = 'ps',
  /** Portuguese */
  pt = 'pt',
  /** Brazilian Portuguese */
  pt_BR = 'pt_BR',
  /** European Portuguese */
  pt_PT = 'pt_PT',
  /** Quechua */
  qu = 'qu',
  /** Romansh */
  rm = 'rm',
  /** Rundi */
  rn = 'rn',
  /** Romanian */
  ro = 'ro',
  /** Moldavian */
  ro_MD = 'ro_MD',
  /** Russian */
  ru = 'ru',
  /** Kinyarwanda */
  rw = 'rw',
  /** Sanskrit */
  sa = 'sa',
  /** Sindhi */
  sd = 'sd',
  /** Northern Sami */
  se = 'se',
  /** Sango */
  sg = 'sg',
  /** Sinhala */
  si = 'si',
  /** Slovak */
  sk = 'sk',
  /** Slovenian */
  sl = 'sl',
  /** Samoan */
  sm = 'sm',
  /** Shona */
  sn = 'sn',
  /** Somali */
  so = 'so',
  /** Albanian */
  sq = 'sq',
  /** Serbian */
  sr = 'sr',
  /** Southern Sotho */
  st = 'st',
  /** Sundanese */
  su = 'su',
  /** Swedish */
  sv = 'sv',
  /** Swahili */
  sw = 'sw',
  /** Congo Swahili */
  sw_CD = 'sw_CD',
  /** Tamil */
  ta = 'ta',
  /** Telugu */
  te = 'te',
  /** Tajik */
  tg = 'tg',
  /** Thai */
  th = 'th',
  /** Tigrinya */
  ti = 'ti',
  /** Turkmen */
  tk = 'tk',
  /** Tongan */
  to = 'to',
  /** Turkish */
  tr = 'tr',
  /** Tatar */
  tt = 'tt',
  /** Uyghur */
  ug = 'ug',
  /** Ukrainian */
  uk = 'uk',
  /** Urdu */
  ur = 'ur',
  /** Uzbek */
  uz = 'uz',
  /** Vietnamese */
  vi = 'vi',
  /** Volapük */
  vo = 'vo',
  /** Wolof */
  wo = 'wo',
  /** Xhosa */
  xh = 'xh',
  /** Yiddish */
  yi = 'yi',
  /** Yoruba */
  yo = 'yo',
  /** Chinese */
  zh = 'zh',
  /** Simplified Chinese */
  zh_Hans = 'zh_Hans',
  /** Traditional Chinese */
  zh_Hant = 'zh_Hant',
  /** Zulu */
  zu = 'zu'
}

/**
 * A summary of the taxes being applied to this order, grouped
 * by taxRate.
 */
export type OrderTaxSummary = {
  __typename?: 'OrderTaxSummary';
  /** A description of this tax */
  description: Scalars['String'];
  /** The taxRate as a percentage */
  taxRate: Scalars['Float'];
  /** The total net price or OrderItems to which this taxRate applies */
  taxBase: Scalars['Int'];
  /** The total tax being applied to the Order at this taxRate */
  taxTotal: Scalars['Int'];
};

export type OrderAddress = {
  __typename?: 'OrderAddress';
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
  customFields?: Maybe<Scalars['JSON']>;
};

export type OrderList = PaginatedList & {
  __typename?: 'OrderList';
  items: Array<Order>;
  totalItems: Scalars['Int'];
};

export type ShippingLine = {
  __typename?: 'ShippingLine';
  shippingMethod: ShippingMethod;
  price: Scalars['Int'];
  priceWithTax: Scalars['Int'];
  discountedPrice: Scalars['Int'];
  discountedPriceWithTax: Scalars['Int'];
  discounts: Array<Discount>;
};

export type Discount = {
  __typename?: 'Discount';
  adjustmentSource: Scalars['String'];
  type: AdjustmentType;
  description: Scalars['String'];
  amount: Scalars['Int'];
  amountWithTax: Scalars['Int'];
};

export type OrderItem = Node & {
  __typename?: 'OrderItem';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  cancelled: Scalars['Boolean'];
  /** The price of a single unit, excluding tax and discounts */
  unitPrice: Scalars['Int'];
  /** The price of a single unit, including tax but excluding discounts */
  unitPriceWithTax: Scalars['Int'];
  /**
   * The price of a single unit including discounts, excluding tax.
   *
   * If Order-level discounts have been applied, this will not be the
   * actual taxable unit price (see `proratedUnitPrice`), but is generally the
   * correct price to display to customers to avoid confusion
   * about the internal handling of distributed Order-level discounts.
   */
  discountedUnitPrice: Scalars['Int'];
  /** The price of a single unit including discounts and tax */
  discountedUnitPriceWithTax: Scalars['Int'];
  /**
   * The actual unit price, taking into account both item discounts _and_ prorated (proportially-distributed)
   * Order-level discounts. This value is the true economic value of the OrderItem, and is used in tax
   * and refund calculations.
   */
  proratedUnitPrice: Scalars['Int'];
  /** The proratedUnitPrice including tax */
  proratedUnitPriceWithTax: Scalars['Int'];
  unitTax: Scalars['Int'];
  taxRate: Scalars['Float'];
  adjustments: Array<Adjustment>;
  taxLines: Array<TaxLine>;
  fulfillment?: Maybe<Fulfillment>;
  refundId?: Maybe<Scalars['ID']>;
};

export type OrderLine = Node & {
  __typename?: 'OrderLine';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  productVariant: ProductVariant;
  featuredAsset?: Maybe<Asset>;
  /** The price of a single unit, excluding tax and discounts */
  unitPrice: Scalars['Int'];
  /** The price of a single unit, including tax but excluding discounts */
  unitPriceWithTax: Scalars['Int'];
  /** Non-zero if the unitPrice has changed since it was initially added to Order */
  unitPriceChangeSinceAdded: Scalars['Int'];
  /** Non-zero if the unitPriceWithTax has changed since it was initially added to Order */
  unitPriceWithTaxChangeSinceAdded: Scalars['Int'];
  /**
   * The price of a single unit including discounts, excluding tax.
   *
   * If Order-level discounts have been applied, this will not be the
   * actual taxable unit price (see `proratedUnitPrice`), but is generally the
   * correct price to display to customers to avoid confusion
   * about the internal handling of distributed Order-level discounts.
   */
  discountedUnitPrice: Scalars['Int'];
  /** The price of a single unit including discounts and tax */
  discountedUnitPriceWithTax: Scalars['Int'];
  /**
   * The actual unit price, taking into account both item discounts _and_ prorated (proportially-distributed)
   * Order-level discounts. This value is the true economic value of the OrderItem, and is used in tax
   * and refund calculations.
   */
  proratedUnitPrice: Scalars['Int'];
  /** The proratedUnitPrice including tax */
  proratedUnitPriceWithTax: Scalars['Int'];
  quantity: Scalars['Int'];
  items: Array<OrderItem>;
  taxRate: Scalars['Float'];
  /** The total price of the line excluding tax and discounts. */
  linePrice: Scalars['Int'];
  /** The total price of the line including tax bit excluding discounts. */
  linePriceWithTax: Scalars['Int'];
  /** The price of the line including discounts, excluding tax */
  discountedLinePrice: Scalars['Int'];
  /** The price of the line including discounts and tax */
  discountedLinePriceWithTax: Scalars['Int'];
  /**
   * The actual line price, taking into account both item discounts _and_ prorated (proportially-distributed)
   * Order-level discounts. This value is the true economic value of the OrderLine, and is used in tax
   * and refund calculations.
   */
  proratedLinePrice: Scalars['Int'];
  /** The proratedLinePrice including tax */
  proratedLinePriceWithTax: Scalars['Int'];
  /** The total tax on this line */
  lineTax: Scalars['Int'];
  discounts: Array<Discount>;
  taxLines: Array<TaxLine>;
  order: Order;
  customFields?: Maybe<Scalars['JSON']>;
};

export type Refund = Node & {
  __typename?: 'Refund';
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

export type Surcharge = Node & {
  __typename?: 'Surcharge';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  description: Scalars['String'];
  sku?: Maybe<Scalars['String']>;
  taxLines: Array<TaxLine>;
  price: Scalars['Int'];
  priceWithTax: Scalars['Int'];
  taxRate: Scalars['Float'];
};

export type ProductOptionGroup = Node & {
  __typename?: 'ProductOptionGroup';
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
  __typename?: 'ProductOptionGroupTranslation';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  languageCode: LanguageCode;
  name: Scalars['String'];
};

export type ProductOption = Node & {
  __typename?: 'ProductOption';
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
  __typename?: 'ProductOptionTranslation';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  languageCode: LanguageCode;
  name: Scalars['String'];
};

export type SearchReindexResponse = {
  __typename?: 'SearchReindexResponse';
  success: Scalars['Boolean'];
};

export type SearchResponse = {
  __typename?: 'SearchResponse';
  items: Array<SearchResult>;
  totalItems: Scalars['Int'];
  facetValues: Array<FacetValueResult>;
  collections: Array<CollectionResult>;
};

/**
 * Which FacetValues are present in the products returned
 * by the search, and in what quantity.
 */
export type FacetValueResult = {
  __typename?: 'FacetValueResult';
  facetValue: FacetValue;
  count: Scalars['Int'];
};

/**
 * Which Collections are present in the products returned
 * by the search, and in what quantity.
 */
export type CollectionResult = {
  __typename?: 'CollectionResult';
  collection: Collection;
  count: Scalars['Int'];
};

export type SearchResultAsset = {
  __typename?: 'SearchResultAsset';
  id: Scalars['ID'];
  preview: Scalars['String'];
  focalPoint?: Maybe<Coordinate>;
};

/** The price of a search result product, either as a range or as a single price */
export type SearchResultPrice = PriceRange | SinglePrice;

/** The price value where the result has a single price */
export type SinglePrice = {
  __typename?: 'SinglePrice';
  value: Scalars['Int'];
};

/** The price range where the result has more than one price */
export type PriceRange = {
  __typename?: 'PriceRange';
  min: Scalars['Int'];
  max: Scalars['Int'];
};

export type ProductTranslation = {
  __typename?: 'ProductTranslation';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  languageCode: LanguageCode;
  name: Scalars['String'];
  slug: Scalars['String'];
  description: Scalars['String'];
};

export type ProductList = PaginatedList & {
  __typename?: 'ProductList';
  items: Array<Product>;
  totalItems: Scalars['Int'];
};

export type ProductVariantTranslation = {
  __typename?: 'ProductVariantTranslation';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  languageCode: LanguageCode;
  name: Scalars['String'];
};

export type Promotion = Node & {
  __typename?: 'Promotion';
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
  __typename?: 'PromotionList';
  items: Array<Promotion>;
  totalItems: Scalars['Int'];
};

export type Role = Node & {
  __typename?: 'Role';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  code: Scalars['String'];
  description: Scalars['String'];
  permissions: Array<Permission>;
  channels: Array<Channel>;
};

export type RoleList = PaginatedList & {
  __typename?: 'RoleList';
  items: Array<Role>;
  totalItems: Scalars['Int'];
};

export type ShippingMethod = Node & {
  __typename?: 'ShippingMethod';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  code: Scalars['String'];
  name: Scalars['String'];
  description: Scalars['String'];
  fulfillmentHandlerCode: Scalars['String'];
  checker: ConfigurableOperation;
  calculator: ConfigurableOperation;
  translations: Array<ShippingMethodTranslation>;
  customFields?: Maybe<Scalars['JSON']>;
};

export type ShippingMethodTranslation = {
  __typename?: 'ShippingMethodTranslation';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  languageCode: LanguageCode;
  name: Scalars['String'];
  description: Scalars['String'];
};

export type ShippingMethodList = PaginatedList & {
  __typename?: 'ShippingMethodList';
  items: Array<ShippingMethod>;
  totalItems: Scalars['Int'];
};

export type Tag = Node & {
  __typename?: 'Tag';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  value: Scalars['String'];
};

export type TagList = PaginatedList & {
  __typename?: 'TagList';
  items: Array<Tag>;
  totalItems: Scalars['Int'];
};

export type TaxCategory = Node & {
  __typename?: 'TaxCategory';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  name: Scalars['String'];
  isDefault: Scalars['Boolean'];
};

export type TaxRate = Node & {
  __typename?: 'TaxRate';
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
  __typename?: 'TaxRateList';
  items: Array<TaxRate>;
  totalItems: Scalars['Int'];
};

export type User = Node & {
  __typename?: 'User';
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
  __typename?: 'AuthenticationMethod';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  strategy: Scalars['String'];
};

export type Zone = Node & {
  __typename?: 'Zone';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  name: Scalars['String'];
  members: Array<Country>;
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

export type PaymentMethodFilterParameter = {
  createdAt?: Maybe<DateOperators>;
  updatedAt?: Maybe<DateOperators>;
  name?: Maybe<StringOperators>;
  code?: Maybe<StringOperators>;
  description?: Maybe<StringOperators>;
  enabled?: Maybe<BooleanOperators>;
};

export type PaymentMethodSortParameter = {
  id?: Maybe<SortOrder>;
  createdAt?: Maybe<SortOrder>;
  updatedAt?: Maybe<SortOrder>;
  name?: Maybe<SortOrder>;
  code?: Maybe<SortOrder>;
  description?: Maybe<SortOrder>;
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
  priceWithTax?: Maybe<NumberOperators>;
  stockLevel?: Maybe<StringOperators>;
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
  stockLevel?: Maybe<SortOrder>;
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
  name?: Maybe<StringOperators>;
  description?: Maybe<StringOperators>;
  fulfillmentHandlerCode?: Maybe<StringOperators>;
};

export type ShippingMethodSortParameter = {
  id?: Maybe<SortOrder>;
  createdAt?: Maybe<SortOrder>;
  updatedAt?: Maybe<SortOrder>;
  code?: Maybe<SortOrder>;
  name?: Maybe<SortOrder>;
  description?: Maybe<SortOrder>;
  fulfillmentHandlerCode?: Maybe<SortOrder>;
};

export type TagFilterParameter = {
  createdAt?: Maybe<DateOperators>;
  updatedAt?: Maybe<DateOperators>;
  value?: Maybe<StringOperators>;
};

export type TagSortParameter = {
  id?: Maybe<SortOrder>;
  createdAt?: Maybe<SortOrder>;
  updatedAt?: Maybe<SortOrder>;
  value?: Maybe<SortOrder>;
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

export type HistoryEntryFilterParameter = {
  isPublic?: Maybe<BooleanOperators>;
  createdAt?: Maybe<DateOperators>;
  updatedAt?: Maybe<DateOperators>;
  type?: Maybe<StringOperators>;
};

export type HistoryEntrySortParameter = {
  id?: Maybe<SortOrder>;
  createdAt?: Maybe<SortOrder>;
  updatedAt?: Maybe<SortOrder>;
};

export type NativeAuthInput = {
  username: Scalars['String'];
  password: Scalars['String'];
};

export type CustomFields = {
  __typename?: 'CustomFields';
  Address: Array<CustomFieldConfig>;
  Administrator: Array<CustomFieldConfig>;
  Asset: Array<CustomFieldConfig>;
  Channel: Array<CustomFieldConfig>;
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

export type NetworkStatus = {
  __typename?: 'NetworkStatus';
  inFlightRequests: Scalars['Int'];
};

export type UserStatus = {
  __typename?: 'UserStatus';
  username: Scalars['String'];
  isLoggedIn: Scalars['Boolean'];
  loginTime: Scalars['String'];
  permissions: Array<Permission>;
  activeChannelId?: Maybe<Scalars['ID']>;
  channels: Array<CurrentUserChannel>;
};

export type UiState = {
  __typename?: 'UiState';
  language: LanguageCode;
  contentLanguage: LanguageCode;
  theme: Scalars['String'];
};

export type CurrentUserChannelInput = {
  id: Scalars['ID'];
  token: Scalars['String'];
  code: Scalars['String'];
  permissions: Array<Permission>;
};

export type UserStatusInput = {
  username: Scalars['String'];
  loginTime: Scalars['String'];
  activeChannelId: Scalars['ID'];
  channels: Array<CurrentUserChannelInput>;
};

export type RoleFragment = (
  { __typename?: 'Role' }
  & Pick<Role, 'id' | 'createdAt' | 'updatedAt' | 'code' | 'description' | 'permissions'>
  & { channels: Array<(
    { __typename?: 'Channel' }
    & Pick<Channel, 'id' | 'code' | 'token'>
  )> }
);

export type AdministratorFragment = (
  { __typename?: 'Administrator' }
  & Pick<Administrator, 'id' | 'createdAt' | 'updatedAt' | 'firstName' | 'lastName' | 'emailAddress'>
  & { user: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'identifier' | 'lastLogin'>
    & { roles: Array<(
      { __typename?: 'Role' }
      & RoleFragment
    )> }
  ) }
);

export type GetAdministratorsQueryVariables = Exact<{
  options?: Maybe<AdministratorListOptions>;
}>;


export type GetAdministratorsQuery = { administrators: (
    { __typename?: 'AdministratorList' }
    & Pick<AdministratorList, 'totalItems'>
    & { items: Array<(
      { __typename?: 'Administrator' }
      & AdministratorFragment
    )> }
  ) };

export type GetActiveAdministratorQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActiveAdministratorQuery = { activeAdministrator?: Maybe<(
    { __typename?: 'Administrator' }
    & AdministratorFragment
  )> };

export type GetAdministratorQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetAdministratorQuery = { administrator?: Maybe<(
    { __typename?: 'Administrator' }
    & AdministratorFragment
  )> };

export type CreateAdministratorMutationVariables = Exact<{
  input: CreateAdministratorInput;
}>;


export type CreateAdministratorMutation = { createAdministrator: (
    { __typename?: 'Administrator' }
    & AdministratorFragment
  ) };

export type UpdateAdministratorMutationVariables = Exact<{
  input: UpdateAdministratorInput;
}>;


export type UpdateAdministratorMutation = { updateAdministrator: (
    { __typename?: 'Administrator' }
    & AdministratorFragment
  ) };

export type UpdateActiveAdministratorMutationVariables = Exact<{
  input: UpdateActiveAdministratorInput;
}>;


export type UpdateActiveAdministratorMutation = { updateActiveAdministrator: (
    { __typename?: 'Administrator' }
    & AdministratorFragment
  ) };

export type DeleteAdministratorMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteAdministratorMutation = { deleteAdministrator: (
    { __typename?: 'DeletionResponse' }
    & Pick<DeletionResponse, 'result' | 'message'>
  ) };

export type GetRolesQueryVariables = Exact<{
  options?: Maybe<RoleListOptions>;
}>;


export type GetRolesQuery = { roles: (
    { __typename?: 'RoleList' }
    & Pick<RoleList, 'totalItems'>
    & { items: Array<(
      { __typename?: 'Role' }
      & RoleFragment
    )> }
  ) };

export type GetRoleQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetRoleQuery = { role?: Maybe<(
    { __typename?: 'Role' }
    & RoleFragment
  )> };

export type CreateRoleMutationVariables = Exact<{
  input: CreateRoleInput;
}>;


export type CreateRoleMutation = { createRole: (
    { __typename?: 'Role' }
    & RoleFragment
  ) };

export type UpdateRoleMutationVariables = Exact<{
  input: UpdateRoleInput;
}>;


export type UpdateRoleMutation = { updateRole: (
    { __typename?: 'Role' }
    & RoleFragment
  ) };

export type DeleteRoleMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteRoleMutation = { deleteRole: (
    { __typename?: 'DeletionResponse' }
    & Pick<DeletionResponse, 'result' | 'message'>
  ) };

export type AssignRoleToAdministratorMutationVariables = Exact<{
  administratorId: Scalars['ID'];
  roleId: Scalars['ID'];
}>;


export type AssignRoleToAdministratorMutation = { assignRoleToAdministrator: (
    { __typename?: 'Administrator' }
    & AdministratorFragment
  ) };

export type CurrentUserFragment = (
  { __typename?: 'CurrentUser' }
  & Pick<CurrentUser, 'id' | 'identifier'>
  & { channels: Array<(
    { __typename?: 'CurrentUserChannel' }
    & Pick<CurrentUserChannel, 'id' | 'code' | 'token' | 'permissions'>
  )> }
);

export type AttemptLoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
  rememberMe: Scalars['Boolean'];
}>;


export type AttemptLoginMutation = { login: (
    { __typename?: 'CurrentUser' }
    & CurrentUserFragment
  ) | (
    { __typename?: 'InvalidCredentialsError' }
    & ErrorResult_InvalidCredentialsError_Fragment
  ) | (
    { __typename?: 'NativeAuthStrategyError' }
    & ErrorResult_NativeAuthStrategyError_Fragment
  ) };

export type LogOutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogOutMutation = { logout: (
    { __typename?: 'Success' }
    & Pick<Success, 'success'>
  ) };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { me?: Maybe<(
    { __typename?: 'CurrentUser' }
    & CurrentUserFragment
  )> };

export type RequestStartedMutationVariables = Exact<{ [key: string]: never; }>;


export type RequestStartedMutation = Pick<Mutation, 'requestStarted'>;

export type RequestCompletedMutationVariables = Exact<{ [key: string]: never; }>;


export type RequestCompletedMutation = Pick<Mutation, 'requestCompleted'>;

export type UserStatusFragment = (
  { __typename?: 'UserStatus' }
  & Pick<UserStatus, 'username' | 'isLoggedIn' | 'loginTime' | 'activeChannelId' | 'permissions'>
  & { channels: Array<(
    { __typename?: 'CurrentUserChannel' }
    & Pick<CurrentUserChannel, 'id' | 'code' | 'token' | 'permissions'>
  )> }
);

export type SetAsLoggedInMutationVariables = Exact<{
  input: UserStatusInput;
}>;


export type SetAsLoggedInMutation = { setAsLoggedIn: (
    { __typename?: 'UserStatus' }
    & UserStatusFragment
  ) };

export type SetAsLoggedOutMutationVariables = Exact<{ [key: string]: never; }>;


export type SetAsLoggedOutMutation = { setAsLoggedOut: (
    { __typename?: 'UserStatus' }
    & UserStatusFragment
  ) };

export type SetUiLanguageMutationVariables = Exact<{
  languageCode: LanguageCode;
}>;


export type SetUiLanguageMutation = Pick<Mutation, 'setUiLanguage'>;

export type SetContentLanguageMutationVariables = Exact<{
  languageCode: LanguageCode;
}>;


export type SetContentLanguageMutation = Pick<Mutation, 'setContentLanguage'>;

export type SetUiThemeMutationVariables = Exact<{
  theme: Scalars['String'];
}>;


export type SetUiThemeMutation = Pick<Mutation, 'setUiTheme'>;

export type GetNetworkStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNetworkStatusQuery = { networkStatus: (
    { __typename?: 'NetworkStatus' }
    & Pick<NetworkStatus, 'inFlightRequests'>
  ) };

export type GetUserStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserStatusQuery = { userStatus: (
    { __typename?: 'UserStatus' }
    & UserStatusFragment
  ) };

export type GetUiStateQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUiStateQuery = { uiState: (
    { __typename?: 'UiState' }
    & Pick<UiState, 'language' | 'contentLanguage' | 'theme'>
  ) };

export type GetClientStateQueryVariables = Exact<{ [key: string]: never; }>;


export type GetClientStateQuery = { networkStatus: (
    { __typename?: 'NetworkStatus' }
    & Pick<NetworkStatus, 'inFlightRequests'>
  ), userStatus: (
    { __typename?: 'UserStatus' }
    & UserStatusFragment
  ), uiState: (
    { __typename?: 'UiState' }
    & Pick<UiState, 'language' | 'contentLanguage' | 'theme'>
  ) };

export type SetActiveChannelMutationVariables = Exact<{
  channelId: Scalars['ID'];
}>;


export type SetActiveChannelMutation = { setActiveChannel: (
    { __typename?: 'UserStatus' }
    & UserStatusFragment
  ) };

export type UpdateUserChannelsMutationVariables = Exact<{
  channels: Array<CurrentUserChannelInput> | CurrentUserChannelInput;
}>;


export type UpdateUserChannelsMutation = { updateUserChannels: (
    { __typename?: 'UserStatus' }
    & UserStatusFragment
  ) };

export type GetCollectionFiltersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCollectionFiltersQuery = { collectionFilters: Array<(
    { __typename?: 'ConfigurableOperationDefinition' }
    & ConfigurableOperationDefFragment
  )> };

export type CollectionFragment = (
  { __typename?: 'Collection' }
  & Pick<Collection, 'id' | 'createdAt' | 'updatedAt' | 'name' | 'slug' | 'description' | 'isPrivate' | 'languageCode'>
  & { featuredAsset?: Maybe<(
    { __typename?: 'Asset' }
    & AssetFragment
  )>, assets: Array<(
    { __typename?: 'Asset' }
    & AssetFragment
  )>, filters: Array<(
    { __typename?: 'ConfigurableOperation' }
    & ConfigurableOperationFragment
  )>, translations: Array<(
    { __typename?: 'CollectionTranslation' }
    & Pick<CollectionTranslation, 'id' | 'languageCode' | 'name' | 'slug' | 'description'>
  )>, parent?: Maybe<(
    { __typename?: 'Collection' }
    & Pick<Collection, 'id' | 'name'>
  )>, children?: Maybe<Array<(
    { __typename?: 'Collection' }
    & Pick<Collection, 'id' | 'name'>
  )>> }
);

export type GetCollectionListQueryVariables = Exact<{
  options?: Maybe<CollectionListOptions>;
}>;


export type GetCollectionListQuery = { collections: (
    { __typename?: 'CollectionList' }
    & Pick<CollectionList, 'totalItems'>
    & { items: Array<(
      { __typename?: 'Collection' }
      & Pick<Collection, 'id' | 'name' | 'slug' | 'description' | 'isPrivate'>
      & { featuredAsset?: Maybe<(
        { __typename?: 'Asset' }
        & AssetFragment
      )>, parent?: Maybe<(
        { __typename?: 'Collection' }
        & Pick<Collection, 'id'>
      )> }
    )> }
  ) };

export type GetCollectionQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetCollectionQuery = { collection?: Maybe<(
    { __typename?: 'Collection' }
    & CollectionFragment
  )> };

export type CreateCollectionMutationVariables = Exact<{
  input: CreateCollectionInput;
}>;


export type CreateCollectionMutation = { createCollection: (
    { __typename?: 'Collection' }
    & CollectionFragment
  ) };

export type UpdateCollectionMutationVariables = Exact<{
  input: UpdateCollectionInput;
}>;


export type UpdateCollectionMutation = { updateCollection: (
    { __typename?: 'Collection' }
    & CollectionFragment
  ) };

export type MoveCollectionMutationVariables = Exact<{
  input: MoveCollectionInput;
}>;


export type MoveCollectionMutation = { moveCollection: (
    { __typename?: 'Collection' }
    & CollectionFragment
  ) };

export type DeleteCollectionMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteCollectionMutation = { deleteCollection: (
    { __typename?: 'DeletionResponse' }
    & Pick<DeletionResponse, 'result' | 'message'>
  ) };

export type GetCollectionContentsQueryVariables = Exact<{
  id: Scalars['ID'];
  options?: Maybe<ProductVariantListOptions>;
}>;


export type GetCollectionContentsQuery = { collection?: Maybe<(
    { __typename?: 'Collection' }
    & Pick<Collection, 'id' | 'name'>
    & { productVariants: (
      { __typename?: 'ProductVariantList' }
      & Pick<ProductVariantList, 'totalItems'>
      & { items: Array<(
        { __typename?: 'ProductVariant' }
        & Pick<ProductVariant, 'id' | 'productId' | 'name'>
      )> }
    ) }
  )> };

export type AddressFragment = (
  { __typename?: 'Address' }
  & Pick<Address, 'id' | 'createdAt' | 'updatedAt' | 'fullName' | 'company' | 'streetLine1' | 'streetLine2' | 'city' | 'province' | 'postalCode' | 'phoneNumber' | 'defaultShippingAddress' | 'defaultBillingAddress'>
  & { country: (
    { __typename?: 'Country' }
    & Pick<Country, 'id' | 'code' | 'name'>
  ) }
);

export type CustomerFragment = (
  { __typename?: 'Customer' }
  & Pick<Customer, 'id' | 'createdAt' | 'updatedAt' | 'title' | 'firstName' | 'lastName' | 'phoneNumber' | 'emailAddress'>
  & { user?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'identifier' | 'verified' | 'lastLogin'>
  )>, addresses?: Maybe<Array<(
    { __typename?: 'Address' }
    & AddressFragment
  )>> }
);

export type GetCustomerListQueryVariables = Exact<{
  options?: Maybe<CustomerListOptions>;
}>;


export type GetCustomerListQuery = { customers: (
    { __typename?: 'CustomerList' }
    & Pick<CustomerList, 'totalItems'>
    & { items: Array<(
      { __typename?: 'Customer' }
      & Pick<Customer, 'id' | 'createdAt' | 'updatedAt' | 'title' | 'firstName' | 'lastName' | 'emailAddress'>
      & { user?: Maybe<(
        { __typename?: 'User' }
        & Pick<User, 'id' | 'verified'>
      )> }
    )> }
  ) };

export type GetCustomerQueryVariables = Exact<{
  id: Scalars['ID'];
  orderListOptions?: Maybe<OrderListOptions>;
}>;


export type GetCustomerQuery = { customer?: Maybe<(
    { __typename?: 'Customer' }
    & { groups: Array<(
      { __typename?: 'CustomerGroup' }
      & Pick<CustomerGroup, 'id' | 'name'>
    )>, orders: (
      { __typename?: 'OrderList' }
      & Pick<OrderList, 'totalItems'>
      & { items: Array<(
        { __typename?: 'Order' }
        & Pick<Order, 'id' | 'code' | 'state' | 'total' | 'currencyCode' | 'updatedAt'>
      )> }
    ) }
    & CustomerFragment
  )> };

export type CreateCustomerMutationVariables = Exact<{
  input: CreateCustomerInput;
  password?: Maybe<Scalars['String']>;
}>;


export type CreateCustomerMutation = { createCustomer: (
    { __typename?: 'Customer' }
    & CustomerFragment
  ) | (
    { __typename?: 'EmailAddressConflictError' }
    & ErrorResult_EmailAddressConflictError_Fragment
  ) };

export type UpdateCustomerMutationVariables = Exact<{
  input: UpdateCustomerInput;
}>;


export type UpdateCustomerMutation = { updateCustomer: (
    { __typename?: 'Customer' }
    & CustomerFragment
  ) | (
    { __typename?: 'EmailAddressConflictError' }
    & ErrorResult_EmailAddressConflictError_Fragment
  ) };

export type DeleteCustomerMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteCustomerMutation = { deleteCustomer: (
    { __typename?: 'DeletionResponse' }
    & Pick<DeletionResponse, 'result' | 'message'>
  ) };

export type CreateCustomerAddressMutationVariables = Exact<{
  customerId: Scalars['ID'];
  input: CreateAddressInput;
}>;


export type CreateCustomerAddressMutation = { createCustomerAddress: (
    { __typename?: 'Address' }
    & AddressFragment
  ) };

export type UpdateCustomerAddressMutationVariables = Exact<{
  input: UpdateAddressInput;
}>;


export type UpdateCustomerAddressMutation = { updateCustomerAddress: (
    { __typename?: 'Address' }
    & AddressFragment
  ) };

export type CreateCustomerGroupMutationVariables = Exact<{
  input: CreateCustomerGroupInput;
}>;


export type CreateCustomerGroupMutation = { createCustomerGroup: (
    { __typename?: 'CustomerGroup' }
    & Pick<CustomerGroup, 'id' | 'createdAt' | 'updatedAt' | 'name'>
  ) };

export type UpdateCustomerGroupMutationVariables = Exact<{
  input: UpdateCustomerGroupInput;
}>;


export type UpdateCustomerGroupMutation = { updateCustomerGroup: (
    { __typename?: 'CustomerGroup' }
    & Pick<CustomerGroup, 'id' | 'createdAt' | 'updatedAt' | 'name'>
  ) };

export type DeleteCustomerGroupMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteCustomerGroupMutation = { deleteCustomerGroup: (
    { __typename?: 'DeletionResponse' }
    & Pick<DeletionResponse, 'result' | 'message'>
  ) };

export type GetCustomerGroupsQueryVariables = Exact<{
  options?: Maybe<CustomerGroupListOptions>;
}>;


export type GetCustomerGroupsQuery = { customerGroups: (
    { __typename?: 'CustomerGroupList' }
    & Pick<CustomerGroupList, 'totalItems'>
    & { items: Array<(
      { __typename?: 'CustomerGroup' }
      & Pick<CustomerGroup, 'id' | 'createdAt' | 'updatedAt' | 'name'>
    )> }
  ) };

export type GetCustomerGroupWithCustomersQueryVariables = Exact<{
  id: Scalars['ID'];
  options?: Maybe<CustomerListOptions>;
}>;


export type GetCustomerGroupWithCustomersQuery = { customerGroup?: Maybe<(
    { __typename?: 'CustomerGroup' }
    & Pick<CustomerGroup, 'id' | 'createdAt' | 'updatedAt' | 'name'>
    & { customers: (
      { __typename?: 'CustomerList' }
      & Pick<CustomerList, 'totalItems'>
      & { items: Array<(
        { __typename?: 'Customer' }
        & Pick<Customer, 'id' | 'createdAt' | 'updatedAt' | 'emailAddress' | 'firstName' | 'lastName'>
      )> }
    ) }
  )> };

export type AddCustomersToGroupMutationVariables = Exact<{
  groupId: Scalars['ID'];
  customerIds: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type AddCustomersToGroupMutation = { addCustomersToGroup: (
    { __typename?: 'CustomerGroup' }
    & Pick<CustomerGroup, 'id' | 'createdAt' | 'updatedAt' | 'name'>
  ) };

export type RemoveCustomersFromGroupMutationVariables = Exact<{
  groupId: Scalars['ID'];
  customerIds: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type RemoveCustomersFromGroupMutation = { removeCustomersFromGroup: (
    { __typename?: 'CustomerGroup' }
    & Pick<CustomerGroup, 'id' | 'createdAt' | 'updatedAt' | 'name'>
  ) };

export type GetCustomerHistoryQueryVariables = Exact<{
  id: Scalars['ID'];
  options?: Maybe<HistoryEntryListOptions>;
}>;


export type GetCustomerHistoryQuery = { customer?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id'>
    & { history: (
      { __typename?: 'HistoryEntryList' }
      & Pick<HistoryEntryList, 'totalItems'>
      & { items: Array<(
        { __typename?: 'HistoryEntry' }
        & Pick<HistoryEntry, 'id' | 'type' | 'createdAt' | 'isPublic' | 'data'>
        & { administrator?: Maybe<(
          { __typename?: 'Administrator' }
          & Pick<Administrator, 'id' | 'firstName' | 'lastName'>
        )> }
      )> }
    ) }
  )> };

export type AddNoteToCustomerMutationVariables = Exact<{
  input: AddNoteToCustomerInput;
}>;


export type AddNoteToCustomerMutation = { addNoteToCustomer: (
    { __typename?: 'Customer' }
    & Pick<Customer, 'id'>
  ) };

export type UpdateCustomerNoteMutationVariables = Exact<{
  input: UpdateCustomerNoteInput;
}>;


export type UpdateCustomerNoteMutation = { updateCustomerNote: (
    { __typename?: 'HistoryEntry' }
    & Pick<HistoryEntry, 'id' | 'data' | 'isPublic'>
  ) };

export type DeleteCustomerNoteMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteCustomerNoteMutation = { deleteCustomerNote: (
    { __typename?: 'DeletionResponse' }
    & Pick<DeletionResponse, 'result' | 'message'>
  ) };

export type FacetValueFragment = (
  { __typename?: 'FacetValue' }
  & Pick<FacetValue, 'id' | 'createdAt' | 'updatedAt' | 'languageCode' | 'code' | 'name'>
  & { translations: Array<(
    { __typename?: 'FacetValueTranslation' }
    & Pick<FacetValueTranslation, 'id' | 'languageCode' | 'name'>
  )>, facet: (
    { __typename?: 'Facet' }
    & Pick<Facet, 'id' | 'createdAt' | 'updatedAt' | 'name'>
  ) }
);

export type FacetWithValuesFragment = (
  { __typename?: 'Facet' }
  & Pick<Facet, 'id' | 'createdAt' | 'updatedAt' | 'languageCode' | 'isPrivate' | 'code' | 'name'>
  & { translations: Array<(
    { __typename?: 'FacetTranslation' }
    & Pick<FacetTranslation, 'id' | 'languageCode' | 'name'>
  )>, values: Array<(
    { __typename?: 'FacetValue' }
    & FacetValueFragment
  )> }
);

export type CreateFacetMutationVariables = Exact<{
  input: CreateFacetInput;
}>;


export type CreateFacetMutation = { createFacet: (
    { __typename?: 'Facet' }
    & FacetWithValuesFragment
  ) };

export type UpdateFacetMutationVariables = Exact<{
  input: UpdateFacetInput;
}>;


export type UpdateFacetMutation = { updateFacet: (
    { __typename?: 'Facet' }
    & FacetWithValuesFragment
  ) };

export type DeleteFacetMutationVariables = Exact<{
  id: Scalars['ID'];
  force?: Maybe<Scalars['Boolean']>;
}>;


export type DeleteFacetMutation = { deleteFacet: (
    { __typename?: 'DeletionResponse' }
    & Pick<DeletionResponse, 'result' | 'message'>
  ) };

export type CreateFacetValuesMutationVariables = Exact<{
  input: Array<CreateFacetValueInput> | CreateFacetValueInput;
}>;


export type CreateFacetValuesMutation = { createFacetValues: Array<(
    { __typename?: 'FacetValue' }
    & FacetValueFragment
  )> };

export type UpdateFacetValuesMutationVariables = Exact<{
  input: Array<UpdateFacetValueInput> | UpdateFacetValueInput;
}>;


export type UpdateFacetValuesMutation = { updateFacetValues: Array<(
    { __typename?: 'FacetValue' }
    & FacetValueFragment
  )> };

export type DeleteFacetValuesMutationVariables = Exact<{
  ids: Array<Scalars['ID']> | Scalars['ID'];
  force?: Maybe<Scalars['Boolean']>;
}>;


export type DeleteFacetValuesMutation = { deleteFacetValues: Array<(
    { __typename?: 'DeletionResponse' }
    & Pick<DeletionResponse, 'result' | 'message'>
  )> };

export type GetFacetListQueryVariables = Exact<{
  options?: Maybe<FacetListOptions>;
}>;


export type GetFacetListQuery = { facets: (
    { __typename?: 'FacetList' }
    & Pick<FacetList, 'totalItems'>
    & { items: Array<(
      { __typename?: 'Facet' }
      & FacetWithValuesFragment
    )> }
  ) };

export type GetFacetWithValuesQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetFacetWithValuesQuery = { facet?: Maybe<(
    { __typename?: 'Facet' }
    & FacetWithValuesFragment
  )> };

export type DiscountFragment = (
  { __typename?: 'Discount' }
  & Pick<Discount, 'adjustmentSource' | 'amount' | 'amountWithTax' | 'description' | 'type'>
);

export type RefundFragment = (
  { __typename?: 'Refund' }
  & Pick<Refund, 'id' | 'state' | 'items' | 'shipping' | 'adjustment' | 'transactionId' | 'paymentId'>
);

export type OrderAddressFragment = (
  { __typename?: 'OrderAddress' }
  & Pick<OrderAddress, 'fullName' | 'company' | 'streetLine1' | 'streetLine2' | 'city' | 'province' | 'postalCode' | 'country' | 'countryCode' | 'phoneNumber'>
);

export type OrderFragment = (
  { __typename?: 'Order' }
  & Pick<Order, 'id' | 'createdAt' | 'updatedAt' | 'orderPlacedAt' | 'code' | 'state' | 'nextStates' | 'total' | 'currencyCode'>
  & { customer?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id' | 'firstName' | 'lastName'>
  )>, shippingLines: Array<(
    { __typename?: 'ShippingLine' }
    & { shippingMethod: (
      { __typename?: 'ShippingMethod' }
      & Pick<ShippingMethod, 'name'>
    ) }
  )> }
);

export type FulfillmentFragment = (
  { __typename?: 'Fulfillment' }
  & Pick<Fulfillment, 'id' | 'state' | 'nextStates' | 'createdAt' | 'updatedAt' | 'method' | 'trackingCode'>
  & { orderItems: Array<(
    { __typename?: 'OrderItem' }
    & Pick<OrderItem, 'id'>
  )> }
);

export type OrderLineFragment = (
  { __typename?: 'OrderLine' }
  & Pick<OrderLine, 'id' | 'unitPrice' | 'unitPriceWithTax' | 'proratedUnitPrice' | 'proratedUnitPriceWithTax' | 'quantity' | 'linePrice' | 'lineTax' | 'linePriceWithTax' | 'discountedLinePrice' | 'discountedLinePriceWithTax'>
  & { featuredAsset?: Maybe<(
    { __typename?: 'Asset' }
    & Pick<Asset, 'preview'>
  )>, productVariant: (
    { __typename?: 'ProductVariant' }
    & Pick<ProductVariant, 'id' | 'name' | 'sku' | 'trackInventory' | 'stockOnHand'>
  ), discounts: Array<(
    { __typename?: 'Discount' }
    & DiscountFragment
  )>, items: Array<(
    { __typename?: 'OrderItem' }
    & Pick<OrderItem, 'id' | 'unitPrice' | 'unitPriceWithTax' | 'taxRate' | 'refundId' | 'cancelled'>
    & { fulfillment?: Maybe<(
      { __typename?: 'Fulfillment' }
      & FulfillmentFragment
    )> }
  )> }
);

export type OrderDetailFragment = (
  { __typename?: 'Order' }
  & Pick<Order, 'id' | 'createdAt' | 'updatedAt' | 'code' | 'state' | 'nextStates' | 'active' | 'subTotal' | 'subTotalWithTax' | 'total' | 'totalWithTax' | 'currencyCode' | 'shipping' | 'shippingWithTax'>
  & { customer?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id' | 'firstName' | 'lastName'>
  )>, lines: Array<(
    { __typename?: 'OrderLine' }
    & OrderLineFragment
  )>, surcharges: Array<(
    { __typename?: 'Surcharge' }
    & Pick<Surcharge, 'id' | 'sku' | 'description' | 'price' | 'priceWithTax' | 'taxRate'>
  )>, discounts: Array<(
    { __typename?: 'Discount' }
    & DiscountFragment
  )>, promotions: Array<(
    { __typename?: 'Promotion' }
    & Pick<Promotion, 'id' | 'couponCode'>
  )>, shippingLines: Array<(
    { __typename?: 'ShippingLine' }
    & { shippingMethod: (
      { __typename?: 'ShippingMethod' }
      & Pick<ShippingMethod, 'id' | 'code' | 'name' | 'fulfillmentHandlerCode' | 'description'>
    ) }
  )>, taxSummary: Array<(
    { __typename?: 'OrderTaxSummary' }
    & Pick<OrderTaxSummary, 'description' | 'taxBase' | 'taxRate' | 'taxTotal'>
  )>, shippingAddress?: Maybe<(
    { __typename?: 'OrderAddress' }
    & OrderAddressFragment
  )>, billingAddress?: Maybe<(
    { __typename?: 'OrderAddress' }
    & OrderAddressFragment
  )>, payments?: Maybe<Array<(
    { __typename?: 'Payment' }
    & Pick<Payment, 'id' | 'createdAt' | 'transactionId' | 'amount' | 'method' | 'state' | 'nextStates' | 'errorMessage' | 'metadata'>
    & { refunds: Array<(
      { __typename?: 'Refund' }
      & Pick<Refund, 'id' | 'createdAt' | 'state' | 'items' | 'adjustment' | 'total' | 'paymentId' | 'reason' | 'transactionId' | 'method' | 'metadata'>
      & { orderItems: Array<(
        { __typename?: 'OrderItem' }
        & Pick<OrderItem, 'id'>
      )> }
    )> }
  )>>, fulfillments?: Maybe<Array<(
    { __typename?: 'Fulfillment' }
    & FulfillmentFragment
  )>>, modifications: Array<(
    { __typename?: 'OrderModification' }
    & Pick<OrderModification, 'id' | 'createdAt' | 'isSettled' | 'priceChange' | 'note'>
    & { payment?: Maybe<(
      { __typename?: 'Payment' }
      & Pick<Payment, 'id' | 'amount'>
    )>, orderItems?: Maybe<Array<(
      { __typename?: 'OrderItem' }
      & Pick<OrderItem, 'id'>
    )>>, refund?: Maybe<(
      { __typename?: 'Refund' }
      & Pick<Refund, 'id' | 'paymentId' | 'total'>
    )>, surcharges?: Maybe<Array<(
      { __typename?: 'Surcharge' }
      & Pick<Surcharge, 'id'>
    )>> }
  )> }
);

export type GetOrderListQueryVariables = Exact<{
  options?: Maybe<OrderListOptions>;
}>;


export type GetOrderListQuery = { orders: (
    { __typename?: 'OrderList' }
    & Pick<OrderList, 'totalItems'>
    & { items: Array<(
      { __typename?: 'Order' }
      & OrderFragment
    )> }
  ) };

export type GetOrderQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetOrderQuery = { order?: Maybe<(
    { __typename?: 'Order' }
    & OrderDetailFragment
  )> };

export type SettlePaymentMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type SettlePaymentMutation = { settlePayment: (
    { __typename?: 'Payment' }
    & Pick<Payment, 'id' | 'transactionId' | 'amount' | 'method' | 'state' | 'metadata'>
  ) | (
    { __typename?: 'SettlePaymentError' }
    & Pick<SettlePaymentError, 'paymentErrorMessage'>
    & ErrorResult_SettlePaymentError_Fragment
  ) | (
    { __typename?: 'PaymentStateTransitionError' }
    & Pick<PaymentStateTransitionError, 'transitionError'>
    & ErrorResult_PaymentStateTransitionError_Fragment
  ) | (
    { __typename?: 'OrderStateTransitionError' }
    & Pick<OrderStateTransitionError, 'transitionError'>
    & ErrorResult_OrderStateTransitionError_Fragment
  ) };

export type TransitionPaymentToStateMutationVariables = Exact<{
  id: Scalars['ID'];
  state: Scalars['String'];
}>;


export type TransitionPaymentToStateMutation = { transitionPaymentToState: (
    { __typename?: 'Payment' }
    & Pick<Payment, 'id' | 'transactionId' | 'amount' | 'method' | 'state' | 'metadata'>
  ) | (
    { __typename?: 'PaymentStateTransitionError' }
    & Pick<PaymentStateTransitionError, 'transitionError'>
    & ErrorResult_PaymentStateTransitionError_Fragment
  ) };

export type CreateFulfillmentMutationVariables = Exact<{
  input: FulfillOrderInput;
}>;


export type CreateFulfillmentMutation = { addFulfillmentToOrder: (
    { __typename?: 'Fulfillment' }
    & FulfillmentFragment
  ) | (
    { __typename?: 'EmptyOrderLineSelectionError' }
    & ErrorResult_EmptyOrderLineSelectionError_Fragment
  ) | (
    { __typename?: 'ItemsAlreadyFulfilledError' }
    & ErrorResult_ItemsAlreadyFulfilledError_Fragment
  ) | (
    { __typename?: 'InsufficientStockOnHandError' }
    & ErrorResult_InsufficientStockOnHandError_Fragment
  ) | (
    { __typename?: 'InvalidFulfillmentHandlerError' }
    & ErrorResult_InvalidFulfillmentHandlerError_Fragment
  ) | (
    { __typename?: 'FulfillmentStateTransitionError' }
    & Pick<FulfillmentStateTransitionError, 'errorCode' | 'message' | 'transitionError'>
    & ErrorResult_FulfillmentStateTransitionError_Fragment
  ) | (
    { __typename?: 'CreateFulfillmentError' }
    & Pick<CreateFulfillmentError, 'errorCode' | 'message' | 'fulfillmentHandlerError'>
    & ErrorResult_CreateFulfillmentError_Fragment
  ) };

export type CancelOrderMutationVariables = Exact<{
  input: CancelOrderInput;
}>;


export type CancelOrderMutation = { cancelOrder: (
    { __typename?: 'Order' }
    & OrderDetailFragment
  ) | (
    { __typename?: 'EmptyOrderLineSelectionError' }
    & ErrorResult_EmptyOrderLineSelectionError_Fragment
  ) | (
    { __typename?: 'QuantityTooGreatError' }
    & ErrorResult_QuantityTooGreatError_Fragment
  ) | (
    { __typename?: 'MultipleOrderError' }
    & ErrorResult_MultipleOrderError_Fragment
  ) | (
    { __typename?: 'CancelActiveOrderError' }
    & ErrorResult_CancelActiveOrderError_Fragment
  ) | (
    { __typename?: 'OrderStateTransitionError' }
    & ErrorResult_OrderStateTransitionError_Fragment
  ) };

export type RefundOrderMutationVariables = Exact<{
  input: RefundOrderInput;
}>;


export type RefundOrderMutation = { refundOrder: (
    { __typename?: 'Refund' }
    & RefundFragment
  ) | (
    { __typename?: 'QuantityTooGreatError' }
    & ErrorResult_QuantityTooGreatError_Fragment
  ) | (
    { __typename?: 'NothingToRefundError' }
    & ErrorResult_NothingToRefundError_Fragment
  ) | (
    { __typename?: 'OrderStateTransitionError' }
    & ErrorResult_OrderStateTransitionError_Fragment
  ) | (
    { __typename?: 'MultipleOrderError' }
    & ErrorResult_MultipleOrderError_Fragment
  ) | (
    { __typename?: 'PaymentOrderMismatchError' }
    & ErrorResult_PaymentOrderMismatchError_Fragment
  ) | (
    { __typename?: 'RefundOrderStateError' }
    & ErrorResult_RefundOrderStateError_Fragment
  ) | (
    { __typename?: 'AlreadyRefundedError' }
    & ErrorResult_AlreadyRefundedError_Fragment
  ) | (
    { __typename?: 'RefundStateTransitionError' }
    & ErrorResult_RefundStateTransitionError_Fragment
  ) };

export type SettleRefundMutationVariables = Exact<{
  input: SettleRefundInput;
}>;


export type SettleRefundMutation = { settleRefund: (
    { __typename?: 'Refund' }
    & RefundFragment
  ) | (
    { __typename?: 'RefundStateTransitionError' }
    & ErrorResult_RefundStateTransitionError_Fragment
  ) };

export type GetOrderHistoryQueryVariables = Exact<{
  id: Scalars['ID'];
  options?: Maybe<HistoryEntryListOptions>;
}>;


export type GetOrderHistoryQuery = { order?: Maybe<(
    { __typename?: 'Order' }
    & Pick<Order, 'id'>
    & { history: (
      { __typename?: 'HistoryEntryList' }
      & Pick<HistoryEntryList, 'totalItems'>
      & { items: Array<(
        { __typename?: 'HistoryEntry' }
        & Pick<HistoryEntry, 'id' | 'type' | 'createdAt' | 'isPublic' | 'data'>
        & { administrator?: Maybe<(
          { __typename?: 'Administrator' }
          & Pick<Administrator, 'id' | 'firstName' | 'lastName'>
        )> }
      )> }
    ) }
  )> };

export type AddNoteToOrderMutationVariables = Exact<{
  input: AddNoteToOrderInput;
}>;


export type AddNoteToOrderMutation = { addNoteToOrder: (
    { __typename?: 'Order' }
    & Pick<Order, 'id'>
  ) };

export type UpdateOrderNoteMutationVariables = Exact<{
  input: UpdateOrderNoteInput;
}>;


export type UpdateOrderNoteMutation = { updateOrderNote: (
    { __typename?: 'HistoryEntry' }
    & Pick<HistoryEntry, 'id' | 'data' | 'isPublic'>
  ) };

export type DeleteOrderNoteMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteOrderNoteMutation = { deleteOrderNote: (
    { __typename?: 'DeletionResponse' }
    & Pick<DeletionResponse, 'result' | 'message'>
  ) };

export type TransitionOrderToStateMutationVariables = Exact<{
  id: Scalars['ID'];
  state: Scalars['String'];
}>;


export type TransitionOrderToStateMutation = { transitionOrderToState?: Maybe<(
    { __typename?: 'Order' }
    & OrderFragment
  ) | (
    { __typename?: 'OrderStateTransitionError' }
    & Pick<OrderStateTransitionError, 'transitionError'>
    & ErrorResult_OrderStateTransitionError_Fragment
  )> };

export type UpdateOrderCustomFieldsMutationVariables = Exact<{
  input: UpdateOrderInput;
}>;


export type UpdateOrderCustomFieldsMutation = { setOrderCustomFields?: Maybe<(
    { __typename?: 'Order' }
    & OrderFragment
  )> };

export type TransitionFulfillmentToStateMutationVariables = Exact<{
  id: Scalars['ID'];
  state: Scalars['String'];
}>;


export type TransitionFulfillmentToStateMutation = { transitionFulfillmentToState: (
    { __typename?: 'Fulfillment' }
    & FulfillmentFragment
  ) | (
    { __typename?: 'FulfillmentStateTransitionError' }
    & Pick<FulfillmentStateTransitionError, 'transitionError'>
    & ErrorResult_FulfillmentStateTransitionError_Fragment
  ) };

export type GetOrderSummaryQueryVariables = Exact<{
  start: Scalars['DateTime'];
  end: Scalars['DateTime'];
}>;


export type GetOrderSummaryQuery = { orders: (
    { __typename?: 'OrderList' }
    & Pick<OrderList, 'totalItems'>
    & { items: Array<(
      { __typename?: 'Order' }
      & Pick<Order, 'id' | 'total' | 'currencyCode'>
    )> }
  ) };

export type ModifyOrderMutationVariables = Exact<{
  input: ModifyOrderInput;
}>;


export type ModifyOrderMutation = { modifyOrder: (
    { __typename?: 'Order' }
    & OrderDetailFragment
  ) | (
    { __typename?: 'NoChangesSpecifiedError' }
    & ErrorResult_NoChangesSpecifiedError_Fragment
  ) | (
    { __typename?: 'OrderModificationStateError' }
    & ErrorResult_OrderModificationStateError_Fragment
  ) | (
    { __typename?: 'PaymentMethodMissingError' }
    & ErrorResult_PaymentMethodMissingError_Fragment
  ) | (
    { __typename?: 'RefundPaymentIdMissingError' }
    & ErrorResult_RefundPaymentIdMissingError_Fragment
  ) | (
    { __typename?: 'OrderLimitError' }
    & ErrorResult_OrderLimitError_Fragment
  ) | (
    { __typename?: 'NegativeQuantityError' }
    & ErrorResult_NegativeQuantityError_Fragment
  ) | (
    { __typename?: 'InsufficientStockError' }
    & ErrorResult_InsufficientStockError_Fragment
  ) };

export type AddManualPaymentMutationVariables = Exact<{
  input: ManualPaymentInput;
}>;


export type AddManualPaymentMutation = { addManualPaymentToOrder: (
    { __typename?: 'Order' }
    & OrderDetailFragment
  ) | (
    { __typename?: 'ManualPaymentStateError' }
    & ErrorResult_ManualPaymentStateError_Fragment
  ) };

export type AssetFragment = (
  { __typename?: 'Asset' }
  & Pick<Asset, 'id' | 'createdAt' | 'updatedAt' | 'name' | 'fileSize' | 'mimeType' | 'type' | 'preview' | 'source' | 'width' | 'height'>
  & { focalPoint?: Maybe<(
    { __typename?: 'Coordinate' }
    & Pick<Coordinate, 'x' | 'y'>
  )> }
);

export type TagFragment = (
  { __typename?: 'Tag' }
  & Pick<Tag, 'id' | 'value'>
);

export type ProductOptionGroupFragment = (
  { __typename?: 'ProductOptionGroup' }
  & Pick<ProductOptionGroup, 'id' | 'code' | 'languageCode' | 'name'>
  & { translations: Array<(
    { __typename?: 'ProductOptionGroupTranslation' }
    & Pick<ProductOptionGroupTranslation, 'id' | 'languageCode' | 'name'>
  )> }
);

export type ProductOptionFragment = (
  { __typename?: 'ProductOption' }
  & Pick<ProductOption, 'id' | 'code' | 'languageCode' | 'name' | 'groupId'>
  & { translations: Array<(
    { __typename?: 'ProductOptionTranslation' }
    & Pick<ProductOptionTranslation, 'id' | 'languageCode' | 'name'>
  )> }
);

export type ProductVariantFragment = (
  { __typename?: 'ProductVariant' }
  & Pick<ProductVariant, 'id' | 'createdAt' | 'updatedAt' | 'enabled' | 'languageCode' | 'name' | 'price' | 'currencyCode' | 'priceWithTax' | 'stockOnHand' | 'stockAllocated' | 'trackInventory' | 'outOfStockThreshold' | 'useGlobalOutOfStockThreshold' | 'sku'>
  & { taxRateApplied: (
    { __typename?: 'TaxRate' }
    & Pick<TaxRate, 'id' | 'name' | 'value'>
  ), taxCategory: (
    { __typename?: 'TaxCategory' }
    & Pick<TaxCategory, 'id' | 'name'>
  ), options: Array<(
    { __typename?: 'ProductOption' }
    & ProductOptionFragment
  )>, facetValues: Array<(
    { __typename?: 'FacetValue' }
    & Pick<FacetValue, 'id' | 'code' | 'name'>
    & { facet: (
      { __typename?: 'Facet' }
      & Pick<Facet, 'id' | 'name'>
    ) }
  )>, featuredAsset?: Maybe<(
    { __typename?: 'Asset' }
    & AssetFragment
  )>, assets: Array<(
    { __typename?: 'Asset' }
    & AssetFragment
  )>, translations: Array<(
    { __typename?: 'ProductVariantTranslation' }
    & Pick<ProductVariantTranslation, 'id' | 'languageCode' | 'name'>
  )>, channels: Array<(
    { __typename?: 'Channel' }
    & Pick<Channel, 'id' | 'code'>
  )> }
);

export type ProductWithVariantsFragment = (
  { __typename?: 'Product' }
  & Pick<Product, 'id' | 'createdAt' | 'updatedAt' | 'enabled' | 'languageCode' | 'name' | 'slug' | 'description'>
  & { featuredAsset?: Maybe<(
    { __typename?: 'Asset' }
    & AssetFragment
  )>, assets: Array<(
    { __typename?: 'Asset' }
    & AssetFragment
  )>, translations: Array<(
    { __typename?: 'ProductTranslation' }
    & Pick<ProductTranslation, 'id' | 'languageCode' | 'name' | 'slug' | 'description'>
  )>, optionGroups: Array<(
    { __typename?: 'ProductOptionGroup' }
    & ProductOptionGroupFragment
  )>, variants: Array<(
    { __typename?: 'ProductVariant' }
    & ProductVariantFragment
  )>, facetValues: Array<(
    { __typename?: 'FacetValue' }
    & Pick<FacetValue, 'id' | 'code' | 'name'>
    & { facet: (
      { __typename?: 'Facet' }
      & Pick<Facet, 'id' | 'name'>
    ) }
  )>, channels: Array<(
    { __typename?: 'Channel' }
    & Pick<Channel, 'id' | 'code'>
  )> }
);

export type ProductOptionGroupWithOptionsFragment = (
  { __typename?: 'ProductOptionGroup' }
  & Pick<ProductOptionGroup, 'id' | 'createdAt' | 'updatedAt' | 'languageCode' | 'code' | 'name'>
  & { translations: Array<(
    { __typename?: 'ProductOptionGroupTranslation' }
    & Pick<ProductOptionGroupTranslation, 'id' | 'name'>
  )>, options: Array<(
    { __typename?: 'ProductOption' }
    & Pick<ProductOption, 'id' | 'languageCode' | 'name' | 'code'>
    & { translations: Array<(
      { __typename?: 'ProductOptionTranslation' }
      & Pick<ProductOptionTranslation, 'name'>
    )> }
  )> }
);

export type UpdateProductMutationVariables = Exact<{
  input: UpdateProductInput;
}>;


export type UpdateProductMutation = { updateProduct: (
    { __typename?: 'Product' }
    & ProductWithVariantsFragment
  ) };

export type CreateProductMutationVariables = Exact<{
  input: CreateProductInput;
}>;


export type CreateProductMutation = { createProduct: (
    { __typename?: 'Product' }
    & ProductWithVariantsFragment
  ) };

export type DeleteProductMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteProductMutation = { deleteProduct: (
    { __typename?: 'DeletionResponse' }
    & Pick<DeletionResponse, 'result' | 'message'>
  ) };

export type CreateProductVariantsMutationVariables = Exact<{
  input: Array<CreateProductVariantInput> | CreateProductVariantInput;
}>;


export type CreateProductVariantsMutation = { createProductVariants: Array<Maybe<(
    { __typename?: 'ProductVariant' }
    & ProductVariantFragment
  )>> };

export type UpdateProductVariantsMutationVariables = Exact<{
  input: Array<UpdateProductVariantInput> | UpdateProductVariantInput;
}>;


export type UpdateProductVariantsMutation = { updateProductVariants: Array<Maybe<(
    { __typename?: 'ProductVariant' }
    & ProductVariantFragment
  )>> };

export type CreateProductOptionGroupMutationVariables = Exact<{
  input: CreateProductOptionGroupInput;
}>;


export type CreateProductOptionGroupMutation = { createProductOptionGroup: (
    { __typename?: 'ProductOptionGroup' }
    & ProductOptionGroupWithOptionsFragment
  ) };

export type GetProductOptionGroupQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetProductOptionGroupQuery = { productOptionGroup?: Maybe<(
    { __typename?: 'ProductOptionGroup' }
    & ProductOptionGroupWithOptionsFragment
  )> };

export type AddOptionToGroupMutationVariables = Exact<{
  input: CreateProductOptionInput;
}>;


export type AddOptionToGroupMutation = { createProductOption: (
    { __typename?: 'ProductOption' }
    & Pick<ProductOption, 'id' | 'createdAt' | 'updatedAt' | 'name' | 'code' | 'groupId'>
  ) };

export type AddOptionGroupToProductMutationVariables = Exact<{
  productId: Scalars['ID'];
  optionGroupId: Scalars['ID'];
}>;


export type AddOptionGroupToProductMutation = { addOptionGroupToProduct: (
    { __typename?: 'Product' }
    & Pick<Product, 'id' | 'createdAt' | 'updatedAt'>
    & { optionGroups: Array<(
      { __typename?: 'ProductOptionGroup' }
      & Pick<ProductOptionGroup, 'id' | 'createdAt' | 'updatedAt' | 'code'>
      & { options: Array<(
        { __typename?: 'ProductOption' }
        & Pick<ProductOption, 'id' | 'createdAt' | 'updatedAt' | 'code'>
      )> }
    )> }
  ) };

export type RemoveOptionGroupFromProductMutationVariables = Exact<{
  productId: Scalars['ID'];
  optionGroupId: Scalars['ID'];
}>;


export type RemoveOptionGroupFromProductMutation = { removeOptionGroupFromProduct: (
    { __typename?: 'Product' }
    & Pick<Product, 'id' | 'createdAt' | 'updatedAt'>
    & { optionGroups: Array<(
      { __typename?: 'ProductOptionGroup' }
      & Pick<ProductOptionGroup, 'id' | 'createdAt' | 'updatedAt' | 'code'>
      & { options: Array<(
        { __typename?: 'ProductOption' }
        & Pick<ProductOption, 'id' | 'createdAt' | 'updatedAt' | 'code'>
      )> }
    )> }
  ) | (
    { __typename?: 'ProductOptionInUseError' }
    & ErrorResult_ProductOptionInUseError_Fragment
  ) };

export type GetProductWithVariantsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetProductWithVariantsQuery = { product?: Maybe<(
    { __typename?: 'Product' }
    & ProductWithVariantsFragment
  )> };

export type GetProductSimpleQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetProductSimpleQuery = { product?: Maybe<(
    { __typename?: 'Product' }
    & Pick<Product, 'id' | 'name'>
    & { featuredAsset?: Maybe<(
      { __typename?: 'Asset' }
      & AssetFragment
    )> }
  )> };

export type GetProductListQueryVariables = Exact<{
  options?: Maybe<ProductListOptions>;
}>;


export type GetProductListQuery = { products: (
    { __typename?: 'ProductList' }
    & Pick<ProductList, 'totalItems'>
    & { items: Array<(
      { __typename?: 'Product' }
      & Pick<Product, 'id' | 'createdAt' | 'updatedAt' | 'enabled' | 'languageCode' | 'name' | 'slug'>
      & { featuredAsset?: Maybe<(
        { __typename?: 'Asset' }
        & Pick<Asset, 'id' | 'createdAt' | 'updatedAt' | 'preview'>
      )> }
    )> }
  ) };

export type GetProductOptionGroupsQueryVariables = Exact<{
  filterTerm?: Maybe<Scalars['String']>;
}>;


export type GetProductOptionGroupsQuery = { productOptionGroups: Array<(
    { __typename?: 'ProductOptionGroup' }
    & Pick<ProductOptionGroup, 'id' | 'createdAt' | 'updatedAt' | 'languageCode' | 'code' | 'name'>
    & { options: Array<(
      { __typename?: 'ProductOption' }
      & Pick<ProductOption, 'id' | 'createdAt' | 'updatedAt' | 'languageCode' | 'code' | 'name'>
    )> }
  )> };

export type GetAssetListQueryVariables = Exact<{
  options?: Maybe<AssetListOptions>;
}>;


export type GetAssetListQuery = { assets: (
    { __typename?: 'AssetList' }
    & Pick<AssetList, 'totalItems'>
    & { items: Array<(
      { __typename?: 'Asset' }
      & { tags: Array<(
        { __typename?: 'Tag' }
        & TagFragment
      )> }
      & AssetFragment
    )> }
  ) };

export type GetAssetQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetAssetQuery = { asset?: Maybe<(
    { __typename?: 'Asset' }
    & { tags: Array<(
      { __typename?: 'Tag' }
      & TagFragment
    )> }
    & AssetFragment
  )> };

export type CreateAssetsMutationVariables = Exact<{
  input: Array<CreateAssetInput> | CreateAssetInput;
}>;


export type CreateAssetsMutation = { createAssets: Array<(
    { __typename?: 'Asset' }
    & { tags: Array<(
      { __typename?: 'Tag' }
      & TagFragment
    )> }
    & AssetFragment
  ) | (
    { __typename?: 'MimeTypeError' }
    & Pick<MimeTypeError, 'message'>
  )> };

export type UpdateAssetMutationVariables = Exact<{
  input: UpdateAssetInput;
}>;


export type UpdateAssetMutation = { updateAsset: (
    { __typename?: 'Asset' }
    & { tags: Array<(
      { __typename?: 'Tag' }
      & TagFragment
    )> }
    & AssetFragment
  ) };

export type DeleteAssetsMutationVariables = Exact<{
  input: DeleteAssetsInput;
}>;


export type DeleteAssetsMutation = { deleteAssets: (
    { __typename?: 'DeletionResponse' }
    & Pick<DeletionResponse, 'result' | 'message'>
  ) };

export type SearchProductsQueryVariables = Exact<{
  input: SearchInput;
}>;


export type SearchProductsQuery = { search: (
    { __typename?: 'SearchResponse' }
    & Pick<SearchResponse, 'totalItems'>
    & { items: Array<(
      { __typename?: 'SearchResult' }
      & Pick<SearchResult, 'enabled' | 'productId' | 'productName' | 'productVariantId' | 'productVariantName' | 'sku' | 'channelIds'>
      & { productAsset?: Maybe<(
        { __typename?: 'SearchResultAsset' }
        & Pick<SearchResultAsset, 'id' | 'preview'>
        & { focalPoint?: Maybe<(
          { __typename?: 'Coordinate' }
          & Pick<Coordinate, 'x' | 'y'>
        )> }
      )>, productVariantAsset?: Maybe<(
        { __typename?: 'SearchResultAsset' }
        & Pick<SearchResultAsset, 'id' | 'preview'>
        & { focalPoint?: Maybe<(
          { __typename?: 'Coordinate' }
          & Pick<Coordinate, 'x' | 'y'>
        )> }
      )> }
    )>, facetValues: Array<(
      { __typename?: 'FacetValueResult' }
      & Pick<FacetValueResult, 'count'>
      & { facetValue: (
        { __typename?: 'FacetValue' }
        & Pick<FacetValue, 'id' | 'createdAt' | 'updatedAt' | 'name'>
        & { facet: (
          { __typename?: 'Facet' }
          & Pick<Facet, 'id' | 'createdAt' | 'updatedAt' | 'name'>
        ) }
      ) }
    )> }
  ) };

export type ProductSelectorSearchQueryVariables = Exact<{
  term: Scalars['String'];
  take: Scalars['Int'];
}>;


export type ProductSelectorSearchQuery = { search: (
    { __typename?: 'SearchResponse' }
    & { items: Array<(
      { __typename?: 'SearchResult' }
      & Pick<SearchResult, 'productVariantId' | 'productVariantName' | 'sku'>
      & { productAsset?: Maybe<(
        { __typename?: 'SearchResultAsset' }
        & Pick<SearchResultAsset, 'id' | 'preview'>
        & { focalPoint?: Maybe<(
          { __typename?: 'Coordinate' }
          & Pick<Coordinate, 'x' | 'y'>
        )> }
      )>, price: { __typename?: 'PriceRange' } | (
        { __typename?: 'SinglePrice' }
        & Pick<SinglePrice, 'value'>
      ), priceWithTax: { __typename?: 'PriceRange' } | (
        { __typename?: 'SinglePrice' }
        & Pick<SinglePrice, 'value'>
      ) }
    )> }
  ) };

export type UpdateProductOptionMutationVariables = Exact<{
  input: UpdateProductOptionInput;
}>;


export type UpdateProductOptionMutation = { updateProductOption: (
    { __typename?: 'ProductOption' }
    & ProductOptionFragment
  ) };

export type DeleteProductVariantMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteProductVariantMutation = { deleteProductVariant: (
    { __typename?: 'DeletionResponse' }
    & Pick<DeletionResponse, 'result' | 'message'>
  ) };

export type GetProductVariantOptionsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetProductVariantOptionsQuery = { product?: Maybe<(
    { __typename?: 'Product' }
    & Pick<Product, 'id' | 'createdAt' | 'updatedAt' | 'name'>
    & { optionGroups: Array<(
      { __typename?: 'ProductOptionGroup' }
      & Pick<ProductOptionGroup, 'id' | 'name' | 'code'>
      & { options: Array<(
        { __typename?: 'ProductOption' }
        & ProductOptionFragment
      )> }
    )>, variants: Array<(
      { __typename?: 'ProductVariant' }
      & Pick<ProductVariant, 'id' | 'createdAt' | 'updatedAt' | 'enabled' | 'name' | 'sku' | 'price' | 'stockOnHand'>
      & { options: Array<(
        { __typename?: 'ProductOption' }
        & Pick<ProductOption, 'id' | 'createdAt' | 'updatedAt' | 'name' | 'code' | 'groupId'>
      )> }
    )> }
  )> };

export type AssignProductsToChannelMutationVariables = Exact<{
  input: AssignProductsToChannelInput;
}>;


export type AssignProductsToChannelMutation = { assignProductsToChannel: Array<(
    { __typename?: 'Product' }
    & Pick<Product, 'id'>
    & { channels: Array<(
      { __typename?: 'Channel' }
      & Pick<Channel, 'id' | 'code'>
    )> }
  )> };

export type AssignVariantsToChannelMutationVariables = Exact<{
  input: AssignProductVariantsToChannelInput;
}>;


export type AssignVariantsToChannelMutation = { assignProductVariantsToChannel: Array<(
    { __typename?: 'ProductVariant' }
    & Pick<ProductVariant, 'id'>
    & { channels: Array<(
      { __typename?: 'Channel' }
      & Pick<Channel, 'id' | 'code'>
    )> }
  )> };

export type RemoveProductsFromChannelMutationVariables = Exact<{
  input: RemoveProductsFromChannelInput;
}>;


export type RemoveProductsFromChannelMutation = { removeProductsFromChannel: Array<(
    { __typename?: 'Product' }
    & Pick<Product, 'id'>
    & { channels: Array<(
      { __typename?: 'Channel' }
      & Pick<Channel, 'id' | 'code'>
    )> }
  )> };

export type RemoveVariantsFromChannelMutationVariables = Exact<{
  input: RemoveProductVariantsFromChannelInput;
}>;


export type RemoveVariantsFromChannelMutation = { removeProductVariantsFromChannel: Array<(
    { __typename?: 'ProductVariant' }
    & Pick<ProductVariant, 'id'>
    & { channels: Array<(
      { __typename?: 'Channel' }
      & Pick<Channel, 'id' | 'code'>
    )> }
  )> };

export type GetProductVariantQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetProductVariantQuery = { productVariant?: Maybe<(
    { __typename?: 'ProductVariant' }
    & Pick<ProductVariant, 'id' | 'name' | 'sku'>
    & { featuredAsset?: Maybe<(
      { __typename?: 'Asset' }
      & Pick<Asset, 'id' | 'preview'>
      & { focalPoint?: Maybe<(
        { __typename?: 'Coordinate' }
        & Pick<Coordinate, 'x' | 'y'>
      )> }
    )>, product: (
      { __typename?: 'Product' }
      & Pick<Product, 'id'>
      & { featuredAsset?: Maybe<(
        { __typename?: 'Asset' }
        & Pick<Asset, 'id' | 'preview'>
        & { focalPoint?: Maybe<(
          { __typename?: 'Coordinate' }
          & Pick<Coordinate, 'x' | 'y'>
        )> }
      )> }
    ) }
  )> };

export type GetProductVariantListQueryVariables = Exact<{
  options: ProductVariantListOptions;
}>;


export type GetProductVariantListQuery = { productVariants: (
    { __typename?: 'ProductVariantList' }
    & Pick<ProductVariantList, 'totalItems'>
    & { items: Array<(
      { __typename?: 'ProductVariant' }
      & Pick<ProductVariant, 'id' | 'name' | 'sku'>
      & { featuredAsset?: Maybe<(
        { __typename?: 'Asset' }
        & Pick<Asset, 'id' | 'preview'>
        & { focalPoint?: Maybe<(
          { __typename?: 'Coordinate' }
          & Pick<Coordinate, 'x' | 'y'>
        )> }
      )>, product: (
        { __typename?: 'Product' }
        & Pick<Product, 'id'>
        & { featuredAsset?: Maybe<(
          { __typename?: 'Asset' }
          & Pick<Asset, 'id' | 'preview'>
          & { focalPoint?: Maybe<(
            { __typename?: 'Coordinate' }
            & Pick<Coordinate, 'x' | 'y'>
          )> }
        )> }
      ) }
    )> }
  ) };

export type GetTagListQueryVariables = Exact<{
  options?: Maybe<TagListOptions>;
}>;


export type GetTagListQuery = { tags: (
    { __typename?: 'TagList' }
    & Pick<TagList, 'totalItems'>
    & { items: Array<(
      { __typename?: 'Tag' }
      & TagFragment
    )> }
  ) };

export type GetTagQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetTagQuery = { tag: (
    { __typename?: 'Tag' }
    & TagFragment
  ) };

export type CreateTagMutationVariables = Exact<{
  input: CreateTagInput;
}>;


export type CreateTagMutation = { createTag: (
    { __typename?: 'Tag' }
    & TagFragment
  ) };

export type UpdateTagMutationVariables = Exact<{
  input: UpdateTagInput;
}>;


export type UpdateTagMutation = { updateTag: (
    { __typename?: 'Tag' }
    & TagFragment
  ) };

export type DeleteTagMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteTagMutation = { deleteTag: (
    { __typename?: 'DeletionResponse' }
    & Pick<DeletionResponse, 'message' | 'result'>
  ) };

export type PromotionFragment = (
  { __typename?: 'Promotion' }
  & Pick<Promotion, 'id' | 'createdAt' | 'updatedAt' | 'name' | 'enabled' | 'couponCode' | 'perCustomerUsageLimit' | 'startsAt' | 'endsAt'>
  & { conditions: Array<(
    { __typename?: 'ConfigurableOperation' }
    & ConfigurableOperationFragment
  )>, actions: Array<(
    { __typename?: 'ConfigurableOperation' }
    & ConfigurableOperationFragment
  )> }
);

export type GetPromotionListQueryVariables = Exact<{
  options?: Maybe<PromotionListOptions>;
}>;


export type GetPromotionListQuery = { promotions: (
    { __typename?: 'PromotionList' }
    & Pick<PromotionList, 'totalItems'>
    & { items: Array<(
      { __typename?: 'Promotion' }
      & PromotionFragment
    )> }
  ) };

export type GetPromotionQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetPromotionQuery = { promotion?: Maybe<(
    { __typename?: 'Promotion' }
    & PromotionFragment
  )> };

export type GetAdjustmentOperationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdjustmentOperationsQuery = { promotionConditions: Array<(
    { __typename?: 'ConfigurableOperationDefinition' }
    & ConfigurableOperationDefFragment
  )>, promotionActions: Array<(
    { __typename?: 'ConfigurableOperationDefinition' }
    & ConfigurableOperationDefFragment
  )> };

export type CreatePromotionMutationVariables = Exact<{
  input: CreatePromotionInput;
}>;


export type CreatePromotionMutation = { createPromotion: (
    { __typename?: 'Promotion' }
    & PromotionFragment
  ) | (
    { __typename?: 'MissingConditionsError' }
    & ErrorResult_MissingConditionsError_Fragment
  ) };

export type UpdatePromotionMutationVariables = Exact<{
  input: UpdatePromotionInput;
}>;


export type UpdatePromotionMutation = { updatePromotion: (
    { __typename?: 'Promotion' }
    & PromotionFragment
  ) | { __typename?: 'MissingConditionsError' } };

export type DeletePromotionMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeletePromotionMutation = { deletePromotion: (
    { __typename?: 'DeletionResponse' }
    & Pick<DeletionResponse, 'result' | 'message'>
  ) };

export type CountryFragment = (
  { __typename?: 'Country' }
  & Pick<Country, 'id' | 'createdAt' | 'updatedAt' | 'code' | 'name' | 'enabled'>
  & { translations: Array<(
    { __typename?: 'CountryTranslation' }
    & Pick<CountryTranslation, 'id' | 'languageCode' | 'name'>
  )> }
);

export type GetCountryListQueryVariables = Exact<{
  options?: Maybe<CountryListOptions>;
}>;


export type GetCountryListQuery = { countries: (
    { __typename?: 'CountryList' }
    & Pick<CountryList, 'totalItems'>
    & { items: Array<(
      { __typename?: 'Country' }
      & Pick<Country, 'id' | 'code' | 'name' | 'enabled'>
    )> }
  ) };

export type GetAvailableCountriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAvailableCountriesQuery = { countries: (
    { __typename?: 'CountryList' }
    & { items: Array<(
      { __typename?: 'Country' }
      & Pick<Country, 'id' | 'code' | 'name' | 'enabled'>
    )> }
  ) };

export type GetCountryQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetCountryQuery = { country?: Maybe<(
    { __typename?: 'Country' }
    & CountryFragment
  )> };

export type CreateCountryMutationVariables = Exact<{
  input: CreateCountryInput;
}>;


export type CreateCountryMutation = { createCountry: (
    { __typename?: 'Country' }
    & CountryFragment
  ) };

export type UpdateCountryMutationVariables = Exact<{
  input: UpdateCountryInput;
}>;


export type UpdateCountryMutation = { updateCountry: (
    { __typename?: 'Country' }
    & CountryFragment
  ) };

export type DeleteCountryMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteCountryMutation = { deleteCountry: (
    { __typename?: 'DeletionResponse' }
    & Pick<DeletionResponse, 'result' | 'message'>
  ) };

export type ZoneFragment = (
  { __typename?: 'Zone' }
  & Pick<Zone, 'id' | 'name'>
  & { members: Array<(
    { __typename?: 'Country' }
    & CountryFragment
  )> }
);

export type GetZonesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetZonesQuery = { zones: Array<(
    { __typename?: 'Zone' }
    & Pick<Zone, 'id' | 'createdAt' | 'updatedAt' | 'name'>
    & { members: Array<(
      { __typename?: 'Country' }
      & Pick<Country, 'createdAt' | 'updatedAt' | 'id' | 'name' | 'code' | 'enabled'>
    )> }
  )> };

export type GetZoneQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetZoneQuery = { zone?: Maybe<(
    { __typename?: 'Zone' }
    & ZoneFragment
  )> };

export type CreateZoneMutationVariables = Exact<{
  input: CreateZoneInput;
}>;


export type CreateZoneMutation = { createZone: (
    { __typename?: 'Zone' }
    & ZoneFragment
  ) };

export type UpdateZoneMutationVariables = Exact<{
  input: UpdateZoneInput;
}>;


export type UpdateZoneMutation = { updateZone: (
    { __typename?: 'Zone' }
    & ZoneFragment
  ) };

export type DeleteZoneMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteZoneMutation = { deleteZone: (
    { __typename?: 'DeletionResponse' }
    & Pick<DeletionResponse, 'message' | 'result'>
  ) };

export type AddMembersToZoneMutationVariables = Exact<{
  zoneId: Scalars['ID'];
  memberIds: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type AddMembersToZoneMutation = { addMembersToZone: (
    { __typename?: 'Zone' }
    & ZoneFragment
  ) };

export type RemoveMembersFromZoneMutationVariables = Exact<{
  zoneId: Scalars['ID'];
  memberIds: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type RemoveMembersFromZoneMutation = { removeMembersFromZone: (
    { __typename?: 'Zone' }
    & ZoneFragment
  ) };

export type TaxCategoryFragment = (
  { __typename?: 'TaxCategory' }
  & Pick<TaxCategory, 'id' | 'createdAt' | 'updatedAt' | 'name' | 'isDefault'>
);

export type GetTaxCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTaxCategoriesQuery = { taxCategories: Array<(
    { __typename?: 'TaxCategory' }
    & TaxCategoryFragment
  )> };

export type GetTaxCategoryQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetTaxCategoryQuery = { taxCategory?: Maybe<(
    { __typename?: 'TaxCategory' }
    & TaxCategoryFragment
  )> };

export type CreateTaxCategoryMutationVariables = Exact<{
  input: CreateTaxCategoryInput;
}>;


export type CreateTaxCategoryMutation = { createTaxCategory: (
    { __typename?: 'TaxCategory' }
    & TaxCategoryFragment
  ) };

export type UpdateTaxCategoryMutationVariables = Exact<{
  input: UpdateTaxCategoryInput;
}>;


export type UpdateTaxCategoryMutation = { updateTaxCategory: (
    { __typename?: 'TaxCategory' }
    & TaxCategoryFragment
  ) };

export type DeleteTaxCategoryMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteTaxCategoryMutation = { deleteTaxCategory: (
    { __typename?: 'DeletionResponse' }
    & Pick<DeletionResponse, 'result' | 'message'>
  ) };

export type TaxRateFragment = (
  { __typename?: 'TaxRate' }
  & Pick<TaxRate, 'id' | 'createdAt' | 'updatedAt' | 'name' | 'enabled' | 'value'>
  & { category: (
    { __typename?: 'TaxCategory' }
    & Pick<TaxCategory, 'id' | 'name'>
  ), zone: (
    { __typename?: 'Zone' }
    & Pick<Zone, 'id' | 'name'>
  ), customerGroup?: Maybe<(
    { __typename?: 'CustomerGroup' }
    & Pick<CustomerGroup, 'id' | 'name'>
  )> }
);

export type GetTaxRateListQueryVariables = Exact<{
  options?: Maybe<TaxRateListOptions>;
}>;


export type GetTaxRateListQuery = { taxRates: (
    { __typename?: 'TaxRateList' }
    & Pick<TaxRateList, 'totalItems'>
    & { items: Array<(
      { __typename?: 'TaxRate' }
      & TaxRateFragment
    )> }
  ) };

export type GetTaxRateQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetTaxRateQuery = { taxRate?: Maybe<(
    { __typename?: 'TaxRate' }
    & TaxRateFragment
  )> };

export type CreateTaxRateMutationVariables = Exact<{
  input: CreateTaxRateInput;
}>;


export type CreateTaxRateMutation = { createTaxRate: (
    { __typename?: 'TaxRate' }
    & TaxRateFragment
  ) };

export type UpdateTaxRateMutationVariables = Exact<{
  input: UpdateTaxRateInput;
}>;


export type UpdateTaxRateMutation = { updateTaxRate: (
    { __typename?: 'TaxRate' }
    & TaxRateFragment
  ) };

export type DeleteTaxRateMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteTaxRateMutation = { deleteTaxRate: (
    { __typename?: 'DeletionResponse' }
    & Pick<DeletionResponse, 'result' | 'message'>
  ) };

export type ChannelFragment = (
  { __typename?: 'Channel' }
  & Pick<Channel, 'id' | 'createdAt' | 'updatedAt' | 'code' | 'token' | 'pricesIncludeTax' | 'currencyCode' | 'defaultLanguageCode'>
  & { defaultShippingZone?: Maybe<(
    { __typename?: 'Zone' }
    & Pick<Zone, 'id' | 'name'>
  )>, defaultTaxZone?: Maybe<(
    { __typename?: 'Zone' }
    & Pick<Zone, 'id' | 'name'>
  )> }
);

export type GetChannelsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetChannelsQuery = { channels: Array<(
    { __typename?: 'Channel' }
    & ChannelFragment
  )> };

export type GetChannelQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetChannelQuery = { channel?: Maybe<(
    { __typename?: 'Channel' }
    & ChannelFragment
  )> };

export type GetActiveChannelQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActiveChannelQuery = { activeChannel: (
    { __typename?: 'Channel' }
    & ChannelFragment
  ) };

export type CreateChannelMutationVariables = Exact<{
  input: CreateChannelInput;
}>;


export type CreateChannelMutation = { createChannel: (
    { __typename?: 'Channel' }
    & ChannelFragment
  ) | (
    { __typename?: 'LanguageNotAvailableError' }
    & ErrorResult_LanguageNotAvailableError_Fragment
  ) };

export type UpdateChannelMutationVariables = Exact<{
  input: UpdateChannelInput;
}>;


export type UpdateChannelMutation = { updateChannel: (
    { __typename?: 'Channel' }
    & ChannelFragment
  ) | (
    { __typename?: 'LanguageNotAvailableError' }
    & ErrorResult_LanguageNotAvailableError_Fragment
  ) };

export type DeleteChannelMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteChannelMutation = { deleteChannel: (
    { __typename?: 'DeletionResponse' }
    & Pick<DeletionResponse, 'result' | 'message'>
  ) };

export type PaymentMethodFragment = (
  { __typename?: 'PaymentMethod' }
  & Pick<PaymentMethod, 'id' | 'createdAt' | 'updatedAt' | 'name' | 'code' | 'description' | 'enabled'>
  & { checker?: Maybe<(
    { __typename?: 'ConfigurableOperation' }
    & ConfigurableOperationFragment
  )>, handler: (
    { __typename?: 'ConfigurableOperation' }
    & ConfigurableOperationFragment
  ) }
);

export type GetPaymentMethodListQueryVariables = Exact<{
  options: PaymentMethodListOptions;
}>;


export type GetPaymentMethodListQuery = { paymentMethods: (
    { __typename?: 'PaymentMethodList' }
    & Pick<PaymentMethodList, 'totalItems'>
    & { items: Array<(
      { __typename?: 'PaymentMethod' }
      & PaymentMethodFragment
    )> }
  ) };

export type GetPaymentMethodOperationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPaymentMethodOperationsQuery = { paymentMethodEligibilityCheckers: Array<(
    { __typename?: 'ConfigurableOperationDefinition' }
    & ConfigurableOperationDefFragment
  )>, paymentMethodHandlers: Array<(
    { __typename?: 'ConfigurableOperationDefinition' }
    & ConfigurableOperationDefFragment
  )> };

export type GetPaymentMethodQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetPaymentMethodQuery = { paymentMethod?: Maybe<(
    { __typename?: 'PaymentMethod' }
    & PaymentMethodFragment
  )> };

export type CreatePaymentMethodMutationVariables = Exact<{
  input: CreatePaymentMethodInput;
}>;


export type CreatePaymentMethodMutation = { createPaymentMethod: (
    { __typename?: 'PaymentMethod' }
    & PaymentMethodFragment
  ) };

export type UpdatePaymentMethodMutationVariables = Exact<{
  input: UpdatePaymentMethodInput;
}>;


export type UpdatePaymentMethodMutation = { updatePaymentMethod: (
    { __typename?: 'PaymentMethod' }
    & PaymentMethodFragment
  ) };

export type DeletePaymentMethodMutationVariables = Exact<{
  id: Scalars['ID'];
  force?: Maybe<Scalars['Boolean']>;
}>;


export type DeletePaymentMethodMutation = { deletePaymentMethod: (
    { __typename?: 'DeletionResponse' }
    & Pick<DeletionResponse, 'result' | 'message'>
  ) };

export type GlobalSettingsFragment = (
  { __typename?: 'GlobalSettings' }
  & Pick<GlobalSettings, 'id' | 'availableLanguages' | 'trackInventory' | 'outOfStockThreshold'>
  & { serverConfig: (
    { __typename?: 'ServerConfig' }
    & { permissions: Array<(
      { __typename?: 'PermissionDefinition' }
      & Pick<PermissionDefinition, 'name' | 'description' | 'assignable'>
    )>, orderProcess: Array<(
      { __typename?: 'OrderProcessState' }
      & Pick<OrderProcessState, 'name'>
    )> }
  ) }
);

export type GetGlobalSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGlobalSettingsQuery = { globalSettings: (
    { __typename?: 'GlobalSettings' }
    & GlobalSettingsFragment
  ) };

export type UpdateGlobalSettingsMutationVariables = Exact<{
  input: UpdateGlobalSettingsInput;
}>;


export type UpdateGlobalSettingsMutation = { updateGlobalSettings: (
    { __typename?: 'GlobalSettings' }
    & GlobalSettingsFragment
  ) | (
    { __typename?: 'ChannelDefaultLanguageError' }
    & ErrorResult_ChannelDefaultLanguageError_Fragment
  ) };

type CustomFieldConfig_StringCustomFieldConfig_Fragment = (
  { __typename?: 'StringCustomFieldConfig' }
  & Pick<StringCustomFieldConfig, 'name' | 'type' | 'list' | 'readonly'>
  & { description?: Maybe<Array<(
    { __typename?: 'LocalizedString' }
    & Pick<LocalizedString, 'languageCode' | 'value'>
  )>>, label?: Maybe<Array<(
    { __typename?: 'LocalizedString' }
    & Pick<LocalizedString, 'languageCode' | 'value'>
  )>> }
);

type CustomFieldConfig_LocaleStringCustomFieldConfig_Fragment = (
  { __typename?: 'LocaleStringCustomFieldConfig' }
  & Pick<LocaleStringCustomFieldConfig, 'name' | 'type' | 'list' | 'readonly'>
  & { description?: Maybe<Array<(
    { __typename?: 'LocalizedString' }
    & Pick<LocalizedString, 'languageCode' | 'value'>
  )>>, label?: Maybe<Array<(
    { __typename?: 'LocalizedString' }
    & Pick<LocalizedString, 'languageCode' | 'value'>
  )>> }
);

type CustomFieldConfig_IntCustomFieldConfig_Fragment = (
  { __typename?: 'IntCustomFieldConfig' }
  & Pick<IntCustomFieldConfig, 'name' | 'type' | 'list' | 'readonly'>
  & { description?: Maybe<Array<(
    { __typename?: 'LocalizedString' }
    & Pick<LocalizedString, 'languageCode' | 'value'>
  )>>, label?: Maybe<Array<(
    { __typename?: 'LocalizedString' }
    & Pick<LocalizedString, 'languageCode' | 'value'>
  )>> }
);

type CustomFieldConfig_FloatCustomFieldConfig_Fragment = (
  { __typename?: 'FloatCustomFieldConfig' }
  & Pick<FloatCustomFieldConfig, 'name' | 'type' | 'list' | 'readonly'>
  & { description?: Maybe<Array<(
    { __typename?: 'LocalizedString' }
    & Pick<LocalizedString, 'languageCode' | 'value'>
  )>>, label?: Maybe<Array<(
    { __typename?: 'LocalizedString' }
    & Pick<LocalizedString, 'languageCode' | 'value'>
  )>> }
);

type CustomFieldConfig_BooleanCustomFieldConfig_Fragment = (
  { __typename?: 'BooleanCustomFieldConfig' }
  & Pick<BooleanCustomFieldConfig, 'name' | 'type' | 'list' | 'readonly'>
  & { description?: Maybe<Array<(
    { __typename?: 'LocalizedString' }
    & Pick<LocalizedString, 'languageCode' | 'value'>
  )>>, label?: Maybe<Array<(
    { __typename?: 'LocalizedString' }
    & Pick<LocalizedString, 'languageCode' | 'value'>
  )>> }
);

type CustomFieldConfig_DateTimeCustomFieldConfig_Fragment = (
  { __typename?: 'DateTimeCustomFieldConfig' }
  & Pick<DateTimeCustomFieldConfig, 'name' | 'type' | 'list' | 'readonly'>
  & { description?: Maybe<Array<(
    { __typename?: 'LocalizedString' }
    & Pick<LocalizedString, 'languageCode' | 'value'>
  )>>, label?: Maybe<Array<(
    { __typename?: 'LocalizedString' }
    & Pick<LocalizedString, 'languageCode' | 'value'>
  )>> }
);

type CustomFieldConfig_RelationCustomFieldConfig_Fragment = (
  { __typename?: 'RelationCustomFieldConfig' }
  & Pick<RelationCustomFieldConfig, 'name' | 'type' | 'list' | 'readonly'>
  & { description?: Maybe<Array<(
    { __typename?: 'LocalizedString' }
    & Pick<LocalizedString, 'languageCode' | 'value'>
  )>>, label?: Maybe<Array<(
    { __typename?: 'LocalizedString' }
    & Pick<LocalizedString, 'languageCode' | 'value'>
  )>> }
);

type CustomFieldConfig_TextCustomFieldConfig_Fragment = (
  { __typename?: 'TextCustomFieldConfig' }
  & Pick<TextCustomFieldConfig, 'name' | 'type' | 'list' | 'readonly'>
  & { description?: Maybe<Array<(
    { __typename?: 'LocalizedString' }
    & Pick<LocalizedString, 'languageCode' | 'value'>
  )>>, label?: Maybe<Array<(
    { __typename?: 'LocalizedString' }
    & Pick<LocalizedString, 'languageCode' | 'value'>
  )>> }
);

export type CustomFieldConfigFragment = CustomFieldConfig_StringCustomFieldConfig_Fragment | CustomFieldConfig_LocaleStringCustomFieldConfig_Fragment | CustomFieldConfig_IntCustomFieldConfig_Fragment | CustomFieldConfig_FloatCustomFieldConfig_Fragment | CustomFieldConfig_BooleanCustomFieldConfig_Fragment | CustomFieldConfig_DateTimeCustomFieldConfig_Fragment | CustomFieldConfig_RelationCustomFieldConfig_Fragment | CustomFieldConfig_TextCustomFieldConfig_Fragment;

export type StringCustomFieldFragment = (
  { __typename?: 'StringCustomFieldConfig' }
  & Pick<StringCustomFieldConfig, 'pattern'>
  & { options?: Maybe<Array<(
    { __typename?: 'StringFieldOption' }
    & Pick<StringFieldOption, 'value'>
    & { label?: Maybe<Array<(
      { __typename?: 'LocalizedString' }
      & Pick<LocalizedString, 'languageCode' | 'value'>
    )>> }
  )>> }
  & CustomFieldConfig_StringCustomFieldConfig_Fragment
);

export type LocaleStringCustomFieldFragment = (
  { __typename?: 'LocaleStringCustomFieldConfig' }
  & Pick<LocaleStringCustomFieldConfig, 'pattern'>
  & CustomFieldConfig_LocaleStringCustomFieldConfig_Fragment
);

export type TextCustomFieldFragment = (
  { __typename?: 'TextCustomFieldConfig' }
  & CustomFieldConfig_TextCustomFieldConfig_Fragment
);

export type BooleanCustomFieldFragment = (
  { __typename?: 'BooleanCustomFieldConfig' }
  & CustomFieldConfig_BooleanCustomFieldConfig_Fragment
);

export type IntCustomFieldFragment = (
  { __typename?: 'IntCustomFieldConfig' }
  & { intMin: IntCustomFieldConfig['min'], intMax: IntCustomFieldConfig['max'], intStep: IntCustomFieldConfig['step'] }
  & CustomFieldConfig_IntCustomFieldConfig_Fragment
);

export type FloatCustomFieldFragment = (
  { __typename?: 'FloatCustomFieldConfig' }
  & { floatMin: FloatCustomFieldConfig['min'], floatMax: FloatCustomFieldConfig['max'], floatStep: FloatCustomFieldConfig['step'] }
  & CustomFieldConfig_FloatCustomFieldConfig_Fragment
);

export type DateTimeCustomFieldFragment = (
  { __typename?: 'DateTimeCustomFieldConfig' }
  & { datetimeMin: DateTimeCustomFieldConfig['min'], datetimeMax: DateTimeCustomFieldConfig['max'], datetimeStep: DateTimeCustomFieldConfig['step'] }
  & CustomFieldConfig_DateTimeCustomFieldConfig_Fragment
);

export type RelationCustomFieldFragment = (
  { __typename?: 'RelationCustomFieldConfig' }
  & Pick<RelationCustomFieldConfig, 'entity' | 'scalarFields'>
  & CustomFieldConfig_RelationCustomFieldConfig_Fragment
);

type CustomFields_StringCustomFieldConfig_Fragment = (
  { __typename?: 'StringCustomFieldConfig' }
  & StringCustomFieldFragment
);

type CustomFields_LocaleStringCustomFieldConfig_Fragment = (
  { __typename?: 'LocaleStringCustomFieldConfig' }
  & LocaleStringCustomFieldFragment
);

type CustomFields_IntCustomFieldConfig_Fragment = (
  { __typename?: 'IntCustomFieldConfig' }
  & IntCustomFieldFragment
);

type CustomFields_FloatCustomFieldConfig_Fragment = (
  { __typename?: 'FloatCustomFieldConfig' }
  & FloatCustomFieldFragment
);

type CustomFields_BooleanCustomFieldConfig_Fragment = (
  { __typename?: 'BooleanCustomFieldConfig' }
  & BooleanCustomFieldFragment
);

type CustomFields_DateTimeCustomFieldConfig_Fragment = (
  { __typename?: 'DateTimeCustomFieldConfig' }
  & DateTimeCustomFieldFragment
);

type CustomFields_RelationCustomFieldConfig_Fragment = (
  { __typename?: 'RelationCustomFieldConfig' }
  & RelationCustomFieldFragment
);

type CustomFields_TextCustomFieldConfig_Fragment = (
  { __typename?: 'TextCustomFieldConfig' }
  & TextCustomFieldFragment
);

export type CustomFieldsFragment = CustomFields_StringCustomFieldConfig_Fragment | CustomFields_LocaleStringCustomFieldConfig_Fragment | CustomFields_IntCustomFieldConfig_Fragment | CustomFields_FloatCustomFieldConfig_Fragment | CustomFields_BooleanCustomFieldConfig_Fragment | CustomFields_DateTimeCustomFieldConfig_Fragment | CustomFields_RelationCustomFieldConfig_Fragment | CustomFields_TextCustomFieldConfig_Fragment;

export type GetServerConfigQueryVariables = Exact<{ [key: string]: never; }>;


export type GetServerConfigQuery = { globalSettings: (
    { __typename?: 'GlobalSettings' }
    & Pick<GlobalSettings, 'id'>
    & { serverConfig: (
      { __typename?: 'ServerConfig' }
      & Pick<ServerConfig, 'permittedAssetTypes'>
      & { orderProcess: Array<(
        { __typename?: 'OrderProcessState' }
        & Pick<OrderProcessState, 'name' | 'to'>
      )>, permissions: Array<(
        { __typename?: 'PermissionDefinition' }
        & Pick<PermissionDefinition, 'name' | 'description' | 'assignable'>
      )>, customFieldConfig: (
        { __typename?: 'CustomFields' }
        & { Address: Array<(
          { __typename?: 'StringCustomFieldConfig' }
          & CustomFields_StringCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'LocaleStringCustomFieldConfig' }
          & CustomFields_LocaleStringCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'IntCustomFieldConfig' }
          & CustomFields_IntCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'FloatCustomFieldConfig' }
          & CustomFields_FloatCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'BooleanCustomFieldConfig' }
          & CustomFields_BooleanCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'DateTimeCustomFieldConfig' }
          & CustomFields_DateTimeCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'RelationCustomFieldConfig' }
          & CustomFields_RelationCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'TextCustomFieldConfig' }
          & CustomFields_TextCustomFieldConfig_Fragment
        )>, Administrator: Array<(
          { __typename?: 'StringCustomFieldConfig' }
          & CustomFields_StringCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'LocaleStringCustomFieldConfig' }
          & CustomFields_LocaleStringCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'IntCustomFieldConfig' }
          & CustomFields_IntCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'FloatCustomFieldConfig' }
          & CustomFields_FloatCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'BooleanCustomFieldConfig' }
          & CustomFields_BooleanCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'DateTimeCustomFieldConfig' }
          & CustomFields_DateTimeCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'RelationCustomFieldConfig' }
          & CustomFields_RelationCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'TextCustomFieldConfig' }
          & CustomFields_TextCustomFieldConfig_Fragment
        )>, Asset: Array<(
          { __typename?: 'StringCustomFieldConfig' }
          & CustomFields_StringCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'LocaleStringCustomFieldConfig' }
          & CustomFields_LocaleStringCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'IntCustomFieldConfig' }
          & CustomFields_IntCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'FloatCustomFieldConfig' }
          & CustomFields_FloatCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'BooleanCustomFieldConfig' }
          & CustomFields_BooleanCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'DateTimeCustomFieldConfig' }
          & CustomFields_DateTimeCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'RelationCustomFieldConfig' }
          & CustomFields_RelationCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'TextCustomFieldConfig' }
          & CustomFields_TextCustomFieldConfig_Fragment
        )>, Channel: Array<(
          { __typename?: 'StringCustomFieldConfig' }
          & CustomFields_StringCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'LocaleStringCustomFieldConfig' }
          & CustomFields_LocaleStringCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'IntCustomFieldConfig' }
          & CustomFields_IntCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'FloatCustomFieldConfig' }
          & CustomFields_FloatCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'BooleanCustomFieldConfig' }
          & CustomFields_BooleanCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'DateTimeCustomFieldConfig' }
          & CustomFields_DateTimeCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'RelationCustomFieldConfig' }
          & CustomFields_RelationCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'TextCustomFieldConfig' }
          & CustomFields_TextCustomFieldConfig_Fragment
        )>, Collection: Array<(
          { __typename?: 'StringCustomFieldConfig' }
          & CustomFields_StringCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'LocaleStringCustomFieldConfig' }
          & CustomFields_LocaleStringCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'IntCustomFieldConfig' }
          & CustomFields_IntCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'FloatCustomFieldConfig' }
          & CustomFields_FloatCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'BooleanCustomFieldConfig' }
          & CustomFields_BooleanCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'DateTimeCustomFieldConfig' }
          & CustomFields_DateTimeCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'RelationCustomFieldConfig' }
          & CustomFields_RelationCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'TextCustomFieldConfig' }
          & CustomFields_TextCustomFieldConfig_Fragment
        )>, Customer: Array<(
          { __typename?: 'StringCustomFieldConfig' }
          & CustomFields_StringCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'LocaleStringCustomFieldConfig' }
          & CustomFields_LocaleStringCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'IntCustomFieldConfig' }
          & CustomFields_IntCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'FloatCustomFieldConfig' }
          & CustomFields_FloatCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'BooleanCustomFieldConfig' }
          & CustomFields_BooleanCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'DateTimeCustomFieldConfig' }
          & CustomFields_DateTimeCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'RelationCustomFieldConfig' }
          & CustomFields_RelationCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'TextCustomFieldConfig' }
          & CustomFields_TextCustomFieldConfig_Fragment
        )>, Facet: Array<(
          { __typename?: 'StringCustomFieldConfig' }
          & CustomFields_StringCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'LocaleStringCustomFieldConfig' }
          & CustomFields_LocaleStringCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'IntCustomFieldConfig' }
          & CustomFields_IntCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'FloatCustomFieldConfig' }
          & CustomFields_FloatCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'BooleanCustomFieldConfig' }
          & CustomFields_BooleanCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'DateTimeCustomFieldConfig' }
          & CustomFields_DateTimeCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'RelationCustomFieldConfig' }
          & CustomFields_RelationCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'TextCustomFieldConfig' }
          & CustomFields_TextCustomFieldConfig_Fragment
        )>, FacetValue: Array<(
          { __typename?: 'StringCustomFieldConfig' }
          & CustomFields_StringCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'LocaleStringCustomFieldConfig' }
          & CustomFields_LocaleStringCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'IntCustomFieldConfig' }
          & CustomFields_IntCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'FloatCustomFieldConfig' }
          & CustomFields_FloatCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'BooleanCustomFieldConfig' }
          & CustomFields_BooleanCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'DateTimeCustomFieldConfig' }
          & CustomFields_DateTimeCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'RelationCustomFieldConfig' }
          & CustomFields_RelationCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'TextCustomFieldConfig' }
          & CustomFields_TextCustomFieldConfig_Fragment
        )>, Fulfillment: Array<(
          { __typename?: 'StringCustomFieldConfig' }
          & CustomFields_StringCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'LocaleStringCustomFieldConfig' }
          & CustomFields_LocaleStringCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'IntCustomFieldConfig' }
          & CustomFields_IntCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'FloatCustomFieldConfig' }
          & CustomFields_FloatCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'BooleanCustomFieldConfig' }
          & CustomFields_BooleanCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'DateTimeCustomFieldConfig' }
          & CustomFields_DateTimeCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'RelationCustomFieldConfig' }
          & CustomFields_RelationCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'TextCustomFieldConfig' }
          & CustomFields_TextCustomFieldConfig_Fragment
        )>, GlobalSettings: Array<(
          { __typename?: 'StringCustomFieldConfig' }
          & CustomFields_StringCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'LocaleStringCustomFieldConfig' }
          & CustomFields_LocaleStringCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'IntCustomFieldConfig' }
          & CustomFields_IntCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'FloatCustomFieldConfig' }
          & CustomFields_FloatCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'BooleanCustomFieldConfig' }
          & CustomFields_BooleanCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'DateTimeCustomFieldConfig' }
          & CustomFields_DateTimeCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'RelationCustomFieldConfig' }
          & CustomFields_RelationCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'TextCustomFieldConfig' }
          & CustomFields_TextCustomFieldConfig_Fragment
        )>, Order: Array<(
          { __typename?: 'StringCustomFieldConfig' }
          & CustomFields_StringCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'LocaleStringCustomFieldConfig' }
          & CustomFields_LocaleStringCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'IntCustomFieldConfig' }
          & CustomFields_IntCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'FloatCustomFieldConfig' }
          & CustomFields_FloatCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'BooleanCustomFieldConfig' }
          & CustomFields_BooleanCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'DateTimeCustomFieldConfig' }
          & CustomFields_DateTimeCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'RelationCustomFieldConfig' }
          & CustomFields_RelationCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'TextCustomFieldConfig' }
          & CustomFields_TextCustomFieldConfig_Fragment
        )>, OrderLine: Array<(
          { __typename?: 'StringCustomFieldConfig' }
          & CustomFields_StringCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'LocaleStringCustomFieldConfig' }
          & CustomFields_LocaleStringCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'IntCustomFieldConfig' }
          & CustomFields_IntCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'FloatCustomFieldConfig' }
          & CustomFields_FloatCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'BooleanCustomFieldConfig' }
          & CustomFields_BooleanCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'DateTimeCustomFieldConfig' }
          & CustomFields_DateTimeCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'RelationCustomFieldConfig' }
          & CustomFields_RelationCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'TextCustomFieldConfig' }
          & CustomFields_TextCustomFieldConfig_Fragment
        )>, Product: Array<(
          { __typename?: 'StringCustomFieldConfig' }
          & CustomFields_StringCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'LocaleStringCustomFieldConfig' }
          & CustomFields_LocaleStringCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'IntCustomFieldConfig' }
          & CustomFields_IntCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'FloatCustomFieldConfig' }
          & CustomFields_FloatCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'BooleanCustomFieldConfig' }
          & CustomFields_BooleanCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'DateTimeCustomFieldConfig' }
          & CustomFields_DateTimeCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'RelationCustomFieldConfig' }
          & CustomFields_RelationCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'TextCustomFieldConfig' }
          & CustomFields_TextCustomFieldConfig_Fragment
        )>, ProductOption: Array<(
          { __typename?: 'StringCustomFieldConfig' }
          & CustomFields_StringCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'LocaleStringCustomFieldConfig' }
          & CustomFields_LocaleStringCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'IntCustomFieldConfig' }
          & CustomFields_IntCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'FloatCustomFieldConfig' }
          & CustomFields_FloatCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'BooleanCustomFieldConfig' }
          & CustomFields_BooleanCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'DateTimeCustomFieldConfig' }
          & CustomFields_DateTimeCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'RelationCustomFieldConfig' }
          & CustomFields_RelationCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'TextCustomFieldConfig' }
          & CustomFields_TextCustomFieldConfig_Fragment
        )>, ProductOptionGroup: Array<(
          { __typename?: 'StringCustomFieldConfig' }
          & CustomFields_StringCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'LocaleStringCustomFieldConfig' }
          & CustomFields_LocaleStringCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'IntCustomFieldConfig' }
          & CustomFields_IntCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'FloatCustomFieldConfig' }
          & CustomFields_FloatCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'BooleanCustomFieldConfig' }
          & CustomFields_BooleanCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'DateTimeCustomFieldConfig' }
          & CustomFields_DateTimeCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'RelationCustomFieldConfig' }
          & CustomFields_RelationCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'TextCustomFieldConfig' }
          & CustomFields_TextCustomFieldConfig_Fragment
        )>, ProductVariant: Array<(
          { __typename?: 'StringCustomFieldConfig' }
          & CustomFields_StringCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'LocaleStringCustomFieldConfig' }
          & CustomFields_LocaleStringCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'IntCustomFieldConfig' }
          & CustomFields_IntCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'FloatCustomFieldConfig' }
          & CustomFields_FloatCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'BooleanCustomFieldConfig' }
          & CustomFields_BooleanCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'DateTimeCustomFieldConfig' }
          & CustomFields_DateTimeCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'RelationCustomFieldConfig' }
          & CustomFields_RelationCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'TextCustomFieldConfig' }
          & CustomFields_TextCustomFieldConfig_Fragment
        )>, ShippingMethod: Array<(
          { __typename?: 'StringCustomFieldConfig' }
          & CustomFields_StringCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'LocaleStringCustomFieldConfig' }
          & CustomFields_LocaleStringCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'IntCustomFieldConfig' }
          & CustomFields_IntCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'FloatCustomFieldConfig' }
          & CustomFields_FloatCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'BooleanCustomFieldConfig' }
          & CustomFields_BooleanCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'DateTimeCustomFieldConfig' }
          & CustomFields_DateTimeCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'RelationCustomFieldConfig' }
          & CustomFields_RelationCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'TextCustomFieldConfig' }
          & CustomFields_TextCustomFieldConfig_Fragment
        )>, User: Array<(
          { __typename?: 'StringCustomFieldConfig' }
          & CustomFields_StringCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'LocaleStringCustomFieldConfig' }
          & CustomFields_LocaleStringCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'IntCustomFieldConfig' }
          & CustomFields_IntCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'FloatCustomFieldConfig' }
          & CustomFields_FloatCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'BooleanCustomFieldConfig' }
          & CustomFields_BooleanCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'DateTimeCustomFieldConfig' }
          & CustomFields_DateTimeCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'RelationCustomFieldConfig' }
          & CustomFields_RelationCustomFieldConfig_Fragment
        ) | (
          { __typename?: 'TextCustomFieldConfig' }
          & CustomFields_TextCustomFieldConfig_Fragment
        )> }
      ) }
    ) }
  ) };

export type JobInfoFragment = (
  { __typename?: 'Job' }
  & Pick<Job, 'id' | 'createdAt' | 'startedAt' | 'settledAt' | 'queueName' | 'state' | 'isSettled' | 'progress' | 'duration' | 'data' | 'result' | 'error'>
);

export type GetJobInfoQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetJobInfoQuery = { job?: Maybe<(
    { __typename?: 'Job' }
    & JobInfoFragment
  )> };

export type GetAllJobsQueryVariables = Exact<{
  options?: Maybe<JobListOptions>;
}>;


export type GetAllJobsQuery = { jobs: (
    { __typename?: 'JobList' }
    & Pick<JobList, 'totalItems'>
    & { items: Array<(
      { __typename?: 'Job' }
      & JobInfoFragment
    )> }
  ) };

export type GetJobsByIdQueryVariables = Exact<{
  ids: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type GetJobsByIdQuery = { jobsById: Array<(
    { __typename?: 'Job' }
    & JobInfoFragment
  )> };

export type GetJobQueueListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetJobQueueListQuery = { jobQueues: Array<(
    { __typename?: 'JobQueue' }
    & Pick<JobQueue, 'name' | 'running'>
  )> };

export type CancelJobMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type CancelJobMutation = { cancelJob: (
    { __typename?: 'Job' }
    & JobInfoFragment
  ) };

export type ReindexMutationVariables = Exact<{ [key: string]: never; }>;


export type ReindexMutation = { reindex: (
    { __typename?: 'Job' }
    & JobInfoFragment
  ) };

export type ConfigurableOperationFragment = (
  { __typename?: 'ConfigurableOperation' }
  & Pick<ConfigurableOperation, 'code'>
  & { args: Array<(
    { __typename?: 'ConfigArg' }
    & Pick<ConfigArg, 'name' | 'value'>
  )> }
);

export type ConfigurableOperationDefFragment = (
  { __typename?: 'ConfigurableOperationDefinition' }
  & Pick<ConfigurableOperationDefinition, 'code' | 'description'>
  & { args: Array<(
    { __typename?: 'ConfigArgDefinition' }
    & Pick<ConfigArgDefinition, 'name' | 'type' | 'required' | 'defaultValue' | 'list' | 'ui' | 'label'>
  )> }
);

type ErrorResult_MimeTypeError_Fragment = (
  { __typename?: 'MimeTypeError' }
  & Pick<MimeTypeError, 'errorCode' | 'message'>
);

type ErrorResult_LanguageNotAvailableError_Fragment = (
  { __typename?: 'LanguageNotAvailableError' }
  & Pick<LanguageNotAvailableError, 'errorCode' | 'message'>
);

type ErrorResult_ChannelDefaultLanguageError_Fragment = (
  { __typename?: 'ChannelDefaultLanguageError' }
  & Pick<ChannelDefaultLanguageError, 'errorCode' | 'message'>
);

type ErrorResult_SettlePaymentError_Fragment = (
  { __typename?: 'SettlePaymentError' }
  & Pick<SettlePaymentError, 'errorCode' | 'message'>
);

type ErrorResult_EmptyOrderLineSelectionError_Fragment = (
  { __typename?: 'EmptyOrderLineSelectionError' }
  & Pick<EmptyOrderLineSelectionError, 'errorCode' | 'message'>
);

type ErrorResult_ItemsAlreadyFulfilledError_Fragment = (
  { __typename?: 'ItemsAlreadyFulfilledError' }
  & Pick<ItemsAlreadyFulfilledError, 'errorCode' | 'message'>
);

type ErrorResult_InvalidFulfillmentHandlerError_Fragment = (
  { __typename?: 'InvalidFulfillmentHandlerError' }
  & Pick<InvalidFulfillmentHandlerError, 'errorCode' | 'message'>
);

type ErrorResult_CreateFulfillmentError_Fragment = (
  { __typename?: 'CreateFulfillmentError' }
  & Pick<CreateFulfillmentError, 'errorCode' | 'message'>
);

type ErrorResult_InsufficientStockOnHandError_Fragment = (
  { __typename?: 'InsufficientStockOnHandError' }
  & Pick<InsufficientStockOnHandError, 'errorCode' | 'message'>
);

type ErrorResult_MultipleOrderError_Fragment = (
  { __typename?: 'MultipleOrderError' }
  & Pick<MultipleOrderError, 'errorCode' | 'message'>
);

type ErrorResult_CancelActiveOrderError_Fragment = (
  { __typename?: 'CancelActiveOrderError' }
  & Pick<CancelActiveOrderError, 'errorCode' | 'message'>
);

type ErrorResult_PaymentOrderMismatchError_Fragment = (
  { __typename?: 'PaymentOrderMismatchError' }
  & Pick<PaymentOrderMismatchError, 'errorCode' | 'message'>
);

type ErrorResult_RefundOrderStateError_Fragment = (
  { __typename?: 'RefundOrderStateError' }
  & Pick<RefundOrderStateError, 'errorCode' | 'message'>
);

type ErrorResult_NothingToRefundError_Fragment = (
  { __typename?: 'NothingToRefundError' }
  & Pick<NothingToRefundError, 'errorCode' | 'message'>
);

type ErrorResult_AlreadyRefundedError_Fragment = (
  { __typename?: 'AlreadyRefundedError' }
  & Pick<AlreadyRefundedError, 'errorCode' | 'message'>
);

type ErrorResult_QuantityTooGreatError_Fragment = (
  { __typename?: 'QuantityTooGreatError' }
  & Pick<QuantityTooGreatError, 'errorCode' | 'message'>
);

type ErrorResult_RefundStateTransitionError_Fragment = (
  { __typename?: 'RefundStateTransitionError' }
  & Pick<RefundStateTransitionError, 'errorCode' | 'message'>
);

type ErrorResult_PaymentStateTransitionError_Fragment = (
  { __typename?: 'PaymentStateTransitionError' }
  & Pick<PaymentStateTransitionError, 'errorCode' | 'message'>
);

type ErrorResult_FulfillmentStateTransitionError_Fragment = (
  { __typename?: 'FulfillmentStateTransitionError' }
  & Pick<FulfillmentStateTransitionError, 'errorCode' | 'message'>
);

type ErrorResult_OrderModificationStateError_Fragment = (
  { __typename?: 'OrderModificationStateError' }
  & Pick<OrderModificationStateError, 'errorCode' | 'message'>
);

type ErrorResult_NoChangesSpecifiedError_Fragment = (
  { __typename?: 'NoChangesSpecifiedError' }
  & Pick<NoChangesSpecifiedError, 'errorCode' | 'message'>
);

type ErrorResult_PaymentMethodMissingError_Fragment = (
  { __typename?: 'PaymentMethodMissingError' }
  & Pick<PaymentMethodMissingError, 'errorCode' | 'message'>
);

type ErrorResult_RefundPaymentIdMissingError_Fragment = (
  { __typename?: 'RefundPaymentIdMissingError' }
  & Pick<RefundPaymentIdMissingError, 'errorCode' | 'message'>
);

type ErrorResult_ManualPaymentStateError_Fragment = (
  { __typename?: 'ManualPaymentStateError' }
  & Pick<ManualPaymentStateError, 'errorCode' | 'message'>
);

type ErrorResult_ProductOptionInUseError_Fragment = (
  { __typename?: 'ProductOptionInUseError' }
  & Pick<ProductOptionInUseError, 'errorCode' | 'message'>
);

type ErrorResult_MissingConditionsError_Fragment = (
  { __typename?: 'MissingConditionsError' }
  & Pick<MissingConditionsError, 'errorCode' | 'message'>
);

type ErrorResult_NativeAuthStrategyError_Fragment = (
  { __typename?: 'NativeAuthStrategyError' }
  & Pick<NativeAuthStrategyError, 'errorCode' | 'message'>
);

type ErrorResult_InvalidCredentialsError_Fragment = (
  { __typename?: 'InvalidCredentialsError' }
  & Pick<InvalidCredentialsError, 'errorCode' | 'message'>
);

type ErrorResult_OrderStateTransitionError_Fragment = (
  { __typename?: 'OrderStateTransitionError' }
  & Pick<OrderStateTransitionError, 'errorCode' | 'message'>
);

type ErrorResult_EmailAddressConflictError_Fragment = (
  { __typename?: 'EmailAddressConflictError' }
  & Pick<EmailAddressConflictError, 'errorCode' | 'message'>
);

type ErrorResult_OrderLimitError_Fragment = (
  { __typename?: 'OrderLimitError' }
  & Pick<OrderLimitError, 'errorCode' | 'message'>
);

type ErrorResult_NegativeQuantityError_Fragment = (
  { __typename?: 'NegativeQuantityError' }
  & Pick<NegativeQuantityError, 'errorCode' | 'message'>
);

type ErrorResult_InsufficientStockError_Fragment = (
  { __typename?: 'InsufficientStockError' }
  & Pick<InsufficientStockError, 'errorCode' | 'message'>
);

export type ErrorResultFragment = ErrorResult_MimeTypeError_Fragment | ErrorResult_LanguageNotAvailableError_Fragment | ErrorResult_ChannelDefaultLanguageError_Fragment | ErrorResult_SettlePaymentError_Fragment | ErrorResult_EmptyOrderLineSelectionError_Fragment | ErrorResult_ItemsAlreadyFulfilledError_Fragment | ErrorResult_InvalidFulfillmentHandlerError_Fragment | ErrorResult_CreateFulfillmentError_Fragment | ErrorResult_InsufficientStockOnHandError_Fragment | ErrorResult_MultipleOrderError_Fragment | ErrorResult_CancelActiveOrderError_Fragment | ErrorResult_PaymentOrderMismatchError_Fragment | ErrorResult_RefundOrderStateError_Fragment | ErrorResult_NothingToRefundError_Fragment | ErrorResult_AlreadyRefundedError_Fragment | ErrorResult_QuantityTooGreatError_Fragment | ErrorResult_RefundStateTransitionError_Fragment | ErrorResult_PaymentStateTransitionError_Fragment | ErrorResult_FulfillmentStateTransitionError_Fragment | ErrorResult_OrderModificationStateError_Fragment | ErrorResult_NoChangesSpecifiedError_Fragment | ErrorResult_PaymentMethodMissingError_Fragment | ErrorResult_RefundPaymentIdMissingError_Fragment | ErrorResult_ManualPaymentStateError_Fragment | ErrorResult_ProductOptionInUseError_Fragment | ErrorResult_MissingConditionsError_Fragment | ErrorResult_NativeAuthStrategyError_Fragment | ErrorResult_InvalidCredentialsError_Fragment | ErrorResult_OrderStateTransitionError_Fragment | ErrorResult_EmailAddressConflictError_Fragment | ErrorResult_OrderLimitError_Fragment | ErrorResult_NegativeQuantityError_Fragment | ErrorResult_InsufficientStockError_Fragment;

export type ShippingMethodFragment = (
  { __typename?: 'ShippingMethod' }
  & Pick<ShippingMethod, 'id' | 'createdAt' | 'updatedAt' | 'code' | 'name' | 'description' | 'fulfillmentHandlerCode'>
  & { checker: (
    { __typename?: 'ConfigurableOperation' }
    & ConfigurableOperationFragment
  ), calculator: (
    { __typename?: 'ConfigurableOperation' }
    & ConfigurableOperationFragment
  ), translations: Array<(
    { __typename?: 'ShippingMethodTranslation' }
    & Pick<ShippingMethodTranslation, 'id' | 'languageCode' | 'name' | 'description'>
  )> }
);

export type GetShippingMethodListQueryVariables = Exact<{
  options?: Maybe<ShippingMethodListOptions>;
}>;


export type GetShippingMethodListQuery = { shippingMethods: (
    { __typename?: 'ShippingMethodList' }
    & Pick<ShippingMethodList, 'totalItems'>
    & { items: Array<(
      { __typename?: 'ShippingMethod' }
      & ShippingMethodFragment
    )> }
  ) };

export type GetShippingMethodQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetShippingMethodQuery = { shippingMethod?: Maybe<(
    { __typename?: 'ShippingMethod' }
    & ShippingMethodFragment
  )> };

export type GetShippingMethodOperationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetShippingMethodOperationsQuery = { shippingEligibilityCheckers: Array<(
    { __typename?: 'ConfigurableOperationDefinition' }
    & ConfigurableOperationDefFragment
  )>, shippingCalculators: Array<(
    { __typename?: 'ConfigurableOperationDefinition' }
    & ConfigurableOperationDefFragment
  )>, fulfillmentHandlers: Array<(
    { __typename?: 'ConfigurableOperationDefinition' }
    & ConfigurableOperationDefFragment
  )> };

export type CreateShippingMethodMutationVariables = Exact<{
  input: CreateShippingMethodInput;
}>;


export type CreateShippingMethodMutation = { createShippingMethod: (
    { __typename?: 'ShippingMethod' }
    & ShippingMethodFragment
  ) };

export type UpdateShippingMethodMutationVariables = Exact<{
  input: UpdateShippingMethodInput;
}>;


export type UpdateShippingMethodMutation = { updateShippingMethod: (
    { __typename?: 'ShippingMethod' }
    & ShippingMethodFragment
  ) };

export type DeleteShippingMethodMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteShippingMethodMutation = { deleteShippingMethod: (
    { __typename?: 'DeletionResponse' }
    & Pick<DeletionResponse, 'result' | 'message'>
  ) };

export type TestShippingMethodQueryVariables = Exact<{
  input: TestShippingMethodInput;
}>;


export type TestShippingMethodQuery = { testShippingMethod: (
    { __typename?: 'TestShippingMethodResult' }
    & Pick<TestShippingMethodResult, 'eligible'>
    & { quote?: Maybe<(
      { __typename?: 'TestShippingMethodQuote' }
      & Pick<TestShippingMethodQuote, 'price' | 'priceWithTax' | 'metadata'>
    )> }
  ) };

export type TestEligibleShippingMethodsQueryVariables = Exact<{
  input: TestEligibleShippingMethodsInput;
}>;


export type TestEligibleShippingMethodsQuery = { testEligibleShippingMethods: Array<(
    { __typename?: 'ShippingMethodQuote' }
    & Pick<ShippingMethodQuote, 'id' | 'name' | 'code' | 'description' | 'price' | 'priceWithTax' | 'metadata'>
  )> };

type DiscriminateUnion<T, U> = T extends U ? T : never;

export namespace Role {
  export type Fragment = RoleFragment;
  export type Channels = NonNullable<(NonNullable<RoleFragment['channels']>)[number]>;
}

export namespace Administrator {
  export type Fragment = AdministratorFragment;
  export type User = (NonNullable<AdministratorFragment['user']>);
  export type Roles = NonNullable<(NonNullable<(NonNullable<AdministratorFragment['user']>)['roles']>)[number]>;
}

export namespace GetAdministrators {
  export type Variables = GetAdministratorsQueryVariables;
  export type Query = GetAdministratorsQuery;
  export type Administrators = (NonNullable<GetAdministratorsQuery['administrators']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetAdministratorsQuery['administrators']>)['items']>)[number]>;
}

export namespace GetActiveAdministrator {
  export type Variables = GetActiveAdministratorQueryVariables;
  export type Query = GetActiveAdministratorQuery;
  export type ActiveAdministrator = (NonNullable<GetActiveAdministratorQuery['activeAdministrator']>);
}

export namespace GetAdministrator {
  export type Variables = GetAdministratorQueryVariables;
  export type Query = GetAdministratorQuery;
  export type Administrator = (NonNullable<GetAdministratorQuery['administrator']>);
}

export namespace CreateAdministrator {
  export type Variables = CreateAdministratorMutationVariables;
  export type Mutation = CreateAdministratorMutation;
  export type CreateAdministrator = (NonNullable<CreateAdministratorMutation['createAdministrator']>);
}

export namespace UpdateAdministrator {
  export type Variables = UpdateAdministratorMutationVariables;
  export type Mutation = UpdateAdministratorMutation;
  export type UpdateAdministrator = (NonNullable<UpdateAdministratorMutation['updateAdministrator']>);
}

export namespace UpdateActiveAdministrator {
  export type Variables = UpdateActiveAdministratorMutationVariables;
  export type Mutation = UpdateActiveAdministratorMutation;
  export type UpdateActiveAdministrator = (NonNullable<UpdateActiveAdministratorMutation['updateActiveAdministrator']>);
}

export namespace DeleteAdministrator {
  export type Variables = DeleteAdministratorMutationVariables;
  export type Mutation = DeleteAdministratorMutation;
  export type DeleteAdministrator = (NonNullable<DeleteAdministratorMutation['deleteAdministrator']>);
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

export namespace CreateRole {
  export type Variables = CreateRoleMutationVariables;
  export type Mutation = CreateRoleMutation;
  export type CreateRole = (NonNullable<CreateRoleMutation['createRole']>);
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

export namespace AssignRoleToAdministrator {
  export type Variables = AssignRoleToAdministratorMutationVariables;
  export type Mutation = AssignRoleToAdministratorMutation;
  export type AssignRoleToAdministrator = (NonNullable<AssignRoleToAdministratorMutation['assignRoleToAdministrator']>);
}

export namespace CurrentUser {
  export type Fragment = CurrentUserFragment;
  export type Channels = NonNullable<(NonNullable<CurrentUserFragment['channels']>)[number]>;
}

export namespace AttemptLogin {
  export type Variables = AttemptLoginMutationVariables;
  export type Mutation = AttemptLoginMutation;
  export type Login = (NonNullable<AttemptLoginMutation['login']>);
}

export namespace LogOut {
  export type Variables = LogOutMutationVariables;
  export type Mutation = LogOutMutation;
  export type Logout = (NonNullable<LogOutMutation['logout']>);
}

export namespace GetCurrentUser {
  export type Variables = GetCurrentUserQueryVariables;
  export type Query = GetCurrentUserQuery;
  export type Me = (NonNullable<GetCurrentUserQuery['me']>);
}

export namespace RequestStarted {
  export type Variables = RequestStartedMutationVariables;
  export type Mutation = RequestStartedMutation;
}

export namespace RequestCompleted {
  export type Variables = RequestCompletedMutationVariables;
  export type Mutation = RequestCompletedMutation;
}

export namespace UserStatus {
  export type Fragment = UserStatusFragment;
  export type Channels = NonNullable<(NonNullable<UserStatusFragment['channels']>)[number]>;
}

export namespace SetAsLoggedIn {
  export type Variables = SetAsLoggedInMutationVariables;
  export type Mutation = SetAsLoggedInMutation;
  export type SetAsLoggedIn = (NonNullable<SetAsLoggedInMutation['setAsLoggedIn']>);
}

export namespace SetAsLoggedOut {
  export type Variables = SetAsLoggedOutMutationVariables;
  export type Mutation = SetAsLoggedOutMutation;
  export type SetAsLoggedOut = (NonNullable<SetAsLoggedOutMutation['setAsLoggedOut']>);
}

export namespace SetUiLanguage {
  export type Variables = SetUiLanguageMutationVariables;
  export type Mutation = SetUiLanguageMutation;
}

export namespace SetContentLanguage {
  export type Variables = SetContentLanguageMutationVariables;
  export type Mutation = SetContentLanguageMutation;
}

export namespace SetUiTheme {
  export type Variables = SetUiThemeMutationVariables;
  export type Mutation = SetUiThemeMutation;
}

export namespace GetNetworkStatus {
  export type Variables = GetNetworkStatusQueryVariables;
  export type Query = GetNetworkStatusQuery;
  export type NetworkStatus = (NonNullable<GetNetworkStatusQuery['networkStatus']>);
}

export namespace GetUserStatus {
  export type Variables = GetUserStatusQueryVariables;
  export type Query = GetUserStatusQuery;
  export type UserStatus = (NonNullable<GetUserStatusQuery['userStatus']>);
}

export namespace GetUiState {
  export type Variables = GetUiStateQueryVariables;
  export type Query = GetUiStateQuery;
  export type UiState = (NonNullable<GetUiStateQuery['uiState']>);
}

export namespace GetClientState {
  export type Variables = GetClientStateQueryVariables;
  export type Query = GetClientStateQuery;
  export type NetworkStatus = (NonNullable<GetClientStateQuery['networkStatus']>);
  export type UserStatus = (NonNullable<GetClientStateQuery['userStatus']>);
  export type UiState = (NonNullable<GetClientStateQuery['uiState']>);
}

export namespace SetActiveChannel {
  export type Variables = SetActiveChannelMutationVariables;
  export type Mutation = SetActiveChannelMutation;
  export type SetActiveChannel = (NonNullable<SetActiveChannelMutation['setActiveChannel']>);
}

export namespace UpdateUserChannels {
  export type Variables = UpdateUserChannelsMutationVariables;
  export type Mutation = UpdateUserChannelsMutation;
  export type UpdateUserChannels = (NonNullable<UpdateUserChannelsMutation['updateUserChannels']>);
}

export namespace GetCollectionFilters {
  export type Variables = GetCollectionFiltersQueryVariables;
  export type Query = GetCollectionFiltersQuery;
  export type CollectionFilters = NonNullable<(NonNullable<GetCollectionFiltersQuery['collectionFilters']>)[number]>;
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

export namespace GetCollectionList {
  export type Variables = GetCollectionListQueryVariables;
  export type Query = GetCollectionListQuery;
  export type Collections = (NonNullable<GetCollectionListQuery['collections']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetCollectionListQuery['collections']>)['items']>)[number]>;
  export type FeaturedAsset = (NonNullable<NonNullable<(NonNullable<(NonNullable<GetCollectionListQuery['collections']>)['items']>)[number]>['featuredAsset']>);
  export type Parent = (NonNullable<NonNullable<(NonNullable<(NonNullable<GetCollectionListQuery['collections']>)['items']>)[number]>['parent']>);
}

export namespace GetCollection {
  export type Variables = GetCollectionQueryVariables;
  export type Query = GetCollectionQuery;
  export type Collection = (NonNullable<GetCollectionQuery['collection']>);
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

export namespace MoveCollection {
  export type Variables = MoveCollectionMutationVariables;
  export type Mutation = MoveCollectionMutation;
  export type MoveCollection = (NonNullable<MoveCollectionMutation['moveCollection']>);
}

export namespace DeleteCollection {
  export type Variables = DeleteCollectionMutationVariables;
  export type Mutation = DeleteCollectionMutation;
  export type DeleteCollection = (NonNullable<DeleteCollectionMutation['deleteCollection']>);
}

export namespace GetCollectionContents {
  export type Variables = GetCollectionContentsQueryVariables;
  export type Query = GetCollectionContentsQuery;
  export type Collection = (NonNullable<GetCollectionContentsQuery['collection']>);
  export type ProductVariants = (NonNullable<(NonNullable<GetCollectionContentsQuery['collection']>)['productVariants']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<(NonNullable<GetCollectionContentsQuery['collection']>)['productVariants']>)['items']>)[number]>;
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

export namespace GetCustomerList {
  export type Variables = GetCustomerListQueryVariables;
  export type Query = GetCustomerListQuery;
  export type Customers = (NonNullable<GetCustomerListQuery['customers']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetCustomerListQuery['customers']>)['items']>)[number]>;
  export type User = (NonNullable<NonNullable<(NonNullable<(NonNullable<GetCustomerListQuery['customers']>)['items']>)[number]>['user']>);
}

export namespace GetCustomer {
  export type Variables = GetCustomerQueryVariables;
  export type Query = GetCustomerQuery;
  export type Customer = (NonNullable<GetCustomerQuery['customer']>);
  export type Groups = NonNullable<(NonNullable<(NonNullable<GetCustomerQuery['customer']>)['groups']>)[number]>;
  export type Orders = (NonNullable<(NonNullable<GetCustomerQuery['customer']>)['orders']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<(NonNullable<GetCustomerQuery['customer']>)['orders']>)['items']>)[number]>;
}

export namespace CreateCustomer {
  export type Variables = CreateCustomerMutationVariables;
  export type Mutation = CreateCustomerMutation;
  export type CreateCustomer = (NonNullable<CreateCustomerMutation['createCustomer']>);
}

export namespace UpdateCustomer {
  export type Variables = UpdateCustomerMutationVariables;
  export type Mutation = UpdateCustomerMutation;
  export type UpdateCustomer = (NonNullable<UpdateCustomerMutation['updateCustomer']>);
}

export namespace DeleteCustomer {
  export type Variables = DeleteCustomerMutationVariables;
  export type Mutation = DeleteCustomerMutation;
  export type DeleteCustomer = (NonNullable<DeleteCustomerMutation['deleteCustomer']>);
}

export namespace CreateCustomerAddress {
  export type Variables = CreateCustomerAddressMutationVariables;
  export type Mutation = CreateCustomerAddressMutation;
  export type CreateCustomerAddress = (NonNullable<CreateCustomerAddressMutation['createCustomerAddress']>);
}

export namespace UpdateCustomerAddress {
  export type Variables = UpdateCustomerAddressMutationVariables;
  export type Mutation = UpdateCustomerAddressMutation;
  export type UpdateCustomerAddress = (NonNullable<UpdateCustomerAddressMutation['updateCustomerAddress']>);
}

export namespace CreateCustomerGroup {
  export type Variables = CreateCustomerGroupMutationVariables;
  export type Mutation = CreateCustomerGroupMutation;
  export type CreateCustomerGroup = (NonNullable<CreateCustomerGroupMutation['createCustomerGroup']>);
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

export namespace GetCustomerGroupWithCustomers {
  export type Variables = GetCustomerGroupWithCustomersQueryVariables;
  export type Query = GetCustomerGroupWithCustomersQuery;
  export type CustomerGroup = (NonNullable<GetCustomerGroupWithCustomersQuery['customerGroup']>);
  export type Customers = (NonNullable<(NonNullable<GetCustomerGroupWithCustomersQuery['customerGroup']>)['customers']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<(NonNullable<GetCustomerGroupWithCustomersQuery['customerGroup']>)['customers']>)['items']>)[number]>;
}

export namespace AddCustomersToGroup {
  export type Variables = AddCustomersToGroupMutationVariables;
  export type Mutation = AddCustomersToGroupMutation;
  export type AddCustomersToGroup = (NonNullable<AddCustomersToGroupMutation['addCustomersToGroup']>);
}

export namespace RemoveCustomersFromGroup {
  export type Variables = RemoveCustomersFromGroupMutationVariables;
  export type Mutation = RemoveCustomersFromGroupMutation;
  export type RemoveCustomersFromGroup = (NonNullable<RemoveCustomersFromGroupMutation['removeCustomersFromGroup']>);
}

export namespace GetCustomerHistory {
  export type Variables = GetCustomerHistoryQueryVariables;
  export type Query = GetCustomerHistoryQuery;
  export type Customer = (NonNullable<GetCustomerHistoryQuery['customer']>);
  export type History = (NonNullable<(NonNullable<GetCustomerHistoryQuery['customer']>)['history']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<(NonNullable<GetCustomerHistoryQuery['customer']>)['history']>)['items']>)[number]>;
  export type Administrator = (NonNullable<NonNullable<(NonNullable<(NonNullable<(NonNullable<GetCustomerHistoryQuery['customer']>)['history']>)['items']>)[number]>['administrator']>);
}

export namespace AddNoteToCustomer {
  export type Variables = AddNoteToCustomerMutationVariables;
  export type Mutation = AddNoteToCustomerMutation;
  export type AddNoteToCustomer = (NonNullable<AddNoteToCustomerMutation['addNoteToCustomer']>);
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

export namespace DeleteFacet {
  export type Variables = DeleteFacetMutationVariables;
  export type Mutation = DeleteFacetMutation;
  export type DeleteFacet = (NonNullable<DeleteFacetMutation['deleteFacet']>);
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

export namespace DeleteFacetValues {
  export type Variables = DeleteFacetValuesMutationVariables;
  export type Mutation = DeleteFacetValuesMutation;
  export type DeleteFacetValues = NonNullable<(NonNullable<DeleteFacetValuesMutation['deleteFacetValues']>)[number]>;
}

export namespace GetFacetList {
  export type Variables = GetFacetListQueryVariables;
  export type Query = GetFacetListQuery;
  export type Facets = (NonNullable<GetFacetListQuery['facets']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetFacetListQuery['facets']>)['items']>)[number]>;
}

export namespace GetFacetWithValues {
  export type Variables = GetFacetWithValuesQueryVariables;
  export type Query = GetFacetWithValuesQuery;
  export type Facet = (NonNullable<GetFacetWithValuesQuery['facet']>);
}

export namespace Discount {
  export type Fragment = DiscountFragment;
}

export namespace Refund {
  export type Fragment = RefundFragment;
}

export namespace OrderAddress {
  export type Fragment = OrderAddressFragment;
}

export namespace Order {
  export type Fragment = OrderFragment;
  export type Customer = (NonNullable<OrderFragment['customer']>);
  export type ShippingLines = NonNullable<(NonNullable<OrderFragment['shippingLines']>)[number]>;
  export type ShippingMethod = (NonNullable<NonNullable<(NonNullable<OrderFragment['shippingLines']>)[number]>['shippingMethod']>);
}

export namespace Fulfillment {
  export type Fragment = FulfillmentFragment;
  export type OrderItems = NonNullable<(NonNullable<FulfillmentFragment['orderItems']>)[number]>;
}

export namespace OrderLine {
  export type Fragment = OrderLineFragment;
  export type FeaturedAsset = (NonNullable<OrderLineFragment['featuredAsset']>);
  export type ProductVariant = (NonNullable<OrderLineFragment['productVariant']>);
  export type Discounts = NonNullable<(NonNullable<OrderLineFragment['discounts']>)[number]>;
  export type Items = NonNullable<(NonNullable<OrderLineFragment['items']>)[number]>;
  export type Fulfillment = (NonNullable<NonNullable<(NonNullable<OrderLineFragment['items']>)[number]>['fulfillment']>);
}

export namespace OrderDetail {
  export type Fragment = OrderDetailFragment;
  export type Customer = (NonNullable<OrderDetailFragment['customer']>);
  export type Lines = NonNullable<(NonNullable<OrderDetailFragment['lines']>)[number]>;
  export type Surcharges = NonNullable<(NonNullable<OrderDetailFragment['surcharges']>)[number]>;
  export type Discounts = NonNullable<(NonNullable<OrderDetailFragment['discounts']>)[number]>;
  export type Promotions = NonNullable<(NonNullable<OrderDetailFragment['promotions']>)[number]>;
  export type ShippingLines = NonNullable<(NonNullable<OrderDetailFragment['shippingLines']>)[number]>;
  export type ShippingMethod = (NonNullable<NonNullable<(NonNullable<OrderDetailFragment['shippingLines']>)[number]>['shippingMethod']>);
  export type TaxSummary = NonNullable<(NonNullable<OrderDetailFragment['taxSummary']>)[number]>;
  export type ShippingAddress = (NonNullable<OrderDetailFragment['shippingAddress']>);
  export type BillingAddress = (NonNullable<OrderDetailFragment['billingAddress']>);
  export type Payments = NonNullable<(NonNullable<OrderDetailFragment['payments']>)[number]>;
  export type Refunds = NonNullable<(NonNullable<NonNullable<(NonNullable<OrderDetailFragment['payments']>)[number]>['refunds']>)[number]>;
  export type OrderItems = NonNullable<(NonNullable<NonNullable<(NonNullable<NonNullable<(NonNullable<OrderDetailFragment['payments']>)[number]>['refunds']>)[number]>['orderItems']>)[number]>;
  export type Fulfillments = NonNullable<(NonNullable<OrderDetailFragment['fulfillments']>)[number]>;
  export type Modifications = NonNullable<(NonNullable<OrderDetailFragment['modifications']>)[number]>;
  export type Payment = (NonNullable<NonNullable<(NonNullable<OrderDetailFragment['modifications']>)[number]>['payment']>);
  export type _OrderItems = NonNullable<(NonNullable<NonNullable<(NonNullable<OrderDetailFragment['modifications']>)[number]>['orderItems']>)[number]>;
  export type Refund = (NonNullable<NonNullable<(NonNullable<OrderDetailFragment['modifications']>)[number]>['refund']>);
  export type _Surcharges = NonNullable<(NonNullable<NonNullable<(NonNullable<OrderDetailFragment['modifications']>)[number]>['surcharges']>)[number]>;
}

export namespace GetOrderList {
  export type Variables = GetOrderListQueryVariables;
  export type Query = GetOrderListQuery;
  export type Orders = (NonNullable<GetOrderListQuery['orders']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetOrderListQuery['orders']>)['items']>)[number]>;
}

export namespace GetOrder {
  export type Variables = GetOrderQueryVariables;
  export type Query = GetOrderQuery;
  export type Order = (NonNullable<GetOrderQuery['order']>);
}

export namespace SettlePayment {
  export type Variables = SettlePaymentMutationVariables;
  export type Mutation = SettlePaymentMutation;
  export type SettlePayment = (NonNullable<SettlePaymentMutation['settlePayment']>);
  export type PaymentInlineFragment = (DiscriminateUnion<(NonNullable<SettlePaymentMutation['settlePayment']>), { __typename?: 'Payment' }>);
  export type SettlePaymentErrorInlineFragment = (DiscriminateUnion<(NonNullable<SettlePaymentMutation['settlePayment']>), { __typename?: 'SettlePaymentError' }>);
  export type PaymentStateTransitionErrorInlineFragment = (DiscriminateUnion<(NonNullable<SettlePaymentMutation['settlePayment']>), { __typename?: 'PaymentStateTransitionError' }>);
  export type OrderStateTransitionErrorInlineFragment = (DiscriminateUnion<(NonNullable<SettlePaymentMutation['settlePayment']>), { __typename?: 'OrderStateTransitionError' }>);
}

export namespace TransitionPaymentToState {
  export type Variables = TransitionPaymentToStateMutationVariables;
  export type Mutation = TransitionPaymentToStateMutation;
  export type TransitionPaymentToState = (NonNullable<TransitionPaymentToStateMutation['transitionPaymentToState']>);
  export type PaymentInlineFragment = (DiscriminateUnion<(NonNullable<TransitionPaymentToStateMutation['transitionPaymentToState']>), { __typename?: 'Payment' }>);
  export type PaymentStateTransitionErrorInlineFragment = (DiscriminateUnion<(NonNullable<TransitionPaymentToStateMutation['transitionPaymentToState']>), { __typename?: 'PaymentStateTransitionError' }>);
}

export namespace CreateFulfillment {
  export type Variables = CreateFulfillmentMutationVariables;
  export type Mutation = CreateFulfillmentMutation;
  export type AddFulfillmentToOrder = (NonNullable<CreateFulfillmentMutation['addFulfillmentToOrder']>);
  export type CreateFulfillmentErrorInlineFragment = (DiscriminateUnion<(NonNullable<CreateFulfillmentMutation['addFulfillmentToOrder']>), { __typename?: 'CreateFulfillmentError' }>);
  export type FulfillmentStateTransitionErrorInlineFragment = (DiscriminateUnion<(NonNullable<CreateFulfillmentMutation['addFulfillmentToOrder']>), { __typename?: 'FulfillmentStateTransitionError' }>);
}

export namespace CancelOrder {
  export type Variables = CancelOrderMutationVariables;
  export type Mutation = CancelOrderMutation;
  export type CancelOrder = (NonNullable<CancelOrderMutation['cancelOrder']>);
}

export namespace RefundOrder {
  export type Variables = RefundOrderMutationVariables;
  export type Mutation = RefundOrderMutation;
  export type RefundOrder = (NonNullable<RefundOrderMutation['refundOrder']>);
}

export namespace SettleRefund {
  export type Variables = SettleRefundMutationVariables;
  export type Mutation = SettleRefundMutation;
  export type SettleRefund = (NonNullable<SettleRefundMutation['settleRefund']>);
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

export namespace TransitionOrderToState {
  export type Variables = TransitionOrderToStateMutationVariables;
  export type Mutation = TransitionOrderToStateMutation;
  export type TransitionOrderToState = (NonNullable<TransitionOrderToStateMutation['transitionOrderToState']>);
  export type OrderStateTransitionErrorInlineFragment = (DiscriminateUnion<(NonNullable<TransitionOrderToStateMutation['transitionOrderToState']>), { __typename?: 'OrderStateTransitionError' }>);
}

export namespace UpdateOrderCustomFields {
  export type Variables = UpdateOrderCustomFieldsMutationVariables;
  export type Mutation = UpdateOrderCustomFieldsMutation;
  export type SetOrderCustomFields = (NonNullable<UpdateOrderCustomFieldsMutation['setOrderCustomFields']>);
}

export namespace TransitionFulfillmentToState {
  export type Variables = TransitionFulfillmentToStateMutationVariables;
  export type Mutation = TransitionFulfillmentToStateMutation;
  export type TransitionFulfillmentToState = (NonNullable<TransitionFulfillmentToStateMutation['transitionFulfillmentToState']>);
  export type FulfillmentStateTransitionErrorInlineFragment = (DiscriminateUnion<(NonNullable<TransitionFulfillmentToStateMutation['transitionFulfillmentToState']>), { __typename?: 'FulfillmentStateTransitionError' }>);
}

export namespace GetOrderSummary {
  export type Variables = GetOrderSummaryQueryVariables;
  export type Query = GetOrderSummaryQuery;
  export type Orders = (NonNullable<GetOrderSummaryQuery['orders']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetOrderSummaryQuery['orders']>)['items']>)[number]>;
}

export namespace ModifyOrder {
  export type Variables = ModifyOrderMutationVariables;
  export type Mutation = ModifyOrderMutation;
  export type ModifyOrder = (NonNullable<ModifyOrderMutation['modifyOrder']>);
}

export namespace AddManualPayment {
  export type Variables = AddManualPaymentMutationVariables;
  export type Mutation = AddManualPaymentMutation;
  export type AddManualPaymentToOrder = (NonNullable<AddManualPaymentMutation['addManualPaymentToOrder']>);
}

export namespace Asset {
  export type Fragment = AssetFragment;
  export type FocalPoint = (NonNullable<AssetFragment['focalPoint']>);
}

export namespace Tag {
  export type Fragment = TagFragment;
}

export namespace ProductOptionGroup {
  export type Fragment = ProductOptionGroupFragment;
  export type Translations = NonNullable<(NonNullable<ProductOptionGroupFragment['translations']>)[number]>;
}

export namespace ProductOption {
  export type Fragment = ProductOptionFragment;
  export type Translations = NonNullable<(NonNullable<ProductOptionFragment['translations']>)[number]>;
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
  export type Channels = NonNullable<(NonNullable<ProductVariantFragment['channels']>)[number]>;
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

export namespace ProductOptionGroupWithOptions {
  export type Fragment = ProductOptionGroupWithOptionsFragment;
  export type Translations = NonNullable<(NonNullable<ProductOptionGroupWithOptionsFragment['translations']>)[number]>;
  export type Options = NonNullable<(NonNullable<ProductOptionGroupWithOptionsFragment['options']>)[number]>;
  export type _Translations = NonNullable<(NonNullable<NonNullable<(NonNullable<ProductOptionGroupWithOptionsFragment['options']>)[number]>['translations']>)[number]>;
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

export namespace DeleteProduct {
  export type Variables = DeleteProductMutationVariables;
  export type Mutation = DeleteProductMutation;
  export type DeleteProduct = (NonNullable<DeleteProductMutation['deleteProduct']>);
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

export namespace CreateProductOptionGroup {
  export type Variables = CreateProductOptionGroupMutationVariables;
  export type Mutation = CreateProductOptionGroupMutation;
  export type CreateProductOptionGroup = (NonNullable<CreateProductOptionGroupMutation['createProductOptionGroup']>);
}

export namespace GetProductOptionGroup {
  export type Variables = GetProductOptionGroupQueryVariables;
  export type Query = GetProductOptionGroupQuery;
  export type ProductOptionGroup = (NonNullable<GetProductOptionGroupQuery['productOptionGroup']>);
}

export namespace AddOptionToGroup {
  export type Variables = AddOptionToGroupMutationVariables;
  export type Mutation = AddOptionToGroupMutation;
  export type CreateProductOption = (NonNullable<AddOptionToGroupMutation['createProductOption']>);
}

export namespace AddOptionGroupToProduct {
  export type Variables = AddOptionGroupToProductMutationVariables;
  export type Mutation = AddOptionGroupToProductMutation;
  export type AddOptionGroupToProduct = (NonNullable<AddOptionGroupToProductMutation['addOptionGroupToProduct']>);
  export type OptionGroups = NonNullable<(NonNullable<(NonNullable<AddOptionGroupToProductMutation['addOptionGroupToProduct']>)['optionGroups']>)[number]>;
  export type Options = NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<AddOptionGroupToProductMutation['addOptionGroupToProduct']>)['optionGroups']>)[number]>['options']>)[number]>;
}

export namespace RemoveOptionGroupFromProduct {
  export type Variables = RemoveOptionGroupFromProductMutationVariables;
  export type Mutation = RemoveOptionGroupFromProductMutation;
  export type RemoveOptionGroupFromProduct = (NonNullable<RemoveOptionGroupFromProductMutation['removeOptionGroupFromProduct']>);
  export type ProductInlineFragment = (DiscriminateUnion<(NonNullable<RemoveOptionGroupFromProductMutation['removeOptionGroupFromProduct']>), { __typename?: 'Product' }>);
  export type OptionGroups = NonNullable<(NonNullable<(DiscriminateUnion<(NonNullable<RemoveOptionGroupFromProductMutation['removeOptionGroupFromProduct']>), { __typename?: 'Product' }>)['optionGroups']>)[number]>;
  export type Options = NonNullable<(NonNullable<NonNullable<(NonNullable<(DiscriminateUnion<(NonNullable<RemoveOptionGroupFromProductMutation['removeOptionGroupFromProduct']>), { __typename?: 'Product' }>)['optionGroups']>)[number]>['options']>)[number]>;
}

export namespace GetProductWithVariants {
  export type Variables = GetProductWithVariantsQueryVariables;
  export type Query = GetProductWithVariantsQuery;
  export type Product = (NonNullable<GetProductWithVariantsQuery['product']>);
}

export namespace GetProductSimple {
  export type Variables = GetProductSimpleQueryVariables;
  export type Query = GetProductSimpleQuery;
  export type Product = (NonNullable<GetProductSimpleQuery['product']>);
  export type FeaturedAsset = (NonNullable<(NonNullable<GetProductSimpleQuery['product']>)['featuredAsset']>);
}

export namespace GetProductList {
  export type Variables = GetProductListQueryVariables;
  export type Query = GetProductListQuery;
  export type Products = (NonNullable<GetProductListQuery['products']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetProductListQuery['products']>)['items']>)[number]>;
  export type FeaturedAsset = (NonNullable<NonNullable<(NonNullable<(NonNullable<GetProductListQuery['products']>)['items']>)[number]>['featuredAsset']>);
}

export namespace GetProductOptionGroups {
  export type Variables = GetProductOptionGroupsQueryVariables;
  export type Query = GetProductOptionGroupsQuery;
  export type ProductOptionGroups = NonNullable<(NonNullable<GetProductOptionGroupsQuery['productOptionGroups']>)[number]>;
  export type Options = NonNullable<(NonNullable<NonNullable<(NonNullable<GetProductOptionGroupsQuery['productOptionGroups']>)[number]>['options']>)[number]>;
}

export namespace GetAssetList {
  export type Variables = GetAssetListQueryVariables;
  export type Query = GetAssetListQuery;
  export type Assets = (NonNullable<GetAssetListQuery['assets']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetAssetListQuery['assets']>)['items']>)[number]>;
  export type Tags = NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<GetAssetListQuery['assets']>)['items']>)[number]>['tags']>)[number]>;
}

export namespace GetAsset {
  export type Variables = GetAssetQueryVariables;
  export type Query = GetAssetQuery;
  export type Asset = (NonNullable<GetAssetQuery['asset']>);
  export type Tags = NonNullable<(NonNullable<(NonNullable<GetAssetQuery['asset']>)['tags']>)[number]>;
}

export namespace CreateAssets {
  export type Variables = CreateAssetsMutationVariables;
  export type Mutation = CreateAssetsMutation;
  export type CreateAssets = NonNullable<(NonNullable<CreateAssetsMutation['createAssets']>)[number]>;
  export type AssetInlineFragment = (DiscriminateUnion<NonNullable<(NonNullable<CreateAssetsMutation['createAssets']>)[number]>, { __typename?: 'Asset' }>);
  export type Tags = NonNullable<(NonNullable<(DiscriminateUnion<NonNullable<(NonNullable<CreateAssetsMutation['createAssets']>)[number]>, { __typename?: 'Asset' }>)['tags']>)[number]>;
  export type ErrorResultInlineFragment = (DiscriminateUnion<NonNullable<(NonNullable<CreateAssetsMutation['createAssets']>)[number]>, { __typename?: 'ErrorResult' }>);
}

export namespace UpdateAsset {
  export type Variables = UpdateAssetMutationVariables;
  export type Mutation = UpdateAssetMutation;
  export type UpdateAsset = (NonNullable<UpdateAssetMutation['updateAsset']>);
  export type Tags = NonNullable<(NonNullable<(NonNullable<UpdateAssetMutation['updateAsset']>)['tags']>)[number]>;
}

export namespace DeleteAssets {
  export type Variables = DeleteAssetsMutationVariables;
  export type Mutation = DeleteAssetsMutation;
  export type DeleteAssets = (NonNullable<DeleteAssetsMutation['deleteAssets']>);
}

export namespace SearchProducts {
  export type Variables = SearchProductsQueryVariables;
  export type Query = SearchProductsQuery;
  export type Search = (NonNullable<SearchProductsQuery['search']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<SearchProductsQuery['search']>)['items']>)[number]>;
  export type ProductAsset = (NonNullable<NonNullable<(NonNullable<(NonNullable<SearchProductsQuery['search']>)['items']>)[number]>['productAsset']>);
  export type FocalPoint = (NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<SearchProductsQuery['search']>)['items']>)[number]>['productAsset']>)['focalPoint']>);
  export type ProductVariantAsset = (NonNullable<NonNullable<(NonNullable<(NonNullable<SearchProductsQuery['search']>)['items']>)[number]>['productVariantAsset']>);
  export type _FocalPoint = (NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<SearchProductsQuery['search']>)['items']>)[number]>['productVariantAsset']>)['focalPoint']>);
  export type FacetValues = NonNullable<(NonNullable<(NonNullable<SearchProductsQuery['search']>)['facetValues']>)[number]>;
  export type FacetValue = (NonNullable<NonNullable<(NonNullable<(NonNullable<SearchProductsQuery['search']>)['facetValues']>)[number]>['facetValue']>);
  export type Facet = (NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<SearchProductsQuery['search']>)['facetValues']>)[number]>['facetValue']>)['facet']>);
}

export namespace ProductSelectorSearch {
  export type Variables = ProductSelectorSearchQueryVariables;
  export type Query = ProductSelectorSearchQuery;
  export type Search = (NonNullable<ProductSelectorSearchQuery['search']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<ProductSelectorSearchQuery['search']>)['items']>)[number]>;
  export type ProductAsset = (NonNullable<NonNullable<(NonNullable<(NonNullable<ProductSelectorSearchQuery['search']>)['items']>)[number]>['productAsset']>);
  export type FocalPoint = (NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<ProductSelectorSearchQuery['search']>)['items']>)[number]>['productAsset']>)['focalPoint']>);
  export type Price = (NonNullable<NonNullable<(NonNullable<(NonNullable<ProductSelectorSearchQuery['search']>)['items']>)[number]>['price']>);
  export type SinglePriceInlineFragment = (DiscriminateUnion<(NonNullable<NonNullable<(NonNullable<(NonNullable<ProductSelectorSearchQuery['search']>)['items']>)[number]>['price']>), { __typename?: 'SinglePrice' }>);
  export type PriceWithTax = (NonNullable<NonNullable<(NonNullable<(NonNullable<ProductSelectorSearchQuery['search']>)['items']>)[number]>['priceWithTax']>);
  export type _SinglePriceInlineFragment = (DiscriminateUnion<(NonNullable<NonNullable<(NonNullable<(NonNullable<ProductSelectorSearchQuery['search']>)['items']>)[number]>['priceWithTax']>), { __typename?: 'SinglePrice' }>);
}

export namespace UpdateProductOption {
  export type Variables = UpdateProductOptionMutationVariables;
  export type Mutation = UpdateProductOptionMutation;
  export type UpdateProductOption = (NonNullable<UpdateProductOptionMutation['updateProductOption']>);
}

export namespace DeleteProductVariant {
  export type Variables = DeleteProductVariantMutationVariables;
  export type Mutation = DeleteProductVariantMutation;
  export type DeleteProductVariant = (NonNullable<DeleteProductVariantMutation['deleteProductVariant']>);
}

export namespace GetProductVariantOptions {
  export type Variables = GetProductVariantOptionsQueryVariables;
  export type Query = GetProductVariantOptionsQuery;
  export type Product = (NonNullable<GetProductVariantOptionsQuery['product']>);
  export type OptionGroups = NonNullable<(NonNullable<(NonNullable<GetProductVariantOptionsQuery['product']>)['optionGroups']>)[number]>;
  export type Options = NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<GetProductVariantOptionsQuery['product']>)['optionGroups']>)[number]>['options']>)[number]>;
  export type Variants = NonNullable<(NonNullable<(NonNullable<GetProductVariantOptionsQuery['product']>)['variants']>)[number]>;
  export type _Options = NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<GetProductVariantOptionsQuery['product']>)['variants']>)[number]>['options']>)[number]>;
}

export namespace AssignProductsToChannel {
  export type Variables = AssignProductsToChannelMutationVariables;
  export type Mutation = AssignProductsToChannelMutation;
  export type AssignProductsToChannel = NonNullable<(NonNullable<AssignProductsToChannelMutation['assignProductsToChannel']>)[number]>;
  export type Channels = NonNullable<(NonNullable<NonNullable<(NonNullable<AssignProductsToChannelMutation['assignProductsToChannel']>)[number]>['channels']>)[number]>;
}

export namespace AssignVariantsToChannel {
  export type Variables = AssignVariantsToChannelMutationVariables;
  export type Mutation = AssignVariantsToChannelMutation;
  export type AssignProductVariantsToChannel = NonNullable<(NonNullable<AssignVariantsToChannelMutation['assignProductVariantsToChannel']>)[number]>;
  export type Channels = NonNullable<(NonNullable<NonNullable<(NonNullable<AssignVariantsToChannelMutation['assignProductVariantsToChannel']>)[number]>['channels']>)[number]>;
}

export namespace RemoveProductsFromChannel {
  export type Variables = RemoveProductsFromChannelMutationVariables;
  export type Mutation = RemoveProductsFromChannelMutation;
  export type RemoveProductsFromChannel = NonNullable<(NonNullable<RemoveProductsFromChannelMutation['removeProductsFromChannel']>)[number]>;
  export type Channels = NonNullable<(NonNullable<NonNullable<(NonNullable<RemoveProductsFromChannelMutation['removeProductsFromChannel']>)[number]>['channels']>)[number]>;
}

export namespace RemoveVariantsFromChannel {
  export type Variables = RemoveVariantsFromChannelMutationVariables;
  export type Mutation = RemoveVariantsFromChannelMutation;
  export type RemoveProductVariantsFromChannel = NonNullable<(NonNullable<RemoveVariantsFromChannelMutation['removeProductVariantsFromChannel']>)[number]>;
  export type Channels = NonNullable<(NonNullable<NonNullable<(NonNullable<RemoveVariantsFromChannelMutation['removeProductVariantsFromChannel']>)[number]>['channels']>)[number]>;
}

export namespace GetProductVariant {
  export type Variables = GetProductVariantQueryVariables;
  export type Query = GetProductVariantQuery;
  export type ProductVariant = (NonNullable<GetProductVariantQuery['productVariant']>);
  export type FeaturedAsset = (NonNullable<(NonNullable<GetProductVariantQuery['productVariant']>)['featuredAsset']>);
  export type FocalPoint = (NonNullable<(NonNullable<(NonNullable<GetProductVariantQuery['productVariant']>)['featuredAsset']>)['focalPoint']>);
  export type Product = (NonNullable<(NonNullable<GetProductVariantQuery['productVariant']>)['product']>);
  export type _FeaturedAsset = (NonNullable<(NonNullable<(NonNullable<GetProductVariantQuery['productVariant']>)['product']>)['featuredAsset']>);
  export type _FocalPoint = (NonNullable<(NonNullable<(NonNullable<(NonNullable<GetProductVariantQuery['productVariant']>)['product']>)['featuredAsset']>)['focalPoint']>);
}

export namespace GetProductVariantList {
  export type Variables = GetProductVariantListQueryVariables;
  export type Query = GetProductVariantListQuery;
  export type ProductVariants = (NonNullable<GetProductVariantListQuery['productVariants']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetProductVariantListQuery['productVariants']>)['items']>)[number]>;
  export type FeaturedAsset = (NonNullable<NonNullable<(NonNullable<(NonNullable<GetProductVariantListQuery['productVariants']>)['items']>)[number]>['featuredAsset']>);
  export type FocalPoint = (NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<GetProductVariantListQuery['productVariants']>)['items']>)[number]>['featuredAsset']>)['focalPoint']>);
  export type Product = (NonNullable<NonNullable<(NonNullable<(NonNullable<GetProductVariantListQuery['productVariants']>)['items']>)[number]>['product']>);
  export type _FeaturedAsset = (NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<GetProductVariantListQuery['productVariants']>)['items']>)[number]>['product']>)['featuredAsset']>);
  export type _FocalPoint = (NonNullable<(NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<GetProductVariantListQuery['productVariants']>)['items']>)[number]>['product']>)['featuredAsset']>)['focalPoint']>);
}

export namespace GetTagList {
  export type Variables = GetTagListQueryVariables;
  export type Query = GetTagListQuery;
  export type Tags = (NonNullable<GetTagListQuery['tags']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetTagListQuery['tags']>)['items']>)[number]>;
}

export namespace GetTag {
  export type Variables = GetTagQueryVariables;
  export type Query = GetTagQuery;
  export type Tag = (NonNullable<GetTagQuery['tag']>);
}

export namespace CreateTag {
  export type Variables = CreateTagMutationVariables;
  export type Mutation = CreateTagMutation;
  export type CreateTag = (NonNullable<CreateTagMutation['createTag']>);
}

export namespace UpdateTag {
  export type Variables = UpdateTagMutationVariables;
  export type Mutation = UpdateTagMutation;
  export type UpdateTag = (NonNullable<UpdateTagMutation['updateTag']>);
}

export namespace DeleteTag {
  export type Variables = DeleteTagMutationVariables;
  export type Mutation = DeleteTagMutation;
  export type DeleteTag = (NonNullable<DeleteTagMutation['deleteTag']>);
}

export namespace Promotion {
  export type Fragment = PromotionFragment;
  export type Conditions = NonNullable<(NonNullable<PromotionFragment['conditions']>)[number]>;
  export type Actions = NonNullable<(NonNullable<PromotionFragment['actions']>)[number]>;
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

export namespace GetAdjustmentOperations {
  export type Variables = GetAdjustmentOperationsQueryVariables;
  export type Query = GetAdjustmentOperationsQuery;
  export type PromotionConditions = NonNullable<(NonNullable<GetAdjustmentOperationsQuery['promotionConditions']>)[number]>;
  export type PromotionActions = NonNullable<(NonNullable<GetAdjustmentOperationsQuery['promotionActions']>)[number]>;
}

export namespace CreatePromotion {
  export type Variables = CreatePromotionMutationVariables;
  export type Mutation = CreatePromotionMutation;
  export type CreatePromotion = (NonNullable<CreatePromotionMutation['createPromotion']>);
}

export namespace UpdatePromotion {
  export type Variables = UpdatePromotionMutationVariables;
  export type Mutation = UpdatePromotionMutation;
  export type UpdatePromotion = (NonNullable<UpdatePromotionMutation['updatePromotion']>);
}

export namespace DeletePromotion {
  export type Variables = DeletePromotionMutationVariables;
  export type Mutation = DeletePromotionMutation;
  export type DeletePromotion = (NonNullable<DeletePromotionMutation['deletePromotion']>);
}

export namespace Country {
  export type Fragment = CountryFragment;
  export type Translations = NonNullable<(NonNullable<CountryFragment['translations']>)[number]>;
}

export namespace GetCountryList {
  export type Variables = GetCountryListQueryVariables;
  export type Query = GetCountryListQuery;
  export type Countries = (NonNullable<GetCountryListQuery['countries']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetCountryListQuery['countries']>)['items']>)[number]>;
}

export namespace GetAvailableCountries {
  export type Variables = GetAvailableCountriesQueryVariables;
  export type Query = GetAvailableCountriesQuery;
  export type Countries = (NonNullable<GetAvailableCountriesQuery['countries']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetAvailableCountriesQuery['countries']>)['items']>)[number]>;
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

export namespace UpdateCountry {
  export type Variables = UpdateCountryMutationVariables;
  export type Mutation = UpdateCountryMutation;
  export type UpdateCountry = (NonNullable<UpdateCountryMutation['updateCountry']>);
}

export namespace DeleteCountry {
  export type Variables = DeleteCountryMutationVariables;
  export type Mutation = DeleteCountryMutation;
  export type DeleteCountry = (NonNullable<DeleteCountryMutation['deleteCountry']>);
}

export namespace Zone {
  export type Fragment = ZoneFragment;
  export type Members = NonNullable<(NonNullable<ZoneFragment['members']>)[number]>;
}

export namespace GetZones {
  export type Variables = GetZonesQueryVariables;
  export type Query = GetZonesQuery;
  export type Zones = NonNullable<(NonNullable<GetZonesQuery['zones']>)[number]>;
  export type Members = NonNullable<(NonNullable<NonNullable<(NonNullable<GetZonesQuery['zones']>)[number]>['members']>)[number]>;
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

export namespace DeleteZone {
  export type Variables = DeleteZoneMutationVariables;
  export type Mutation = DeleteZoneMutation;
  export type DeleteZone = (NonNullable<DeleteZoneMutation['deleteZone']>);
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

export namespace TaxCategory {
  export type Fragment = TaxCategoryFragment;
}

export namespace GetTaxCategories {
  export type Variables = GetTaxCategoriesQueryVariables;
  export type Query = GetTaxCategoriesQuery;
  export type TaxCategories = NonNullable<(NonNullable<GetTaxCategoriesQuery['taxCategories']>)[number]>;
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

export namespace TaxRate {
  export type Fragment = TaxRateFragment;
  export type Category = (NonNullable<TaxRateFragment['category']>);
  export type Zone = (NonNullable<TaxRateFragment['zone']>);
  export type CustomerGroup = (NonNullable<TaxRateFragment['customerGroup']>);
}

export namespace GetTaxRateList {
  export type Variables = GetTaxRateListQueryVariables;
  export type Query = GetTaxRateListQuery;
  export type TaxRates = (NonNullable<GetTaxRateListQuery['taxRates']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetTaxRateListQuery['taxRates']>)['items']>)[number]>;
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

export namespace UpdateTaxRate {
  export type Variables = UpdateTaxRateMutationVariables;
  export type Mutation = UpdateTaxRateMutation;
  export type UpdateTaxRate = (NonNullable<UpdateTaxRateMutation['updateTaxRate']>);
}

export namespace DeleteTaxRate {
  export type Variables = DeleteTaxRateMutationVariables;
  export type Mutation = DeleteTaxRateMutation;
  export type DeleteTaxRate = (NonNullable<DeleteTaxRateMutation['deleteTaxRate']>);
}

export namespace Channel {
  export type Fragment = ChannelFragment;
  export type DefaultShippingZone = (NonNullable<ChannelFragment['defaultShippingZone']>);
  export type DefaultTaxZone = (NonNullable<ChannelFragment['defaultTaxZone']>);
}

export namespace GetChannels {
  export type Variables = GetChannelsQueryVariables;
  export type Query = GetChannelsQuery;
  export type Channels = NonNullable<(NonNullable<GetChannelsQuery['channels']>)[number]>;
}

export namespace GetChannel {
  export type Variables = GetChannelQueryVariables;
  export type Query = GetChannelQuery;
  export type Channel = (NonNullable<GetChannelQuery['channel']>);
}

export namespace GetActiveChannel {
  export type Variables = GetActiveChannelQueryVariables;
  export type Query = GetActiveChannelQuery;
  export type ActiveChannel = (NonNullable<GetActiveChannelQuery['activeChannel']>);
}

export namespace CreateChannel {
  export type Variables = CreateChannelMutationVariables;
  export type Mutation = CreateChannelMutation;
  export type CreateChannel = (NonNullable<CreateChannelMutation['createChannel']>);
}

export namespace UpdateChannel {
  export type Variables = UpdateChannelMutationVariables;
  export type Mutation = UpdateChannelMutation;
  export type UpdateChannel = (NonNullable<UpdateChannelMutation['updateChannel']>);
}

export namespace DeleteChannel {
  export type Variables = DeleteChannelMutationVariables;
  export type Mutation = DeleteChannelMutation;
  export type DeleteChannel = (NonNullable<DeleteChannelMutation['deleteChannel']>);
}

export namespace PaymentMethod {
  export type Fragment = PaymentMethodFragment;
  export type Checker = (NonNullable<PaymentMethodFragment['checker']>);
  export type Handler = (NonNullable<PaymentMethodFragment['handler']>);
}

export namespace GetPaymentMethodList {
  export type Variables = GetPaymentMethodListQueryVariables;
  export type Query = GetPaymentMethodListQuery;
  export type PaymentMethods = (NonNullable<GetPaymentMethodListQuery['paymentMethods']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetPaymentMethodListQuery['paymentMethods']>)['items']>)[number]>;
}

export namespace GetPaymentMethodOperations {
  export type Variables = GetPaymentMethodOperationsQueryVariables;
  export type Query = GetPaymentMethodOperationsQuery;
  export type PaymentMethodEligibilityCheckers = NonNullable<(NonNullable<GetPaymentMethodOperationsQuery['paymentMethodEligibilityCheckers']>)[number]>;
  export type PaymentMethodHandlers = NonNullable<(NonNullable<GetPaymentMethodOperationsQuery['paymentMethodHandlers']>)[number]>;
}

export namespace GetPaymentMethod {
  export type Variables = GetPaymentMethodQueryVariables;
  export type Query = GetPaymentMethodQuery;
  export type PaymentMethod = (NonNullable<GetPaymentMethodQuery['paymentMethod']>);
}

export namespace CreatePaymentMethod {
  export type Variables = CreatePaymentMethodMutationVariables;
  export type Mutation = CreatePaymentMethodMutation;
  export type CreatePaymentMethod = (NonNullable<CreatePaymentMethodMutation['createPaymentMethod']>);
}

export namespace UpdatePaymentMethod {
  export type Variables = UpdatePaymentMethodMutationVariables;
  export type Mutation = UpdatePaymentMethodMutation;
  export type UpdatePaymentMethod = (NonNullable<UpdatePaymentMethodMutation['updatePaymentMethod']>);
}

export namespace DeletePaymentMethod {
  export type Variables = DeletePaymentMethodMutationVariables;
  export type Mutation = DeletePaymentMethodMutation;
  export type DeletePaymentMethod = (NonNullable<DeletePaymentMethodMutation['deletePaymentMethod']>);
}

export namespace GlobalSettings {
  export type Fragment = GlobalSettingsFragment;
  export type ServerConfig = (NonNullable<GlobalSettingsFragment['serverConfig']>);
  export type Permissions = NonNullable<(NonNullable<(NonNullable<GlobalSettingsFragment['serverConfig']>)['permissions']>)[number]>;
  export type OrderProcess = NonNullable<(NonNullable<(NonNullable<GlobalSettingsFragment['serverConfig']>)['orderProcess']>)[number]>;
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
}

export namespace CustomFieldConfig {
  export type Fragment = CustomFieldConfigFragment;
  export type Description = NonNullable<(NonNullable<CustomFieldConfigFragment['description']>)[number]>;
  export type Label = NonNullable<(NonNullable<CustomFieldConfigFragment['label']>)[number]>;
}

export namespace StringCustomField {
  export type Fragment = StringCustomFieldFragment;
  export type Options = NonNullable<(NonNullable<StringCustomFieldFragment['options']>)[number]>;
  export type Label = NonNullable<(NonNullable<NonNullable<(NonNullable<StringCustomFieldFragment['options']>)[number]>['label']>)[number]>;
}

export namespace LocaleStringCustomField {
  export type Fragment = LocaleStringCustomFieldFragment;
}

export namespace TextCustomField {
  export type Fragment = TextCustomFieldFragment;
}

export namespace BooleanCustomField {
  export type Fragment = BooleanCustomFieldFragment;
}

export namespace IntCustomField {
  export type Fragment = IntCustomFieldFragment;
}

export namespace FloatCustomField {
  export type Fragment = FloatCustomFieldFragment;
}

export namespace DateTimeCustomField {
  export type Fragment = DateTimeCustomFieldFragment;
}

export namespace RelationCustomField {
  export type Fragment = RelationCustomFieldFragment;
}

export namespace CustomFields {
  export type Fragment = CustomFieldsFragment;
  export type StringCustomFieldConfigInlineFragment = (DiscriminateUnion<CustomFieldsFragment, { __typename?: 'StringCustomFieldConfig' }>);
  export type LocaleStringCustomFieldConfigInlineFragment = (DiscriminateUnion<CustomFieldsFragment, { __typename?: 'LocaleStringCustomFieldConfig' }>);
  export type TextCustomFieldConfigInlineFragment = (DiscriminateUnion<CustomFieldsFragment, { __typename?: 'TextCustomFieldConfig' }>);
  export type BooleanCustomFieldConfigInlineFragment = (DiscriminateUnion<CustomFieldsFragment, { __typename?: 'BooleanCustomFieldConfig' }>);
  export type IntCustomFieldConfigInlineFragment = (DiscriminateUnion<CustomFieldsFragment, { __typename?: 'IntCustomFieldConfig' }>);
  export type FloatCustomFieldConfigInlineFragment = (DiscriminateUnion<CustomFieldsFragment, { __typename?: 'FloatCustomFieldConfig' }>);
  export type DateTimeCustomFieldConfigInlineFragment = (DiscriminateUnion<CustomFieldsFragment, { __typename?: 'DateTimeCustomFieldConfig' }>);
  export type RelationCustomFieldConfigInlineFragment = (DiscriminateUnion<CustomFieldsFragment, { __typename?: 'RelationCustomFieldConfig' }>);
}

export namespace GetServerConfig {
  export type Variables = GetServerConfigQueryVariables;
  export type Query = GetServerConfigQuery;
  export type GlobalSettings = (NonNullable<GetServerConfigQuery['globalSettings']>);
  export type ServerConfig = (NonNullable<(NonNullable<GetServerConfigQuery['globalSettings']>)['serverConfig']>);
  export type OrderProcess = NonNullable<(NonNullable<(NonNullable<(NonNullable<GetServerConfigQuery['globalSettings']>)['serverConfig']>)['orderProcess']>)[number]>;
  export type Permissions = NonNullable<(NonNullable<(NonNullable<(NonNullable<GetServerConfigQuery['globalSettings']>)['serverConfig']>)['permissions']>)[number]>;
  export type CustomFieldConfig = (NonNullable<(NonNullable<(NonNullable<GetServerConfigQuery['globalSettings']>)['serverConfig']>)['customFieldConfig']>);
  export type Address = NonNullable<(NonNullable<(NonNullable<(NonNullable<(NonNullable<GetServerConfigQuery['globalSettings']>)['serverConfig']>)['customFieldConfig']>)['Address']>)[number]>;
  export type Administrator = NonNullable<(NonNullable<(NonNullable<(NonNullable<(NonNullable<GetServerConfigQuery['globalSettings']>)['serverConfig']>)['customFieldConfig']>)['Administrator']>)[number]>;
  export type Asset = NonNullable<(NonNullable<(NonNullable<(NonNullable<(NonNullable<GetServerConfigQuery['globalSettings']>)['serverConfig']>)['customFieldConfig']>)['Asset']>)[number]>;
  export type Channel = NonNullable<(NonNullable<(NonNullable<(NonNullable<(NonNullable<GetServerConfigQuery['globalSettings']>)['serverConfig']>)['customFieldConfig']>)['Channel']>)[number]>;
  export type Collection = NonNullable<(NonNullable<(NonNullable<(NonNullable<(NonNullable<GetServerConfigQuery['globalSettings']>)['serverConfig']>)['customFieldConfig']>)['Collection']>)[number]>;
  export type Customer = NonNullable<(NonNullable<(NonNullable<(NonNullable<(NonNullable<GetServerConfigQuery['globalSettings']>)['serverConfig']>)['customFieldConfig']>)['Customer']>)[number]>;
  export type Facet = NonNullable<(NonNullable<(NonNullable<(NonNullable<(NonNullable<GetServerConfigQuery['globalSettings']>)['serverConfig']>)['customFieldConfig']>)['Facet']>)[number]>;
  export type FacetValue = NonNullable<(NonNullable<(NonNullable<(NonNullable<(NonNullable<GetServerConfigQuery['globalSettings']>)['serverConfig']>)['customFieldConfig']>)['FacetValue']>)[number]>;
  export type Fulfillment = NonNullable<(NonNullable<(NonNullable<(NonNullable<(NonNullable<GetServerConfigQuery['globalSettings']>)['serverConfig']>)['customFieldConfig']>)['Fulfillment']>)[number]>;
  export type _GlobalSettings = NonNullable<(NonNullable<(NonNullable<(NonNullable<(NonNullable<GetServerConfigQuery['globalSettings']>)['serverConfig']>)['customFieldConfig']>)['GlobalSettings']>)[number]>;
  export type Order = NonNullable<(NonNullable<(NonNullable<(NonNullable<(NonNullable<GetServerConfigQuery['globalSettings']>)['serverConfig']>)['customFieldConfig']>)['Order']>)[number]>;
  export type OrderLine = NonNullable<(NonNullable<(NonNullable<(NonNullable<(NonNullable<GetServerConfigQuery['globalSettings']>)['serverConfig']>)['customFieldConfig']>)['OrderLine']>)[number]>;
  export type Product = NonNullable<(NonNullable<(NonNullable<(NonNullable<(NonNullable<GetServerConfigQuery['globalSettings']>)['serverConfig']>)['customFieldConfig']>)['Product']>)[number]>;
  export type ProductOption = NonNullable<(NonNullable<(NonNullable<(NonNullable<(NonNullable<GetServerConfigQuery['globalSettings']>)['serverConfig']>)['customFieldConfig']>)['ProductOption']>)[number]>;
  export type ProductOptionGroup = NonNullable<(NonNullable<(NonNullable<(NonNullable<(NonNullable<GetServerConfigQuery['globalSettings']>)['serverConfig']>)['customFieldConfig']>)['ProductOptionGroup']>)[number]>;
  export type ProductVariant = NonNullable<(NonNullable<(NonNullable<(NonNullable<(NonNullable<GetServerConfigQuery['globalSettings']>)['serverConfig']>)['customFieldConfig']>)['ProductVariant']>)[number]>;
  export type ShippingMethod = NonNullable<(NonNullable<(NonNullable<(NonNullable<(NonNullable<GetServerConfigQuery['globalSettings']>)['serverConfig']>)['customFieldConfig']>)['ShippingMethod']>)[number]>;
  export type User = NonNullable<(NonNullable<(NonNullable<(NonNullable<(NonNullable<GetServerConfigQuery['globalSettings']>)['serverConfig']>)['customFieldConfig']>)['User']>)[number]>;
}

export namespace JobInfo {
  export type Fragment = JobInfoFragment;
}

export namespace GetJobInfo {
  export type Variables = GetJobInfoQueryVariables;
  export type Query = GetJobInfoQuery;
  export type Job = (NonNullable<GetJobInfoQuery['job']>);
}

export namespace GetAllJobs {
  export type Variables = GetAllJobsQueryVariables;
  export type Query = GetAllJobsQuery;
  export type Jobs = (NonNullable<GetAllJobsQuery['jobs']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<GetAllJobsQuery['jobs']>)['items']>)[number]>;
}

export namespace GetJobsById {
  export type Variables = GetJobsByIdQueryVariables;
  export type Query = GetJobsByIdQuery;
  export type JobsById = NonNullable<(NonNullable<GetJobsByIdQuery['jobsById']>)[number]>;
}

export namespace GetJobQueueList {
  export type Variables = GetJobQueueListQueryVariables;
  export type Query = GetJobQueueListQuery;
  export type JobQueues = NonNullable<(NonNullable<GetJobQueueListQuery['jobQueues']>)[number]>;
}

export namespace CancelJob {
  export type Variables = CancelJobMutationVariables;
  export type Mutation = CancelJobMutation;
  export type CancelJob = (NonNullable<CancelJobMutation['cancelJob']>);
}

export namespace Reindex {
  export type Variables = ReindexMutationVariables;
  export type Mutation = ReindexMutation;
  export type Reindex = (NonNullable<ReindexMutation['reindex']>);
}

export namespace ConfigurableOperation {
  export type Fragment = ConfigurableOperationFragment;
  export type Args = NonNullable<(NonNullable<ConfigurableOperationFragment['args']>)[number]>;
}

export namespace ConfigurableOperationDef {
  export type Fragment = ConfigurableOperationDefFragment;
  export type Args = NonNullable<(NonNullable<ConfigurableOperationDefFragment['args']>)[number]>;
}

export namespace ErrorResult {
  export type Fragment = ErrorResultFragment;
}

export namespace ShippingMethod {
  export type Fragment = ShippingMethodFragment;
  export type Checker = (NonNullable<ShippingMethodFragment['checker']>);
  export type Calculator = (NonNullable<ShippingMethodFragment['calculator']>);
  export type Translations = NonNullable<(NonNullable<ShippingMethodFragment['translations']>)[number]>;
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

export namespace GetShippingMethodOperations {
  export type Variables = GetShippingMethodOperationsQueryVariables;
  export type Query = GetShippingMethodOperationsQuery;
  export type ShippingEligibilityCheckers = NonNullable<(NonNullable<GetShippingMethodOperationsQuery['shippingEligibilityCheckers']>)[number]>;
  export type ShippingCalculators = NonNullable<(NonNullable<GetShippingMethodOperationsQuery['shippingCalculators']>)[number]>;
  export type FulfillmentHandlers = NonNullable<(NonNullable<GetShippingMethodOperationsQuery['fulfillmentHandlers']>)[number]>;
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

export namespace TestShippingMethod {
  export type Variables = TestShippingMethodQueryVariables;
  export type Query = TestShippingMethodQuery;
  export type TestShippingMethod = (NonNullable<TestShippingMethodQuery['testShippingMethod']>);
  export type Quote = (NonNullable<(NonNullable<TestShippingMethodQuery['testShippingMethod']>)['quote']>);
}

export namespace TestEligibleShippingMethods {
  export type Variables = TestEligibleShippingMethodsQueryVariables;
  export type Query = TestEligibleShippingMethodsQuery;
  export type TestEligibleShippingMethods = NonNullable<(NonNullable<TestEligibleShippingMethodsQuery['testEligibleShippingMethods']>)[number]>;
}
