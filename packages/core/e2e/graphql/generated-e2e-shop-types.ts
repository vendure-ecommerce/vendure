// tslint:disable
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the
     * `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO
     * 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    DateTime: any;
    /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
    JSON: any;
    /** The `Upload` scalar type represents a file upload. */
    Upload: any;
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

export type Adjustment = {
    __typename?: 'Adjustment';
    adjustmentSource: Scalars['String'];
    type: AdjustmentType;
    description: Scalars['String'];
    amount: Scalars['Int'];
};

export enum AdjustmentType {
    TAX = 'TAX',
    PROMOTION = 'PROMOTION',
    SHIPPING = 'SHIPPING',
    REFUND = 'REFUND',
    TAX_REFUND = 'TAX_REFUND',
    PROMOTION_REFUND = 'PROMOTION_REFUND',
    SHIPPING_REFUND = 'SHIPPING_REFUND',
}

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

export type BooleanCustomFieldConfig = CustomField & {
    __typename?: 'BooleanCustomFieldConfig';
    name: Scalars['String'];
    type: Scalars['String'];
    label?: Maybe<Array<LocalizedString>>;
    description?: Maybe<Array<LocalizedString>>;
    readonly?: Maybe<Scalars['Boolean']>;
    internal?: Maybe<Scalars['Boolean']>;
};

export type BooleanOperators = {
    eq?: Maybe<Scalars['Boolean']>;
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
};

export type CollectionFilterParameter = {
    createdAt?: Maybe<DateOperators>;
    updatedAt?: Maybe<DateOperators>;
    languageCode?: Maybe<StringOperators>;
    name?: Maybe<StringOperators>;
    position?: Maybe<NumberOperators>;
    description?: Maybe<StringOperators>;
};

export type CollectionList = PaginatedList & {
    __typename?: 'CollectionList';
    items: Array<Collection>;
    totalItems: Scalars['Int'];
};

export type CollectionListOptions = {
    skip?: Maybe<Scalars['Int']>;
    take?: Maybe<Scalars['Int']>;
    sort?: Maybe<CollectionSortParameter>;
    filter?: Maybe<CollectionFilterParameter>;
};

export type CollectionSortParameter = {
    id?: Maybe<SortOrder>;
    createdAt?: Maybe<SortOrder>;
    updatedAt?: Maybe<SortOrder>;
    name?: Maybe<SortOrder>;
    position?: Maybe<SortOrder>;
    description?: Maybe<SortOrder>;
};

export type CollectionTranslation = {
    __typename?: 'CollectionTranslation';
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    languageCode: LanguageCode;
    name: Scalars['String'];
    description: Scalars['String'];
};

export type ConfigArg = {
    __typename?: 'ConfigArg';
    name: Scalars['String'];
    type: Scalars['String'];
    value: Scalars['String'];
};

export type ConfigArgDefinition = {
    __typename?: 'ConfigArgDefinition';
    name: Scalars['String'];
    type: Scalars['String'];
    label?: Maybe<Scalars['String']>;
    description?: Maybe<Scalars['String']>;
    config?: Maybe<Scalars['JSON']>;
};

export type ConfigArgInput = {
    name: Scalars['String'];
    type: Scalars['String'];
    value: Scalars['String'];
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

export type ConfigurableOperationInput = {
    code: Scalars['String'];
    arguments: Array<ConfigArgInput>;
};

export type Coordinate = {
    __typename?: 'Coordinate';
    x: Scalars['Float'];
    y: Scalars['Float'];
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

export type CountryList = PaginatedList & {
    __typename?: 'CountryList';
    items: Array<Country>;
    totalItems: Scalars['Int'];
};

export type CountryTranslation = {
    __typename?: 'CountryTranslation';
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    languageCode: LanguageCode;
    name: Scalars['String'];
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

export type CreateCustomerInput = {
    title?: Maybe<Scalars['String']>;
    firstName: Scalars['String'];
    lastName: Scalars['String'];
    phoneNumber?: Maybe<Scalars['String']>;
    emailAddress: Scalars['String'];
    customFields?: Maybe<Scalars['JSON']>;
};

/** @description
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
    CHE = 'CHE',
    /** Swiss franc */
    CHW = 'CHW',
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

export type CustomerGroup = Node & {
    __typename?: 'CustomerGroup';
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    name: Scalars['String'];
};

export type CustomerList = PaginatedList & {
    __typename?: 'CustomerList';
    items: Array<Customer>;
    totalItems: Scalars['Int'];
};

export type CustomField = {
    __typename?: 'CustomField';
    name: Scalars['String'];
    type: Scalars['String'];
    label?: Maybe<Array<LocalizedString>>;
    description?: Maybe<Array<LocalizedString>>;
    readonly?: Maybe<Scalars['Boolean']>;
    internal?: Maybe<Scalars['Boolean']>;
};

export type CustomFieldConfig =
    | StringCustomFieldConfig
    | LocaleStringCustomFieldConfig
    | IntCustomFieldConfig
    | FloatCustomFieldConfig
    | BooleanCustomFieldConfig
    | DateTimeCustomFieldConfig;

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
};

export type DateOperators = {
    eq?: Maybe<Scalars['DateTime']>;
    before?: Maybe<Scalars['DateTime']>;
    after?: Maybe<Scalars['DateTime']>;
    between?: Maybe<DateRange>;
};

export type DateRange = {
    start: Scalars['DateTime'];
    end: Scalars['DateTime'];
};

/** Expects the same validation formats as the <input type="datetime-local"> HTML element.
 * See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local#Additional_attributes
 */
export type DateTimeCustomFieldConfig = CustomField & {
    __typename?: 'DateTimeCustomFieldConfig';
    name: Scalars['String'];
    type: Scalars['String'];
    label?: Maybe<Array<LocalizedString>>;
    description?: Maybe<Array<LocalizedString>>;
    readonly?: Maybe<Scalars['Boolean']>;
    internal?: Maybe<Scalars['Boolean']>;
    min?: Maybe<Scalars['String']>;
    max?: Maybe<Scalars['String']>;
    step?: Maybe<Scalars['Int']>;
};

export type DeletionResponse = {
    __typename?: 'DeletionResponse';
    result: DeletionResult;
    message?: Maybe<Scalars['String']>;
};

export enum DeletionResult {
    /** The entity was successfully deleted */
    DELETED = 'DELETED',
    /** Deletion did not take place, reason given in message */
    NOT_DELETED = 'NOT_DELETED',
}

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

export type FacetList = PaginatedList & {
    __typename?: 'FacetList';
    items: Array<Facet>;
    totalItems: Scalars['Int'];
};

export type FacetTranslation = {
    __typename?: 'FacetTranslation';
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    languageCode: LanguageCode;
    name: Scalars['String'];
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

/** Which FacetValues are present in the products returned
 * by the search, and in what quantity.
 */
export type FacetValueResult = {
    __typename?: 'FacetValueResult';
    facetValue: FacetValue;
    count: Scalars['Int'];
};

export type FacetValueTranslation = {
    __typename?: 'FacetValueTranslation';
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    languageCode: LanguageCode;
    name: Scalars['String'];
};

export type FloatCustomFieldConfig = CustomField & {
    __typename?: 'FloatCustomFieldConfig';
    name: Scalars['String'];
    type: Scalars['String'];
    label?: Maybe<Array<LocalizedString>>;
    description?: Maybe<Array<LocalizedString>>;
    readonly?: Maybe<Scalars['Boolean']>;
    internal?: Maybe<Scalars['Boolean']>;
    min?: Maybe<Scalars['Float']>;
    max?: Maybe<Scalars['Float']>;
    step?: Maybe<Scalars['Float']>;
};

export type Fulfillment = Node & {
    __typename?: 'Fulfillment';
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    orderItems: Array<OrderItem>;
    method: Scalars['String'];
    trackingCode?: Maybe<Scalars['String']>;
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

export type HistoryEntryFilterParameter = {
    createdAt?: Maybe<DateOperators>;
    updatedAt?: Maybe<DateOperators>;
    isPublic?: Maybe<BooleanOperators>;
    type?: Maybe<StringOperators>;
};

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

export type HistoryEntrySortParameter = {
    id?: Maybe<SortOrder>;
    createdAt?: Maybe<SortOrder>;
    updatedAt?: Maybe<SortOrder>;
};

export enum HistoryEntryType {
    ORDER_STATE_TRANSITION = 'ORDER_STATE_TRANSITION',
    ORDER_PAYMENT_TRANSITION = 'ORDER_PAYMENT_TRANSITION',
    ORDER_FULLFILLMENT = 'ORDER_FULLFILLMENT',
    ORDER_CANCELLATION = 'ORDER_CANCELLATION',
    ORDER_REFUND_TRANSITION = 'ORDER_REFUND_TRANSITION',
    ORDER_NOTE = 'ORDER_NOTE',
    ORDER_COUPON_APPLIED = 'ORDER_COUPON_APPLIED',
    ORDER_COUPON_REMOVED = 'ORDER_COUPON_REMOVED',
}

export type ImportInfo = {
    __typename?: 'ImportInfo';
    errors?: Maybe<Array<Scalars['String']>>;
    processed: Scalars['Int'];
    imported: Scalars['Int'];
};

export type IntCustomFieldConfig = CustomField & {
    __typename?: 'IntCustomFieldConfig';
    name: Scalars['String'];
    type: Scalars['String'];
    label?: Maybe<Array<LocalizedString>>;
    description?: Maybe<Array<LocalizedString>>;
    readonly?: Maybe<Scalars['Boolean']>;
    internal?: Maybe<Scalars['Boolean']>;
    min?: Maybe<Scalars['Int']>;
    max?: Maybe<Scalars['Int']>;
    step?: Maybe<Scalars['Int']>;
};

/** @description
 * ISO 639-1 language code
 *
 * @docsCategory common
 */
export enum LanguageCode {
    /** Afar */
    aa = 'aa',
    /** Abkhazian */
    ab = 'ab',
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
    /** Aragonese */
    an = 'an',
    /** Armenian */
    hy = 'hy',
    /** Assamese */
    as = 'as',
    /** Avaric */
    av = 'av',
    /** Avestan */
    ae = 'ae',
    /** Aymara */
    ay = 'ay',
    /** Azerbaijani */
    az = 'az',
    /** Bashkir */
    ba = 'ba',
    /** Bambara */
    bm = 'bm',
    /** Basque */
    eu = 'eu',
    /** Belarusian */
    be = 'be',
    /** Bengali */
    bn = 'bn',
    /** Bihari languages */
    bh = 'bh',
    /** Bislama */
    bi = 'bi',
    /** Bosnian */
    bs = 'bs',
    /** Breton */
    br = 'br',
    /** Bulgarian */
    bg = 'bg',
    /** Burmese */
    my = 'my',
    /** Catalan; Valencian */
    ca = 'ca',
    /** Chamorro */
    ch = 'ch',
    /** Chechen */
    ce = 'ce',
    /** Chinese */
    zh = 'zh',
    /** Church Slavic; Old Slavonic; Church Slavonic; Old Bulgarian; Old Church Slavonic */
    cu = 'cu',
    /** Chuvash */
    cv = 'cv',
    /** Cornish */
    kw = 'kw',
    /** Corsican */
    co = 'co',
    /** Cree */
    cr = 'cr',
    /** Czech */
    cs = 'cs',
    /** Danish */
    da = 'da',
    /** Divehi; Dhivehi; Maldivian */
    dv = 'dv',
    /** Dutch; Flemish */
    nl = 'nl',
    /** Dzongkha */
    dz = 'dz',
    /** English */
    en = 'en',
    /** Esperanto */
    eo = 'eo',
    /** Estonian */
    et = 'et',
    /** Ewe */
    ee = 'ee',
    /** Faroese */
    fo = 'fo',
    /** Fijian */
    fj = 'fj',
    /** Finnish */
    fi = 'fi',
    /** French */
    fr = 'fr',
    /** Western Frisian */
    fy = 'fy',
    /** Fulah */
    ff = 'ff',
    /** Georgian */
    ka = 'ka',
    /** German */
    de = 'de',
    /** Gaelic; Scottish Gaelic */
    gd = 'gd',
    /** Irish */
    ga = 'ga',
    /** Galician */
    gl = 'gl',
    /** Manx */
    gv = 'gv',
    /** Greek, Modern (1453-) */
    el = 'el',
    /** Guarani */
    gn = 'gn',
    /** Gujarati */
    gu = 'gu',
    /** Haitian; Haitian Creole */
    ht = 'ht',
    /** Hausa */
    ha = 'ha',
    /** Hebrew */
    he = 'he',
    /** Herero */
    hz = 'hz',
    /** Hindi */
    hi = 'hi',
    /** Hiri Motu */
    ho = 'ho',
    /** Croatian */
    hr = 'hr',
    /** Hungarian */
    hu = 'hu',
    /** Igbo */
    ig = 'ig',
    /** Icelandic */
    is = 'is',
    /** Ido */
    io = 'io',
    /** Sichuan Yi; Nuosu */
    ii = 'ii',
    /** Inuktitut */
    iu = 'iu',
    /** Interlingue; Occidental */
    ie = 'ie',
    /** Interlingua (International Auxiliary Language Association) */
    ia = 'ia',
    /** Indonesian */
    id = 'id',
    /** Inupiaq */
    ik = 'ik',
    /** Italian */
    it = 'it',
    /** Javanese */
    jv = 'jv',
    /** Japanese */
    ja = 'ja',
    /** Kalaallisut; Greenlandic */
    kl = 'kl',
    /** Kannada */
    kn = 'kn',
    /** Kashmiri */
    ks = 'ks',
    /** Kanuri */
    kr = 'kr',
    /** Kazakh */
    kk = 'kk',
    /** Central Khmer */
    km = 'km',
    /** Kikuyu; Gikuyu */
    ki = 'ki',
    /** Kinyarwanda */
    rw = 'rw',
    /** Kirghiz; Kyrgyz */
    ky = 'ky',
    /** Komi */
    kv = 'kv',
    /** Kongo */
    kg = 'kg',
    /** Korean */
    ko = 'ko',
    /** Kuanyama; Kwanyama */
    kj = 'kj',
    /** Kurdish */
    ku = 'ku',
    /** Lao */
    lo = 'lo',
    /** Latin */
    la = 'la',
    /** Latvian */
    lv = 'lv',
    /** Limburgan; Limburger; Limburgish */
    li = 'li',
    /** Lingala */
    ln = 'ln',
    /** Lithuanian */
    lt = 'lt',
    /** Luxembourgish; Letzeburgesch */
    lb = 'lb',
    /** Luba-Katanga */
    lu = 'lu',
    /** Ganda */
    lg = 'lg',
    /** Macedonian */
    mk = 'mk',
    /** Marshallese */
    mh = 'mh',
    /** Malayalam */
    ml = 'ml',
    /** Maori */
    mi = 'mi',
    /** Marathi */
    mr = 'mr',
    /** Malay */
    ms = 'ms',
    /** Malagasy */
    mg = 'mg',
    /** Maltese */
    mt = 'mt',
    /** Mongolian */
    mn = 'mn',
    /** Nauru */
    na = 'na',
    /** Navajo; Navaho */
    nv = 'nv',
    /** Ndebele, South; South Ndebele */
    nr = 'nr',
    /** Ndebele, North; North Ndebele */
    nd = 'nd',
    /** Ndonga */
    ng = 'ng',
    /** Nepali */
    ne = 'ne',
    /** Norwegian Nynorsk; Nynorsk, Norwegian */
    nn = 'nn',
    /** Bokmål, Norwegian; Norwegian Bokmål */
    nb = 'nb',
    /** Norwegian */
    no = 'no',
    /** Chichewa; Chewa; Nyanja */
    ny = 'ny',
    /** Occitan (post 1500); Provençal */
    oc = 'oc',
    /** Ojibwa */
    oj = 'oj',
    /** Oriya */
    or = 'or',
    /** Oromo */
    om = 'om',
    /** Ossetian; Ossetic */
    os = 'os',
    /** Panjabi; Punjabi */
    pa = 'pa',
    /** Persian */
    fa = 'fa',
    /** Pali */
    pi = 'pi',
    /** Polish */
    pl = 'pl',
    /** Portuguese */
    pt = 'pt',
    /** Pushto; Pashto */
    ps = 'ps',
    /** Quechua */
    qu = 'qu',
    /** Romansh */
    rm = 'rm',
    /** Romanian; Moldavian; Moldovan */
    ro = 'ro',
    /** Rundi */
    rn = 'rn',
    /** Russian */
    ru = 'ru',
    /** Sango */
    sg = 'sg',
    /** Sanskrit */
    sa = 'sa',
    /** Sinhala; Sinhalese */
    si = 'si',
    /** Slovak */
    sk = 'sk',
    /** Slovenian */
    sl = 'sl',
    /** Northern Sami */
    se = 'se',
    /** Samoan */
    sm = 'sm',
    /** Shona */
    sn = 'sn',
    /** Sindhi */
    sd = 'sd',
    /** Somali */
    so = 'so',
    /** Sotho, Southern */
    st = 'st',
    /** Spanish; Castilian */
    es = 'es',
    /** Sardinian */
    sc = 'sc',
    /** Serbian */
    sr = 'sr',
    /** Swati */
    ss = 'ss',
    /** Sundanese */
    su = 'su',
    /** Swahili */
    sw = 'sw',
    /** Swedish */
    sv = 'sv',
    /** Tahitian */
    ty = 'ty',
    /** Tamil */
    ta = 'ta',
    /** Tatar */
    tt = 'tt',
    /** Telugu */
    te = 'te',
    /** Tajik */
    tg = 'tg',
    /** Tagalog */
    tl = 'tl',
    /** Thai */
    th = 'th',
    /** Tibetan */
    bo = 'bo',
    /** Tigrinya */
    ti = 'ti',
    /** Tonga (Tonga Islands) */
    to = 'to',
    /** Tswana */
    tn = 'tn',
    /** Tsonga */
    ts = 'ts',
    /** Turkmen */
    tk = 'tk',
    /** Turkish */
    tr = 'tr',
    /** Twi */
    tw = 'tw',
    /** Uighur; Uyghur */
    ug = 'ug',
    /** Ukrainian */
    uk = 'uk',
    /** Urdu */
    ur = 'ur',
    /** Uzbek */
    uz = 'uz',
    /** Venda */
    ve = 've',
    /** Vietnamese */
    vi = 'vi',
    /** Volapük */
    vo = 'vo',
    /** Welsh */
    cy = 'cy',
    /** Walloon */
    wa = 'wa',
    /** Wolof */
    wo = 'wo',
    /** Xhosa */
    xh = 'xh',
    /** Yiddish */
    yi = 'yi',
    /** Yoruba */
    yo = 'yo',
    /** Zhuang; Chuang */
    za = 'za',
    /** Zulu */
    zu = 'zu',
}

export type LocaleStringCustomFieldConfig = CustomField & {
    __typename?: 'LocaleStringCustomFieldConfig';
    name: Scalars['String'];
    type: Scalars['String'];
    label?: Maybe<Array<LocalizedString>>;
    description?: Maybe<Array<LocalizedString>>;
    readonly?: Maybe<Scalars['Boolean']>;
    internal?: Maybe<Scalars['Boolean']>;
    pattern?: Maybe<Scalars['String']>;
};

export type LocalizedString = {
    __typename?: 'LocalizedString';
    languageCode: LanguageCode;
    value: Scalars['String'];
};

export type LoginResult = {
    __typename?: 'LoginResult';
    user: CurrentUser;
};

export type Mutation = {
    __typename?: 'Mutation';
    /** Adds an item to the order. If custom fields are defined on the OrderLine
     * entity, a third argument 'customFields' will be available.
     */
    addItemToOrder?: Maybe<Order>;
    removeOrderLine?: Maybe<Order>;
    /** Adjusts an OrderLine. If custom fields are defined on the OrderLine entity, a
     * third argument 'customFields' will be available.
     */
    adjustOrderLine?: Maybe<Order>;
    /** Applies the given coupon code to the active Order */
    applyCouponCode?: Maybe<Order>;
    /** Removes the given coupon code from the active Order */
    removeCouponCode?: Maybe<Order>;
    transitionOrderToState?: Maybe<Order>;
    setOrderShippingAddress?: Maybe<Order>;
    setOrderShippingMethod?: Maybe<Order>;
    addPaymentToOrder?: Maybe<Order>;
    setCustomerForOrder?: Maybe<Order>;
    login: LoginResult;
    logout: Scalars['Boolean'];
    /** Regenerate and send a verification token for a new Customer registration. Only
     * applicable if `authOptions.requireVerification` is set to true.
     */
    refreshCustomerVerification: Scalars['Boolean'];
    /** Register a Customer account with the given credentials */
    registerCustomerAccount: Scalars['Boolean'];
    /** Update an existing Customer */
    updateCustomer: Customer;
    /** Create a new Customer Address */
    createCustomerAddress: Address;
    /** Update an existing Address */
    updateCustomerAddress: Address;
    /** Delete an existing Address */
    deleteCustomerAddress: Scalars['Boolean'];
    /** Verify a Customer email address with the token sent to that address. Only
     * applicable if `authOptions.requireVerification` is set to true.
     */
    verifyCustomerAccount: LoginResult;
    /** Update the password of the active Customer */
    updateCustomerPassword?: Maybe<Scalars['Boolean']>;
    /** Request to update the emailAddress of the active Customer. If `authOptions.requireVerification` is enabled
     * (as is the default), then the `identifierChangeToken` will be assigned to the current User and
     * a IdentifierChangeRequestEvent will be raised. This can then be used e.g. by the EmailPlugin to email
     * that verification token to the Customer, which is then used to verify the change of email address.
     */
    requestUpdateCustomerEmailAddress?: Maybe<Scalars['Boolean']>;
    /** Confirm the update of the emailAddress with the provided token, which has been generated by the
     * `requestUpdateCustomerEmailAddress` mutation.
     */
    updateCustomerEmailAddress?: Maybe<Scalars['Boolean']>;
    /** Requests a password reset email to be sent */
    requestPasswordReset?: Maybe<Scalars['Boolean']>;
    /** Resets a Customer's password based on the provided token */
    resetPassword: LoginResult;
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

export type MutationRefreshCustomerVerificationArgs = {
    emailAddress: Scalars['String'];
};

export type MutationRegisterCustomerAccountArgs = {
    input: RegisterCustomerInput;
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
    password: Scalars['String'];
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

export type Node = {
    __typename?: 'Node';
    id: Scalars['ID'];
};

export type NumberOperators = {
    eq?: Maybe<Scalars['Float']>;
    lt?: Maybe<Scalars['Float']>;
    lte?: Maybe<Scalars['Float']>;
    gt?: Maybe<Scalars['Float']>;
    gte?: Maybe<Scalars['Float']>;
    between?: Maybe<NumberRange>;
};

export type NumberRange = {
    start: Scalars['Float'];
    end: Scalars['Float'];
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
    promotions: Array<Promotion>;
    payments?: Maybe<Array<Payment>>;
    fulfillments?: Maybe<Array<Fulfillment>>;
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

export type OrderFilterParameter = {
    createdAt?: Maybe<DateOperators>;
    updatedAt?: Maybe<DateOperators>;
    code?: Maybe<StringOperators>;
    state?: Maybe<StringOperators>;
    active?: Maybe<BooleanOperators>;
    subTotalBeforeTax?: Maybe<NumberOperators>;
    subTotal?: Maybe<NumberOperators>;
    currencyCode?: Maybe<StringOperators>;
    shipping?: Maybe<NumberOperators>;
    shippingWithTax?: Maybe<NumberOperators>;
    totalBeforeTax?: Maybe<NumberOperators>;
    total?: Maybe<NumberOperators>;
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

export type OrderList = PaginatedList & {
    __typename?: 'OrderList';
    items: Array<Order>;
    totalItems: Scalars['Int'];
};

export type OrderListOptions = {
    skip?: Maybe<Scalars['Int']>;
    take?: Maybe<Scalars['Int']>;
    sort?: Maybe<OrderSortParameter>;
    filter?: Maybe<OrderFilterParameter>;
};

export type OrderSortParameter = {
    id?: Maybe<SortOrder>;
    createdAt?: Maybe<SortOrder>;
    updatedAt?: Maybe<SortOrder>;
    code?: Maybe<SortOrder>;
    state?: Maybe<SortOrder>;
    subTotalBeforeTax?: Maybe<SortOrder>;
    subTotal?: Maybe<SortOrder>;
    shipping?: Maybe<SortOrder>;
    shippingWithTax?: Maybe<SortOrder>;
    totalBeforeTax?: Maybe<SortOrder>;
    total?: Maybe<SortOrder>;
};

export type PaginatedList = {
    __typename?: 'PaginatedList';
    items: Array<Node>;
    totalItems: Scalars['Int'];
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

/** Passed as input to the `addPaymentToOrder` mutation. */
export type PaymentInput = {
    /** This field should correspond to the `code` property of a PaymentMethodHandler. */
    method: Scalars['String'];
    /** This field should contain arbitrary data passed to the specified PaymentMethodHandler's `createPayment()` method
     * as the "metadata" argument. For example, it could contain an ID for the payment and other
     * data generated by the payment provider.
     */
    metadata: Scalars['JSON'];
};

export type PaymentMethod = Node & {
    __typename?: 'PaymentMethod';
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    code: Scalars['String'];
    enabled: Scalars['Boolean'];
    configArgs: Array<ConfigArg>;
};

/** "
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

export type ProductFilterParameter = {
    createdAt?: Maybe<DateOperators>;
    updatedAt?: Maybe<DateOperators>;
    languageCode?: Maybe<StringOperators>;
    name?: Maybe<StringOperators>;
    slug?: Maybe<StringOperators>;
    description?: Maybe<StringOperators>;
};

export type ProductList = PaginatedList & {
    __typename?: 'ProductList';
    items: Array<Product>;
    totalItems: Scalars['Int'];
};

export type ProductListOptions = {
    skip?: Maybe<Scalars['Int']>;
    take?: Maybe<Scalars['Int']>;
    sort?: Maybe<ProductSortParameter>;
    filter?: Maybe<ProductFilterParameter>;
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
    translations: Array<ProductOptionTranslation>;
    customFields?: Maybe<Scalars['JSON']>;
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

export type ProductOptionTranslation = {
    __typename?: 'ProductOptionTranslation';
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    languageCode: LanguageCode;
    name: Scalars['String'];
};

export type ProductSortParameter = {
    id?: Maybe<SortOrder>;
    createdAt?: Maybe<SortOrder>;
    updatedAt?: Maybe<SortOrder>;
    name?: Maybe<SortOrder>;
    slug?: Maybe<SortOrder>;
    description?: Maybe<SortOrder>;
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

export type ProductVariant = Node & {
    __typename?: 'ProductVariant';
    id: Scalars['ID'];
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

export type ProductVariantList = PaginatedList & {
    __typename?: 'ProductVariantList';
    items: Array<ProductVariant>;
    totalItems: Scalars['Int'];
};

export type ProductVariantListOptions = {
    skip?: Maybe<Scalars['Int']>;
    take?: Maybe<Scalars['Int']>;
    sort?: Maybe<ProductVariantSortParameter>;
    filter?: Maybe<ProductVariantFilterParameter>;
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

export type Query = {
    __typename?: 'Query';
    activeChannel: Channel;
    activeCustomer?: Maybe<Customer>;
    activeOrder?: Maybe<Order>;
    availableCountries: Array<Country>;
    collections: CollectionList;
    collection?: Maybe<Collection>;
    eligibleShippingMethods: Array<ShippingMethodQuote>;
    me?: Maybe<CurrentUser>;
    nextOrderStates: Array<Scalars['String']>;
    order?: Maybe<Order>;
    orderByCode?: Maybe<Order>;
    /** Get a Product either by id or slug. If neither 'id' nor 'slug' is speicified, an error will result. */
    product?: Maybe<Product>;
    products: ProductList;
    search: SearchResponse;
};

export type QueryCollectionsArgs = {
    options?: Maybe<CollectionListOptions>;
};

export type QueryCollectionArgs = {
    id: Scalars['ID'];
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

export type RegisterCustomerInput = {
    emailAddress: Scalars['String'];
    title?: Maybe<Scalars['String']>;
    firstName?: Maybe<Scalars['String']>;
    lastName?: Maybe<Scalars['String']>;
    password?: Maybe<Scalars['String']>;
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

export type SearchInput = {
    term?: Maybe<Scalars['String']>;
    facetValueIds?: Maybe<Array<Scalars['ID']>>;
    collectionId?: Maybe<Scalars['ID']>;
    groupByProduct?: Maybe<Scalars['Boolean']>;
    take?: Maybe<Scalars['Int']>;
    skip?: Maybe<Scalars['Int']>;
    sort?: Maybe<SearchResultSortParameter>;
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

export type SearchResult = {
    __typename?: 'SearchResult';
    sku: Scalars['String'];
    slug: Scalars['String'];
    productId: Scalars['ID'];
    productName: Scalars['String'];
    productPreview: Scalars['String'];
    productAsset?: Maybe<SearchResultAsset>;
    productVariantId: Scalars['ID'];
    productVariantName: Scalars['String'];
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

export type SearchResultAsset = {
    __typename?: 'SearchResultAsset';
    id: Scalars['ID'];
    preview: Scalars['String'];
    focalPoint?: Maybe<Coordinate>;
};

/** The price of a search result product, either as a range or as a single price */
export type SearchResultPrice = PriceRange | SinglePrice;

export type SearchResultSortParameter = {
    name?: Maybe<SortOrder>;
    price?: Maybe<SortOrder>;
};

export type ServerConfig = {
    __typename?: 'ServerConfig';
    customFieldConfig: CustomFields;
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
};

export type ShippingMethodList = PaginatedList & {
    __typename?: 'ShippingMethodList';
    items: Array<ShippingMethod>;
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

/** The price value where the result has a single price */
export type SinglePrice = {
    __typename?: 'SinglePrice';
    value: Scalars['Int'];
};

export enum SortOrder {
    ASC = 'ASC',
    DESC = 'DESC',
}

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

export type StockMovement = {
    __typename?: 'StockMovement';
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    productVariant: ProductVariant;
    type: StockMovementType;
    quantity: Scalars['Int'];
};

export type StockMovementItem = StockAdjustment | Sale | Cancellation | Return;

export type StockMovementList = {
    __typename?: 'StockMovementList';
    items: Array<StockMovementItem>;
    totalItems: Scalars['Int'];
};

export enum StockMovementType {
    ADJUSTMENT = 'ADJUSTMENT',
    SALE = 'SALE',
    CANCELLATION = 'CANCELLATION',
    RETURN = 'RETURN',
}

export type StringCustomFieldConfig = CustomField & {
    __typename?: 'StringCustomFieldConfig';
    name: Scalars['String'];
    type: Scalars['String'];
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

export type StringOperators = {
    eq?: Maybe<Scalars['String']>;
    contains?: Maybe<Scalars['String']>;
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

export type UpdateCustomerInput = {
    title?: Maybe<Scalars['String']>;
    firstName?: Maybe<Scalars['String']>;
    lastName?: Maybe<Scalars['String']>;
    phoneNumber?: Maybe<Scalars['String']>;
    customFields?: Maybe<Scalars['JSON']>;
};

export type User = Node & {
    __typename?: 'User';
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    identifier: Scalars['String'];
    verified: Scalars['Boolean'];
    roles: Array<Role>;
    lastLogin?: Maybe<Scalars['String']>;
    customFields?: Maybe<Scalars['JSON']>;
};

export type Zone = Node & {
    __typename?: 'Zone';
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    name: Scalars['String'];
    members: Array<Country>;
};
export type TestOrderFragmentFragment = { __typename?: 'Order' } & Pick<
    Order,
    'id' | 'code' | 'state' | 'active' | 'total' | 'couponCodes' | 'shipping'
> & {
        adjustments: Array<
            { __typename?: 'Adjustment' } & Pick<
                Adjustment,
                'adjustmentSource' | 'amount' | 'description' | 'type'
            >
        >;
        lines: Array<
            { __typename?: 'OrderLine' } & Pick<OrderLine, 'id' | 'quantity'> & {
                    productVariant: { __typename?: 'ProductVariant' } & Pick<ProductVariant, 'id'>;
                }
        >;
        shippingMethod: Maybe<
            { __typename?: 'ShippingMethod' } & Pick<ShippingMethod, 'id' | 'code' | 'description'>
        >;
        customer: Maybe<
            { __typename?: 'Customer' } & Pick<Customer, 'id'> & {
                    user: Maybe<{ __typename?: 'User' } & Pick<User, 'id' | 'identifier'>>;
                }
        >;
        history: { __typename?: 'HistoryEntryList' } & {
            items: Array<{ __typename?: 'HistoryEntry' } & Pick<HistoryEntry, 'id' | 'type' | 'data'>>;
        };
    };

export type AddItemToOrderMutationVariables = {
    productVariantId: Scalars['ID'];
    quantity: Scalars['Int'];
};

export type AddItemToOrderMutation = { __typename?: 'Mutation' } & {
    addItemToOrder: Maybe<
        { __typename?: 'Order' } & Pick<Order, 'id' | 'code' | 'state' | 'active' | 'total'> & {
                lines: Array<
                    { __typename?: 'OrderLine' } & Pick<OrderLine, 'id' | 'quantity'> & {
                            productVariant: { __typename?: 'ProductVariant' } & Pick<ProductVariant, 'id'>;
                        }
                >;
                adjustments: Array<
                    { __typename?: 'Adjustment' } & Pick<
                        Adjustment,
                        'adjustmentSource' | 'amount' | 'description' | 'type'
                    >
                >;
            }
    >;
};

export type SearchProductsShopQueryVariables = {
    input: SearchInput;
};

export type SearchProductsShopQuery = { __typename?: 'Query' } & {
    search: { __typename?: 'SearchResponse' } & Pick<SearchResponse, 'totalItems'> & {
            items: Array<
                { __typename?: 'SearchResult' } & Pick<
                    SearchResult,
                    | 'productId'
                    | 'productName'
                    | 'productPreview'
                    | 'productVariantId'
                    | 'productVariantName'
                    | 'productVariantPreview'
                    | 'sku'
                    | 'collectionIds'
                >
            >;
        };
};

export type RegisterMutationVariables = {
    input: RegisterCustomerInput;
};

export type RegisterMutation = { __typename?: 'Mutation' } & Pick<Mutation, 'registerCustomerAccount'>;

export type VerifyMutationVariables = {
    password: Scalars['String'];
    token: Scalars['String'];
};

export type VerifyMutation = { __typename?: 'Mutation' } & {
    verifyCustomerAccount: { __typename?: 'LoginResult' } & {
        user: { __typename?: 'CurrentUser' } & Pick<CurrentUser, 'id' | 'identifier'>;
    };
};

export type RefreshTokenMutationVariables = {
    emailAddress: Scalars['String'];
};

export type RefreshTokenMutation = { __typename?: 'Mutation' } & Pick<
    Mutation,
    'refreshCustomerVerification'
>;

export type RequestPasswordResetMutationVariables = {
    identifier: Scalars['String'];
};

export type RequestPasswordResetMutation = { __typename?: 'Mutation' } & Pick<
    Mutation,
    'requestPasswordReset'
>;

export type ResetPasswordMutationVariables = {
    token: Scalars['String'];
    password: Scalars['String'];
};

export type ResetPasswordMutation = { __typename?: 'Mutation' } & {
    resetPassword: { __typename?: 'LoginResult' } & {
        user: { __typename?: 'CurrentUser' } & Pick<CurrentUser, 'id' | 'identifier'>;
    };
};

export type RequestUpdateEmailAddressMutationVariables = {
    password: Scalars['String'];
    newEmailAddress: Scalars['String'];
};

export type RequestUpdateEmailAddressMutation = { __typename?: 'Mutation' } & Pick<
    Mutation,
    'requestUpdateCustomerEmailAddress'
>;

export type UpdateEmailAddressMutationVariables = {
    token: Scalars['String'];
};

export type UpdateEmailAddressMutation = { __typename?: 'Mutation' } & Pick<
    Mutation,
    'updateCustomerEmailAddress'
>;

export type GetActiveCustomerQueryVariables = {};

export type GetActiveCustomerQuery = { __typename?: 'Query' } & {
    activeCustomer: Maybe<{ __typename?: 'Customer' } & Pick<Customer, 'id' | 'emailAddress'>>;
};

export type CreateAddressShopMutationVariables = {
    input: CreateAddressInput;
};

export type CreateAddressShopMutation = { __typename?: 'Mutation' } & {
    createCustomerAddress: { __typename?: 'Address' } & Pick<Address, 'id' | 'streetLine1'> & {
            country: { __typename?: 'Country' } & Pick<Country, 'code'>;
        };
};

export type UpdateAddressShopMutationVariables = {
    input: UpdateAddressInput;
};

export type UpdateAddressShopMutation = { __typename?: 'Mutation' } & {
    updateCustomerAddress: { __typename?: 'Address' } & Pick<Address, 'streetLine1'> & {
            country: { __typename?: 'Country' } & Pick<Country, 'code'>;
        };
};

export type DeleteAddressShopMutationVariables = {
    id: Scalars['ID'];
};

export type DeleteAddressShopMutation = { __typename?: 'Mutation' } & Pick<Mutation, 'deleteCustomerAddress'>;

export type UpdateCustomerMutationVariables = {
    input: UpdateCustomerInput;
};

export type UpdateCustomerMutation = { __typename?: 'Mutation' } & {
    updateCustomer: { __typename?: 'Customer' } & Pick<Customer, 'id' | 'firstName' | 'lastName'>;
};

export type UpdatePasswordMutationVariables = {
    old: Scalars['String'];
    new: Scalars['String'];
};

export type UpdatePasswordMutation = { __typename?: 'Mutation' } & Pick<Mutation, 'updateCustomerPassword'>;

export type GetActiveOrderQueryVariables = {};

export type GetActiveOrderQuery = { __typename?: 'Query' } & {
    activeOrder: Maybe<{ __typename?: 'Order' } & TestOrderFragmentFragment>;
};

export type AdjustItemQuantityMutationVariables = {
    orderLineId: Scalars['ID'];
    quantity: Scalars['Int'];
};

export type AdjustItemQuantityMutation = { __typename?: 'Mutation' } & {
    adjustOrderLine: Maybe<{ __typename?: 'Order' } & TestOrderFragmentFragment>;
};

export type RemoveItemFromOrderMutationVariables = {
    orderLineId: Scalars['ID'];
};

export type RemoveItemFromOrderMutation = { __typename?: 'Mutation' } & {
    removeOrderLine: Maybe<{ __typename?: 'Order' } & TestOrderFragmentFragment>;
};

export type GetShippingMethodsQueryVariables = {};

export type GetShippingMethodsQuery = { __typename?: 'Query' } & {
    eligibleShippingMethods: Array<
        { __typename?: 'ShippingMethodQuote' } & Pick<ShippingMethodQuote, 'id' | 'price' | 'description'>
    >;
};

export type SetShippingMethodMutationVariables = {
    id: Scalars['ID'];
};

export type SetShippingMethodMutation = { __typename?: 'Mutation' } & {
    setOrderShippingMethod: Maybe<
        { __typename?: 'Order' } & Pick<Order, 'shipping'> & {
                shippingMethod: Maybe<
                    { __typename?: 'ShippingMethod' } & Pick<ShippingMethod, 'id' | 'code' | 'description'>
                >;
            }
    >;
};

export type SetCustomerForOrderMutationVariables = {
    input: CreateCustomerInput;
};

export type SetCustomerForOrderMutation = { __typename?: 'Mutation' } & {
    setCustomerForOrder: Maybe<
        { __typename?: 'Order' } & Pick<Order, 'id'> & {
                customer: Maybe<
                    { __typename?: 'Customer' } & Pick<
                        Customer,
                        'id' | 'emailAddress' | 'firstName' | 'lastName'
                    >
                >;
            }
    >;
};

export type GetOrderByCodeQueryVariables = {
    code: Scalars['String'];
};

export type GetOrderByCodeQuery = { __typename?: 'Query' } & {
    orderByCode: Maybe<{ __typename?: 'Order' } & TestOrderFragmentFragment>;
};

export type GetOrderPromotionsByCodeQueryVariables = {
    code: Scalars['String'];
};

export type GetOrderPromotionsByCodeQuery = { __typename?: 'Query' } & {
    orderByCode: Maybe<
        { __typename?: 'Order' } & {
            promotions: Array<{ __typename?: 'Promotion' } & Pick<Promotion, 'id' | 'name'>>;
        } & TestOrderFragmentFragment
    >;
};

export type GetAvailableCountriesQueryVariables = {};

export type GetAvailableCountriesQuery = { __typename?: 'Query' } & {
    availableCountries: Array<{ __typename?: 'Country' } & Pick<Country, 'id' | 'code'>>;
};

export type TransitionToStateMutationVariables = {
    state: Scalars['String'];
};

export type TransitionToStateMutation = { __typename?: 'Mutation' } & {
    transitionOrderToState: Maybe<{ __typename?: 'Order' } & Pick<Order, 'id' | 'state'>>;
};

export type SetShippingAddressMutationVariables = {
    input: CreateAddressInput;
};

export type SetShippingAddressMutation = { __typename?: 'Mutation' } & {
    setOrderShippingAddress: Maybe<
        { __typename?: 'Order' } & {
            shippingAddress: Maybe<
                { __typename?: 'OrderAddress' } & Pick<
                    OrderAddress,
                    | 'fullName'
                    | 'company'
                    | 'streetLine1'
                    | 'streetLine2'
                    | 'city'
                    | 'province'
                    | 'postalCode'
                    | 'country'
                    | 'phoneNumber'
                >
            >;
        }
    >;
};

export type AddPaymentToOrderMutationVariables = {
    input: PaymentInput;
};

export type AddPaymentToOrderMutation = { __typename?: 'Mutation' } & {
    addPaymentToOrder: Maybe<
        { __typename?: 'Order' } & {
            payments: Maybe<
                Array<
                    { __typename?: 'Payment' } & Pick<
                        Payment,
                        'id' | 'transactionId' | 'method' | 'amount' | 'state' | 'metadata'
                    >
                >
            >;
        } & TestOrderFragmentFragment
    >;
};

export type GetActiveOrderPaymentsQueryVariables = {};

export type GetActiveOrderPaymentsQuery = { __typename?: 'Query' } & {
    activeOrder: Maybe<
        { __typename?: 'Order' } & Pick<Order, 'id'> & {
                payments: Maybe<
                    Array<
                        { __typename?: 'Payment' } & Pick<
                            Payment,
                            | 'id'
                            | 'transactionId'
                            | 'method'
                            | 'amount'
                            | 'state'
                            | 'errorMessage'
                            | 'metadata'
                        >
                    >
                >;
            }
    >;
};

export type GetNextOrderStatesQueryVariables = {};

export type GetNextOrderStatesQuery = { __typename?: 'Query' } & Pick<Query, 'nextOrderStates'>;

export type GetCustomerAddressesQueryVariables = {};

export type GetCustomerAddressesQuery = { __typename?: 'Query' } & {
    activeOrder: Maybe<
        { __typename?: 'Order' } & {
            customer: Maybe<
                { __typename?: 'Customer' } & {
                    addresses: Maybe<Array<{ __typename?: 'Address' } & Pick<Address, 'id' | 'streetLine1'>>>;
                }
            >;
        }
    >;
};

export type GetCustomerOrdersQueryVariables = {};

export type GetCustomerOrdersQuery = { __typename?: 'Query' } & {
    activeOrder: Maybe<
        { __typename?: 'Order' } & {
            customer: Maybe<
                { __typename?: 'Customer' } & {
                    orders: { __typename?: 'OrderList' } & {
                        items: Array<{ __typename?: 'Order' } & Pick<Order, 'id'>>;
                    };
                }
            >;
        }
    >;
};

export type ApplyCouponCodeMutationVariables = {
    couponCode: Scalars['String'];
};

export type ApplyCouponCodeMutation = { __typename?: 'Mutation' } & {
    applyCouponCode: Maybe<{ __typename?: 'Order' } & TestOrderFragmentFragment>;
};

export type RemoveCouponCodeMutationVariables = {
    couponCode: Scalars['String'];
};

export type RemoveCouponCodeMutation = { __typename?: 'Mutation' } & {
    removeCouponCode: Maybe<{ __typename?: 'Order' } & TestOrderFragmentFragment>;
};
export namespace TestOrderFragment {
    export type Fragment = TestOrderFragmentFragment;
    export type Adjustments = NonNullable<TestOrderFragmentFragment['adjustments'][0]>;
    export type Lines = NonNullable<TestOrderFragmentFragment['lines'][0]>;
    export type ProductVariant = (NonNullable<TestOrderFragmentFragment['lines'][0]>)['productVariant'];
    export type ShippingMethod = NonNullable<TestOrderFragmentFragment['shippingMethod']>;
    export type Customer = NonNullable<TestOrderFragmentFragment['customer']>;
    export type User = NonNullable<(NonNullable<TestOrderFragmentFragment['customer']>)['user']>;
    export type History = TestOrderFragmentFragment['history'];
    export type Items = NonNullable<TestOrderFragmentFragment['history']['items'][0]>;
}

export namespace AddItemToOrder {
    export type Variables = AddItemToOrderMutationVariables;
    export type Mutation = AddItemToOrderMutation;
    export type AddItemToOrder = NonNullable<AddItemToOrderMutation['addItemToOrder']>;
    export type Lines = NonNullable<(NonNullable<AddItemToOrderMutation['addItemToOrder']>)['lines'][0]>;
    export type ProductVariant = (NonNullable<
        (NonNullable<AddItemToOrderMutation['addItemToOrder']>)['lines'][0]
    >)['productVariant'];
    export type Adjustments = NonNullable<
        (NonNullable<AddItemToOrderMutation['addItemToOrder']>)['adjustments'][0]
    >;
}

export namespace SearchProductsShop {
    export type Variables = SearchProductsShopQueryVariables;
    export type Query = SearchProductsShopQuery;
    export type Search = SearchProductsShopQuery['search'];
    export type Items = NonNullable<SearchProductsShopQuery['search']['items'][0]>;
}

export namespace Register {
    export type Variables = RegisterMutationVariables;
    export type Mutation = RegisterMutation;
}

export namespace Verify {
    export type Variables = VerifyMutationVariables;
    export type Mutation = VerifyMutation;
    export type VerifyCustomerAccount = VerifyMutation['verifyCustomerAccount'];
    export type User = VerifyMutation['verifyCustomerAccount']['user'];
}

export namespace RefreshToken {
    export type Variables = RefreshTokenMutationVariables;
    export type Mutation = RefreshTokenMutation;
}

export namespace RequestPasswordReset {
    export type Variables = RequestPasswordResetMutationVariables;
    export type Mutation = RequestPasswordResetMutation;
}

export namespace ResetPassword {
    export type Variables = ResetPasswordMutationVariables;
    export type Mutation = ResetPasswordMutation;
    export type ResetPassword = ResetPasswordMutation['resetPassword'];
    export type User = ResetPasswordMutation['resetPassword']['user'];
}

export namespace RequestUpdateEmailAddress {
    export type Variables = RequestUpdateEmailAddressMutationVariables;
    export type Mutation = RequestUpdateEmailAddressMutation;
}

export namespace UpdateEmailAddress {
    export type Variables = UpdateEmailAddressMutationVariables;
    export type Mutation = UpdateEmailAddressMutation;
}

export namespace GetActiveCustomer {
    export type Variables = GetActiveCustomerQueryVariables;
    export type Query = GetActiveCustomerQuery;
    export type ActiveCustomer = NonNullable<GetActiveCustomerQuery['activeCustomer']>;
}

export namespace CreateAddressShop {
    export type Variables = CreateAddressShopMutationVariables;
    export type Mutation = CreateAddressShopMutation;
    export type CreateCustomerAddress = CreateAddressShopMutation['createCustomerAddress'];
    export type Country = CreateAddressShopMutation['createCustomerAddress']['country'];
}

export namespace UpdateAddressShop {
    export type Variables = UpdateAddressShopMutationVariables;
    export type Mutation = UpdateAddressShopMutation;
    export type UpdateCustomerAddress = UpdateAddressShopMutation['updateCustomerAddress'];
    export type Country = UpdateAddressShopMutation['updateCustomerAddress']['country'];
}

export namespace DeleteAddressShop {
    export type Variables = DeleteAddressShopMutationVariables;
    export type Mutation = DeleteAddressShopMutation;
}

export namespace UpdateCustomer {
    export type Variables = UpdateCustomerMutationVariables;
    export type Mutation = UpdateCustomerMutation;
    export type UpdateCustomer = UpdateCustomerMutation['updateCustomer'];
}

export namespace UpdatePassword {
    export type Variables = UpdatePasswordMutationVariables;
    export type Mutation = UpdatePasswordMutation;
}

export namespace GetActiveOrder {
    export type Variables = GetActiveOrderQueryVariables;
    export type Query = GetActiveOrderQuery;
    export type ActiveOrder = TestOrderFragmentFragment;
}

export namespace AdjustItemQuantity {
    export type Variables = AdjustItemQuantityMutationVariables;
    export type Mutation = AdjustItemQuantityMutation;
    export type AdjustOrderLine = TestOrderFragmentFragment;
}

export namespace RemoveItemFromOrder {
    export type Variables = RemoveItemFromOrderMutationVariables;
    export type Mutation = RemoveItemFromOrderMutation;
    export type RemoveOrderLine = TestOrderFragmentFragment;
}

export namespace GetShippingMethods {
    export type Variables = GetShippingMethodsQueryVariables;
    export type Query = GetShippingMethodsQuery;
    export type EligibleShippingMethods = NonNullable<GetShippingMethodsQuery['eligibleShippingMethods'][0]>;
}

export namespace SetShippingMethod {
    export type Variables = SetShippingMethodMutationVariables;
    export type Mutation = SetShippingMethodMutation;
    export type SetOrderShippingMethod = NonNullable<SetShippingMethodMutation['setOrderShippingMethod']>;
    export type ShippingMethod = NonNullable<
        (NonNullable<SetShippingMethodMutation['setOrderShippingMethod']>)['shippingMethod']
    >;
}

export namespace SetCustomerForOrder {
    export type Variables = SetCustomerForOrderMutationVariables;
    export type Mutation = SetCustomerForOrderMutation;
    export type SetCustomerForOrder = NonNullable<SetCustomerForOrderMutation['setCustomerForOrder']>;
    export type Customer = NonNullable<
        (NonNullable<SetCustomerForOrderMutation['setCustomerForOrder']>)['customer']
    >;
}

export namespace GetOrderByCode {
    export type Variables = GetOrderByCodeQueryVariables;
    export type Query = GetOrderByCodeQuery;
    export type OrderByCode = TestOrderFragmentFragment;
}

export namespace GetOrderPromotionsByCode {
    export type Variables = GetOrderPromotionsByCodeQueryVariables;
    export type Query = GetOrderPromotionsByCodeQuery;
    export type OrderByCode = TestOrderFragmentFragment;
    export type Promotions = NonNullable<
        (NonNullable<GetOrderPromotionsByCodeQuery['orderByCode']>)['promotions'][0]
    >;
}

export namespace GetAvailableCountries {
    export type Variables = GetAvailableCountriesQueryVariables;
    export type Query = GetAvailableCountriesQuery;
    export type AvailableCountries = NonNullable<GetAvailableCountriesQuery['availableCountries'][0]>;
}

export namespace TransitionToState {
    export type Variables = TransitionToStateMutationVariables;
    export type Mutation = TransitionToStateMutation;
    export type TransitionOrderToState = NonNullable<TransitionToStateMutation['transitionOrderToState']>;
}

export namespace SetShippingAddress {
    export type Variables = SetShippingAddressMutationVariables;
    export type Mutation = SetShippingAddressMutation;
    export type SetOrderShippingAddress = NonNullable<SetShippingAddressMutation['setOrderShippingAddress']>;
    export type ShippingAddress = NonNullable<
        (NonNullable<SetShippingAddressMutation['setOrderShippingAddress']>)['shippingAddress']
    >;
}

export namespace AddPaymentToOrder {
    export type Variables = AddPaymentToOrderMutationVariables;
    export type Mutation = AddPaymentToOrderMutation;
    export type AddPaymentToOrder = TestOrderFragmentFragment;
    export type Payments = NonNullable<
        (NonNullable<(NonNullable<AddPaymentToOrderMutation['addPaymentToOrder']>)['payments']>)[0]
    >;
}

export namespace GetActiveOrderPayments {
    export type Variables = GetActiveOrderPaymentsQueryVariables;
    export type Query = GetActiveOrderPaymentsQuery;
    export type ActiveOrder = NonNullable<GetActiveOrderPaymentsQuery['activeOrder']>;
    export type Payments = NonNullable<
        (NonNullable<(NonNullable<GetActiveOrderPaymentsQuery['activeOrder']>)['payments']>)[0]
    >;
}

export namespace GetNextOrderStates {
    export type Variables = GetNextOrderStatesQueryVariables;
    export type Query = GetNextOrderStatesQuery;
}

export namespace GetCustomerAddresses {
    export type Variables = GetCustomerAddressesQueryVariables;
    export type Query = GetCustomerAddressesQuery;
    export type ActiveOrder = NonNullable<GetCustomerAddressesQuery['activeOrder']>;
    export type Customer = NonNullable<(NonNullable<GetCustomerAddressesQuery['activeOrder']>)['customer']>;
    export type Addresses = NonNullable<
        (NonNullable<
            (NonNullable<(NonNullable<GetCustomerAddressesQuery['activeOrder']>)['customer']>)['addresses']
        >)[0]
    >;
}

export namespace GetCustomerOrders {
    export type Variables = GetCustomerOrdersQueryVariables;
    export type Query = GetCustomerOrdersQuery;
    export type ActiveOrder = NonNullable<GetCustomerOrdersQuery['activeOrder']>;
    export type Customer = NonNullable<(NonNullable<GetCustomerOrdersQuery['activeOrder']>)['customer']>;
    export type Orders = (NonNullable<
        (NonNullable<GetCustomerOrdersQuery['activeOrder']>)['customer']
    >)['orders'];
    export type Items = NonNullable<
        (NonNullable<(NonNullable<GetCustomerOrdersQuery['activeOrder']>)['customer']>)['orders']['items'][0]
    >;
}

export namespace ApplyCouponCode {
    export type Variables = ApplyCouponCodeMutationVariables;
    export type Mutation = ApplyCouponCodeMutation;
    export type ApplyCouponCode = TestOrderFragmentFragment;
}

export namespace RemoveCouponCode {
    export type Variables = RemoveCouponCodeMutationVariables;
    export type Mutation = RemoveCouponCodeMutation;
    export type RemoveCouponCode = TestOrderFragmentFragment;
}
