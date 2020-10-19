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
  /** The active Channel */
  activeChannel: Channel;
  /** The active Customer */
  activeCustomer?: Maybe<Customer>;
  /**
   * The active Order. Will be `null` until an Order is created via `addItemToOrder`. Once an Order reaches the
   * state of `PaymentApproved` or `PaymentSettled`, then that Order is no longer considered "active" and this
   * query will once again return `null`.
   */
  activeOrder?: Maybe<Order>;
  /** An array of supported Countries */
  availableCountries: Array<Country>;
  /** A list of Collections available to the shop */
  collections: CollectionList;
  /** Returns a Collection either by its id or slug. If neither 'id' nor 'slug' is speicified, an error will result. */
  collection?: Maybe<Collection>;
  /** Returns a list of eligible shipping methods based on the current active Order */
  eligibleShippingMethods: Array<ShippingMethodQuote>;
  /** Returns information about the current authenticated User */
  me?: Maybe<CurrentUser>;
  /** Returns the possible next states that the activeOrder can transition to */
  nextOrderStates: Array<Scalars['String']>;
  /**
   * Returns an Order based on the id. Note that in the Shop API, only orders belonging to the
   * currently-authenticated User may be queried.
   */
  order?: Maybe<Order>;
  /**
   * Returns an Order based on the order `code`. For guest Orders (i.e. Orders placed by non-authenticated Customers)
   * this query will only return the Order within 2 hours of the Order being placed. This allows an Order confirmation
   * screen to be shown immediately after completion of a guest checkout, yet prevents security risks of allowing
   * general anonymous access to Order data.
   */
  orderByCode?: Maybe<Order>;
  /** Get a Product either by id or slug. If neither 'id' nor 'slug' is speicified, an error will result. */
  product?: Maybe<Product>;
  /** Get a list of Products */
  products: ProductList;
  /** Search Products based on the criteria set by the `SearchInput` */
  search: SearchResponse;
};


export type QueryCollectionsArgs = {
  options?: Maybe<CollectionListOptions>;
};


export type QueryCollectionArgs = {
  id?: Maybe<Scalars['ID']>;
  slug?: Maybe<Scalars['String']>;
};


export type QueryOrderArgs = {
  id: Scalars['ID'];
};


export type QueryOrderByCodeArgs = {
  code: Scalars['String'];
};


export type QueryProductArgs = {
  id?: Maybe<Scalars['ID']>;
  slug?: Maybe<Scalars['String']>;
};


export type QueryProductsArgs = {
  options?: Maybe<ProductListOptions>;
};


export type QuerySearchArgs = {
  input: SearchInput;
};

export type Mutation = {
  /** Adds an item to the order. If custom fields are defined on the OrderLine entity, a third argument 'customFields' will be available. */
  addItemToOrder: UpdateOrderItemsResult;
  /** Remove an OrderLine from the Order */
  removeOrderLine: RemoveOrderItemsResult;
  /** Remove all OrderLine from the Order */
  removeAllOrderLines: RemoveOrderItemsResult;
  /** Adjusts an OrderLine. If custom fields are defined on the OrderLine entity, a third argument 'customFields' of type `OrderLineCustomFieldsInput` will be available. */
  adjustOrderLine: UpdateOrderItemsResult;
  /** Applies the given coupon code to the active Order */
  applyCouponCode: ApplyCouponCodeResult;
  /** Removes the given coupon code from the active Order */
  removeCouponCode?: Maybe<Order>;
  /** Transitions an Order to a new state. Valid next states can be found by querying `nextOrderStates` */
  transitionOrderToState?: Maybe<TransitionOrderToStateResult>;
  /** Sets the shipping address for this order */
  setOrderShippingAddress?: Maybe<Order>;
  /** Sets the billing address for this order */
  setOrderBillingAddress?: Maybe<Order>;
  /** Allows any custom fields to be set for the active order */
  setOrderCustomFields?: Maybe<Order>;
  /** Sets the shipping method by id, which can be obtained with the `eligibleShippingMethods` query */
  setOrderShippingMethod: SetOrderShippingMethodResult;
  /** Add a Payment to the Order */
  addPaymentToOrder?: Maybe<AddPaymentToOrderResult>;
  /** Set the Customer for the Order. Required only if the Customer is not currently logged in */
  setCustomerForOrder?: Maybe<SetCustomerForOrderResult>;
  /** Authenticates the user using the native authentication strategy. This mutation is an alias for `authenticate({ native: { ... }})` */
  login: NativeAuthenticationResult;
  /** Authenticates the user using a named authentication strategy */
  authenticate: AuthenticationResult;
  /** End the current authenticated session */
  logout: Success;
  /**
   * Register a Customer account with the given credentials. There are three possible registration flows:
   * 
   * _If `authOptions.requireVerification` is set to `true`:_
   * 
   * 1. **The Customer is registered _with_ a password**. A verificationToken will be created (and typically emailed to the Customer). That
   *    verificationToken would then be passed to the `verifyCustomerAccount` mutation _without_ a password. The Customer is then
   *    verified and authenticated in one step.
   * 2. **The Customer is registered _without_ a password**. A verificationToken will be created (and typically emailed to the Customer). That
   *    verificationToken would then be passed to the `verifyCustomerAccount` mutation _with_ the chosed password of the Customer. The Customer is then
   *    verified and authenticated in one step.
   * 
   * _If `authOptions.requireVerification` is set to `false`:_
   * 
   * 3. The Customer _must_ be registered _with_ a password. No further action is needed - the Customer is able to authenticate immediately.
   */
  registerCustomerAccount: RegisterCustomerAccountResult;
  /** Regenerate and send a verification token for a new Customer registration. Only applicable if `authOptions.requireVerification` is set to true. */
  refreshCustomerVerification: RefreshCustomerVerificationResult;
  /** Update an existing Customer */
  updateCustomer: Customer;
  /** Create a new Customer Address */
  createCustomerAddress: Address;
  /** Update an existing Address */
  updateCustomerAddress: Address;
  /** Delete an existing Address */
  deleteCustomerAddress: Success;
  /**
   * Verify a Customer email address with the token sent to that address. Only applicable if `authOptions.requireVerification` is set to true.
   * 
   * If the Customer was not registered with a password in the `registerCustomerAccount` mutation, the a password _must_ be
   * provided here.
   */
  verifyCustomerAccount: VerifyCustomerAccountResult;
  /** Update the password of the active Customer */
  updateCustomerPassword: UpdateCustomerPasswordResult;
  /**
   * Request to update the emailAddress of the active Customer. If `authOptions.requireVerification` is enabled
   * (as is the default), then the `identifierChangeToken` will be assigned to the current User and
   * a IdentifierChangeRequestEvent will be raised. This can then be used e.g. by the EmailPlugin to email
   * that verification token to the Customer, which is then used to verify the change of email address.
   */
  requestUpdateCustomerEmailAddress: RequestUpdateCustomerEmailAddressResult;
  /**
   * Confirm the update of the emailAddress with the provided token, which has been generated by the
   * `requestUpdateCustomerEmailAddress` mutation.
   */
  updateCustomerEmailAddress: UpdateCustomerEmailAddressResult;
  /** Requests a password reset email to be sent */
  requestPasswordReset?: Maybe<RequestPasswordResetResult>;
  /** Resets a Customer's password based on the provided token */
  resetPassword: ResetPasswordResult;
};


export type MutationAddItemToOrderArgs = {
  productVariantId: Scalars['ID'];
  quantity: Scalars['Int'];
};


export type MutationRemoveOrderLineArgs = {
  orderLineId: Scalars['ID'];
};


export type MutationAdjustOrderLineArgs = {
  orderLineId: Scalars['ID'];
  quantity?: Maybe<Scalars['Int']>;
};


export type MutationApplyCouponCodeArgs = {
  couponCode: Scalars['String'];
};


export type MutationRemoveCouponCodeArgs = {
  couponCode: Scalars['String'];
};


export type MutationTransitionOrderToStateArgs = {
  state: Scalars['String'];
};


export type MutationSetOrderShippingAddressArgs = {
  input: CreateAddressInput;
};


export type MutationSetOrderBillingAddressArgs = {
  input: CreateAddressInput;
};


export type MutationSetOrderCustomFieldsArgs = {
  input: UpdateOrderInput;
};


export type MutationSetOrderShippingMethodArgs = {
  shippingMethodId: Scalars['ID'];
};


export type MutationAddPaymentToOrderArgs = {
  input: PaymentInput;
};


export type MutationSetCustomerForOrderArgs = {
  input: CreateCustomerInput;
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


export type MutationRegisterCustomerAccountArgs = {
  input: RegisterCustomerInput;
};


export type MutationRefreshCustomerVerificationArgs = {
  emailAddress: Scalars['String'];
};


export type MutationUpdateCustomerArgs = {
  input: UpdateCustomerInput;
};


export type MutationCreateCustomerAddressArgs = {
  input: CreateAddressInput;
};


export type MutationUpdateCustomerAddressArgs = {
  input: UpdateAddressInput;
};


export type MutationDeleteCustomerAddressArgs = {
  id: Scalars['ID'];
};


export type MutationVerifyCustomerAccountArgs = {
  token: Scalars['String'];
  password?: Maybe<Scalars['String']>;
};


export type MutationUpdateCustomerPasswordArgs = {
  currentPassword: Scalars['String'];
  newPassword: Scalars['String'];
};


export type MutationRequestUpdateCustomerEmailAddressArgs = {
  password: Scalars['String'];
  newEmailAddress: Scalars['String'];
};


export type MutationUpdateCustomerEmailAddressArgs = {
  token: Scalars['String'];
};


export type MutationRequestPasswordResetArgs = {
  emailAddress: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  token: Scalars['String'];
  password: Scalars['String'];
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
  NATIVE_AUTH_STRATEGY_ERROR = 'NATIVE_AUTH_STRATEGY_ERROR',
  INVALID_CREDENTIALS_ERROR = 'INVALID_CREDENTIALS_ERROR',
  ORDER_STATE_TRANSITION_ERROR = 'ORDER_STATE_TRANSITION_ERROR',
  EMAIL_ADDRESS_CONFLICT_ERROR = 'EMAIL_ADDRESS_CONFLICT_ERROR',
  ORDER_MODIFICATION_ERROR = 'ORDER_MODIFICATION_ERROR',
  ORDER_LIMIT_ERROR = 'ORDER_LIMIT_ERROR',
  NEGATIVE_QUANTITY_ERROR = 'NEGATIVE_QUANTITY_ERROR',
  ORDER_PAYMENT_STATE_ERROR = 'ORDER_PAYMENT_STATE_ERROR',
  PAYMENT_FAILED_ERROR = 'PAYMENT_FAILED_ERROR',
  PAYMENT_DECLINED_ERROR = 'PAYMENT_DECLINED_ERROR',
  COUPON_CODE_INVALID_ERROR = 'COUPON_CODE_INVALID_ERROR',
  COUPON_CODE_EXPIRED_ERROR = 'COUPON_CODE_EXPIRED_ERROR',
  COUPON_CODE_LIMIT_ERROR = 'COUPON_CODE_LIMIT_ERROR',
  ALREADY_LOGGED_IN_ERROR = 'ALREADY_LOGGED_IN_ERROR',
  MISSING_PASSWORD_ERROR = 'MISSING_PASSWORD_ERROR',
  PASSWORD_ALREADY_SET_ERROR = 'PASSWORD_ALREADY_SET_ERROR',
  VERIFICATION_TOKEN_INVALID_ERROR = 'VERIFICATION_TOKEN_INVALID_ERROR',
  VERIFICATION_TOKEN_EXPIRED_ERROR = 'VERIFICATION_TOKEN_EXPIRED_ERROR',
  IDENTIFIER_CHANGE_TOKEN_INVALID_ERROR = 'IDENTIFIER_CHANGE_TOKEN_INVALID_ERROR',
  IDENTIFIER_CHANGE_TOKEN_EXPIRED_ERROR = 'IDENTIFIER_CHANGE_TOKEN_EXPIRED_ERROR',
  PASSWORD_RESET_TOKEN_INVALID_ERROR = 'PASSWORD_RESET_TOKEN_INVALID_ERROR',
  PASSWORD_RESET_TOKEN_EXPIRED_ERROR = 'PASSWORD_RESET_TOKEN_EXPIRED_ERROR',
  NOT_VERIFIED_ERROR = 'NOT_VERIFIED_ERROR'
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

export type RegisterCustomerInput = {
  emailAddress: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
};

export type UpdateCustomerInput = {
  title?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  customFields?: Maybe<Scalars['JSON']>;
};

/** Passed as input to the `addPaymentToOrder` mutation. */
export type PaymentInput = {
  /** This field should correspond to the `code` property of a PaymentMethodHandler. */
  method: Scalars['String'];
  /**
   * This field should contain arbitrary data passed to the specified PaymentMethodHandler's `createPayment()` method
   * as the "metadata" argument. For example, it could contain an ID for the payment and other
   * data generated by the payment provider.
   */
  metadata: Scalars['JSON'];
};

/** Returned when attempting to modify the contents of an Order that is not in the `AddingItems` state. */
export type OrderModificationError = ErrorResult & {
  errorCode: ErrorCode;
  message: Scalars['String'];
};

/** Retured when the maximum order size limit has been reached. */
export type OrderLimitError = ErrorResult & {
  errorCode: ErrorCode;
  message: Scalars['String'];
  maxItems: Scalars['Int'];
};

/** Retured when attemting to set a negative OrderLine quantity. */
export type NegativeQuantityError = ErrorResult & {
  errorCode: ErrorCode;
  message: Scalars['String'];
};

/** Returned when attempting to add a Payment to an Order that is not in the `ArrangingPayment` state. */
export type OrderPaymentStateError = ErrorResult & {
  errorCode: ErrorCode;
  message: Scalars['String'];
};

/** Returned when a Payment fails due to an error. */
export type PaymentFailedError = ErrorResult & {
  errorCode: ErrorCode;
  message: Scalars['String'];
  paymentErrorMessage: Scalars['String'];
};

/** Returned when a Payment is declined by the payment provider. */
export type PaymentDeclinedError = ErrorResult & {
  errorCode: ErrorCode;
  message: Scalars['String'];
  paymentErrorMessage: Scalars['String'];
};

/** Returned if the provided coupon code is invalid */
export type CouponCodeInvalidError = ErrorResult & {
  errorCode: ErrorCode;
  message: Scalars['String'];
  couponCode: Scalars['String'];
};

/** Returned if the provided coupon code is invalid */
export type CouponCodeExpiredError = ErrorResult & {
  errorCode: ErrorCode;
  message: Scalars['String'];
  couponCode: Scalars['String'];
};

/** Returned if the provided coupon code is invalid */
export type CouponCodeLimitError = ErrorResult & {
  errorCode: ErrorCode;
  message: Scalars['String'];
  couponCode: Scalars['String'];
  limit: Scalars['Int'];
};

/** Retured when attemting to set the Customer for an Order when already logged in. */
export type AlreadyLoggedInError = ErrorResult & {
  errorCode: ErrorCode;
  message: Scalars['String'];
};

/** Retured when attemting to register or verify a customer account without a password, when one is required. */
export type MissingPasswordError = ErrorResult & {
  errorCode: ErrorCode;
  message: Scalars['String'];
};

/** Retured when attemting to verify a customer account with a password, when a password has already been set. */
export type PasswordAlreadySetError = ErrorResult & {
  errorCode: ErrorCode;
  message: Scalars['String'];
};

/**
 * Retured if the verification token (used to verify a Customer's email address) is either
 * invalid or does not match any expected tokens.
 */
export type VerificationTokenInvalidError = ErrorResult & {
  errorCode: ErrorCode;
  message: Scalars['String'];
};

/**
 * Returned if the verification token (used to verify a Customer's email address) is valid, but has
 * expired according to the `verificationTokenDuration` setting in the AuthOptions.
 */
export type VerificationTokenExpiredError = ErrorResult & {
  errorCode: ErrorCode;
  message: Scalars['String'];
};

/**
 * Retured if the token used to change a Customer's email address is either
 * invalid or does not match any expected tokens.
 */
export type IdentifierChangeTokenInvalidError = ErrorResult & {
  errorCode: ErrorCode;
  message: Scalars['String'];
};

/**
 * Retured if the token used to change a Customer's email address is valid, but has
 * expired according to the `verificationTokenDuration` setting in the AuthOptions.
 */
export type IdentifierChangeTokenExpiredError = ErrorResult & {
  errorCode: ErrorCode;
  message: Scalars['String'];
};

/**
 * Retured if the token used to reset a Customer's password is either
 * invalid or does not match any expected tokens.
 */
export type PasswordResetTokenInvalidError = ErrorResult & {
  errorCode: ErrorCode;
  message: Scalars['String'];
};

/**
 * Retured if the token used to reset a Customer's password is valid, but has
 * expired according to the `verificationTokenDuration` setting in the AuthOptions.
 */
export type PasswordResetTokenExpiredError = ErrorResult & {
  errorCode: ErrorCode;
  message: Scalars['String'];
};

/**
 * Returned if `authOptions.requireVerification` is set to `true` (which is the default)
 * and an unverified user attempts to authenticate.
 */
export type NotVerifiedError = ErrorResult & {
  errorCode: ErrorCode;
  message: Scalars['String'];
};

export type UpdateOrderItemsResult = Order | OrderModificationError | OrderLimitError | NegativeQuantityError;

export type RemoveOrderItemsResult = Order | OrderModificationError;

export type SetOrderShippingMethodResult = Order | OrderModificationError;

export type ApplyCouponCodeResult = Order | CouponCodeExpiredError | CouponCodeInvalidError | CouponCodeLimitError;

export type AddPaymentToOrderResult = Order | OrderPaymentStateError | PaymentFailedError | PaymentDeclinedError | OrderStateTransitionError;

export type TransitionOrderToStateResult = Order | OrderStateTransitionError;

export type SetCustomerForOrderResult = Order | AlreadyLoggedInError | EmailAddressConflictError;

export type RegisterCustomerAccountResult = Success | MissingPasswordError | NativeAuthStrategyError;

export type RefreshCustomerVerificationResult = Success | NativeAuthStrategyError;

export type VerifyCustomerAccountResult = CurrentUser | VerificationTokenInvalidError | VerificationTokenExpiredError | MissingPasswordError | PasswordAlreadySetError | NativeAuthStrategyError;

export type UpdateCustomerPasswordResult = Success | InvalidCredentialsError | NativeAuthStrategyError;

export type RequestUpdateCustomerEmailAddressResult = Success | InvalidCredentialsError | EmailAddressConflictError | NativeAuthStrategyError;

export type UpdateCustomerEmailAddressResult = Success | IdentifierChangeTokenInvalidError | IdentifierChangeTokenExpiredError | NativeAuthStrategyError;

export type RequestPasswordResetResult = Success | NativeAuthStrategyError;

export type ResetPasswordResult = CurrentUser | PasswordResetTokenInvalidError | PasswordResetTokenExpiredError | NativeAuthStrategyError;

export type NativeAuthenticationResult = CurrentUser | InvalidCredentialsError | NotVerifiedError | NativeAuthStrategyError;

export type AuthenticationResult = CurrentUser | InvalidCredentialsError | NotVerifiedError;

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

export type Collection = Node & {
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

export type Customer = Node & {
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


export type CustomerOrdersArgs = {
  options?: Maybe<OrderListOptions>;
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

export type Facet = Node & {
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

export type Order = Node & {
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

export type Fulfillment = Node & {
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  orderItems: Array<OrderItem>;
  state: Scalars['String'];
  method: Scalars['String'];
  trackingCode?: Maybe<Scalars['String']>;
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

export type SearchResult = {
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

export type Product = Node & {
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

export type ProductVariant = Node & {
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

export type CollectionListOptions = {
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
  sort?: Maybe<CollectionSortParameter>;
  filter?: Maybe<CollectionFilterParameter>;
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

export type CustomerListOptions = {
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
  sort?: Maybe<CustomerSortParameter>;
  filter?: Maybe<CustomerFilterParameter>;
};

export type OrderListOptions = {
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
  sort?: Maybe<OrderSortParameter>;
  filter?: Maybe<OrderFilterParameter>;
};

export type HistoryEntryListOptions = {
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
  sort?: Maybe<HistoryEntrySortParameter>;
  filter?: Maybe<HistoryEntryFilterParameter>;
};

export type CollectionFilterParameter = {
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

export type ProductFilterParameter = {
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
  id?: Maybe<SortOrder>;
  productId?: Maybe<SortOrder>;
  createdAt?: Maybe<SortOrder>;
  updatedAt?: Maybe<SortOrder>;
  sku?: Maybe<SortOrder>;
  name?: Maybe<SortOrder>;
  price?: Maybe<SortOrder>;
  priceWithTax?: Maybe<SortOrder>;
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

export type UpdateOrderInput = {
  customFields?: Maybe<Scalars['JSON']>;
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

export type TestOrderFragmentFragment = (
  Pick<Order, 'id' | 'code' | 'state' | 'active' | 'total' | 'couponCodes' | 'shipping'>
  & { adjustments: Array<Pick<Adjustment, 'adjustmentSource' | 'amount' | 'description' | 'type'>>, lines: Array<(
    Pick<OrderLine, 'id' | 'quantity'>
    & { productVariant: Pick<ProductVariant, 'id'>, adjustments: Array<Pick<Adjustment, 'adjustmentSource' | 'amount' | 'description' | 'type'>> }
  )>, shippingMethod?: Maybe<Pick<ShippingMethod, 'id' | 'code' | 'description'>>, customer?: Maybe<(
    Pick<Customer, 'id'>
    & { user?: Maybe<Pick<User, 'id' | 'identifier'>> }
  )>, history: { items: Array<Pick<HistoryEntry, 'id' | 'type' | 'data'>> } }
);

export type UpdatedOrderFragment = (
  Pick<Order, 'id' | 'code' | 'state' | 'active' | 'total'>
  & { lines: Array<(
    Pick<OrderLine, 'id' | 'quantity'>
    & { productVariant: Pick<ProductVariant, 'id'>, adjustments: Array<Pick<Adjustment, 'adjustmentSource' | 'amount' | 'description' | 'type'>> }
  )>, adjustments: Array<Pick<Adjustment, 'adjustmentSource' | 'amount' | 'description' | 'type'>> }
);

export type AddItemToOrderMutationVariables = Exact<{
  productVariantId: Scalars['ID'];
  quantity: Scalars['Int'];
}>;


export type AddItemToOrderMutation = { addItemToOrder: UpdatedOrderFragment | Pick<OrderModificationError, 'errorCode' | 'message'> | Pick<OrderLimitError, 'errorCode' | 'message'> | Pick<NegativeQuantityError, 'errorCode' | 'message'> };

export type SearchProductsShopQueryVariables = Exact<{
  input: SearchInput;
}>;


export type SearchProductsShopQuery = { search: (
    Pick<SearchResponse, 'totalItems'>
    & { items: Array<(
      Pick<SearchResult, 'productId' | 'productName' | 'productPreview' | 'productVariantId' | 'productVariantName' | 'productVariantPreview' | 'sku' | 'collectionIds'>
      & { price: Pick<PriceRange, 'min' | 'max'> | Pick<SinglePrice, 'value'> }
    )> }
  ) };

export type RegisterMutationVariables = Exact<{
  input: RegisterCustomerInput;
}>;


export type RegisterMutation = { registerCustomerAccount: Pick<Success, 'success'> | Pick<MissingPasswordError, 'errorCode' | 'message'> | Pick<NativeAuthStrategyError, 'errorCode' | 'message'> };

export type CurrentUserShopFragment = (
  Pick<CurrentUser, 'id' | 'identifier'>
  & { channels: Array<Pick<CurrentUserChannel, 'code' | 'token' | 'permissions'>> }
);

export type VerifyMutationVariables = Exact<{
  password?: Maybe<Scalars['String']>;
  token: Scalars['String'];
}>;


export type VerifyMutation = { verifyCustomerAccount: CurrentUserShopFragment | Pick<VerificationTokenInvalidError, 'errorCode' | 'message'> | Pick<VerificationTokenExpiredError, 'errorCode' | 'message'> | Pick<MissingPasswordError, 'errorCode' | 'message'> | Pick<PasswordAlreadySetError, 'errorCode' | 'message'> | Pick<NativeAuthStrategyError, 'errorCode' | 'message'> };

export type RefreshTokenMutationVariables = Exact<{
  emailAddress: Scalars['String'];
}>;


export type RefreshTokenMutation = { refreshCustomerVerification: Pick<Success, 'success'> | Pick<NativeAuthStrategyError, 'errorCode' | 'message'> };

export type RequestPasswordResetMutationVariables = Exact<{
  identifier: Scalars['String'];
}>;


export type RequestPasswordResetMutation = { requestPasswordReset?: Maybe<Pick<Success, 'success'> | Pick<NativeAuthStrategyError, 'errorCode' | 'message'>> };

export type ResetPasswordMutationVariables = Exact<{
  token: Scalars['String'];
  password: Scalars['String'];
}>;


export type ResetPasswordMutation = { resetPassword: CurrentUserShopFragment | Pick<PasswordResetTokenInvalidError, 'errorCode' | 'message'> | Pick<PasswordResetTokenExpiredError, 'errorCode' | 'message'> | Pick<NativeAuthStrategyError, 'errorCode' | 'message'> };

export type RequestUpdateEmailAddressMutationVariables = Exact<{
  password: Scalars['String'];
  newEmailAddress: Scalars['String'];
}>;


export type RequestUpdateEmailAddressMutation = { requestUpdateCustomerEmailAddress: Pick<Success, 'success'> | Pick<InvalidCredentialsError, 'errorCode' | 'message'> | Pick<EmailAddressConflictError, 'errorCode' | 'message'> | Pick<NativeAuthStrategyError, 'errorCode' | 'message'> };

export type UpdateEmailAddressMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type UpdateEmailAddressMutation = { updateCustomerEmailAddress: Pick<Success, 'success'> | Pick<IdentifierChangeTokenInvalidError, 'errorCode' | 'message'> | Pick<IdentifierChangeTokenExpiredError, 'errorCode' | 'message'> | Pick<NativeAuthStrategyError, 'errorCode' | 'message'> };

export type GetActiveCustomerQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActiveCustomerQuery = { activeCustomer?: Maybe<Pick<Customer, 'id' | 'emailAddress'>> };

export type CreateAddressShopMutationVariables = Exact<{
  input: CreateAddressInput;
}>;


export type CreateAddressShopMutation = { createCustomerAddress: (
    Pick<Address, 'id' | 'streetLine1'>
    & { country: Pick<Country, 'code'> }
  ) };

export type UpdateAddressShopMutationVariables = Exact<{
  input: UpdateAddressInput;
}>;


export type UpdateAddressShopMutation = { updateCustomerAddress: (
    Pick<Address, 'streetLine1'>
    & { country: Pick<Country, 'code'> }
  ) };

export type DeleteAddressShopMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteAddressShopMutation = { deleteCustomerAddress: Pick<Success, 'success'> };

export type UpdateCustomerMutationVariables = Exact<{
  input: UpdateCustomerInput;
}>;


export type UpdateCustomerMutation = { updateCustomer: Pick<Customer, 'id' | 'firstName' | 'lastName'> };

export type UpdatePasswordMutationVariables = Exact<{
  old: Scalars['String'];
  new: Scalars['String'];
}>;


export type UpdatePasswordMutation = { updateCustomerPassword: Pick<Success, 'success'> | Pick<InvalidCredentialsError, 'errorCode' | 'message'> | Pick<NativeAuthStrategyError, 'errorCode' | 'message'> };

export type GetActiveOrderQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActiveOrderQuery = { activeOrder?: Maybe<TestOrderFragmentFragment> };

export type AdjustItemQuantityMutationVariables = Exact<{
  orderLineId: Scalars['ID'];
  quantity: Scalars['Int'];
}>;


export type AdjustItemQuantityMutation = { adjustOrderLine: TestOrderFragmentFragment | Pick<OrderModificationError, 'errorCode' | 'message'> | Pick<OrderLimitError, 'errorCode' | 'message'> | Pick<NegativeQuantityError, 'errorCode' | 'message'> };

export type RemoveItemFromOrderMutationVariables = Exact<{
  orderLineId: Scalars['ID'];
}>;


export type RemoveItemFromOrderMutation = { removeOrderLine: TestOrderFragmentFragment | Pick<OrderModificationError, 'errorCode' | 'message'> };

export type GetShippingMethodsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetShippingMethodsQuery = { eligibleShippingMethods: Array<Pick<ShippingMethodQuote, 'id' | 'price' | 'description'>> };

export type SetShippingMethodMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type SetShippingMethodMutation = { setOrderShippingMethod: TestOrderFragmentFragment | Pick<OrderModificationError, 'errorCode' | 'message'> };

export type ActiveOrderCustomerFragment = (
  Pick<Order, 'id'>
  & { customer?: Maybe<Pick<Customer, 'id' | 'emailAddress' | 'firstName' | 'lastName'>>, lines: Array<Pick<OrderLine, 'id'>> }
);

export type SetCustomerForOrderMutationVariables = Exact<{
  input: CreateCustomerInput;
}>;


export type SetCustomerForOrderMutation = { setCustomerForOrder?: Maybe<ActiveOrderCustomerFragment | Pick<AlreadyLoggedInError, 'errorCode' | 'message'> | Pick<EmailAddressConflictError, 'errorCode' | 'message'>> };

export type GetOrderByCodeQueryVariables = Exact<{
  code: Scalars['String'];
}>;


export type GetOrderByCodeQuery = { orderByCode?: Maybe<TestOrderFragmentFragment> };

export type GetOrderPromotionsByCodeQueryVariables = Exact<{
  code: Scalars['String'];
}>;


export type GetOrderPromotionsByCodeQuery = { orderByCode?: Maybe<(
    { promotions: Array<Pick<Promotion, 'id' | 'name'>> }
    & TestOrderFragmentFragment
  )> };

export type GetAvailableCountriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAvailableCountriesQuery = { availableCountries: Array<Pick<Country, 'id' | 'code'>> };

export type TransitionToStateMutationVariables = Exact<{
  state: Scalars['String'];
}>;


export type TransitionToStateMutation = { transitionOrderToState?: Maybe<TestOrderFragmentFragment | Pick<OrderStateTransitionError, 'errorCode' | 'message' | 'transitionError' | 'fromState' | 'toState'>> };

export type SetShippingAddressMutationVariables = Exact<{
  input: CreateAddressInput;
}>;


export type SetShippingAddressMutation = { setOrderShippingAddress?: Maybe<{ shippingAddress?: Maybe<Pick<OrderAddress, 'fullName' | 'company' | 'streetLine1' | 'streetLine2' | 'city' | 'province' | 'postalCode' | 'country' | 'phoneNumber'>> }> };

export type SetBillingAddressMutationVariables = Exact<{
  input: CreateAddressInput;
}>;


export type SetBillingAddressMutation = { setOrderBillingAddress?: Maybe<{ billingAddress?: Maybe<Pick<OrderAddress, 'fullName' | 'company' | 'streetLine1' | 'streetLine2' | 'city' | 'province' | 'postalCode' | 'country' | 'phoneNumber'>> }> };

export type TestOrderWithPaymentsFragment = (
  { payments?: Maybe<Array<Pick<Payment, 'id' | 'transactionId' | 'method' | 'amount' | 'state' | 'metadata'>>> }
  & TestOrderFragmentFragment
);

export type GetActiveOrderWithPaymentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActiveOrderWithPaymentsQuery = { activeOrder?: Maybe<TestOrderWithPaymentsFragment> };

export type AddPaymentToOrderMutationVariables = Exact<{
  input: PaymentInput;
}>;


export type AddPaymentToOrderMutation = { addPaymentToOrder?: Maybe<TestOrderWithPaymentsFragment | Pick<OrderPaymentStateError, 'errorCode' | 'message'> | Pick<PaymentFailedError, 'errorCode' | 'message' | 'paymentErrorMessage'> | Pick<PaymentDeclinedError, 'errorCode' | 'message' | 'paymentErrorMessage'> | Pick<OrderStateTransitionError, 'errorCode' | 'message'>> };

export type GetActiveOrderPaymentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActiveOrderPaymentsQuery = { activeOrder?: Maybe<(
    Pick<Order, 'id'>
    & { payments?: Maybe<Array<Pick<Payment, 'id' | 'transactionId' | 'method' | 'amount' | 'state' | 'errorMessage' | 'metadata'>>> }
  )> };

export type GetOrderByCodeWithPaymentsQueryVariables = Exact<{
  code: Scalars['String'];
}>;


export type GetOrderByCodeWithPaymentsQuery = { orderByCode?: Maybe<TestOrderWithPaymentsFragment> };

export type GetNextOrderStatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNextOrderStatesQuery = Pick<Query, 'nextOrderStates'>;

export type GetCustomerAddressesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCustomerAddressesQuery = { activeOrder?: Maybe<{ customer?: Maybe<{ addresses?: Maybe<Array<Pick<Address, 'id' | 'streetLine1'>>> }> }> };

export type GetCustomerOrdersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCustomerOrdersQuery = { activeOrder?: Maybe<{ customer?: Maybe<{ orders: { items: Array<Pick<Order, 'id'>> } }> }> };

export type ApplyCouponCodeMutationVariables = Exact<{
  couponCode: Scalars['String'];
}>;


export type ApplyCouponCodeMutation = { applyCouponCode: TestOrderFragmentFragment | Pick<CouponCodeExpiredError, 'errorCode' | 'message'> | Pick<CouponCodeInvalidError, 'errorCode' | 'message'> | Pick<CouponCodeLimitError, 'errorCode' | 'message'> };

export type RemoveCouponCodeMutationVariables = Exact<{
  couponCode: Scalars['String'];
}>;


export type RemoveCouponCodeMutation = { removeCouponCode?: Maybe<TestOrderFragmentFragment> };

export type RemoveAllOrderLinesMutationVariables = Exact<{ [key: string]: never; }>;


export type RemoveAllOrderLinesMutation = { removeAllOrderLines: TestOrderFragmentFragment | Pick<OrderModificationError, 'errorCode' | 'message'> };

type DiscriminateUnion<T, U> = T extends U ? T : never;

export namespace TestOrderFragment {
  export type Fragment = TestOrderFragmentFragment;
  export type Adjustments = NonNullable<(NonNullable<TestOrderFragmentFragment['adjustments']>)[number]>;
  export type Lines = NonNullable<(NonNullable<TestOrderFragmentFragment['lines']>)[number]>;
  export type ProductVariant = (NonNullable<NonNullable<(NonNullable<TestOrderFragmentFragment['lines']>)[number]>['productVariant']>);
  export type _Adjustments = NonNullable<(NonNullable<NonNullable<(NonNullable<TestOrderFragmentFragment['lines']>)[number]>['adjustments']>)[number]>;
  export type ShippingMethod = (NonNullable<TestOrderFragmentFragment['shippingMethod']>);
  export type Customer = (NonNullable<TestOrderFragmentFragment['customer']>);
  export type User = (NonNullable<(NonNullable<TestOrderFragmentFragment['customer']>)['user']>);
  export type History = (NonNullable<TestOrderFragmentFragment['history']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<TestOrderFragmentFragment['history']>)['items']>)[number]>;
}

export namespace UpdatedOrder {
  export type Fragment = UpdatedOrderFragment;
  export type Lines = NonNullable<(NonNullable<UpdatedOrderFragment['lines']>)[number]>;
  export type ProductVariant = (NonNullable<NonNullable<(NonNullable<UpdatedOrderFragment['lines']>)[number]>['productVariant']>);
  export type Adjustments = NonNullable<(NonNullable<NonNullable<(NonNullable<UpdatedOrderFragment['lines']>)[number]>['adjustments']>)[number]>;
  export type _Adjustments = NonNullable<(NonNullable<UpdatedOrderFragment['adjustments']>)[number]>;
}

export namespace AddItemToOrder {
  export type Variables = AddItemToOrderMutationVariables;
  export type Mutation = AddItemToOrderMutation;
  export type AddItemToOrder = (NonNullable<AddItemToOrderMutation['addItemToOrder']>);
  export type ErrorResultInlineFragment = (DiscriminateUnion<(NonNullable<AddItemToOrderMutation['addItemToOrder']>), { __typename?: 'ErrorResult' }>);
}

export namespace SearchProductsShop {
  export type Variables = SearchProductsShopQueryVariables;
  export type Query = SearchProductsShopQuery;
  export type Search = (NonNullable<SearchProductsShopQuery['search']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<SearchProductsShopQuery['search']>)['items']>)[number]>;
  export type Price = (NonNullable<NonNullable<(NonNullable<(NonNullable<SearchProductsShopQuery['search']>)['items']>)[number]>['price']>);
  export type SinglePriceInlineFragment = (DiscriminateUnion<(NonNullable<NonNullable<(NonNullable<(NonNullable<SearchProductsShopQuery['search']>)['items']>)[number]>['price']>), { __typename?: 'SinglePrice' }>);
  export type PriceRangeInlineFragment = (DiscriminateUnion<(NonNullable<NonNullable<(NonNullable<(NonNullable<SearchProductsShopQuery['search']>)['items']>)[number]>['price']>), { __typename?: 'PriceRange' }>);
}

export namespace Register {
  export type Variables = RegisterMutationVariables;
  export type Mutation = RegisterMutation;
  export type RegisterCustomerAccount = (NonNullable<RegisterMutation['registerCustomerAccount']>);
  export type SuccessInlineFragment = (DiscriminateUnion<(NonNullable<RegisterMutation['registerCustomerAccount']>), { __typename?: 'Success' }>);
  export type ErrorResultInlineFragment = (DiscriminateUnion<(NonNullable<RegisterMutation['registerCustomerAccount']>), { __typename?: 'ErrorResult' }>);
}

export namespace CurrentUserShop {
  export type Fragment = CurrentUserShopFragment;
  export type Channels = NonNullable<(NonNullable<CurrentUserShopFragment['channels']>)[number]>;
}

export namespace Verify {
  export type Variables = VerifyMutationVariables;
  export type Mutation = VerifyMutation;
  export type VerifyCustomerAccount = (NonNullable<VerifyMutation['verifyCustomerAccount']>);
  export type ErrorResultInlineFragment = (DiscriminateUnion<(NonNullable<VerifyMutation['verifyCustomerAccount']>), { __typename?: 'ErrorResult' }>);
}

export namespace RefreshToken {
  export type Variables = RefreshTokenMutationVariables;
  export type Mutation = RefreshTokenMutation;
  export type RefreshCustomerVerification = (NonNullable<RefreshTokenMutation['refreshCustomerVerification']>);
  export type SuccessInlineFragment = (DiscriminateUnion<(NonNullable<RefreshTokenMutation['refreshCustomerVerification']>), { __typename?: 'Success' }>);
  export type ErrorResultInlineFragment = (DiscriminateUnion<(NonNullable<RefreshTokenMutation['refreshCustomerVerification']>), { __typename?: 'ErrorResult' }>);
}

export namespace RequestPasswordReset {
  export type Variables = RequestPasswordResetMutationVariables;
  export type Mutation = RequestPasswordResetMutation;
  export type RequestPasswordReset = (NonNullable<RequestPasswordResetMutation['requestPasswordReset']>);
  export type SuccessInlineFragment = (DiscriminateUnion<(NonNullable<RequestPasswordResetMutation['requestPasswordReset']>), { __typename?: 'Success' }>);
  export type ErrorResultInlineFragment = (DiscriminateUnion<(NonNullable<RequestPasswordResetMutation['requestPasswordReset']>), { __typename?: 'ErrorResult' }>);
}

export namespace ResetPassword {
  export type Variables = ResetPasswordMutationVariables;
  export type Mutation = ResetPasswordMutation;
  export type ResetPassword = (NonNullable<ResetPasswordMutation['resetPassword']>);
  export type ErrorResultInlineFragment = (DiscriminateUnion<(NonNullable<ResetPasswordMutation['resetPassword']>), { __typename?: 'ErrorResult' }>);
}

export namespace RequestUpdateEmailAddress {
  export type Variables = RequestUpdateEmailAddressMutationVariables;
  export type Mutation = RequestUpdateEmailAddressMutation;
  export type RequestUpdateCustomerEmailAddress = (NonNullable<RequestUpdateEmailAddressMutation['requestUpdateCustomerEmailAddress']>);
  export type SuccessInlineFragment = (DiscriminateUnion<(NonNullable<RequestUpdateEmailAddressMutation['requestUpdateCustomerEmailAddress']>), { __typename?: 'Success' }>);
  export type ErrorResultInlineFragment = (DiscriminateUnion<(NonNullable<RequestUpdateEmailAddressMutation['requestUpdateCustomerEmailAddress']>), { __typename?: 'ErrorResult' }>);
}

export namespace UpdateEmailAddress {
  export type Variables = UpdateEmailAddressMutationVariables;
  export type Mutation = UpdateEmailAddressMutation;
  export type UpdateCustomerEmailAddress = (NonNullable<UpdateEmailAddressMutation['updateCustomerEmailAddress']>);
  export type SuccessInlineFragment = (DiscriminateUnion<(NonNullable<UpdateEmailAddressMutation['updateCustomerEmailAddress']>), { __typename?: 'Success' }>);
  export type ErrorResultInlineFragment = (DiscriminateUnion<(NonNullable<UpdateEmailAddressMutation['updateCustomerEmailAddress']>), { __typename?: 'ErrorResult' }>);
}

export namespace GetActiveCustomer {
  export type Variables = GetActiveCustomerQueryVariables;
  export type Query = GetActiveCustomerQuery;
  export type ActiveCustomer = (NonNullable<GetActiveCustomerQuery['activeCustomer']>);
}

export namespace CreateAddressShop {
  export type Variables = CreateAddressShopMutationVariables;
  export type Mutation = CreateAddressShopMutation;
  export type CreateCustomerAddress = (NonNullable<CreateAddressShopMutation['createCustomerAddress']>);
  export type Country = (NonNullable<(NonNullable<CreateAddressShopMutation['createCustomerAddress']>)['country']>);
}

export namespace UpdateAddressShop {
  export type Variables = UpdateAddressShopMutationVariables;
  export type Mutation = UpdateAddressShopMutation;
  export type UpdateCustomerAddress = (NonNullable<UpdateAddressShopMutation['updateCustomerAddress']>);
  export type Country = (NonNullable<(NonNullable<UpdateAddressShopMutation['updateCustomerAddress']>)['country']>);
}

export namespace DeleteAddressShop {
  export type Variables = DeleteAddressShopMutationVariables;
  export type Mutation = DeleteAddressShopMutation;
  export type DeleteCustomerAddress = (NonNullable<DeleteAddressShopMutation['deleteCustomerAddress']>);
}

export namespace UpdateCustomer {
  export type Variables = UpdateCustomerMutationVariables;
  export type Mutation = UpdateCustomerMutation;
  export type UpdateCustomer = (NonNullable<UpdateCustomerMutation['updateCustomer']>);
}

export namespace UpdatePassword {
  export type Variables = UpdatePasswordMutationVariables;
  export type Mutation = UpdatePasswordMutation;
  export type UpdateCustomerPassword = (NonNullable<UpdatePasswordMutation['updateCustomerPassword']>);
  export type SuccessInlineFragment = (DiscriminateUnion<(NonNullable<UpdatePasswordMutation['updateCustomerPassword']>), { __typename?: 'Success' }>);
  export type ErrorResultInlineFragment = (DiscriminateUnion<(NonNullable<UpdatePasswordMutation['updateCustomerPassword']>), { __typename?: 'ErrorResult' }>);
}

export namespace GetActiveOrder {
  export type Variables = GetActiveOrderQueryVariables;
  export type Query = GetActiveOrderQuery;
  export type ActiveOrder = (NonNullable<GetActiveOrderQuery['activeOrder']>);
}

export namespace AdjustItemQuantity {
  export type Variables = AdjustItemQuantityMutationVariables;
  export type Mutation = AdjustItemQuantityMutation;
  export type AdjustOrderLine = (NonNullable<AdjustItemQuantityMutation['adjustOrderLine']>);
  export type ErrorResultInlineFragment = (DiscriminateUnion<(NonNullable<AdjustItemQuantityMutation['adjustOrderLine']>), { __typename?: 'ErrorResult' }>);
}

export namespace RemoveItemFromOrder {
  export type Variables = RemoveItemFromOrderMutationVariables;
  export type Mutation = RemoveItemFromOrderMutation;
  export type RemoveOrderLine = (NonNullable<RemoveItemFromOrderMutation['removeOrderLine']>);
  export type ErrorResultInlineFragment = (DiscriminateUnion<(NonNullable<RemoveItemFromOrderMutation['removeOrderLine']>), { __typename?: 'ErrorResult' }>);
}

export namespace GetShippingMethods {
  export type Variables = GetShippingMethodsQueryVariables;
  export type Query = GetShippingMethodsQuery;
  export type EligibleShippingMethods = NonNullable<(NonNullable<GetShippingMethodsQuery['eligibleShippingMethods']>)[number]>;
}

export namespace SetShippingMethod {
  export type Variables = SetShippingMethodMutationVariables;
  export type Mutation = SetShippingMethodMutation;
  export type SetOrderShippingMethod = (NonNullable<SetShippingMethodMutation['setOrderShippingMethod']>);
  export type ErrorResultInlineFragment = (DiscriminateUnion<(NonNullable<SetShippingMethodMutation['setOrderShippingMethod']>), { __typename?: 'ErrorResult' }>);
}

export namespace ActiveOrderCustomer {
  export type Fragment = ActiveOrderCustomerFragment;
  export type Customer = (NonNullable<ActiveOrderCustomerFragment['customer']>);
  export type Lines = NonNullable<(NonNullable<ActiveOrderCustomerFragment['lines']>)[number]>;
}

export namespace SetCustomerForOrder {
  export type Variables = SetCustomerForOrderMutationVariables;
  export type Mutation = SetCustomerForOrderMutation;
  export type SetCustomerForOrder = (NonNullable<SetCustomerForOrderMutation['setCustomerForOrder']>);
  export type ErrorResultInlineFragment = (DiscriminateUnion<(NonNullable<SetCustomerForOrderMutation['setCustomerForOrder']>), { __typename?: 'ErrorResult' }>);
}

export namespace GetOrderByCode {
  export type Variables = GetOrderByCodeQueryVariables;
  export type Query = GetOrderByCodeQuery;
  export type OrderByCode = (NonNullable<GetOrderByCodeQuery['orderByCode']>);
}

export namespace GetOrderPromotionsByCode {
  export type Variables = GetOrderPromotionsByCodeQueryVariables;
  export type Query = GetOrderPromotionsByCodeQuery;
  export type OrderByCode = (NonNullable<GetOrderPromotionsByCodeQuery['orderByCode']>);
  export type Promotions = NonNullable<(NonNullable<(NonNullable<GetOrderPromotionsByCodeQuery['orderByCode']>)['promotions']>)[number]>;
}

export namespace GetAvailableCountries {
  export type Variables = GetAvailableCountriesQueryVariables;
  export type Query = GetAvailableCountriesQuery;
  export type AvailableCountries = NonNullable<(NonNullable<GetAvailableCountriesQuery['availableCountries']>)[number]>;
}

export namespace TransitionToState {
  export type Variables = TransitionToStateMutationVariables;
  export type Mutation = TransitionToStateMutation;
  export type TransitionOrderToState = (NonNullable<TransitionToStateMutation['transitionOrderToState']>);
  export type OrderStateTransitionErrorInlineFragment = (DiscriminateUnion<(NonNullable<TransitionToStateMutation['transitionOrderToState']>), { __typename?: 'OrderStateTransitionError' }>);
}

export namespace SetShippingAddress {
  export type Variables = SetShippingAddressMutationVariables;
  export type Mutation = SetShippingAddressMutation;
  export type SetOrderShippingAddress = (NonNullable<SetShippingAddressMutation['setOrderShippingAddress']>);
  export type ShippingAddress = (NonNullable<(NonNullable<SetShippingAddressMutation['setOrderShippingAddress']>)['shippingAddress']>);
}

export namespace SetBillingAddress {
  export type Variables = SetBillingAddressMutationVariables;
  export type Mutation = SetBillingAddressMutation;
  export type SetOrderBillingAddress = (NonNullable<SetBillingAddressMutation['setOrderBillingAddress']>);
  export type BillingAddress = (NonNullable<(NonNullable<SetBillingAddressMutation['setOrderBillingAddress']>)['billingAddress']>);
}

export namespace TestOrderWithPayments {
  export type Fragment = TestOrderWithPaymentsFragment;
  export type Payments = NonNullable<(NonNullable<TestOrderWithPaymentsFragment['payments']>)[number]>;
}

export namespace GetActiveOrderWithPayments {
  export type Variables = GetActiveOrderWithPaymentsQueryVariables;
  export type Query = GetActiveOrderWithPaymentsQuery;
  export type ActiveOrder = (NonNullable<GetActiveOrderWithPaymentsQuery['activeOrder']>);
}

export namespace AddPaymentToOrder {
  export type Variables = AddPaymentToOrderMutationVariables;
  export type Mutation = AddPaymentToOrderMutation;
  export type AddPaymentToOrder = (NonNullable<AddPaymentToOrderMutation['addPaymentToOrder']>);
  export type ErrorResultInlineFragment = (DiscriminateUnion<(NonNullable<AddPaymentToOrderMutation['addPaymentToOrder']>), { __typename?: 'ErrorResult' }>);
  export type PaymentDeclinedErrorInlineFragment = (DiscriminateUnion<(NonNullable<AddPaymentToOrderMutation['addPaymentToOrder']>), { __typename?: 'PaymentDeclinedError' }>);
  export type PaymentFailedErrorInlineFragment = (DiscriminateUnion<(NonNullable<AddPaymentToOrderMutation['addPaymentToOrder']>), { __typename?: 'PaymentFailedError' }>);
}

export namespace GetActiveOrderPayments {
  export type Variables = GetActiveOrderPaymentsQueryVariables;
  export type Query = GetActiveOrderPaymentsQuery;
  export type ActiveOrder = (NonNullable<GetActiveOrderPaymentsQuery['activeOrder']>);
  export type Payments = NonNullable<(NonNullable<(NonNullable<GetActiveOrderPaymentsQuery['activeOrder']>)['payments']>)[number]>;
}

export namespace GetOrderByCodeWithPayments {
  export type Variables = GetOrderByCodeWithPaymentsQueryVariables;
  export type Query = GetOrderByCodeWithPaymentsQuery;
  export type OrderByCode = (NonNullable<GetOrderByCodeWithPaymentsQuery['orderByCode']>);
}

export namespace GetNextOrderStates {
  export type Variables = GetNextOrderStatesQueryVariables;
  export type Query = GetNextOrderStatesQuery;
}

export namespace GetCustomerAddresses {
  export type Variables = GetCustomerAddressesQueryVariables;
  export type Query = GetCustomerAddressesQuery;
  export type ActiveOrder = (NonNullable<GetCustomerAddressesQuery['activeOrder']>);
  export type Customer = (NonNullable<(NonNullable<GetCustomerAddressesQuery['activeOrder']>)['customer']>);
  export type Addresses = NonNullable<(NonNullable<(NonNullable<(NonNullable<GetCustomerAddressesQuery['activeOrder']>)['customer']>)['addresses']>)[number]>;
}

export namespace GetCustomerOrders {
  export type Variables = GetCustomerOrdersQueryVariables;
  export type Query = GetCustomerOrdersQuery;
  export type ActiveOrder = (NonNullable<GetCustomerOrdersQuery['activeOrder']>);
  export type Customer = (NonNullable<(NonNullable<GetCustomerOrdersQuery['activeOrder']>)['customer']>);
  export type Orders = (NonNullable<(NonNullable<(NonNullable<GetCustomerOrdersQuery['activeOrder']>)['customer']>)['orders']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<(NonNullable<(NonNullable<GetCustomerOrdersQuery['activeOrder']>)['customer']>)['orders']>)['items']>)[number]>;
}

export namespace ApplyCouponCode {
  export type Variables = ApplyCouponCodeMutationVariables;
  export type Mutation = ApplyCouponCodeMutation;
  export type ApplyCouponCode = (NonNullable<ApplyCouponCodeMutation['applyCouponCode']>);
  export type ErrorResultInlineFragment = (DiscriminateUnion<(NonNullable<ApplyCouponCodeMutation['applyCouponCode']>), { __typename?: 'ErrorResult' }>);
}

export namespace RemoveCouponCode {
  export type Variables = RemoveCouponCodeMutationVariables;
  export type Mutation = RemoveCouponCodeMutation;
  export type RemoveCouponCode = (NonNullable<RemoveCouponCodeMutation['removeCouponCode']>);
}

export namespace RemoveAllOrderLines {
  export type Variables = RemoveAllOrderLinesMutationVariables;
  export type Mutation = RemoveAllOrderLinesMutation;
  export type RemoveAllOrderLines = (NonNullable<RemoveAllOrderLinesMutation['removeAllOrderLines']>);
  export type ErrorResultInlineFragment = (DiscriminateUnion<(NonNullable<RemoveAllOrderLinesMutation['removeAllOrderLines']>), { __typename?: 'ErrorResult' }>);
}
