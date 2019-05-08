// tslint:disable
// Generated in 2019-05-07T21:25:27+02:00

export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the
   * `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO
   * 8601 standard for representation of dates and times using the Gregorian calendar.
 */
  DateTime: any,
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any,
  /** The `Upload` scalar type represents a file upload. */
  Upload: any,
};

export type Address = Node & {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  fullName?: Maybe<Scalars['String']>,
  company?: Maybe<Scalars['String']>,
  streetLine1: Scalars['String'],
  streetLine2?: Maybe<Scalars['String']>,
  city?: Maybe<Scalars['String']>,
  province?: Maybe<Scalars['String']>,
  postalCode?: Maybe<Scalars['String']>,
  country: Country,
  phoneNumber?: Maybe<Scalars['String']>,
  defaultShippingAddress?: Maybe<Scalars['Boolean']>,
  defaultBillingAddress?: Maybe<Scalars['Boolean']>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type Adjustment = {
  adjustmentSource: Scalars['String'],
  type: AdjustmentType,
  description: Scalars['String'],
  amount: Scalars['Int'],
};

export type AdjustmentOperations = {
  conditions: Array<ConfigurableOperation>,
  actions: Array<ConfigurableOperation>,
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

export type Administrator = Node & {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  firstName: Scalars['String'],
  lastName: Scalars['String'],
  emailAddress: Scalars['String'],
  user: User,
};

export type AdministratorFilterParameter = {
  createdAt?: Maybe<DateOperators>,
  updatedAt?: Maybe<DateOperators>,
  firstName?: Maybe<StringOperators>,
  lastName?: Maybe<StringOperators>,
  emailAddress?: Maybe<StringOperators>,
};

export type AdministratorList = PaginatedList & {
  items: Array<Administrator>,
  totalItems: Scalars['Int'],
};

export type AdministratorListOptions = {
  skip?: Maybe<Scalars['Int']>,
  take?: Maybe<Scalars['Int']>,
  sort?: Maybe<AdministratorSortParameter>,
  filter?: Maybe<AdministratorFilterParameter>,
};

export type AdministratorSortParameter = {
  id?: Maybe<SortOrder>,
  createdAt?: Maybe<SortOrder>,
  updatedAt?: Maybe<SortOrder>,
  firstName?: Maybe<SortOrder>,
  lastName?: Maybe<SortOrder>,
  emailAddress?: Maybe<SortOrder>,
};

export type Asset = Node & {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  name: Scalars['String'],
  type: AssetType,
  fileSize: Scalars['Int'],
  mimeType: Scalars['String'],
  source: Scalars['String'],
  preview: Scalars['String'],
};

export type AssetFilterParameter = {
  createdAt?: Maybe<DateOperators>,
  updatedAt?: Maybe<DateOperators>,
  name?: Maybe<StringOperators>,
  type?: Maybe<StringOperators>,
  fileSize?: Maybe<NumberOperators>,
  mimeType?: Maybe<StringOperators>,
  source?: Maybe<StringOperators>,
  preview?: Maybe<StringOperators>,
};

export type AssetList = PaginatedList & {
  items: Array<Asset>,
  totalItems: Scalars['Int'],
};

export type AssetListOptions = {
  skip?: Maybe<Scalars['Int']>,
  take?: Maybe<Scalars['Int']>,
  sort?: Maybe<AssetSortParameter>,
  filter?: Maybe<AssetFilterParameter>,
};

export type AssetSortParameter = {
  id?: Maybe<SortOrder>,
  createdAt?: Maybe<SortOrder>,
  updatedAt?: Maybe<SortOrder>,
  name?: Maybe<SortOrder>,
  fileSize?: Maybe<SortOrder>,
  mimeType?: Maybe<SortOrder>,
  source?: Maybe<SortOrder>,
  preview?: Maybe<SortOrder>,
};

export enum AssetType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  BINARY = 'BINARY'
}

export type BooleanOperators = {
  eq?: Maybe<Scalars['Boolean']>,
};

export type Cancellation = Node & StockMovement & {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  productVariant: ProductVariant,
  type: StockMovementType,
  quantity: Scalars['Int'],
  orderLine: OrderLine,
};

export type Channel = Node & {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  code: Scalars['String'],
  token: Scalars['String'],
  defaultTaxZone?: Maybe<Zone>,
  defaultShippingZone?: Maybe<Zone>,
  defaultLanguageCode: LanguageCode,
  currencyCode: CurrencyCode,
  pricesIncludeTax: Scalars['Boolean'],
};

export type Collection = Node & {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  languageCode?: Maybe<LanguageCode>,
  name: Scalars['String'],
  breadcrumbs: Array<CollectionBreadcrumb>,
  position: Scalars['Int'],
  description: Scalars['String'],
  featuredAsset?: Maybe<Asset>,
  assets: Array<Asset>,
  parent?: Maybe<Collection>,
  children?: Maybe<Array<Collection>>,
  filters: Array<ConfigurableOperation>,
  translations: Array<CollectionTranslation>,
  productVariants: ProductVariantList,
  isPrivate: Scalars['Boolean'],
  customFields?: Maybe<Scalars['JSON']>,
};


export type CollectionProductVariantsArgs = {
  options?: Maybe<ProductVariantListOptions>
};

export type CollectionBreadcrumb = {
  id: Scalars['ID'],
  name: Scalars['String'],
};

export type CollectionFilterParameter = {
  createdAt?: Maybe<DateOperators>,
  updatedAt?: Maybe<DateOperators>,
  languageCode?: Maybe<StringOperators>,
  name?: Maybe<StringOperators>,
  position?: Maybe<NumberOperators>,
  description?: Maybe<StringOperators>,
  isPrivate?: Maybe<BooleanOperators>,
};

export type CollectionList = PaginatedList & {
  items: Array<Collection>,
  totalItems: Scalars['Int'],
};

export type CollectionListOptions = {
  skip?: Maybe<Scalars['Int']>,
  take?: Maybe<Scalars['Int']>,
  sort?: Maybe<CollectionSortParameter>,
  filter?: Maybe<CollectionFilterParameter>,
};

export type CollectionSortParameter = {
  id?: Maybe<SortOrder>,
  createdAt?: Maybe<SortOrder>,
  updatedAt?: Maybe<SortOrder>,
  name?: Maybe<SortOrder>,
  position?: Maybe<SortOrder>,
  description?: Maybe<SortOrder>,
};

export type CollectionTranslation = {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  languageCode: LanguageCode,
  name: Scalars['String'],
  description: Scalars['String'],
};

export type CollectionTranslationInput = {
  id?: Maybe<Scalars['ID']>,
  languageCode: LanguageCode,
  name?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type ConfigArg = {
  name: Scalars['String'],
  type: ConfigArgType,
  value?: Maybe<Scalars['String']>,
};

export type ConfigArgInput = {
  name: Scalars['String'],
  type: ConfigArgType,
  value?: Maybe<Scalars['String']>,
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
  STRING_OPERATOR = 'STRING_OPERATOR'
}

export type ConfigurableOperation = {
  code: Scalars['String'],
  args: Array<ConfigArg>,
  description: Scalars['String'],
};

export type ConfigurableOperationInput = {
  code: Scalars['String'],
  arguments: Array<ConfigArgInput>,
};

export type Country = Node & {
  id: Scalars['ID'],
  languageCode: LanguageCode,
  code: Scalars['String'],
  name: Scalars['String'],
  enabled: Scalars['Boolean'],
  translations: Array<CountryTranslation>,
};

export type CountryFilterParameter = {
  languageCode?: Maybe<StringOperators>,
  code?: Maybe<StringOperators>,
  name?: Maybe<StringOperators>,
  enabled?: Maybe<BooleanOperators>,
};

export type CountryList = PaginatedList & {
  items: Array<Country>,
  totalItems: Scalars['Int'],
};

export type CountryListOptions = {
  skip?: Maybe<Scalars['Int']>,
  take?: Maybe<Scalars['Int']>,
  sort?: Maybe<CountrySortParameter>,
  filter?: Maybe<CountryFilterParameter>,
};

export type CountrySortParameter = {
  id?: Maybe<SortOrder>,
  code?: Maybe<SortOrder>,
  name?: Maybe<SortOrder>,
};

export type CountryTranslation = {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  languageCode: LanguageCode,
  name: Scalars['String'],
};

export type CountryTranslationInput = {
  id?: Maybe<Scalars['ID']>,
  languageCode: LanguageCode,
  name?: Maybe<Scalars['String']>,
};

export type CreateAddressInput = {
  fullName?: Maybe<Scalars['String']>,
  company?: Maybe<Scalars['String']>,
  streetLine1: Scalars['String'],
  streetLine2?: Maybe<Scalars['String']>,
  city?: Maybe<Scalars['String']>,
  province?: Maybe<Scalars['String']>,
  postalCode?: Maybe<Scalars['String']>,
  countryCode: Scalars['String'],
  phoneNumber?: Maybe<Scalars['String']>,
  defaultShippingAddress?: Maybe<Scalars['Boolean']>,
  defaultBillingAddress?: Maybe<Scalars['Boolean']>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type CreateAdministratorInput = {
  firstName: Scalars['String'],
  lastName: Scalars['String'],
  emailAddress: Scalars['String'],
  password: Scalars['String'],
  roleIds: Array<Scalars['ID']>,
};

export type CreateAssetInput = {
  file: Scalars['Upload'],
};

export type CreateChannelInput = {
  code: Scalars['String'],
  token: Scalars['String'],
  defaultLanguageCode: LanguageCode,
  pricesIncludeTax: Scalars['Boolean'],
  currencyCode: CurrencyCode,
  defaultTaxZoneId?: Maybe<Scalars['ID']>,
  defaultShippingZoneId?: Maybe<Scalars['ID']>,
};

export type CreateCollectionInput = {
  isPrivate?: Maybe<Scalars['Boolean']>,
  featuredAssetId?: Maybe<Scalars['ID']>,
  assetIds?: Maybe<Array<Scalars['ID']>>,
  parentId?: Maybe<Scalars['ID']>,
  filters: Array<ConfigurableOperationInput>,
  translations: Array<CollectionTranslationInput>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type CreateCountryInput = {
  code: Scalars['String'],
  translations: Array<CountryTranslationInput>,
  enabled: Scalars['Boolean'],
};

export type CreateCustomerGroupInput = {
  name: Scalars['String'],
  customerIds?: Maybe<Array<Scalars['ID']>>,
};

export type CreateCustomerInput = {
  title?: Maybe<Scalars['String']>,
  firstName: Scalars['String'],
  lastName: Scalars['String'],
  phoneNumber?: Maybe<Scalars['String']>,
  emailAddress: Scalars['String'],
  customFields?: Maybe<Scalars['JSON']>,
};

export type CreateFacetInput = {
  code: Scalars['String'],
  isPrivate: Scalars['Boolean'],
  translations: Array<FacetTranslationInput>,
  values?: Maybe<Array<CreateFacetValueWithFacetInput>>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type CreateFacetValueInput = {
  facetId: Scalars['ID'],
  code: Scalars['String'],
  translations: Array<FacetValueTranslationInput>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type CreateFacetValueWithFacetInput = {
  code: Scalars['String'],
  translations: Array<FacetValueTranslationInput>,
};

export type CreateProductInput = {
  featuredAssetId?: Maybe<Scalars['ID']>,
  assetIds?: Maybe<Array<Scalars['ID']>>,
  facetValueIds?: Maybe<Array<Scalars['ID']>>,
  translations: Array<ProductTranslationInput>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type CreateProductOptionGroupInput = {
  code: Scalars['String'],
  translations: Array<ProductOptionGroupTranslationInput>,
  options: Array<CreateProductOptionInput>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type CreateProductOptionInput = {
  code: Scalars['String'],
  translations: Array<ProductOptionGroupTranslationInput>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type CreateProductVariantInput = {
  translations: Array<ProductVariantTranslationInput>,
  facetValueIds?: Maybe<Array<Scalars['ID']>>,
  sku: Scalars['String'],
  price?: Maybe<Scalars['Int']>,
  taxCategoryId: Scalars['ID'],
  optionIds?: Maybe<Array<Scalars['ID']>>,
  featuredAssetId?: Maybe<Scalars['ID']>,
  assetIds?: Maybe<Array<Scalars['ID']>>,
  stockOnHand?: Maybe<Scalars['Int']>,
  trackInventory?: Maybe<Scalars['Boolean']>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type CreatePromotionInput = {
  name: Scalars['String'],
  enabled: Scalars['Boolean'],
  conditions: Array<ConfigurableOperationInput>,
  actions: Array<ConfigurableOperationInput>,
};

export type CreateRoleInput = {
  code: Scalars['String'],
  description: Scalars['String'],
  permissions: Array<Permission>,
};

export type CreateShippingMethodInput = {
  code: Scalars['String'],
  description: Scalars['String'],
  checker: ConfigurableOperationInput,
  calculator: ConfigurableOperationInput,
};

export type CreateTaxCategoryInput = {
  name: Scalars['String'],
};

export type CreateTaxRateInput = {
  name: Scalars['String'],
  enabled: Scalars['Boolean'],
  value: Scalars['Int'],
  categoryId: Scalars['ID'],
  zoneId: Scalars['ID'],
  customerGroupId?: Maybe<Scalars['ID']>,
};

export type CreateZoneInput = {
  name: Scalars['String'],
  memberIds?: Maybe<Array<Scalars['ID']>>,
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
  ZWL = 'ZWL'
}

export type CurrentUser = {
  id: Scalars['ID'],
  identifier: Scalars['String'],
  channelTokens: Array<Scalars['String']>,
};

export type Customer = Node & {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  title?: Maybe<Scalars['String']>,
  firstName: Scalars['String'],
  lastName: Scalars['String'],
  phoneNumber?: Maybe<Scalars['String']>,
  emailAddress: Scalars['String'],
  addresses?: Maybe<Array<Address>>,
  orders: OrderList,
  user?: Maybe<User>,
  customFields?: Maybe<Scalars['JSON']>,
};


export type CustomerOrdersArgs = {
  options?: Maybe<OrderListOptions>
};

export type CustomerFilterParameter = {
  createdAt?: Maybe<DateOperators>,
  updatedAt?: Maybe<DateOperators>,
  title?: Maybe<StringOperators>,
  firstName?: Maybe<StringOperators>,
  lastName?: Maybe<StringOperators>,
  phoneNumber?: Maybe<StringOperators>,
  emailAddress?: Maybe<StringOperators>,
};

export type CustomerGroup = Node & {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  name: Scalars['String'],
};

export type CustomerList = PaginatedList & {
  items: Array<Customer>,
  totalItems: Scalars['Int'],
};

export type CustomerListOptions = {
  skip?: Maybe<Scalars['Int']>,
  take?: Maybe<Scalars['Int']>,
  sort?: Maybe<CustomerSortParameter>,
  filter?: Maybe<CustomerFilterParameter>,
};

export type CustomerSortParameter = {
  id?: Maybe<SortOrder>,
  createdAt?: Maybe<SortOrder>,
  updatedAt?: Maybe<SortOrder>,
  title?: Maybe<SortOrder>,
  firstName?: Maybe<SortOrder>,
  lastName?: Maybe<SortOrder>,
  phoneNumber?: Maybe<SortOrder>,
  emailAddress?: Maybe<SortOrder>,
};

export type DateOperators = {
  eq?: Maybe<Scalars['DateTime']>,
  before?: Maybe<Scalars['DateTime']>,
  after?: Maybe<Scalars['DateTime']>,
  between?: Maybe<DateRange>,
};

export type DateRange = {
  start: Scalars['DateTime'],
  end: Scalars['DateTime'],
};


export type DeletionResponse = {
  result: DeletionResult,
  message?: Maybe<Scalars['String']>,
};

export enum DeletionResult {
  /** The entity was successfully deleted */
  DELETED = 'DELETED',
  /** Deletion did not take place, reason given in message */
  NOT_DELETED = 'NOT_DELETED'
}

export type Facet = Node & {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  languageCode: LanguageCode,
  name: Scalars['String'],
  code: Scalars['String'],
  values: Array<FacetValue>,
  translations: Array<FacetTranslation>,
  isPrivate: Scalars['Boolean'],
  customFields?: Maybe<Scalars['JSON']>,
};

export type FacetFilterParameter = {
  createdAt?: Maybe<DateOperators>,
  updatedAt?: Maybe<DateOperators>,
  languageCode?: Maybe<StringOperators>,
  name?: Maybe<StringOperators>,
  code?: Maybe<StringOperators>,
  isPrivate?: Maybe<BooleanOperators>,
};

export type FacetList = PaginatedList & {
  items: Array<Facet>,
  totalItems: Scalars['Int'],
};

export type FacetListOptions = {
  skip?: Maybe<Scalars['Int']>,
  take?: Maybe<Scalars['Int']>,
  sort?: Maybe<FacetSortParameter>,
  filter?: Maybe<FacetFilterParameter>,
};

export type FacetSortParameter = {
  id?: Maybe<SortOrder>,
  createdAt?: Maybe<SortOrder>,
  updatedAt?: Maybe<SortOrder>,
  name?: Maybe<SortOrder>,
  code?: Maybe<SortOrder>,
};

export type FacetTranslation = {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  languageCode: LanguageCode,
  name: Scalars['String'],
};

export type FacetTranslationInput = {
  id?: Maybe<Scalars['ID']>,
  languageCode: LanguageCode,
  name?: Maybe<Scalars['String']>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type FacetValue = Node & {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  languageCode: LanguageCode,
  facet: Facet,
  name: Scalars['String'],
  code: Scalars['String'],
  translations: Array<FacetValueTranslation>,
  customFields?: Maybe<Scalars['JSON']>,
};

/** Which FacetValues are present in the products returned
 * by the search, and in what quantity.
 */
export type FacetValueResult = {
  facetValue: FacetValue,
  count: Scalars['Int'],
};

export type FacetValueTranslation = {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  languageCode: LanguageCode,
  name: Scalars['String'],
};

export type FacetValueTranslationInput = {
  id?: Maybe<Scalars['ID']>,
  languageCode: LanguageCode,
  name?: Maybe<Scalars['String']>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type GlobalSettings = {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  availableLanguages: Array<LanguageCode>,
  trackInventory: Scalars['Boolean'],
  serverConfig: ServerConfig,
  customFields?: Maybe<Scalars['JSON']>,
};

export type ImportInfo = {
  errors?: Maybe<Array<Scalars['String']>>,
  processed: Scalars['Int'],
  imported: Scalars['Int'],
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
  zu = 'zu'
}

export type LoginResult = {
  user: CurrentUser,
};

export type MoveCollectionInput = {
  collectionId: Scalars['ID'],
  parentId: Scalars['ID'],
  index: Scalars['Int'],
};

export type Mutation = {
  /** Create a new Administrator */
  createAdministrator: Administrator,
  /** Update an existing Administrator */
  updateAdministrator: Administrator,
  /** Assign a Role to an Administrator */
  assignRoleToAdministrator: Administrator,
  login: LoginResult,
  logout: Scalars['Boolean'],
  /** Create a new Asset */
  createAssets: Array<Asset>,
  /** Create a new Collection */
  createCollection: Collection,
  /** Update an existing Collection */
  updateCollection: Collection,
  /** Move a Collection to a different parent or index */
  moveCollection: Collection,
  /** Create a new Channel */
  createChannel: Channel,
  /** Update an existing Channel */
  updateChannel: Channel,
  /** Create a new Country */
  createCountry: Country,
  /** Update an existing Country */
  updateCountry: Country,
  /** Delete a Country */
  deleteCountry: DeletionResponse,
  /** Create a new CustomerGroup */
  createCustomerGroup: CustomerGroup,
  /** Update an existing CustomerGroup */
  updateCustomerGroup: CustomerGroup,
  /** Add Customers to a CustomerGroup */
  addCustomersToGroup: CustomerGroup,
  /** Remove Customers from a CustomerGroup */
  removeCustomersFromGroup: CustomerGroup,
  /** Create a new Customer. If a password is provided, a new User will also be created an linked to the Customer. */
  createCustomer: Customer,
  /** Update an existing Customer */
  updateCustomer: Customer,
  /** Delete a Customer */
  deleteCustomer: DeletionResponse,
  /** Create a new Address and associate it with the Customer specified by customerId */
  createCustomerAddress: Address,
  /** Update an existing Address */
  updateCustomerAddress: Address,
  /** Update an existing Address */
  deleteCustomerAddress: Scalars['Boolean'],
  /** Create a new Facet */
  createFacet: Facet,
  /** Update an existing Facet */
  updateFacet: Facet,
  /** Delete an existing Facet */
  deleteFacet: DeletionResponse,
  /** Create one or more FacetValues */
  createFacetValues: Array<FacetValue>,
  /** Update one or more FacetValues */
  updateFacetValues: Array<FacetValue>,
  /** Delete one or more FacetValues */
  deleteFacetValues: Array<DeletionResponse>,
  updateGlobalSettings: GlobalSettings,
  importProducts?: Maybe<ImportInfo>,
  /** Update an existing PaymentMethod */
  updatePaymentMethod: PaymentMethod,
  /** Create a new ProductOptionGroup */
  createProductOptionGroup: ProductOptionGroup,
  /** Update an existing ProductOptionGroup */
  updateProductOptionGroup: ProductOptionGroup,
  reindex: SearchReindexResponse,
  /** Create a new Product */
  createProduct: Product,
  /** Update an existing Product */
  updateProduct: Product,
  /** Delete a Product */
  deleteProduct: DeletionResponse,
  /** Add an OptionGroup to a Product */
  addOptionGroupToProduct: Product,
  /** Remove an OptionGroup from a Product */
  removeOptionGroupFromProduct: Product,
  /** Create a set of ProductVariants based on the OptionGroups assigned to the given Product */
  generateVariantsForProduct: Product,
  /** Update existing ProductVariants */
  updateProductVariants: Array<Maybe<ProductVariant>>,
  createPromotion: Promotion,
  updatePromotion: Promotion,
  deletePromotion: DeletionResponse,
  /** Create a new Role */
  createRole: Role,
  /** Update an existing Role */
  updateRole: Role,
  /** Create a new ShippingMethod */
  createShippingMethod: ShippingMethod,
  /** Update an existing ShippingMethod */
  updateShippingMethod: ShippingMethod,
  /** Create a new TaxCategory */
  createTaxCategory: TaxCategory,
  /** Update an existing TaxCategory */
  updateTaxCategory: TaxCategory,
  /** Create a new TaxRate */
  createTaxRate: TaxRate,
  /** Update an existing TaxRate */
  updateTaxRate: TaxRate,
  /** Create a new Zone */
  createZone: Zone,
  /** Update an existing Zone */
  updateZone: Zone,
  /** Delete a Zone */
  deleteZone: DeletionResponse,
  /** Add members to a Zone */
  addMembersToZone: Zone,
  /** Remove members from a Zone */
  removeMembersFromZone: Zone,
};


export type MutationCreateAdministratorArgs = {
  input: CreateAdministratorInput
};


export type MutationUpdateAdministratorArgs = {
  input: UpdateAdministratorInput
};


export type MutationAssignRoleToAdministratorArgs = {
  administratorId: Scalars['ID'],
  roleId: Scalars['ID']
};


export type MutationLoginArgs = {
  username: Scalars['String'],
  password: Scalars['String'],
  rememberMe?: Maybe<Scalars['Boolean']>
};


export type MutationCreateAssetsArgs = {
  input: Array<CreateAssetInput>
};


export type MutationCreateCollectionArgs = {
  input: CreateCollectionInput
};


export type MutationUpdateCollectionArgs = {
  input: UpdateCollectionInput
};


export type MutationMoveCollectionArgs = {
  input: MoveCollectionInput
};


export type MutationCreateChannelArgs = {
  input: CreateChannelInput
};


export type MutationUpdateChannelArgs = {
  input: UpdateChannelInput
};


export type MutationCreateCountryArgs = {
  input: CreateCountryInput
};


export type MutationUpdateCountryArgs = {
  input: UpdateCountryInput
};


export type MutationDeleteCountryArgs = {
  id: Scalars['ID']
};


export type MutationCreateCustomerGroupArgs = {
  input: CreateCustomerGroupInput
};


export type MutationUpdateCustomerGroupArgs = {
  input: UpdateCustomerGroupInput
};


export type MutationAddCustomersToGroupArgs = {
  customerGroupId: Scalars['ID'],
  customerIds: Array<Scalars['ID']>
};


export type MutationRemoveCustomersFromGroupArgs = {
  customerGroupId: Scalars['ID'],
  customerIds: Array<Scalars['ID']>
};


export type MutationCreateCustomerArgs = {
  input: CreateCustomerInput,
  password?: Maybe<Scalars['String']>
};


export type MutationUpdateCustomerArgs = {
  input: UpdateCustomerInput
};


export type MutationDeleteCustomerArgs = {
  id: Scalars['ID']
};


export type MutationCreateCustomerAddressArgs = {
  customerId: Scalars['ID'],
  input: CreateAddressInput
};


export type MutationUpdateCustomerAddressArgs = {
  input: UpdateAddressInput
};


export type MutationDeleteCustomerAddressArgs = {
  id: Scalars['ID']
};


export type MutationCreateFacetArgs = {
  input: CreateFacetInput
};


export type MutationUpdateFacetArgs = {
  input: UpdateFacetInput
};


export type MutationDeleteFacetArgs = {
  id: Scalars['ID'],
  force?: Maybe<Scalars['Boolean']>
};


export type MutationCreateFacetValuesArgs = {
  input: Array<CreateFacetValueInput>
};


export type MutationUpdateFacetValuesArgs = {
  input: Array<UpdateFacetValueInput>
};


export type MutationDeleteFacetValuesArgs = {
  ids: Array<Scalars['ID']>,
  force?: Maybe<Scalars['Boolean']>
};


export type MutationUpdateGlobalSettingsArgs = {
  input: UpdateGlobalSettingsInput
};


export type MutationImportProductsArgs = {
  csvFile: Scalars['Upload']
};


export type MutationUpdatePaymentMethodArgs = {
  input: UpdatePaymentMethodInput
};


export type MutationCreateProductOptionGroupArgs = {
  input: CreateProductOptionGroupInput
};


export type MutationUpdateProductOptionGroupArgs = {
  input: UpdateProductOptionGroupInput
};


export type MutationCreateProductArgs = {
  input: CreateProductInput
};


export type MutationUpdateProductArgs = {
  input: UpdateProductInput
};


export type MutationDeleteProductArgs = {
  id: Scalars['ID']
};


export type MutationAddOptionGroupToProductArgs = {
  productId: Scalars['ID'],
  optionGroupId: Scalars['ID']
};


export type MutationRemoveOptionGroupFromProductArgs = {
  productId: Scalars['ID'],
  optionGroupId: Scalars['ID']
};


export type MutationGenerateVariantsForProductArgs = {
  productId: Scalars['ID'],
  defaultTaxCategoryId?: Maybe<Scalars['ID']>,
  defaultPrice?: Maybe<Scalars['Int']>,
  defaultSku?: Maybe<Scalars['String']>
};


export type MutationUpdateProductVariantsArgs = {
  input: Array<UpdateProductVariantInput>
};


export type MutationCreatePromotionArgs = {
  input: CreatePromotionInput
};


export type MutationUpdatePromotionArgs = {
  input: UpdatePromotionInput
};


export type MutationDeletePromotionArgs = {
  id: Scalars['ID']
};


export type MutationCreateRoleArgs = {
  input: CreateRoleInput
};


export type MutationUpdateRoleArgs = {
  input: UpdateRoleInput
};


export type MutationCreateShippingMethodArgs = {
  input: CreateShippingMethodInput
};


export type MutationUpdateShippingMethodArgs = {
  input: UpdateShippingMethodInput
};


export type MutationCreateTaxCategoryArgs = {
  input: CreateTaxCategoryInput
};


export type MutationUpdateTaxCategoryArgs = {
  input: UpdateTaxCategoryInput
};


export type MutationCreateTaxRateArgs = {
  input: CreateTaxRateInput
};


export type MutationUpdateTaxRateArgs = {
  input: UpdateTaxRateInput
};


export type MutationCreateZoneArgs = {
  input: CreateZoneInput
};


export type MutationUpdateZoneArgs = {
  input: UpdateZoneInput
};


export type MutationDeleteZoneArgs = {
  id: Scalars['ID']
};


export type MutationAddMembersToZoneArgs = {
  zoneId: Scalars['ID'],
  memberIds: Array<Scalars['ID']>
};


export type MutationRemoveMembersFromZoneArgs = {
  zoneId: Scalars['ID'],
  memberIds: Array<Scalars['ID']>
};

export type Node = {
  id: Scalars['ID'],
};

export type NumberOperators = {
  eq?: Maybe<Scalars['Float']>,
  lt?: Maybe<Scalars['Float']>,
  lte?: Maybe<Scalars['Float']>,
  gt?: Maybe<Scalars['Float']>,
  gte?: Maybe<Scalars['Float']>,
  between?: Maybe<NumberRange>,
};

export type NumberRange = {
  start: Scalars['Float'],
  end: Scalars['Float'],
};

export type Order = Node & {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  code: Scalars['String'],
  state: Scalars['String'],
  active: Scalars['Boolean'],
  customer?: Maybe<Customer>,
  shippingAddress?: Maybe<OrderAddress>,
  billingAddress?: Maybe<OrderAddress>,
  lines: Array<OrderLine>,
  adjustments: Array<Adjustment>,
  payments?: Maybe<Array<Payment>>,
  subTotalBeforeTax: Scalars['Int'],
  subTotal: Scalars['Int'],
  currencyCode: CurrencyCode,
  shipping: Scalars['Int'],
  shippingMethod?: Maybe<ShippingMethod>,
  totalBeforeTax: Scalars['Int'],
  total: Scalars['Int'],
};

export type OrderAddress = {
  fullName?: Maybe<Scalars['String']>,
  company?: Maybe<Scalars['String']>,
  streetLine1?: Maybe<Scalars['String']>,
  streetLine2?: Maybe<Scalars['String']>,
  city?: Maybe<Scalars['String']>,
  province?: Maybe<Scalars['String']>,
  postalCode?: Maybe<Scalars['String']>,
  country?: Maybe<Scalars['String']>,
  countryCode?: Maybe<Scalars['String']>,
  phoneNumber?: Maybe<Scalars['String']>,
};

export type OrderFilterParameter = {
  createdAt?: Maybe<DateOperators>,
  updatedAt?: Maybe<DateOperators>,
  code?: Maybe<StringOperators>,
  state?: Maybe<StringOperators>,
  active?: Maybe<BooleanOperators>,
  subTotalBeforeTax?: Maybe<NumberOperators>,
  subTotal?: Maybe<NumberOperators>,
  currencyCode?: Maybe<StringOperators>,
  shipping?: Maybe<NumberOperators>,
  totalBeforeTax?: Maybe<NumberOperators>,
  total?: Maybe<NumberOperators>,
};

export type OrderItem = Node & {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  unitPrice: Scalars['Int'],
  unitPriceWithTax: Scalars['Int'],
  unitPriceIncludesTax: Scalars['Boolean'],
  taxRate: Scalars['Float'],
  adjustments: Array<Adjustment>,
};

export type OrderLine = Node & {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  productVariant: ProductVariant,
  featuredAsset?: Maybe<Asset>,
  unitPrice: Scalars['Int'],
  unitPriceWithTax: Scalars['Int'],
  quantity: Scalars['Int'],
  items: Array<OrderItem>,
  totalPrice: Scalars['Int'],
  adjustments: Array<Adjustment>,
  order: Order,
};

export type OrderList = PaginatedList & {
  items: Array<Order>,
  totalItems: Scalars['Int'],
};

export type OrderListOptions = {
  skip?: Maybe<Scalars['Int']>,
  take?: Maybe<Scalars['Int']>,
  sort?: Maybe<OrderSortParameter>,
  filter?: Maybe<OrderFilterParameter>,
};

export type OrderSortParameter = {
  id?: Maybe<SortOrder>,
  createdAt?: Maybe<SortOrder>,
  updatedAt?: Maybe<SortOrder>,
  code?: Maybe<SortOrder>,
  state?: Maybe<SortOrder>,
  subTotalBeforeTax?: Maybe<SortOrder>,
  subTotal?: Maybe<SortOrder>,
  shipping?: Maybe<SortOrder>,
  totalBeforeTax?: Maybe<SortOrder>,
  total?: Maybe<SortOrder>,
};

export type PaginatedList = {
  items: Array<Node>,
  totalItems: Scalars['Int'],
};

export type Payment = Node & {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  method: Scalars['String'],
  amount: Scalars['Int'],
  state: Scalars['String'],
  transactionId?: Maybe<Scalars['String']>,
  metadata?: Maybe<Scalars['JSON']>,
};

export type PaymentMethod = Node & {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  code: Scalars['String'],
  enabled: Scalars['Boolean'],
  configArgs: Array<ConfigArg>,
};

export type PaymentMethodFilterParameter = {
  createdAt?: Maybe<DateOperators>,
  updatedAt?: Maybe<DateOperators>,
  code?: Maybe<StringOperators>,
  enabled?: Maybe<BooleanOperators>,
};

export type PaymentMethodList = PaginatedList & {
  items: Array<PaymentMethod>,
  totalItems: Scalars['Int'],
};

export type PaymentMethodListOptions = {
  skip?: Maybe<Scalars['Int']>,
  take?: Maybe<Scalars['Int']>,
  sort?: Maybe<PaymentMethodSortParameter>,
  filter?: Maybe<PaymentMethodFilterParameter>,
};

export type PaymentMethodSortParameter = {
  id?: Maybe<SortOrder>,
  createdAt?: Maybe<SortOrder>,
  updatedAt?: Maybe<SortOrder>,
  code?: Maybe<SortOrder>,
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
  DeleteSettings = 'DeleteSettings'
}

/** The price range where the result has more than one price */
export type PriceRange = {
  min: Scalars['Int'],
  max: Scalars['Int'],
};

export type Product = Node & {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  languageCode: LanguageCode,
  name: Scalars['String'],
  slug: Scalars['String'],
  description: Scalars['String'],
  featuredAsset?: Maybe<Asset>,
  assets: Array<Asset>,
  variants: Array<ProductVariant>,
  optionGroups: Array<ProductOptionGroup>,
  facetValues: Array<FacetValue>,
  translations: Array<ProductTranslation>,
  collections: Array<Collection>,
  enabled: Scalars['Boolean'],
  customFields?: Maybe<Scalars['JSON']>,
};

export type ProductFilterParameter = {
  createdAt?: Maybe<DateOperators>,
  updatedAt?: Maybe<DateOperators>,
  languageCode?: Maybe<StringOperators>,
  name?: Maybe<StringOperators>,
  slug?: Maybe<StringOperators>,
  description?: Maybe<StringOperators>,
  enabled?: Maybe<BooleanOperators>,
};

export type ProductList = PaginatedList & {
  items: Array<Product>,
  totalItems: Scalars['Int'],
};

export type ProductListOptions = {
  skip?: Maybe<Scalars['Int']>,
  take?: Maybe<Scalars['Int']>,
  sort?: Maybe<ProductSortParameter>,
  filter?: Maybe<ProductFilterParameter>,
};

export type ProductOption = Node & {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  languageCode?: Maybe<LanguageCode>,
  code?: Maybe<Scalars['String']>,
  name?: Maybe<Scalars['String']>,
  translations: Array<ProductOptionTranslation>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type ProductOptionGroup = Node & {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  languageCode: LanguageCode,
  code: Scalars['String'],
  name: Scalars['String'],
  options: Array<ProductOption>,
  translations: Array<ProductOptionGroupTranslation>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type ProductOptionGroupTranslation = {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  languageCode: LanguageCode,
  name: Scalars['String'],
};

export type ProductOptionGroupTranslationInput = {
  id?: Maybe<Scalars['ID']>,
  languageCode: LanguageCode,
  name?: Maybe<Scalars['String']>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type ProductOptionTranslation = {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  languageCode: LanguageCode,
  name: Scalars['String'],
};

export type ProductOptionTranslationInput = {
  id?: Maybe<Scalars['ID']>,
  languageCode: LanguageCode,
  name?: Maybe<Scalars['String']>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type ProductSortParameter = {
  id?: Maybe<SortOrder>,
  createdAt?: Maybe<SortOrder>,
  updatedAt?: Maybe<SortOrder>,
  name?: Maybe<SortOrder>,
  slug?: Maybe<SortOrder>,
  description?: Maybe<SortOrder>,
};

export type ProductTranslation = {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  languageCode: LanguageCode,
  name: Scalars['String'],
  slug: Scalars['String'],
  description: Scalars['String'],
};

export type ProductTranslationInput = {
  id?: Maybe<Scalars['ID']>,
  languageCode: LanguageCode,
  name?: Maybe<Scalars['String']>,
  slug?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type ProductVariant = Node & {
  id: Scalars['ID'],
  productId: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  languageCode: LanguageCode,
  sku: Scalars['String'],
  name: Scalars['String'],
  featuredAsset?: Maybe<Asset>,
  assets: Array<Asset>,
  price: Scalars['Int'],
  currencyCode: CurrencyCode,
  priceIncludesTax: Scalars['Boolean'],
  priceWithTax: Scalars['Int'],
  taxRateApplied: TaxRate,
  taxCategory: TaxCategory,
  options: Array<ProductOption>,
  facetValues: Array<FacetValue>,
  translations: Array<ProductVariantTranslation>,
  enabled: Scalars['Boolean'],
  stockOnHand: Scalars['Int'],
  trackInventory: Scalars['Boolean'],
  stockMovements: StockMovementList,
  customFields?: Maybe<Scalars['JSON']>,
};


export type ProductVariantStockMovementsArgs = {
  options?: Maybe<StockMovementListOptions>
};

export type ProductVariantFilterParameter = {
  createdAt?: Maybe<DateOperators>,
  updatedAt?: Maybe<DateOperators>,
  languageCode?: Maybe<StringOperators>,
  sku?: Maybe<StringOperators>,
  name?: Maybe<StringOperators>,
  price?: Maybe<NumberOperators>,
  currencyCode?: Maybe<StringOperators>,
  priceIncludesTax?: Maybe<BooleanOperators>,
  priceWithTax?: Maybe<NumberOperators>,
  enabled?: Maybe<BooleanOperators>,
  stockOnHand?: Maybe<NumberOperators>,
  trackInventory?: Maybe<BooleanOperators>,
};

export type ProductVariantList = PaginatedList & {
  items: Array<ProductVariant>,
  totalItems: Scalars['Int'],
};

export type ProductVariantListOptions = {
  skip?: Maybe<Scalars['Int']>,
  take?: Maybe<Scalars['Int']>,
  sort?: Maybe<ProductVariantSortParameter>,
  filter?: Maybe<ProductVariantFilterParameter>,
};

export type ProductVariantSortParameter = {
  id?: Maybe<SortOrder>,
  productId?: Maybe<SortOrder>,
  createdAt?: Maybe<SortOrder>,
  updatedAt?: Maybe<SortOrder>,
  sku?: Maybe<SortOrder>,
  name?: Maybe<SortOrder>,
  price?: Maybe<SortOrder>,
  priceWithTax?: Maybe<SortOrder>,
  stockOnHand?: Maybe<SortOrder>,
};

export type ProductVariantTranslation = {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  languageCode: LanguageCode,
  name: Scalars['String'],
};

export type ProductVariantTranslationInput = {
  id?: Maybe<Scalars['ID']>,
  languageCode: LanguageCode,
  name?: Maybe<Scalars['String']>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type Promotion = Node & {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  name: Scalars['String'],
  enabled: Scalars['Boolean'],
  conditions: Array<ConfigurableOperation>,
  actions: Array<ConfigurableOperation>,
};

export type PromotionFilterParameter = {
  createdAt?: Maybe<DateOperators>,
  updatedAt?: Maybe<DateOperators>,
  name?: Maybe<StringOperators>,
  enabled?: Maybe<BooleanOperators>,
};

export type PromotionList = PaginatedList & {
  items: Array<Promotion>,
  totalItems: Scalars['Int'],
};

export type PromotionListOptions = {
  skip?: Maybe<Scalars['Int']>,
  take?: Maybe<Scalars['Int']>,
  sort?: Maybe<PromotionSortParameter>,
  filter?: Maybe<PromotionFilterParameter>,
};

export type PromotionSortParameter = {
  id?: Maybe<SortOrder>,
  createdAt?: Maybe<SortOrder>,
  updatedAt?: Maybe<SortOrder>,
  name?: Maybe<SortOrder>,
};

export type Query = {
  administrators: AdministratorList,
  administrator?: Maybe<Administrator>,
  me?: Maybe<CurrentUser>,
  assets: AssetList,
  asset?: Maybe<Asset>,
  collections: CollectionList,
  collection?: Maybe<Collection>,
  collectionFilters: Array<ConfigurableOperation>,
  channels: Array<Channel>,
  channel?: Maybe<Channel>,
  activeChannel: Channel,
  countries: CountryList,
  country?: Maybe<Country>,
  customerGroups: Array<CustomerGroup>,
  customerGroup?: Maybe<CustomerGroup>,
  customers: CustomerList,
  customer?: Maybe<Customer>,
  facets: FacetList,
  facet?: Maybe<Facet>,
  globalSettings: GlobalSettings,
  order?: Maybe<Order>,
  orders: OrderList,
  paymentMethods: PaymentMethodList,
  paymentMethod?: Maybe<PaymentMethod>,
  productOptionGroups: Array<ProductOptionGroup>,
  productOptionGroup?: Maybe<ProductOptionGroup>,
  search: SearchResponse,
  products: ProductList,
  product?: Maybe<Product>,
  promotion?: Maybe<Promotion>,
  promotions: PromotionList,
  adjustmentOperations: AdjustmentOperations,
  roles: RoleList,
  role?: Maybe<Role>,
  shippingMethods: ShippingMethodList,
  shippingMethod?: Maybe<ShippingMethod>,
  shippingEligibilityCheckers: Array<ConfigurableOperation>,
  shippingCalculators: Array<ConfigurableOperation>,
  taxCategories: Array<TaxCategory>,
  taxCategory?: Maybe<TaxCategory>,
  taxRates: TaxRateList,
  taxRate?: Maybe<TaxRate>,
  zones: Array<Zone>,
  zone?: Maybe<Zone>,
  temp__?: Maybe<Scalars['Boolean']>,
};


export type QueryAdministratorsArgs = {
  options?: Maybe<AdministratorListOptions>
};


export type QueryAdministratorArgs = {
  id: Scalars['ID']
};


export type QueryAssetsArgs = {
  options?: Maybe<AssetListOptions>
};


export type QueryAssetArgs = {
  id: Scalars['ID']
};


export type QueryCollectionsArgs = {
  languageCode?: Maybe<LanguageCode>,
  options?: Maybe<CollectionListOptions>
};


export type QueryCollectionArgs = {
  id: Scalars['ID'],
  languageCode?: Maybe<LanguageCode>
};


export type QueryChannelArgs = {
  id: Scalars['ID']
};


export type QueryCountriesArgs = {
  options?: Maybe<CountryListOptions>
};


export type QueryCountryArgs = {
  id: Scalars['ID']
};


export type QueryCustomerGroupArgs = {
  id: Scalars['ID']
};


export type QueryCustomersArgs = {
  options?: Maybe<CustomerListOptions>
};


export type QueryCustomerArgs = {
  id: Scalars['ID']
};


export type QueryFacetsArgs = {
  languageCode?: Maybe<LanguageCode>,
  options?: Maybe<FacetListOptions>
};


export type QueryFacetArgs = {
  id: Scalars['ID'],
  languageCode?: Maybe<LanguageCode>
};


export type QueryOrderArgs = {
  id: Scalars['ID']
};


export type QueryOrdersArgs = {
  options?: Maybe<OrderListOptions>
};


export type QueryPaymentMethodsArgs = {
  options?: Maybe<PaymentMethodListOptions>
};


export type QueryPaymentMethodArgs = {
  id: Scalars['ID']
};


export type QueryProductOptionGroupsArgs = {
  languageCode?: Maybe<LanguageCode>,
  filterTerm?: Maybe<Scalars['String']>
};


export type QueryProductOptionGroupArgs = {
  id: Scalars['ID'],
  languageCode?: Maybe<LanguageCode>
};


export type QuerySearchArgs = {
  input: SearchInput
};


export type QueryProductsArgs = {
  languageCode?: Maybe<LanguageCode>,
  options?: Maybe<ProductListOptions>
};


export type QueryProductArgs = {
  id: Scalars['ID'],
  languageCode?: Maybe<LanguageCode>
};


export type QueryPromotionArgs = {
  id: Scalars['ID']
};


export type QueryPromotionsArgs = {
  options?: Maybe<PromotionListOptions>
};


export type QueryRolesArgs = {
  options?: Maybe<RoleListOptions>
};


export type QueryRoleArgs = {
  id: Scalars['ID']
};


export type QueryShippingMethodsArgs = {
  options?: Maybe<ShippingMethodListOptions>
};


export type QueryShippingMethodArgs = {
  id: Scalars['ID']
};


export type QueryTaxCategoryArgs = {
  id: Scalars['ID']
};


export type QueryTaxRatesArgs = {
  options?: Maybe<TaxRateListOptions>
};


export type QueryTaxRateArgs = {
  id: Scalars['ID']
};


export type QueryZoneArgs = {
  id: Scalars['ID']
};

export type Return = Node & StockMovement & {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  productVariant: ProductVariant,
  type: StockMovementType,
  quantity: Scalars['Int'],
  orderItem: OrderItem,
};

export type Role = Node & {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  code: Scalars['String'],
  description: Scalars['String'],
  permissions: Array<Permission>,
  channels: Array<Channel>,
};

export type RoleFilterParameter = {
  createdAt?: Maybe<DateOperators>,
  updatedAt?: Maybe<DateOperators>,
  code?: Maybe<StringOperators>,
  description?: Maybe<StringOperators>,
};

export type RoleList = PaginatedList & {
  items: Array<Role>,
  totalItems: Scalars['Int'],
};

export type RoleListOptions = {
  skip?: Maybe<Scalars['Int']>,
  take?: Maybe<Scalars['Int']>,
  sort?: Maybe<RoleSortParameter>,
  filter?: Maybe<RoleFilterParameter>,
};

export type RoleSortParameter = {
  id?: Maybe<SortOrder>,
  createdAt?: Maybe<SortOrder>,
  updatedAt?: Maybe<SortOrder>,
  code?: Maybe<SortOrder>,
  description?: Maybe<SortOrder>,
};

export type Sale = Node & StockMovement & {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  productVariant: ProductVariant,
  type: StockMovementType,
  quantity: Scalars['Int'],
  orderLine: OrderLine,
};

export type SearchInput = {
  term?: Maybe<Scalars['String']>,
  facetIds?: Maybe<Array<Scalars['String']>>,
  collectionId?: Maybe<Scalars['String']>,
  groupByProduct?: Maybe<Scalars['Boolean']>,
  take?: Maybe<Scalars['Int']>,
  skip?: Maybe<Scalars['Int']>,
  sort?: Maybe<SearchResultSortParameter>,
};

export type SearchReindexResponse = {
  success: Scalars['Boolean'],
  timeTaken: Scalars['Int'],
  indexedItemCount: Scalars['Int'],
};

export type SearchResponse = {
  items: Array<SearchResult>,
  totalItems: Scalars['Int'],
  facetValues: Array<FacetValueResult>,
};

export type SearchResult = {
  sku: Scalars['String'],
  slug: Scalars['String'],
  productId: Scalars['ID'],
  productName: Scalars['String'],
  productPreview: Scalars['String'],
  productVariantId: Scalars['ID'],
  productVariantName: Scalars['String'],
  productVariantPreview: Scalars['String'],
  price: SearchResultPrice,
  priceWithTax: SearchResultPrice,
  currencyCode: CurrencyCode,
  description: Scalars['String'],
  facetIds: Array<Scalars['String']>,
  facetValueIds: Array<Scalars['String']>,
  /** An array of ids of the Collections in which this result appears */
  collectionIds: Array<Scalars['String']>,
  /** A relevence score for the result. Differs between database implementations */
  score: Scalars['Float'],
  enabled: Scalars['Boolean'],
};

/** The price of a search result product, either as a range or as a single price */
export type SearchResultPrice = PriceRange | SinglePrice;

export type SearchResultSortParameter = {
  name?: Maybe<SortOrder>,
  price?: Maybe<SortOrder>,
};

export type ServerConfig = {
  customFields?: Maybe<Scalars['JSON']>,
};

export type ShippingMethod = Node & {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  code: Scalars['String'],
  description: Scalars['String'],
  checker: ConfigurableOperation,
  calculator: ConfigurableOperation,
};

export type ShippingMethodFilterParameter = {
  createdAt?: Maybe<DateOperators>,
  updatedAt?: Maybe<DateOperators>,
  code?: Maybe<StringOperators>,
  description?: Maybe<StringOperators>,
};

export type ShippingMethodList = PaginatedList & {
  items: Array<ShippingMethod>,
  totalItems: Scalars['Int'],
};

export type ShippingMethodListOptions = {
  skip?: Maybe<Scalars['Int']>,
  take?: Maybe<Scalars['Int']>,
  sort?: Maybe<ShippingMethodSortParameter>,
  filter?: Maybe<ShippingMethodFilterParameter>,
};

export type ShippingMethodQuote = {
  id: Scalars['ID'],
  price: Scalars['Int'],
  description: Scalars['String'],
};

export type ShippingMethodSortParameter = {
  id?: Maybe<SortOrder>,
  createdAt?: Maybe<SortOrder>,
  updatedAt?: Maybe<SortOrder>,
  code?: Maybe<SortOrder>,
  description?: Maybe<SortOrder>,
};

/** The price value where the result has a single price */
export type SinglePrice = {
  value: Scalars['Int'],
};

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

export type StockAdjustment = Node & StockMovement & {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  productVariant: ProductVariant,
  type: StockMovementType,
  quantity: Scalars['Int'],
};

export type StockMovement = {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  productVariant: ProductVariant,
  type: StockMovementType,
  quantity: Scalars['Int'],
};

export type StockMovementItem = StockAdjustment | Sale | Cancellation | Return;

export type StockMovementList = {
  items: Array<StockMovementItem>,
  totalItems: Scalars['Int'],
};

export type StockMovementListOptions = {
  type?: Maybe<StockMovementType>,
  skip?: Maybe<Scalars['Int']>,
  take?: Maybe<Scalars['Int']>,
};

export enum StockMovementType {
  ADJUSTMENT = 'ADJUSTMENT',
  SALE = 'SALE',
  CANCELLATION = 'CANCELLATION',
  RETURN = 'RETURN'
}

export type StringOperators = {
  eq?: Maybe<Scalars['String']>,
  contains?: Maybe<Scalars['String']>,
};

export type TaxCategory = Node & {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  name: Scalars['String'],
};

export type TaxRate = Node & {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  name: Scalars['String'],
  enabled: Scalars['Boolean'],
  value: Scalars['Int'],
  category: TaxCategory,
  zone: Zone,
  customerGroup?: Maybe<CustomerGroup>,
};

export type TaxRateFilterParameter = {
  createdAt?: Maybe<DateOperators>,
  updatedAt?: Maybe<DateOperators>,
  name?: Maybe<StringOperators>,
  enabled?: Maybe<BooleanOperators>,
  value?: Maybe<NumberOperators>,
};

export type TaxRateList = PaginatedList & {
  items: Array<TaxRate>,
  totalItems: Scalars['Int'],
};

export type TaxRateListOptions = {
  skip?: Maybe<Scalars['Int']>,
  take?: Maybe<Scalars['Int']>,
  sort?: Maybe<TaxRateSortParameter>,
  filter?: Maybe<TaxRateFilterParameter>,
};

export type TaxRateSortParameter = {
  id?: Maybe<SortOrder>,
  createdAt?: Maybe<SortOrder>,
  updatedAt?: Maybe<SortOrder>,
  name?: Maybe<SortOrder>,
  value?: Maybe<SortOrder>,
};

export type UpdateAddressInput = {
  id: Scalars['ID'],
  fullName?: Maybe<Scalars['String']>,
  company?: Maybe<Scalars['String']>,
  streetLine1?: Maybe<Scalars['String']>,
  streetLine2?: Maybe<Scalars['String']>,
  city?: Maybe<Scalars['String']>,
  province?: Maybe<Scalars['String']>,
  postalCode?: Maybe<Scalars['String']>,
  countryCode?: Maybe<Scalars['String']>,
  phoneNumber?: Maybe<Scalars['String']>,
  defaultShippingAddress?: Maybe<Scalars['Boolean']>,
  defaultBillingAddress?: Maybe<Scalars['Boolean']>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type UpdateAdministratorInput = {
  id: Scalars['ID'],
  firstName?: Maybe<Scalars['String']>,
  lastName?: Maybe<Scalars['String']>,
  emailAddress?: Maybe<Scalars['String']>,
  password?: Maybe<Scalars['String']>,
  roleIds?: Maybe<Array<Scalars['ID']>>,
};

export type UpdateChannelInput = {
  id: Scalars['ID'],
  code?: Maybe<Scalars['String']>,
  token?: Maybe<Scalars['String']>,
  defaultLanguageCode?: Maybe<LanguageCode>,
  pricesIncludeTax?: Maybe<Scalars['Boolean']>,
  currencyCode?: Maybe<CurrencyCode>,
  defaultTaxZoneId?: Maybe<Scalars['ID']>,
  defaultShippingZoneId?: Maybe<Scalars['ID']>,
};

export type UpdateCollectionInput = {
  id: Scalars['ID'],
  isPrivate?: Maybe<Scalars['Boolean']>,
  featuredAssetId?: Maybe<Scalars['ID']>,
  parentId?: Maybe<Scalars['ID']>,
  assetIds?: Maybe<Array<Scalars['ID']>>,
  filters?: Maybe<Array<ConfigurableOperationInput>>,
  translations?: Maybe<Array<CollectionTranslationInput>>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type UpdateCountryInput = {
  id: Scalars['ID'],
  code?: Maybe<Scalars['String']>,
  translations?: Maybe<Array<CountryTranslationInput>>,
  enabled?: Maybe<Scalars['Boolean']>,
};

export type UpdateCustomerGroupInput = {
  id: Scalars['ID'],
  name?: Maybe<Scalars['String']>,
};

export type UpdateCustomerInput = {
  id: Scalars['ID'],
  title?: Maybe<Scalars['String']>,
  firstName?: Maybe<Scalars['String']>,
  lastName?: Maybe<Scalars['String']>,
  phoneNumber?: Maybe<Scalars['String']>,
  emailAddress?: Maybe<Scalars['String']>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type UpdateFacetInput = {
  id: Scalars['ID'],
  isPrivate?: Maybe<Scalars['Boolean']>,
  code?: Maybe<Scalars['String']>,
  translations?: Maybe<Array<FacetTranslationInput>>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type UpdateFacetValueInput = {
  id: Scalars['ID'],
  code?: Maybe<Scalars['String']>,
  translations?: Maybe<Array<FacetValueTranslationInput>>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type UpdateGlobalSettingsInput = {
  availableLanguages?: Maybe<Array<LanguageCode>>,
  trackInventory?: Maybe<Scalars['Boolean']>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type UpdatePaymentMethodInput = {
  id: Scalars['ID'],
  code?: Maybe<Scalars['String']>,
  enabled?: Maybe<Scalars['Boolean']>,
  configArgs?: Maybe<Array<ConfigArgInput>>,
};

export type UpdateProductInput = {
  id: Scalars['ID'],
  enabled?: Maybe<Scalars['Boolean']>,
  featuredAssetId?: Maybe<Scalars['ID']>,
  assetIds?: Maybe<Array<Scalars['ID']>>,
  facetValueIds?: Maybe<Array<Scalars['ID']>>,
  translations?: Maybe<Array<ProductTranslationInput>>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type UpdateProductOptionGroupInput = {
  id: Scalars['ID'],
  code?: Maybe<Scalars['String']>,
  translations?: Maybe<Array<ProductOptionGroupTranslationInput>>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type UpdateProductVariantInput = {
  id: Scalars['ID'],
  enabled?: Maybe<Scalars['Boolean']>,
  translations?: Maybe<Array<ProductVariantTranslationInput>>,
  facetValueIds?: Maybe<Array<Scalars['ID']>>,
  sku?: Maybe<Scalars['String']>,
  taxCategoryId?: Maybe<Scalars['ID']>,
  price?: Maybe<Scalars['Int']>,
  featuredAssetId?: Maybe<Scalars['ID']>,
  assetIds?: Maybe<Array<Scalars['ID']>>,
  stockOnHand?: Maybe<Scalars['Int']>,
  trackInventory?: Maybe<Scalars['Boolean']>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type UpdatePromotionInput = {
  id: Scalars['ID'],
  name?: Maybe<Scalars['String']>,
  enabled?: Maybe<Scalars['Boolean']>,
  conditions?: Maybe<Array<ConfigurableOperationInput>>,
  actions?: Maybe<Array<ConfigurableOperationInput>>,
};

export type UpdateRoleInput = {
  id: Scalars['ID'],
  code?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  permissions?: Maybe<Array<Permission>>,
};

export type UpdateShippingMethodInput = {
  id: Scalars['ID'],
  code?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  checker?: Maybe<ConfigurableOperationInput>,
  calculator?: Maybe<ConfigurableOperationInput>,
};

export type UpdateTaxCategoryInput = {
  id: Scalars['ID'],
  name?: Maybe<Scalars['String']>,
};

export type UpdateTaxRateInput = {
  id: Scalars['ID'],
  name?: Maybe<Scalars['String']>,
  value?: Maybe<Scalars['Int']>,
  enabled?: Maybe<Scalars['Boolean']>,
  categoryId?: Maybe<Scalars['ID']>,
  zoneId?: Maybe<Scalars['ID']>,
  customerGroupId?: Maybe<Scalars['ID']>,
};

export type UpdateZoneInput = {
  id: Scalars['ID'],
  name?: Maybe<Scalars['String']>,
};


export type User = Node & {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  identifier: Scalars['String'],
  verified: Scalars['Boolean'],
  roles: Array<Role>,
  lastLogin?: Maybe<Scalars['String']>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type Zone = Node & {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  name: Scalars['String'],
  members: Array<Country>,
};
