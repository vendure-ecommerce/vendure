// tslint:disable
export type Maybe<T> = T;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string | number;
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
    __typename?: 'Mutation';
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
    __typename?: 'Adjustment';
    adjustmentSource: Scalars['String'];
    type: AdjustmentType;
    description: Scalars['String'];
    amount: Scalars['Int'];
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

export enum DeletionResult {
    /** The entity was successfully deleted */
    DELETED = 'DELETED',
    /** Deletion did not take place, reason given in message */
    NOT_DELETED = 'NOT_DELETED',
}

export type DeletionResponse = {
    __typename?: 'DeletionResponse';
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
    NOT_VERIFIED_ERROR = 'NOT_VERIFIED_ERROR',
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
    __typename?: 'Success';
    success: Scalars['Boolean'];
};

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

export type LocalizedString = {
    __typename?: 'LocalizedString';
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
    DeleteSettings = 'DeleteSettings',
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
    __typename?: 'OrderModificationError';
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

/** Returned when attempting to add a Payment to an Order that is not in the `ArrangingPayment` state. */
export type OrderPaymentStateError = ErrorResult & {
    __typename?: 'OrderPaymentStateError';
    errorCode: ErrorCode;
    message: Scalars['String'];
};

/** Returned when a Payment fails due to an error. */
export type PaymentFailedError = ErrorResult & {
    __typename?: 'PaymentFailedError';
    errorCode: ErrorCode;
    message: Scalars['String'];
    paymentErrorMessage: Scalars['String'];
};

/** Returned when a Payment is declined by the payment provider. */
export type PaymentDeclinedError = ErrorResult & {
    __typename?: 'PaymentDeclinedError';
    errorCode: ErrorCode;
    message: Scalars['String'];
    paymentErrorMessage: Scalars['String'];
};

/** Returned if the provided coupon code is invalid */
export type CouponCodeInvalidError = ErrorResult & {
    __typename?: 'CouponCodeInvalidError';
    errorCode: ErrorCode;
    message: Scalars['String'];
    couponCode: Scalars['String'];
};

/** Returned if the provided coupon code is invalid */
export type CouponCodeExpiredError = ErrorResult & {
    __typename?: 'CouponCodeExpiredError';
    errorCode: ErrorCode;
    message: Scalars['String'];
    couponCode: Scalars['String'];
};

/** Returned if the provided coupon code is invalid */
export type CouponCodeLimitError = ErrorResult & {
    __typename?: 'CouponCodeLimitError';
    errorCode: ErrorCode;
    message: Scalars['String'];
    couponCode: Scalars['String'];
    limit: Scalars['Int'];
};

/** Retured when attemting to set the Customer for an Order when already logged in. */
export type AlreadyLoggedInError = ErrorResult & {
    __typename?: 'AlreadyLoggedInError';
    errorCode: ErrorCode;
    message: Scalars['String'];
};

/** Retured when attemting to register or verify a customer account without a password, when one is required. */
export type MissingPasswordError = ErrorResult & {
    __typename?: 'MissingPasswordError';
    errorCode: ErrorCode;
    message: Scalars['String'];
};

/** Retured when attemting to verify a customer account with a password, when a password has already been set. */
export type PasswordAlreadySetError = ErrorResult & {
    __typename?: 'PasswordAlreadySetError';
    errorCode: ErrorCode;
    message: Scalars['String'];
};

/**
 * Retured if the verification token (used to verify a Customer's email address) is either
 * invalid or does not match any expected tokens.
 */
export type VerificationTokenInvalidError = ErrorResult & {
    __typename?: 'VerificationTokenInvalidError';
    errorCode: ErrorCode;
    message: Scalars['String'];
};

/**
 * Returned if the verification token (used to verify a Customer's email address) is valid, but has
 * expired according to the `verificationTokenDuration` setting in the AuthOptions.
 */
export type VerificationTokenExpiredError = ErrorResult & {
    __typename?: 'VerificationTokenExpiredError';
    errorCode: ErrorCode;
    message: Scalars['String'];
};

/**
 * Retured if the token used to change a Customer's email address is either
 * invalid or does not match any expected tokens.
 */
export type IdentifierChangeTokenInvalidError = ErrorResult & {
    __typename?: 'IdentifierChangeTokenInvalidError';
    errorCode: ErrorCode;
    message: Scalars['String'];
};

/**
 * Retured if the token used to change a Customer's email address is valid, but has
 * expired according to the `verificationTokenDuration` setting in the AuthOptions.
 */
export type IdentifierChangeTokenExpiredError = ErrorResult & {
    __typename?: 'IdentifierChangeTokenExpiredError';
    errorCode: ErrorCode;
    message: Scalars['String'];
};

/**
 * Retured if the token used to reset a Customer's password is either
 * invalid or does not match any expected tokens.
 */
export type PasswordResetTokenInvalidError = ErrorResult & {
    __typename?: 'PasswordResetTokenInvalidError';
    errorCode: ErrorCode;
    message: Scalars['String'];
};

/**
 * Retured if the token used to reset a Customer's password is valid, but has
 * expired according to the `verificationTokenDuration` setting in the AuthOptions.
 */
export type PasswordResetTokenExpiredError = ErrorResult & {
    __typename?: 'PasswordResetTokenExpiredError';
    errorCode: ErrorCode;
    message: Scalars['String'];
};

/**
 * Returned if `authOptions.requireVerification` is set to `true` (which is the default)
 * and an unverified user attempts to authenticate.
 */
export type NotVerifiedError = ErrorResult & {
    __typename?: 'NotVerifiedError';
    errorCode: ErrorCode;
    message: Scalars['String'];
};

export type UpdateOrderItemsResult = Order | OrderModificationError | OrderLimitError | NegativeQuantityError;

export type RemoveOrderItemsResult = Order | OrderModificationError;

export type SetOrderShippingMethodResult = Order | OrderModificationError;

export type ApplyCouponCodeResult =
    | Order
    | CouponCodeExpiredError
    | CouponCodeInvalidError
    | CouponCodeLimitError;

export type AddPaymentToOrderResult =
    | Order
    | OrderPaymentStateError
    | PaymentFailedError
    | PaymentDeclinedError
    | OrderStateTransitionError;

export type TransitionOrderToStateResult = Order | OrderStateTransitionError;

export type SetCustomerForOrderResult = Order | AlreadyLoggedInError | EmailAddressConflictError;

export type RegisterCustomerAccountResult = Success | MissingPasswordError | NativeAuthStrategyError;

export type RefreshCustomerVerificationResult = Success | NativeAuthStrategyError;

export type VerifyCustomerAccountResult =
    | CurrentUser
    | VerificationTokenInvalidError
    | VerificationTokenExpiredError
    | MissingPasswordError
    | PasswordAlreadySetError
    | NativeAuthStrategyError;

export type UpdateCustomerPasswordResult = Success | InvalidCredentialsError | NativeAuthStrategyError;

export type RequestUpdateCustomerEmailAddressResult =
    | Success
    | InvalidCredentialsError
    | EmailAddressConflictError
    | NativeAuthStrategyError;

export type UpdateCustomerEmailAddressResult =
    | Success
    | IdentifierChangeTokenInvalidError
    | IdentifierChangeTokenExpiredError
    | NativeAuthStrategyError;

export type RequestPasswordResetResult = Success | NativeAuthStrategyError;

export type ResetPasswordResult =
    | CurrentUser
    | PasswordResetTokenInvalidError
    | PasswordResetTokenExpiredError
    | NativeAuthStrategyError;

export type NativeAuthenticationResult =
    | CurrentUser
    | InvalidCredentialsError
    | NotVerifiedError
    | NativeAuthStrategyError;

export type AuthenticationResult = CurrentUser | InvalidCredentialsError | NotVerifiedError;

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

export type Administrator = Node & {
    __typename?: 'Administrator';
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    firstName: Scalars['String'];
    lastName: Scalars['String'];
    emailAddress: Scalars['String'];
    user: User;
};

export type AdministratorList = PaginatedList & {
    __typename?: 'AdministratorList';
    items: Array<Administrator>;
    totalItems: Scalars['Int'];
};

export type Asset = Node & {
    __typename?: 'Asset';
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
    BINARY = 'BINARY',
}

export type CurrentUser = {
    __typename?: 'CurrentUser';
    id: Scalars['ID'];
    identifier: Scalars['String'];
    channels: Array<CurrentUserChannel>;
};

export type CurrentUserChannel = {
    __typename?: 'CurrentUserChannel';
    id: Scalars['ID'];
    token: Scalars['String'];
    code: Scalars['String'];
    permissions: Array<Permission>;
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
};

export type Collection = Node & {
    __typename?: 'Collection';
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

export type Customer = Node & {
    __typename?: 'Customer';
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

export type Facet = Node & {
    __typename?: 'Facet';
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

export type GlobalSettings = {
    __typename?: 'GlobalSettings';
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    availableLanguages: Array<LanguageCode>;
    trackInventory: Scalars['Boolean'];
    serverConfig: ServerConfig;
    customFields?: Maybe<Scalars['JSON']>;
};

export type OrderProcessState = {
    __typename?: 'OrderProcessState';
    name: Scalars['String'];
    to: Array<Scalars['String']>;
};

export type ServerConfig = {
    __typename?: 'ServerConfig';
    orderProcess: Array<OrderProcessState>;
    permittedAssetTypes: Array<Scalars['String']>;
    customFieldConfig: CustomFields;
};

export type HistoryEntry = Node & {
    __typename?: 'HistoryEntry';
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
    __typename?: 'HistoryEntryList';
    items: Array<HistoryEntry>;
    totalItems: Scalars['Int'];
};

export type ImportInfo = {
    __typename?: 'ImportInfo';
    errors?: Maybe<Array<Scalars['String']>>;
    processed: Scalars['Int'];
    imported: Scalars['Int'];
};

export type Order = Node & {
    __typename?: 'Order';
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
};

export type OrderList = PaginatedList & {
    __typename?: 'OrderList';
    items: Array<Order>;
    totalItems: Scalars['Int'];
};

export type ShippingMethodQuote = {
    __typename?: 'ShippingMethodQuote';
    id: Scalars['ID'];
    price: Scalars['Int'];
    priceWithTax: Scalars['Int'];
    description: Scalars['String'];
    metadata?: Maybe<Scalars['JSON']>;
};

export type OrderItem = Node & {
    __typename?: 'OrderItem';
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
    __typename?: 'OrderLine';
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
    __typename?: 'Payment';
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

export type Fulfillment = Node & {
    __typename?: 'Fulfillment';
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    orderItems: Array<OrderItem>;
    state: Scalars['String'];
    method: Scalars['String'];
    trackingCode?: Maybe<Scalars['String']>;
};

export type PaymentMethod = Node & {
    __typename?: 'PaymentMethod';
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    code: Scalars['String'];
    enabled: Scalars['Boolean'];
    configArgs: Array<ConfigArg>;
    definition: ConfigurableOperationDefinition;
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

export type SearchResultAsset = {
    __typename?: 'SearchResultAsset';
    id: Scalars['ID'];
    preview: Scalars['String'];
    focalPoint?: Maybe<Coordinate>;
};

export type SearchResult = {
    __typename?: 'SearchResult';
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
    __typename?: 'SinglePrice';
    value: Scalars['Int'];
};

/** The price range where the result has more than one price */
export type PriceRange = {
    __typename?: 'PriceRange';
    min: Scalars['Int'];
    max: Scalars['Int'];
};

export type Product = Node & {
    __typename?: 'Product';
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

export type ProductVariant = Node & {
    __typename?: 'ProductVariant';
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
    description: Scalars['String'];
    checker: ConfigurableOperation;
    calculator: ConfigurableOperation;
    customFields?: Maybe<Scalars['JSON']>;
};

export type ShippingMethodList = PaginatedList & {
    __typename?: 'ShippingMethodList';
    items: Array<ShippingMethod>;
    totalItems: Scalars['Int'];
};

export enum StockMovementType {
    ADJUSTMENT = 'ADJUSTMENT',
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
        __typename?: 'StockAdjustment';
        id: Scalars['ID'];
        createdAt: Scalars['DateTime'];
        updatedAt: Scalars['DateTime'];
        productVariant: ProductVariant;
        type: StockMovementType;
        quantity: Scalars['Int'];
    };

export type Sale = Node &
    StockMovement & {
        __typename?: 'Sale';
        id: Scalars['ID'];
        createdAt: Scalars['DateTime'];
        updatedAt: Scalars['DateTime'];
        productVariant: ProductVariant;
        type: StockMovementType;
        quantity: Scalars['Int'];
        orderLine: OrderLine;
    };

export type Cancellation = Node &
    StockMovement & {
        __typename?: 'Cancellation';
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
        __typename?: 'Return';
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
    __typename?: 'StockMovementList';
    items: Array<StockMovementItem>;
    totalItems: Scalars['Int'];
};

export type TaxCategory = Node & {
    __typename?: 'TaxCategory';
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    name: Scalars['String'];
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
    __typename?: 'CustomFields';
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
