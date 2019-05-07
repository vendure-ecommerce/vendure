// tslint:disable
// Generated in 2019-05-07T10:31:37+02:00

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
    adjustmentSource: Scalars['String'];
    type: AdjustmentType;
    description: Scalars['String'];
    amount: Scalars['Int'];
};

export type AdjustmentOperations = {
    conditions: Array<ConfigurableOperation>;
    actions: Array<ConfigurableOperation>;
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
    source: Scalars['String'];
    preview: Scalars['String'];
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

export type BooleanOperators = {
    eq?: Maybe<Scalars['Boolean']>;
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
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    languageCode: LanguageCode;
    name: Scalars['String'];
    description: Scalars['String'];
};

export type ConfigArg = {
    name: Scalars['String'];
    type: ConfigArgType;
    value?: Maybe<Scalars['String']>;
};

export type ConfigArgInput = {
    name: Scalars['String'];
    type: ConfigArgType;
    value?: Maybe<Scalars['String']>;
};

/** Certain entities allow arbitrary configuration arguments to be specified which can then
 * be set in the admin-ui and used in the business logic of the app. These are the valid
 * data types of such arguments. The data type influences:
 *
 * 1. How the argument form field is rendered in the admin-ui
 * 2. The JavaScript type into which the value is coerced before being passed to the business logic.
 */
export enum ConfigArgType {
    PERCENTAGE = 'PERCENTAGE',
    MONEY = 'MONEY',
    INT = 'INT',
    STRING = 'STRING',
    DATETIME = 'DATETIME',
    BOOLEAN = 'BOOLEAN',
    FACET_VALUE_IDS = 'FACET_VALUE_IDS',
    STRING_OPERATOR = 'STRING_OPERATOR',
}

export type ConfigurableOperation = {
    code: Scalars['String'];
    args: Array<ConfigArg>;
    description: Scalars['String'];
};

export type ConfigurableOperationInput = {
    code: Scalars['String'];
    arguments: Array<ConfigArgInput>;
};

export type Country = Node & {
    id: Scalars['ID'];
    languageCode: LanguageCode;
    code: Scalars['String'];
    name: Scalars['String'];
    enabled: Scalars['Boolean'];
    translations: Array<CountryTranslation>;
};

export type CountryList = PaginatedList & {
    items: Array<Country>;
    totalItems: Scalars['Int'];
};

export type CountryTranslation = {
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

/** ISO 4217 currency code */
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
    id: Scalars['ID'];
    identifier: Scalars['String'];
    channelTokens: Array<Scalars['String']>;
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

export type CustomerGroup = Node & {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    name: Scalars['String'];
};

export type CustomerList = PaginatedList & {
    items: Array<Customer>;
    totalItems: Scalars['Int'];
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

export type DeletionResponse = {
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
    items: Array<Facet>;
    totalItems: Scalars['Int'];
};

export type FacetTranslation = {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    languageCode: LanguageCode;
    name: Scalars['String'];
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

/** Which FacetValues are present in the products returned
 * by the search, and in what quantity.
 */
export type FacetValueResult = {
    facetValue: FacetValue;
    count: Scalars['Int'];
};

export type FacetValueTranslation = {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    languageCode: LanguageCode;
    name: Scalars['String'];
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

export type ImportInfo = {
    errors?: Maybe<Array<Scalars['String']>>;
    processed: Scalars['Int'];
    imported: Scalars['Int'];
};

/** ISO 639-1 language code */
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

export type LoginResult = {
    user: CurrentUser;
};

export type Mutation = {
    addItemToOrder?: Maybe<Order>;
    removeItemFromOrder?: Maybe<Order>;
    adjustItemQuantity?: Maybe<Order>;
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

export type MutationRemoveItemFromOrderArgs = {
    orderItemId: Scalars['ID'];
};

export type MutationAdjustItemQuantityArgs = {
    orderItemId: Scalars['ID'];
    quantity: Scalars['Int'];
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
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    code: Scalars['String'];
    state: Scalars['String'];
    active: Scalars['Boolean'];
    customer?: Maybe<Customer>;
    shippingAddress?: Maybe<OrderAddress>;
    billingAddress?: Maybe<OrderAddress>;
    lines: Array<OrderLine>;
    adjustments: Array<Adjustment>;
    payments?: Maybe<Array<Payment>>;
    subTotalBeforeTax: Scalars['Int'];
    subTotal: Scalars['Int'];
    currencyCode: CurrencyCode;
    shipping: Scalars['Int'];
    shippingMethod?: Maybe<ShippingMethod>;
    totalBeforeTax: Scalars['Int'];
    total: Scalars['Int'];
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
    totalBeforeTax?: Maybe<NumberOperators>;
    total?: Maybe<NumberOperators>;
};

export type OrderItem = Node & {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    unitPrice: Scalars['Int'];
    unitPriceWithTax: Scalars['Int'];
    unitPriceIncludesTax: Scalars['Boolean'];
    taxRate: Scalars['Float'];
    adjustments: Array<Adjustment>;
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
};

export type OrderList = PaginatedList & {
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
    totalBeforeTax?: Maybe<SortOrder>;
    total?: Maybe<SortOrder>;
};

export type PaginatedList = {
    items: Array<Node>;
    totalItems: Scalars['Int'];
};

export type Payment = Node & {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    method: Scalars['String'];
    amount: Scalars['Int'];
    state: Scalars['String'];
    transactionId?: Maybe<Scalars['String']>;
    metadata?: Maybe<Scalars['JSON']>;
};

export type PaymentInput = {
    method: Scalars['String'];
    metadata: Scalars['JSON'];
};

export type PaymentMethod = Node & {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    code: Scalars['String'];
    enabled: Scalars['Boolean'];
    configArgs: Array<ConfigArg>;
};

/**  Permissions for administrators and customers  */
export enum Permission {
    /**  The Authenticated role means simply that the user is logged in  */
    Authenticated = 'Authenticated',
    /**  SuperAdmin can perform the most sensitive tasks  */
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
    CreateSettings = 'CreateSettings',
    ReadSettings = 'ReadSettings',
    UpdateSettings = 'UpdateSettings',
    DeleteSettings = 'DeleteSettings',
}

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

export type ProductFilterParameter = {
    createdAt?: Maybe<DateOperators>;
    updatedAt?: Maybe<DateOperators>;
    languageCode?: Maybe<StringOperators>;
    name?: Maybe<StringOperators>;
    slug?: Maybe<StringOperators>;
    description?: Maybe<StringOperators>;
};

export type ProductList = PaginatedList & {
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
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    languageCode?: Maybe<LanguageCode>;
    code?: Maybe<Scalars['String']>;
    name?: Maybe<Scalars['String']>;
    translations: Array<ProductOptionTranslation>;
    customFields?: Maybe<Scalars['JSON']>;
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

export type ProductOptionTranslation = {
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
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    languageCode: LanguageCode;
    name: Scalars['String'];
    slug: Scalars['String'];
    description: Scalars['String'];
};

export type ProductVariant = Node & {
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
    name: Scalars['String'];
    enabled: Scalars['Boolean'];
    conditions: Array<ConfigurableOperation>;
    actions: Array<ConfigurableOperation>;
};

export type PromotionList = PaginatedList & {
    items: Array<Promotion>;
    totalItems: Scalars['Int'];
};

export type Query = {
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
    product?: Maybe<Product>;
    products: ProductList;
    search: SearchResponse;
    temp__?: Maybe<Scalars['Boolean']>;
};

export type QueryCollectionsArgs = {
    languageCode?: Maybe<LanguageCode>;
    options?: Maybe<CollectionListOptions>;
};

export type QueryCollectionArgs = {
    id: Scalars['ID'];
    languageCode?: Maybe<LanguageCode>;
};

export type QueryOrderArgs = {
    id: Scalars['ID'];
};

export type QueryOrderByCodeArgs = {
    code: Scalars['String'];
};

export type QueryProductArgs = {
    id: Scalars['ID'];
    languageCode?: Maybe<LanguageCode>;
};

export type QueryProductsArgs = {
    languageCode?: Maybe<LanguageCode>;
    options?: Maybe<ProductListOptions>;
};

export type QuerySearchArgs = {
    input: SearchInput;
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
        id: Scalars['ID'];
        createdAt: Scalars['DateTime'];
        updatedAt: Scalars['DateTime'];
        productVariant: ProductVariant;
        type: StockMovementType;
        quantity: Scalars['Int'];
        orderItem: OrderItem;
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

export type Sale = Node &
    StockMovement & {
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
    facetIds?: Maybe<Array<Scalars['String']>>;
    collectionId?: Maybe<Scalars['String']>;
    groupByProduct?: Maybe<Scalars['Boolean']>;
    take?: Maybe<Scalars['Int']>;
    skip?: Maybe<Scalars['Int']>;
    sort?: Maybe<SearchResultSortParameter>;
};

export type SearchReindexResponse = {
    success: Scalars['Boolean'];
    timeTaken: Scalars['Int'];
    indexedItemCount: Scalars['Int'];
};

export type SearchResponse = {
    items: Array<SearchResult>;
    totalItems: Scalars['Int'];
    facetValues: Array<FacetValueResult>;
};

export type SearchResult = {
    sku: Scalars['String'];
    slug: Scalars['String'];
    productId: Scalars['ID'];
    productName: Scalars['String'];
    productPreview: Scalars['String'];
    productVariantId: Scalars['ID'];
    productVariantName: Scalars['String'];
    productVariantPreview: Scalars['String'];
    price: SearchResultPrice;
    priceWithTax: SearchResultPrice;
    currencyCode: CurrencyCode;
    description: Scalars['String'];
    facetIds: Array<Scalars['String']>;
    facetValueIds: Array<Scalars['String']>;
    /** An array of ids of the Collections in which this result appears */
    collectionIds: Array<Scalars['String']>;
    /** A relevence score for the result. Differs between database implementations */
    score: Scalars['Float'];
};

/** The price of a search result product, either as a range or as a single price */
export type SearchResultPrice = PriceRange | SinglePrice;

export type SearchResultSortParameter = {
    name?: Maybe<SortOrder>;
    price?: Maybe<SortOrder>;
};

export type ServerConfig = {
    customFields?: Maybe<Scalars['JSON']>;
};

export type ShippingMethod = Node & {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    code: Scalars['String'];
    description: Scalars['String'];
    checker: ConfigurableOperation;
    calculator: ConfigurableOperation;
};

export type ShippingMethodList = PaginatedList & {
    items: Array<ShippingMethod>;
    totalItems: Scalars['Int'];
};

export type ShippingMethodQuote = {
    id: Scalars['ID'];
    price: Scalars['Int'];
    description: Scalars['String'];
};

/** The price value where the result has a single price */
export type SinglePrice = {
    value: Scalars['Int'];
};

export enum SortOrder {
    ASC = 'ASC',
    DESC = 'DESC',
}

export type StockAdjustment = Node &
    StockMovement & {
        id: Scalars['ID'];
        createdAt: Scalars['DateTime'];
        updatedAt: Scalars['DateTime'];
        productVariant: ProductVariant;
        type: StockMovementType;
        quantity: Scalars['Int'];
    };

export type StockMovement = {
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    productVariant: ProductVariant;
    type: StockMovementType;
    quantity: Scalars['Int'];
};

export type StockMovementItem = StockAdjustment | Sale | Cancellation | Return;

export type StockMovementList = {
    items: Array<StockMovementItem>;
    totalItems: Scalars['Int'];
};

export enum StockMovementType {
    ADJUSTMENT = 'ADJUSTMENT',
    SALE = 'SALE',
    CANCELLATION = 'CANCELLATION',
    RETURN = 'RETURN',
}

export type StringOperators = {
    eq?: Maybe<Scalars['String']>;
    contains?: Maybe<Scalars['String']>;
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
    value: Scalars['Int'];
    category: TaxCategory;
    zone: Zone;
    customerGroup?: Maybe<CustomerGroup>;
};

export type TaxRateList = PaginatedList & {
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
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    updatedAt: Scalars['DateTime'];
    name: Scalars['String'];
    members: Array<Country>;
};
