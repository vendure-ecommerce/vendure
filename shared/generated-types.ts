// tslint:disable
// Generated in 2019-03-04T11:47:06+01:00
export type Maybe<T> = T | null;


export interface AdministratorListOptions {
  
  skip?: Maybe<number>;
  
  take?: Maybe<number>;
  
  sort?: Maybe<AdministratorSortParameter>;
  
  filter?: Maybe<AdministratorFilterParameter>;
}

export interface AdministratorSortParameter {
  
  id?: Maybe<SortOrder>;
  
  createdAt?: Maybe<SortOrder>;
  
  updatedAt?: Maybe<SortOrder>;
  
  firstName?: Maybe<SortOrder>;
  
  lastName?: Maybe<SortOrder>;
  
  emailAddress?: Maybe<SortOrder>;
}

export interface AdministratorFilterParameter {
  
  createdAt?: Maybe<DateOperators>;
  
  updatedAt?: Maybe<DateOperators>;
  
  firstName?: Maybe<StringOperators>;
  
  lastName?: Maybe<StringOperators>;
  
  emailAddress?: Maybe<StringOperators>;
}

export interface DateOperators {
  
  eq?: Maybe<DateTime>;
  
  before?: Maybe<DateTime>;
  
  after?: Maybe<DateTime>;
  
  between?: Maybe<DateRange>;
}

export interface DateRange {
  
  start: DateTime;
  
  end: DateTime;
}

export interface StringOperators {
  
  eq?: Maybe<string>;
  
  contains?: Maybe<string>;
}

export interface AssetListOptions {
  
  skip?: Maybe<number>;
  
  take?: Maybe<number>;
  
  sort?: Maybe<AssetSortParameter>;
  
  filter?: Maybe<AssetFilterParameter>;
}

export interface AssetSortParameter {
  
  id?: Maybe<SortOrder>;
  
  name?: Maybe<SortOrder>;
  
  fileSize?: Maybe<SortOrder>;
  
  mimeType?: Maybe<SortOrder>;
  
  source?: Maybe<SortOrder>;
  
  preview?: Maybe<SortOrder>;
}

export interface AssetFilterParameter {
  
  name?: Maybe<StringOperators>;
  
  type?: Maybe<StringOperators>;
  
  fileSize?: Maybe<NumberOperators>;
  
  mimeType?: Maybe<StringOperators>;
  
  source?: Maybe<StringOperators>;
  
  preview?: Maybe<StringOperators>;
}

export interface NumberOperators {
  
  eq?: Maybe<number>;
  
  lt?: Maybe<number>;
  
  lte?: Maybe<number>;
  
  gt?: Maybe<number>;
  
  gte?: Maybe<number>;
  
  between?: Maybe<NumberRange>;
}

export interface NumberRange {
  
  start: number;
  
  end: number;
}

export interface CollectionListOptions {
  
  skip?: Maybe<number>;
  
  take?: Maybe<number>;
  
  sort?: Maybe<CollectionSortParameter>;
  
  filter?: Maybe<CollectionFilterParameter>;
}

export interface CollectionSortParameter {
  
  id?: Maybe<SortOrder>;
  
  createdAt?: Maybe<SortOrder>;
  
  updatedAt?: Maybe<SortOrder>;
  
  name?: Maybe<SortOrder>;
  
  position?: Maybe<SortOrder>;
  
  description?: Maybe<SortOrder>;
}

export interface CollectionFilterParameter {
  
  createdAt?: Maybe<DateOperators>;
  
  updatedAt?: Maybe<DateOperators>;
  
  languageCode?: Maybe<StringOperators>;
  
  name?: Maybe<StringOperators>;
  
  position?: Maybe<NumberOperators>;
  
  description?: Maybe<StringOperators>;
}

export interface CountryListOptions {
  
  skip?: Maybe<number>;
  
  take?: Maybe<number>;
  
  sort?: Maybe<CountrySortParameter>;
  
  filter?: Maybe<CountryFilterParameter>;
}

export interface CountrySortParameter {
  
  id?: Maybe<SortOrder>;
  
  code?: Maybe<SortOrder>;
  
  name?: Maybe<SortOrder>;
}

export interface CountryFilterParameter {
  
  languageCode?: Maybe<StringOperators>;
  
  code?: Maybe<StringOperators>;
  
  name?: Maybe<StringOperators>;
  
  enabled?: Maybe<BooleanOperators>;
}

export interface BooleanOperators {
  
  eq?: Maybe<boolean>;
}

export interface CustomerListOptions {
  
  skip?: Maybe<number>;
  
  take?: Maybe<number>;
  
  sort?: Maybe<CustomerSortParameter>;
  
  filter?: Maybe<CustomerFilterParameter>;
}

export interface CustomerSortParameter {
  
  id?: Maybe<SortOrder>;
  
  createdAt?: Maybe<SortOrder>;
  
  updatedAt?: Maybe<SortOrder>;
  
  title?: Maybe<SortOrder>;
  
  firstName?: Maybe<SortOrder>;
  
  lastName?: Maybe<SortOrder>;
  
  phoneNumber?: Maybe<SortOrder>;
  
  emailAddress?: Maybe<SortOrder>;
}

export interface CustomerFilterParameter {
  
  createdAt?: Maybe<DateOperators>;
  
  updatedAt?: Maybe<DateOperators>;
  
  title?: Maybe<StringOperators>;
  
  firstName?: Maybe<StringOperators>;
  
  lastName?: Maybe<StringOperators>;
  
  phoneNumber?: Maybe<StringOperators>;
  
  emailAddress?: Maybe<StringOperators>;
}

export interface OrderListOptions {
  
  skip?: Maybe<number>;
  
  take?: Maybe<number>;
  
  sort?: Maybe<OrderSortParameter>;
  
  filter?: Maybe<OrderFilterParameter>;
}

export interface OrderSortParameter {
  
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
}

export interface OrderFilterParameter {
  
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
}

export interface FacetListOptions {
  
  skip?: Maybe<number>;
  
  take?: Maybe<number>;
  
  sort?: Maybe<FacetSortParameter>;
  
  filter?: Maybe<FacetFilterParameter>;
}

export interface FacetSortParameter {
  
  id?: Maybe<SortOrder>;
  
  createdAt?: Maybe<SortOrder>;
  
  updatedAt?: Maybe<SortOrder>;
  
  name?: Maybe<SortOrder>;
  
  code?: Maybe<SortOrder>;
}

export interface FacetFilterParameter {
  
  createdAt?: Maybe<DateOperators>;
  
  updatedAt?: Maybe<DateOperators>;
  
  languageCode?: Maybe<StringOperators>;
  
  name?: Maybe<StringOperators>;
  
  code?: Maybe<StringOperators>;
}

export interface PaymentMethodListOptions {
  
  skip?: Maybe<number>;
  
  take?: Maybe<number>;
  
  sort?: Maybe<PaymentMethodSortParameter>;
  
  filter?: Maybe<PaymentMethodFilterParameter>;
}

export interface PaymentMethodSortParameter {
  
  id?: Maybe<SortOrder>;
  
  createdAt?: Maybe<SortOrder>;
  
  updatedAt?: Maybe<SortOrder>;
  
  code?: Maybe<SortOrder>;
}

export interface PaymentMethodFilterParameter {
  
  createdAt?: Maybe<DateOperators>;
  
  updatedAt?: Maybe<DateOperators>;
  
  code?: Maybe<StringOperators>;
  
  enabled?: Maybe<BooleanOperators>;
}

export interface SearchInput {
  
  term?: Maybe<string>;
  
  facetIds?: Maybe<string[]>;
  
  groupByProduct?: Maybe<boolean>;
  
  take?: Maybe<number>;
  
  skip?: Maybe<number>;
  
  sort?: Maybe<SearchResultSortParameter>;
}

export interface SearchResultSortParameter {
  
  name?: Maybe<SortOrder>;
  
  price?: Maybe<SortOrder>;
}

export interface ProductListOptions {
  
  skip?: Maybe<number>;
  
  take?: Maybe<number>;
  
  sort?: Maybe<ProductSortParameter>;
  
  filter?: Maybe<ProductFilterParameter>;
  
  categoryId?: Maybe<string>;
}

export interface ProductSortParameter {
  
  id?: Maybe<SortOrder>;
  
  createdAt?: Maybe<SortOrder>;
  
  updatedAt?: Maybe<SortOrder>;
  
  name?: Maybe<SortOrder>;
  
  slug?: Maybe<SortOrder>;
  
  description?: Maybe<SortOrder>;
}

export interface ProductFilterParameter {
  
  createdAt?: Maybe<DateOperators>;
  
  updatedAt?: Maybe<DateOperators>;
  
  languageCode?: Maybe<StringOperators>;
  
  name?: Maybe<StringOperators>;
  
  slug?: Maybe<StringOperators>;
  
  description?: Maybe<StringOperators>;
}

export interface PromotionListOptions {
  
  skip?: Maybe<number>;
  
  take?: Maybe<number>;
  
  sort?: Maybe<PromotionSortParameter>;
  
  filter?: Maybe<PromotionFilterParameter>;
}

export interface PromotionSortParameter {
  
  id?: Maybe<SortOrder>;
  
  createdAt?: Maybe<SortOrder>;
  
  updatedAt?: Maybe<SortOrder>;
  
  name?: Maybe<SortOrder>;
}

export interface PromotionFilterParameter {
  
  createdAt?: Maybe<DateOperators>;
  
  updatedAt?: Maybe<DateOperators>;
  
  name?: Maybe<StringOperators>;
  
  enabled?: Maybe<BooleanOperators>;
}

export interface RoleListOptions {
  
  skip?: Maybe<number>;
  
  take?: Maybe<number>;
  
  sort?: Maybe<RoleSortParameter>;
  
  filter?: Maybe<RoleFilterParameter>;
}

export interface RoleSortParameter {
  
  id?: Maybe<SortOrder>;
  
  createdAt?: Maybe<SortOrder>;
  
  updatedAt?: Maybe<SortOrder>;
  
  code?: Maybe<SortOrder>;
  
  description?: Maybe<SortOrder>;
}

export interface RoleFilterParameter {
  
  createdAt?: Maybe<DateOperators>;
  
  updatedAt?: Maybe<DateOperators>;
  
  code?: Maybe<StringOperators>;
  
  description?: Maybe<StringOperators>;
}

export interface ShippingMethodListOptions {
  
  skip?: Maybe<number>;
  
  take?: Maybe<number>;
  
  sort?: Maybe<ShippingMethodSortParameter>;
  
  filter?: Maybe<ShippingMethodFilterParameter>;
}

export interface ShippingMethodSortParameter {
  
  id?: Maybe<SortOrder>;
  
  createdAt?: Maybe<SortOrder>;
  
  updatedAt?: Maybe<SortOrder>;
  
  code?: Maybe<SortOrder>;
  
  description?: Maybe<SortOrder>;
}

export interface ShippingMethodFilterParameter {
  
  createdAt?: Maybe<DateOperators>;
  
  updatedAt?: Maybe<DateOperators>;
  
  code?: Maybe<StringOperators>;
  
  description?: Maybe<StringOperators>;
}

export interface TaxRateListOptions {
  
  skip?: Maybe<number>;
  
  take?: Maybe<number>;
  
  sort?: Maybe<TaxRateSortParameter>;
  
  filter?: Maybe<TaxRateFilterParameter>;
}

export interface TaxRateSortParameter {
  
  id?: Maybe<SortOrder>;
  
  createdAt?: Maybe<SortOrder>;
  
  updatedAt?: Maybe<SortOrder>;
  
  name?: Maybe<SortOrder>;
  
  value?: Maybe<SortOrder>;
}

export interface TaxRateFilterParameter {
  
  createdAt?: Maybe<DateOperators>;
  
  updatedAt?: Maybe<DateOperators>;
  
  name?: Maybe<StringOperators>;
  
  enabled?: Maybe<BooleanOperators>;
  
  value?: Maybe<NumberOperators>;
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
  
  firstName?: Maybe<string>;
  
  lastName?: Maybe<string>;
  
  emailAddress?: Maybe<string>;
  
  password?: Maybe<string>;
  
  roleIds?: Maybe<string[]>;
}

export interface CreateAssetInput {
  
  file: Upload;
}

export interface CreateChannelInput {
  
  code: string;
  
  token: string;
  
  defaultLanguageCode: LanguageCode;
  
  pricesIncludeTax: boolean;
  
  currencyCode: CurrencyCode;
  
  defaultTaxZoneId?: Maybe<string>;
  
  defaultShippingZoneId?: Maybe<string>;
}

export interface UpdateChannelInput {
  
  id: string;
  
  code?: Maybe<string>;
  
  token?: Maybe<string>;
  
  defaultLanguageCode?: Maybe<LanguageCode>;
  
  pricesIncludeTax?: Maybe<boolean>;
  
  currencyCode?: Maybe<CurrencyCode>;
  
  defaultTaxZoneId?: Maybe<string>;
  
  defaultShippingZoneId?: Maybe<string>;
}

export interface CreateCollectionInput {
  
  featuredAssetId?: Maybe<string>;
  
  assetIds?: Maybe<string[]>;
  
  parentId?: Maybe<string>;
  
  facetValueIds?: Maybe<string[]>;
  
  translations: CollectionTranslationInput[];
  
  customFields?: Maybe<Json>;
}

export interface CollectionTranslationInput {
  
  id?: Maybe<string>;
  
  languageCode: LanguageCode;
  
  name?: Maybe<string>;
  
  description?: Maybe<string>;
  
  customFields?: Maybe<Json>;
}

export interface UpdateCollectionInput {
  
  id: string;
  
  featuredAssetId?: Maybe<string>;
  
  parentId?: Maybe<string>;
  
  assetIds?: Maybe<string[]>;
  
  facetValueIds?: Maybe<string[]>;
  
  translations: CollectionTranslationInput[];
  
  customFields?: Maybe<Json>;
}

export interface MoveCollectionInput {
  
  categoryId: string;
  
  parentId: string;
  
  index: number;
}

export interface CreateCountryInput {
  
  code: string;
  
  translations: CountryTranslationInput[];
  
  enabled: boolean;
}

export interface CountryTranslationInput {
  
  id?: Maybe<string>;
  
  languageCode: LanguageCode;
  
  name?: Maybe<string>;
}

export interface UpdateCountryInput {
  
  id: string;
  
  code?: Maybe<string>;
  
  translations?: Maybe<CountryTranslationInput[]>;
  
  enabled?: Maybe<boolean>;
}

export interface CreateCustomerGroupInput {
  
  name: string;
  
  customerIds?: Maybe<string[]>;
}

export interface UpdateCustomerGroupInput {
  
  id: string;
  
  name?: Maybe<string>;
}

export interface CreateCustomerInput {
  
  title?: Maybe<string>;
  
  firstName: string;
  
  lastName: string;
  
  phoneNumber?: Maybe<string>;
  
  emailAddress: string;
  
  customFields?: Maybe<Json>;
}

export interface UpdateCustomerInput {
  
  id: string;
  
  title?: Maybe<string>;
  
  firstName?: Maybe<string>;
  
  lastName?: Maybe<string>;
  
  phoneNumber?: Maybe<string>;
  
  emailAddress?: Maybe<string>;
  
  customFields?: Maybe<Json>;
}

export interface CreateAddressInput {
  
  fullName?: Maybe<string>;
  
  company?: Maybe<string>;
  
  streetLine1: string;
  
  streetLine2?: Maybe<string>;
  
  city?: Maybe<string>;
  
  province?: Maybe<string>;
  
  postalCode?: Maybe<string>;
  
  countryCode: string;
  
  phoneNumber?: Maybe<string>;
  
  defaultShippingAddress?: Maybe<boolean>;
  
  defaultBillingAddress?: Maybe<boolean>;
  
  customFields?: Maybe<Json>;
}

export interface UpdateAddressInput {
  
  id: string;
  
  fullName?: Maybe<string>;
  
  company?: Maybe<string>;
  
  streetLine1?: Maybe<string>;
  
  streetLine2?: Maybe<string>;
  
  city?: Maybe<string>;
  
  province?: Maybe<string>;
  
  postalCode?: Maybe<string>;
  
  countryCode?: Maybe<string>;
  
  phoneNumber?: Maybe<string>;
  
  defaultShippingAddress?: Maybe<boolean>;
  
  defaultBillingAddress?: Maybe<boolean>;
  
  customFields?: Maybe<Json>;
}

export interface CreateFacetInput {
  
  code: string;
  
  translations: FacetTranslationInput[];
  
  values?: Maybe<CreateFacetValueWithFacetInput[]>;
  
  customFields?: Maybe<Json>;
}

export interface FacetTranslationInput {
  
  id?: Maybe<string>;
  
  languageCode: LanguageCode;
  
  name?: Maybe<string>;
  
  customFields?: Maybe<Json>;
}

export interface CreateFacetValueWithFacetInput {
  
  code: string;
  
  translations: FacetValueTranslationInput[];
}

export interface FacetValueTranslationInput {
  
  id?: Maybe<string>;
  
  languageCode: LanguageCode;
  
  name?: Maybe<string>;
  
  customFields?: Maybe<Json>;
}

export interface UpdateFacetInput {
  
  id: string;
  
  code?: Maybe<string>;
  
  translations?: Maybe<FacetTranslationInput[]>;
  
  customFields?: Maybe<Json>;
}

export interface CreateFacetValueInput {
  
  facetId: string;
  
  code: string;
  
  translations: FacetValueTranslationInput[];
  
  customFields?: Maybe<Json>;
}

export interface UpdateFacetValueInput {
  
  id: string;
  
  code?: Maybe<string>;
  
  translations?: Maybe<FacetValueTranslationInput[]>;
  
  customFields?: Maybe<Json>;
}

export interface UpdateGlobalSettingsInput {
  
  availableLanguages?: Maybe<LanguageCode[]>;
  
  customFields?: Maybe<Json>;
}

export interface UpdatePaymentMethodInput {
  
  id: string;
  
  code?: Maybe<string>;
  
  enabled?: Maybe<boolean>;
  
  configArgs?: Maybe<ConfigArgInput[]>;
}

export interface ConfigArgInput {
  
  name: string;
  
  value: string;
}

export interface CreateProductOptionGroupInput {
  
  code: string;
  
  translations: ProductOptionGroupTranslationInput[];
  
  options: CreateProductOptionInput[];
  
  customFields?: Maybe<Json>;
}

export interface ProductOptionGroupTranslationInput {
  
  id?: Maybe<string>;
  
  languageCode: LanguageCode;
  
  name?: Maybe<string>;
  
  customFields?: Maybe<Json>;
}

export interface CreateProductOptionInput {
  
  code: string;
  
  translations: ProductOptionGroupTranslationInput[];
  
  customFields?: Maybe<Json>;
}

export interface UpdateProductOptionGroupInput {
  
  id: string;
  
  code?: Maybe<string>;
  
  translations?: Maybe<ProductOptionGroupTranslationInput[]>;
  
  customFields?: Maybe<Json>;
}

export interface CreateProductInput {
  
  featuredAssetId?: Maybe<string>;
  
  assetIds?: Maybe<string[]>;
  
  facetValueIds?: Maybe<string[]>;
  
  translations: ProductTranslationInput[];
  
  customFields?: Maybe<Json>;
}

export interface ProductTranslationInput {
  
  id?: Maybe<string>;
  
  languageCode: LanguageCode;
  
  name?: Maybe<string>;
  
  slug?: Maybe<string>;
  
  description?: Maybe<string>;
  
  customFields?: Maybe<Json>;
}

export interface UpdateProductInput {
  
  id: string;
  
  featuredAssetId?: Maybe<string>;
  
  assetIds?: Maybe<string[]>;
  
  facetValueIds?: Maybe<string[]>;
  
  translations?: Maybe<ProductTranslationInput[]>;
  
  customFields?: Maybe<Json>;
}

export interface UpdateProductVariantInput {
  
  id: string;
  
  translations?: Maybe<ProductVariantTranslationInput[]>;
  
  facetValueIds?: Maybe<string[]>;
  
  sku?: Maybe<string>;
  
  taxCategoryId?: Maybe<string>;
  
  price?: Maybe<number>;
  
  featuredAssetId?: Maybe<string>;
  
  assetIds?: Maybe<string[]>;
  
  customFields?: Maybe<Json>;
}

export interface ProductVariantTranslationInput {
  
  id?: Maybe<string>;
  
  languageCode: LanguageCode;
  
  name?: Maybe<string>;
  
  customFields?: Maybe<Json>;
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
  
  name?: Maybe<string>;
  
  enabled?: Maybe<boolean>;
  
  conditions?: Maybe<AdjustmentOperationInput[]>;
  
  actions?: Maybe<AdjustmentOperationInput[]>;
}

export interface CreateRoleInput {
  
  code: string;
  
  description: string;
  
  permissions: Permission[];
}

export interface UpdateRoleInput {
  
  id: string;
  
  code?: Maybe<string>;
  
  description?: Maybe<string>;
  
  permissions?: Maybe<Permission[]>;
}

export interface CreateShippingMethodInput {
  
  code: string;
  
  description: string;
  
  checker: AdjustmentOperationInput;
  
  calculator: AdjustmentOperationInput;
}

export interface UpdateShippingMethodInput {
  
  id: string;
  
  code?: Maybe<string>;
  
  description?: Maybe<string>;
  
  checker?: Maybe<AdjustmentOperationInput>;
  
  calculator?: Maybe<AdjustmentOperationInput>;
}

export interface CreateTaxCategoryInput {
  
  name: string;
}

export interface UpdateTaxCategoryInput {
  
  id: string;
  
  name?: Maybe<string>;
}

export interface CreateTaxRateInput {
  
  name: string;
  
  enabled: boolean;
  
  value: number;
  
  categoryId: string;
  
  zoneId: string;
  
  customerGroupId?: Maybe<string>;
}

export interface UpdateTaxRateInput {
  
  id: string;
  
  name?: Maybe<string>;
  
  value?: Maybe<number>;
  
  enabled?: Maybe<boolean>;
  
  categoryId?: Maybe<string>;
  
  zoneId?: Maybe<string>;
  
  customerGroupId?: Maybe<string>;
}

export interface CreateZoneInput {
  
  name: string;
  
  memberIds?: Maybe<string[]>;
}

export interface UpdateZoneInput {
  
  id: string;
  
  name?: Maybe<string>;
}

export interface CreateProductVariantInput {
  
  translations: ProductVariantTranslationInput[];
  
  facetValueIds?: Maybe<string[]>;
  
  sku: string;
  
  price?: Maybe<number>;
  
  taxCategoryId: string;
  
  optionIds?: Maybe<string[]>;
  
  featuredAssetId?: Maybe<string>;
  
  assetIds?: Maybe<string[]>;
  
  customFields?: Maybe<Json>;
}

export interface ProductOptionTranslationInput {
  
  id?: Maybe<string>;
  
  languageCode: LanguageCode;
  
  name?: Maybe<string>;
  
  customFields?: Maybe<Json>;
}

  export enum SortOrder {
    ASC = "ASC",
    DESC = "DESC",
  }
/** Permissions for administrators and customers */
  export enum Permission {
    Authenticated = "Authenticated",
    SuperAdmin = "SuperAdmin",
    Owner = "Owner",
    Public = "Public",
    CreateCatalog = "CreateCatalog",
    ReadCatalog = "ReadCatalog",
    UpdateCatalog = "UpdateCatalog",
    DeleteCatalog = "DeleteCatalog",
    CreateCustomer = "CreateCustomer",
    ReadCustomer = "ReadCustomer",
    UpdateCustomer = "UpdateCustomer",
    DeleteCustomer = "DeleteCustomer",
    CreateAdministrator = "CreateAdministrator",
    ReadAdministrator = "ReadAdministrator",
    UpdateAdministrator = "UpdateAdministrator",
    DeleteAdministrator = "DeleteAdministrator",
    CreateOrder = "CreateOrder",
    ReadOrder = "ReadOrder",
    UpdateOrder = "UpdateOrder",
    DeleteOrder = "DeleteOrder",
    CreateSettings = "CreateSettings",
    ReadSettings = "ReadSettings",
    UpdateSettings = "UpdateSettings",
    DeleteSettings = "DeleteSettings",
  }
/** ISO 639-1 language code */
  export enum LanguageCode {
    aa = "aa",
    ab = "ab",
    af = "af",
    ak = "ak",
    sq = "sq",
    am = "am",
    ar = "ar",
    an = "an",
    hy = "hy",
    as = "as",
    av = "av",
    ae = "ae",
    ay = "ay",
    az = "az",
    ba = "ba",
    bm = "bm",
    eu = "eu",
    be = "be",
    bn = "bn",
    bh = "bh",
    bi = "bi",
    bs = "bs",
    br = "br",
    bg = "bg",
    my = "my",
    ca = "ca",
    ch = "ch",
    ce = "ce",
    zh = "zh",
    cu = "cu",
    cv = "cv",
    kw = "kw",
    co = "co",
    cr = "cr",
    cs = "cs",
    da = "da",
    dv = "dv",
    nl = "nl",
    dz = "dz",
    en = "en",
    eo = "eo",
    et = "et",
    ee = "ee",
    fo = "fo",
    fj = "fj",
    fi = "fi",
    fr = "fr",
    fy = "fy",
    ff = "ff",
    ka = "ka",
    de = "de",
    gd = "gd",
    ga = "ga",
    gl = "gl",
    gv = "gv",
    el = "el",
    gn = "gn",
    gu = "gu",
    ht = "ht",
    ha = "ha",
    he = "he",
    hz = "hz",
    hi = "hi",
    ho = "ho",
    hr = "hr",
    hu = "hu",
    ig = "ig",
    is = "is",
    io = "io",
    ii = "ii",
    iu = "iu",
    ie = "ie",
    ia = "ia",
    id = "id",
    ik = "ik",
    it = "it",
    jv = "jv",
    ja = "ja",
    kl = "kl",
    kn = "kn",
    ks = "ks",
    kr = "kr",
    kk = "kk",
    km = "km",
    ki = "ki",
    rw = "rw",
    ky = "ky",
    kv = "kv",
    kg = "kg",
    ko = "ko",
    kj = "kj",
    ku = "ku",
    lo = "lo",
    la = "la",
    lv = "lv",
    li = "li",
    ln = "ln",
    lt = "lt",
    lb = "lb",
    lu = "lu",
    lg = "lg",
    mk = "mk",
    mh = "mh",
    ml = "ml",
    mi = "mi",
    mr = "mr",
    ms = "ms",
    mg = "mg",
    mt = "mt",
    mn = "mn",
    na = "na",
    nv = "nv",
    nr = "nr",
    nd = "nd",
    ng = "ng",
    ne = "ne",
    nn = "nn",
    nb = "nb",
    no = "no",
    ny = "ny",
    oc = "oc",
    oj = "oj",
    or = "or",
    om = "om",
    os = "os",
    pa = "pa",
    fa = "fa",
    pi = "pi",
    pl = "pl",
    pt = "pt",
    ps = "ps",
    qu = "qu",
    rm = "rm",
    ro = "ro",
    rn = "rn",
    ru = "ru",
    sg = "sg",
    sa = "sa",
    si = "si",
    sk = "sk",
    sl = "sl",
    se = "se",
    sm = "sm",
    sn = "sn",
    sd = "sd",
    so = "so",
    st = "st",
    es = "es",
    sc = "sc",
    sr = "sr",
    ss = "ss",
    su = "su",
    sw = "sw",
    sv = "sv",
    ty = "ty",
    ta = "ta",
    tt = "tt",
    te = "te",
    tg = "tg",
    tl = "tl",
    th = "th",
    bo = "bo",
    ti = "ti",
    to = "to",
    tn = "tn",
    ts = "ts",
    tk = "tk",
    tr = "tr",
    tw = "tw",
    ug = "ug",
    uk = "uk",
    ur = "ur",
    uz = "uz",
    ve = "ve",
    vi = "vi",
    vo = "vo",
    cy = "cy",
    wa = "wa",
    wo = "wo",
    xh = "xh",
    yi = "yi",
    yo = "yo",
    za = "za",
    zu = "zu",
  }
/** ISO 4217 currency code */
  export enum CurrencyCode {
    AED = "AED",
    AFN = "AFN",
    ALL = "ALL",
    AMD = "AMD",
    ANG = "ANG",
    AOA = "AOA",
    ARS = "ARS",
    AUD = "AUD",
    AWG = "AWG",
    AZN = "AZN",
    BAM = "BAM",
    BBD = "BBD",
    BDT = "BDT",
    BGN = "BGN",
    BHD = "BHD",
    BIF = "BIF",
    BMD = "BMD",
    BND = "BND",
    BOB = "BOB",
    BRL = "BRL",
    BSD = "BSD",
    BTN = "BTN",
    BWP = "BWP",
    BYN = "BYN",
    BZD = "BZD",
    CAD = "CAD",
    CHE = "CHE",
    CHW = "CHW",
    CLP = "CLP",
    CNY = "CNY",
    COP = "COP",
    CRC = "CRC",
    CUC = "CUC",
    CUP = "CUP",
    CVE = "CVE",
    CZK = "CZK",
    DJF = "DJF",
    DKK = "DKK",
    DOP = "DOP",
    DZD = "DZD",
    EGP = "EGP",
    ERN = "ERN",
    ETB = "ETB",
    EUR = "EUR",
    FJD = "FJD",
    FKP = "FKP",
    GBP = "GBP",
    GEL = "GEL",
    GHS = "GHS",
    GIP = "GIP",
    GMD = "GMD",
    GNF = "GNF",
    GTQ = "GTQ",
    GYD = "GYD",
    HKD = "HKD",
    HNL = "HNL",
    HRK = "HRK",
    HTG = "HTG",
    HUF = "HUF",
    IDR = "IDR",
    ILS = "ILS",
    INR = "INR",
    IQD = "IQD",
    IRR = "IRR",
    ISK = "ISK",
    JMD = "JMD",
    JOD = "JOD",
    JPY = "JPY",
    KES = "KES",
    KGS = "KGS",
    KHR = "KHR",
    KMF = "KMF",
    KPW = "KPW",
    KRW = "KRW",
    KWD = "KWD",
    KYD = "KYD",
    KZT = "KZT",
    LAK = "LAK",
    LBP = "LBP",
    LKR = "LKR",
    LRD = "LRD",
    LSL = "LSL",
    LYD = "LYD",
    MAD = "MAD",
    MDL = "MDL",
    MGA = "MGA",
    MKD = "MKD",
    MMK = "MMK",
    MNT = "MNT",
    MOP = "MOP",
    MRU = "MRU",
    MUR = "MUR",
    MVR = "MVR",
    MWK = "MWK",
    MXN = "MXN",
    MYR = "MYR",
    MZN = "MZN",
    NAD = "NAD",
    NGN = "NGN",
    NIO = "NIO",
    NOK = "NOK",
    NPR = "NPR",
    NZD = "NZD",
    OMR = "OMR",
    PAB = "PAB",
    PEN = "PEN",
    PGK = "PGK",
    PHP = "PHP",
    PKR = "PKR",
    PLN = "PLN",
    PYG = "PYG",
    QAR = "QAR",
    RON = "RON",
    RSD = "RSD",
    RUB = "RUB",
    RWF = "RWF",
    SAR = "SAR",
    SBD = "SBD",
    SCR = "SCR",
    SDG = "SDG",
    SEK = "SEK",
    SGD = "SGD",
    SHP = "SHP",
    SLL = "SLL",
    SOS = "SOS",
    SRD = "SRD",
    SSP = "SSP",
    STN = "STN",
    SVC = "SVC",
    SYP = "SYP",
    SZL = "SZL",
    THB = "THB",
    TJS = "TJS",
    TMT = "TMT",
    TND = "TND",
    TOP = "TOP",
    TRY = "TRY",
    TTD = "TTD",
    TWD = "TWD",
    TZS = "TZS",
    UAH = "UAH",
    UGX = "UGX",
    USD = "USD",
    UYU = "UYU",
    UZS = "UZS",
    VES = "VES",
    VND = "VND",
    VUV = "VUV",
    WST = "WST",
    XAF = "XAF",
    XCD = "XCD",
    XOF = "XOF",
    XPF = "XPF",
    YER = "YER",
    ZAR = "ZAR",
    ZMW = "ZMW",
    ZWL = "ZWL",
  }

  export enum AssetType {
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
    BINARY = "BINARY",
  }

  export enum AdjustmentType {
    TAX = "TAX",
    PROMOTION = "PROMOTION",
    SHIPPING = "SHIPPING",
    REFUND = "REFUND",
    TAX_REFUND = "TAX_REFUND",
    PROMOTION_REFUND = "PROMOTION_REFUND",
    SHIPPING_REFUND = "SHIPPING_REFUND",
  }

  export enum DeletionResult {
    DELETED = "DELETED",
    NOT_DELETED = "NOT_DELETED",
  }

/** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
export type DateTime = any;

/** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
export type Json = any;

/** The `Upload` scalar type represents a file upload. */
export type Upload = any;


// ====================================================
// Documents
// ====================================================



export namespace GetAdministrators {
  export type Variables = {
    options?: Maybe<AdministratorListOptions>;
  }

  export type Query = {
    __typename?: "Query";
    
    administrators: Administrators;
  }

  export type Administrators = {
    __typename?: "AdministratorList";
    
    items: Items[];
    
    totalItems: number;
  } 

  export type Items = Administrator.Fragment
}

export namespace GetAdministrator {
  export type Variables = {
    id: string;
  }

  export type Query = {
    __typename?: "Query";
    
    administrator: Maybe<Administrator>;
  }

  export type Administrator = Administrator.Fragment
}

export namespace CreateAdministrator {
  export type Variables = {
    input: CreateAdministratorInput;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    createAdministrator: CreateAdministrator;
  }

  export type CreateAdministrator = Administrator.Fragment
}

export namespace UpdateAdministrator {
  export type Variables = {
    input: UpdateAdministratorInput;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    updateAdministrator: UpdateAdministrator;
  }

  export type UpdateAdministrator = Administrator.Fragment
}

export namespace GetRoles {
  export type Variables = {
    options?: Maybe<RoleListOptions>;
  }

  export type Query = {
    __typename?: "Query";
    
    roles: Roles;
  }

  export type Roles = {
    __typename?: "RoleList";
    
    items: Items[];
    
    totalItems: number;
  } 

  export type Items = Role.Fragment
}

export namespace GetRole {
  export type Variables = {
    id: string;
  }

  export type Query = {
    __typename?: "Query";
    
    role: Maybe<Role>;
  }

  export type Role = Role.Fragment
}

export namespace CreateRole {
  export type Variables = {
    input: CreateRoleInput;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    createRole: CreateRole;
  }

  export type CreateRole = Role.Fragment
}

export namespace UpdateRole {
  export type Variables = {
    input: UpdateRoleInput;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    updateRole: UpdateRole;
  }

  export type UpdateRole = Role.Fragment
}

export namespace AssignRoleToAdministrator {
  export type Variables = {
    administratorId: string;
    roleId: string;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    assignRoleToAdministrator: AssignRoleToAdministrator;
  }

  export type AssignRoleToAdministrator = Administrator.Fragment
}

export namespace AttemptLogin {
  export type Variables = {
    username: string;
    password: string;
    rememberMe: boolean;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    login: Login;
  }

  export type Login = {
    __typename?: "LoginResult";
    
    user: User;
  } 

  export type User = CurrentUser.Fragment
}

export namespace LogOut {
  export type Variables = {
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    logout: boolean;
  }
}

export namespace GetCurrentUser {
  export type Variables = {
  }

  export type Query = {
    __typename?: "Query";
    
    me: Maybe<Me>;
  }

  export type Me = CurrentUser.Fragment
}

export namespace RequestStarted {
  export type Variables = {
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    requestStarted: number;
  }
}

export namespace RequestCompleted {
  export type Variables = {
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    requestCompleted: number;
  }
}

export namespace SetAsLoggedIn {
  export type Variables = {
    username: string;
    loginTime: string;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    setAsLoggedIn: SetAsLoggedIn;
  }

  export type SetAsLoggedIn = {
    __typename?: "UserStatus";
    
    username: string;
    
    isLoggedIn: boolean;
    
    loginTime: string;
  } 
}

export namespace SetAsLoggedOut {
  export type Variables = {
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    setAsLoggedOut: SetAsLoggedOut;
  }

  export type SetAsLoggedOut = {
    __typename?: "UserStatus";
    
    username: string;
    
    isLoggedIn: boolean;
    
    loginTime: string;
  } 
}

export namespace SetUiLanguage {
  export type Variables = {
    languageCode: LanguageCode;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    setUiLanguage: Maybe<LanguageCode>;
  }
}

export namespace GetNetworkStatus {
  export type Variables = {
  }

  export type Query = {
    __typename?: "Query";
    
    networkStatus: NetworkStatus;
  }

  export type NetworkStatus = {
    __typename?: "NetworkStatus";
    
    inFlightRequests: number;
  } 
}

export namespace GetUserStatus {
  export type Variables = {
  }

  export type Query = {
    __typename?: "Query";
    
    userStatus: UserStatus;
  }

  export type UserStatus = {
    __typename?: "UserStatus";
    
    username: string;
    
    isLoggedIn: boolean;
    
    loginTime: string;
  } 
}

export namespace GetUiState {
  export type Variables = {
  }

  export type Query = {
    __typename?: "Query";
    
    uiState: UiState;
  }

  export type UiState = {
    __typename?: "UiState";
    
    language: LanguageCode;
  } 
}

export namespace GetCustomerList {
  export type Variables = {
    options?: Maybe<CustomerListOptions>;
  }

  export type Query = {
    __typename?: "Query";
    
    customers: Customers;
  }

  export type Customers = {
    __typename?: "CustomerList";
    
    items: Items[];
    
    totalItems: number;
  } 

  export type Items = {
    __typename?: "Customer";
    
    id: string;
    
    title: Maybe<string>;
    
    firstName: string;
    
    lastName: string;
    
    emailAddress: string;
    
    user: Maybe<User>;
  } 

  export type User = {
    __typename?: "User";
    
    id: string;
    
    verified: boolean;
  } 
}

export namespace GetCustomer {
  export type Variables = {
    id: string;
    orderListOptions?: Maybe<OrderListOptions>;
  }

  export type Query = {
    __typename?: "Query";
    
    customer: Maybe<Customer>;
  }

  export type Customer = {
    __typename?: "Customer";
    
    orders: Orders;
  }  & Customer.Fragment

  export type Orders = {
    __typename?: "OrderList";
    
    items: Items[];
    
    totalItems: number;
  } 

  export type Items = {
    __typename?: "Order";
    
    id: string;
    
    code: string;
    
    state: string;
    
    total: number;
    
    currencyCode: CurrencyCode;
    
    updatedAt: DateTime;
  } 
}

export namespace CreateCustomer {
  export type Variables = {
    input: CreateCustomerInput;
    password?: Maybe<string>;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    createCustomer: CreateCustomer;
  }

  export type CreateCustomer = Customer.Fragment
}

export namespace UpdateCustomer {
  export type Variables = {
    input: UpdateCustomerInput;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    updateCustomer: UpdateCustomer;
  }

  export type UpdateCustomer = Customer.Fragment
}

export namespace CreateCustomerAddress {
  export type Variables = {
    customerId: string;
    input: CreateAddressInput;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    createCustomerAddress: CreateCustomerAddress;
  }

  export type CreateCustomerAddress = Address.Fragment
}

export namespace UpdateCustomerAddress {
  export type Variables = {
    input: UpdateAddressInput;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    updateCustomerAddress: UpdateCustomerAddress;
  }

  export type UpdateCustomerAddress = Address.Fragment
}

export namespace CreateFacet {
  export type Variables = {
    input: CreateFacetInput;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    createFacet: CreateFacet;
  }

  export type CreateFacet = FacetWithValues.Fragment
}

export namespace UpdateFacet {
  export type Variables = {
    input: UpdateFacetInput;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    updateFacet: UpdateFacet;
  }

  export type UpdateFacet = FacetWithValues.Fragment
}

export namespace DeleteFacet {
  export type Variables = {
    id: string;
    force?: Maybe<boolean>;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    deleteFacet: DeleteFacet;
  }

  export type DeleteFacet = {
    __typename?: "DeletionResponse";
    
    result: DeletionResult;
    
    message: Maybe<string>;
  } 
}

export namespace CreateFacetValues {
  export type Variables = {
    input: CreateFacetValueInput[];
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    createFacetValues: CreateFacetValues[];
  }

  export type CreateFacetValues = FacetValue.Fragment
}

export namespace UpdateFacetValues {
  export type Variables = {
    input: UpdateFacetValueInput[];
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    updateFacetValues: UpdateFacetValues[];
  }

  export type UpdateFacetValues = FacetValue.Fragment
}

export namespace DeleteFacetValues {
  export type Variables = {
    ids: string[];
    force?: Maybe<boolean>;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    deleteFacetValues: DeleteFacetValues[];
  }

  export type DeleteFacetValues = {
    __typename?: "DeletionResponse";
    
    result: DeletionResult;
    
    message: Maybe<string>;
  } 
}

export namespace GetFacetList {
  export type Variables = {
    options?: Maybe<FacetListOptions>;
    languageCode?: Maybe<LanguageCode>;
  }

  export type Query = {
    __typename?: "Query";
    
    facets: Facets;
  }

  export type Facets = {
    __typename?: "FacetList";
    
    items: Items[];
    
    totalItems: number;
  } 

  export type Items = FacetWithValues.Fragment
}

export namespace GetFacetWithValues {
  export type Variables = {
    id: string;
    languageCode?: Maybe<LanguageCode>;
  }

  export type Query = {
    __typename?: "Query";
    
    facet: Maybe<Facet>;
  }

  export type Facet = FacetWithValues.Fragment
}

export namespace GetOrderList {
  export type Variables = {
    options?: Maybe<OrderListOptions>;
  }

  export type Query = {
    __typename?: "Query";
    
    orders: Orders;
  }

  export type Orders = {
    __typename?: "OrderList";
    
    items: Items[];
    
    totalItems: number;
  } 

  export type Items = Order.Fragment
}

export namespace GetOrder {
  export type Variables = {
    id: string;
  }

  export type Query = {
    __typename?: "Query";
    
    order: Maybe<Order>;
  }

  export type Order = OrderWithLines.Fragment
}

export namespace UpdateProduct {
  export type Variables = {
    input: UpdateProductInput;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    updateProduct: UpdateProduct;
  }

  export type UpdateProduct = ProductWithVariants.Fragment
}

export namespace CreateProduct {
  export type Variables = {
    input: CreateProductInput;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    createProduct: CreateProduct;
  }

  export type CreateProduct = ProductWithVariants.Fragment
}

export namespace DeleteProduct {
  export type Variables = {
    id: string;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    deleteProduct: DeleteProduct;
  }

  export type DeleteProduct = {
    __typename?: "DeletionResponse";
    
    result: DeletionResult;
    
    message: Maybe<string>;
  } 
}

export namespace GenerateProductVariants {
  export type Variables = {
    productId: string;
    defaultTaxCategoryId?: Maybe<string>;
    defaultPrice?: Maybe<number>;
    defaultSku?: Maybe<string>;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    generateVariantsForProduct: GenerateVariantsForProduct;
  }

  export type GenerateVariantsForProduct = ProductWithVariants.Fragment
}

export namespace UpdateProductVariants {
  export type Variables = {
    input: UpdateProductVariantInput[];
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    updateProductVariants: (Maybe<UpdateProductVariants>)[];
  }

  export type UpdateProductVariants = ProductVariant.Fragment
}

export namespace CreateProductOptionGroup {
  export type Variables = {
    input: CreateProductOptionGroupInput;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    createProductOptionGroup: CreateProductOptionGroup;
  }

  export type CreateProductOptionGroup = ProductOptionGroup.Fragment
}

export namespace AddOptionGroupToProduct {
  export type Variables = {
    productId: string;
    optionGroupId: string;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    addOptionGroupToProduct: AddOptionGroupToProduct;
  }

  export type AddOptionGroupToProduct = {
    __typename?: "Product";
    
    id: string;
    
    optionGroups: OptionGroups[];
  } 

  export type OptionGroups = {
    __typename?: "ProductOptionGroup";
    
    id: string;
    
    code: string;
    
    options: Options[];
  } 

  export type Options = {
    __typename?: "ProductOption";
    
    id: string;
    
    code: Maybe<string>;
  } 
}

export namespace RemoveOptionGroupFromProduct {
  export type Variables = {
    productId: string;
    optionGroupId: string;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    removeOptionGroupFromProduct: RemoveOptionGroupFromProduct;
  }

  export type RemoveOptionGroupFromProduct = {
    __typename?: "Product";
    
    id: string;
    
    optionGroups: OptionGroups[];
  } 

  export type OptionGroups = {
    __typename?: "ProductOptionGroup";
    
    id: string;
    
    code: string;
    
    options: Options[];
  } 

  export type Options = {
    __typename?: "ProductOption";
    
    id: string;
    
    code: Maybe<string>;
  } 
}

export namespace GetProductWithVariants {
  export type Variables = {
    id: string;
    languageCode?: Maybe<LanguageCode>;
  }

  export type Query = {
    __typename?: "Query";
    
    product: Maybe<Product>;
  }

  export type Product = ProductWithVariants.Fragment
}

export namespace GetProductList {
  export type Variables = {
    options?: Maybe<ProductListOptions>;
    languageCode?: Maybe<LanguageCode>;
  }

  export type Query = {
    __typename?: "Query";
    
    products: Products;
  }

  export type Products = {
    __typename?: "ProductList";
    
    items: Items[];
    
    totalItems: number;
  } 

  export type Items = {
    __typename?: "Product";
    
    id: string;
    
    languageCode: LanguageCode;
    
    name: string;
    
    slug: string;
    
    featuredAsset: Maybe<FeaturedAsset>;
  } 

  export type FeaturedAsset = {
    __typename?: "Asset";
    
    id: string;
    
    preview: string;
  } 
}

export namespace GetProductOptionGroups {
  export type Variables = {
    filterTerm?: Maybe<string>;
    languageCode?: Maybe<LanguageCode>;
  }

  export type Query = {
    __typename?: "Query";
    
    productOptionGroups: ProductOptionGroups[];
  }

  export type ProductOptionGroups = {
    __typename?: "ProductOptionGroup";
    
    id: string;
    
    languageCode: LanguageCode;
    
    code: string;
    
    name: string;
    
    options: Options[];
  } 

  export type Options = {
    __typename?: "ProductOption";
    
    id: string;
    
    languageCode: Maybe<LanguageCode>;
    
    code: Maybe<string>;
    
    name: Maybe<string>;
  } 
}

export namespace GetAssetList {
  export type Variables = {
    options?: Maybe<AssetListOptions>;
  }

  export type Query = {
    __typename?: "Query";
    
    assets: Assets;
  }

  export type Assets = {
    __typename?: "AssetList";
    
    items: Items[];
    
    totalItems: number;
  } 

  export type Items = Asset.Fragment
}

export namespace CreateAssets {
  export type Variables = {
    input: CreateAssetInput[];
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    createAssets: CreateAssets[];
  }

  export type CreateAssets = Asset.Fragment
}

export namespace GetCollectionList {
  export type Variables = {
    options?: Maybe<CollectionListOptions>;
    languageCode?: Maybe<LanguageCode>;
  }

  export type Query = {
    __typename?: "Query";
    
    collections: Collections;
  }

  export type Collections = {
    __typename?: "CollectionList";
    
    items: Items[];
    
    totalItems: number;
  } 

  export type Items = {
    __typename?: "Collection";
    
    id: string;
    
    name: string;
    
    description: string;
    
    featuredAsset: Maybe<FeaturedAsset>;
    
    facetValues: FacetValues[];
    
    parent: Parent;
  } 

  export type FeaturedAsset = Asset.Fragment

  export type FacetValues = {
    __typename?: "FacetValue";
    
    id: string;
    
    code: string;
    
    name: string;
    
    facet: Facet;
  } 

  export type Facet = {
    __typename?: "Facet";
    
    id: string;
    
    name: string;
  } 

  export type Parent = {
    __typename?: "Collection";
    
    id: string;
  } 
}

export namespace GetCollection {
  export type Variables = {
    id: string;
    languageCode?: Maybe<LanguageCode>;
  }

  export type Query = {
    __typename?: "Query";
    
    collection: Maybe<Collection>;
  }

  export type Collection = Collection.Fragment
}

export namespace CreateCollection {
  export type Variables = {
    input: CreateCollectionInput;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    createCollection: CreateCollection;
  }

  export type CreateCollection = Collection.Fragment
}

export namespace UpdateCollection {
  export type Variables = {
    input: UpdateCollectionInput;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    updateCollection: UpdateCollection;
  }

  export type UpdateCollection = Collection.Fragment
}

export namespace MoveCollection {
  export type Variables = {
    input: MoveCollectionInput;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    moveCollection: MoveCollection;
  }

  export type MoveCollection = Collection.Fragment
}

export namespace SearchProducts {
  export type Variables = {
    input: SearchInput;
  }

  export type Query = {
    __typename?: "Query";
    
    search: Search;
  }

  export type Search = {
    __typename?: "SearchResponse";
    
    totalItems: number;
    
    items: Items[];
  } 

  export type Items = {
    __typename?: "SearchResult";
    
    productId: string;
    
    productName: string;
    
    productPreview: string;
    
    productVariantId: string;
    
    productVariantName: string;
    
    productVariantPreview: string;
    
    sku: string;
  } 
}

export namespace GetPromotionList {
  export type Variables = {
    options?: Maybe<PromotionListOptions>;
  }

  export type Query = {
    __typename?: "Query";
    
    promotions: Promotions;
  }

  export type Promotions = {
    __typename?: "PromotionList";
    
    items: Items[];
    
    totalItems: number;
  } 

  export type Items = Promotion.Fragment
}

export namespace GetPromotion {
  export type Variables = {
    id: string;
  }

  export type Query = {
    __typename?: "Query";
    
    promotion: Maybe<Promotion>;
  }

  export type Promotion = Promotion.Fragment
}

export namespace GetAdjustmentOperations {
  export type Variables = {
  }

  export type Query = {
    __typename?: "Query";
    
    adjustmentOperations: AdjustmentOperations;
  }

  export type AdjustmentOperations = {
    __typename?: "AdjustmentOperations";
    
    actions: Actions[];
    
    conditions: Conditions[];
  } 

  export type Actions = AdjustmentOperation.Fragment

  export type Conditions = AdjustmentOperation.Fragment
}

export namespace CreatePromotion {
  export type Variables = {
    input: CreatePromotionInput;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    createPromotion: CreatePromotion;
  }

  export type CreatePromotion = Promotion.Fragment
}

export namespace UpdatePromotion {
  export type Variables = {
    input: UpdatePromotionInput;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    updatePromotion: UpdatePromotion;
  }

  export type UpdatePromotion = Promotion.Fragment
}

export namespace GetCountryList {
  export type Variables = {
    options?: Maybe<CountryListOptions>;
  }

  export type Query = {
    __typename?: "Query";
    
    countries: Countries;
  }

  export type Countries = {
    __typename?: "CountryList";
    
    items: Items[];
    
    totalItems: number;
  } 

  export type Items = {
    __typename?: "Country";
    
    id: string;
    
    code: string;
    
    name: string;
    
    enabled: boolean;
  } 
}

export namespace GetAvailableCountries {
  export type Variables = {
  }

  export type Query = {
    __typename?: "Query";
    
    countries: Countries;
  }

  export type Countries = {
    __typename?: "CountryList";
    
    items: Items[];
  } 

  export type Items = {
    __typename?: "Country";
    
    id: string;
    
    code: string;
    
    name: string;
    
    enabled: boolean;
  } 
}

export namespace GetCountry {
  export type Variables = {
    id: string;
  }

  export type Query = {
    __typename?: "Query";
    
    country: Maybe<Country>;
  }

  export type Country = Country.Fragment
}

export namespace CreateCountry {
  export type Variables = {
    input: CreateCountryInput;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    createCountry: CreateCountry;
  }

  export type CreateCountry = Country.Fragment
}

export namespace UpdateCountry {
  export type Variables = {
    input: UpdateCountryInput;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    updateCountry: UpdateCountry;
  }

  export type UpdateCountry = Country.Fragment
}

export namespace DeleteCountry {
  export type Variables = {
    id: string;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    deleteCountry: DeleteCountry;
  }

  export type DeleteCountry = {
    __typename?: "DeletionResponse";
    
    result: DeletionResult;
    
    message: Maybe<string>;
  } 
}

export namespace GetZones {
  export type Variables = {
  }

  export type Query = {
    __typename?: "Query";
    
    zones: Zones[];
  }

  export type Zones = {
    __typename?: "Zone";
    
    id: string;
    
    name: string;
    
    members: Members[];
  } 

  export type Members = {
    __typename?: "Country";
    
    id: string;
    
    name: string;
    
    code: string;
  } 
}

export namespace GetZone {
  export type Variables = {
    id: string;
  }

  export type Query = {
    __typename?: "Query";
    
    zone: Maybe<Zone>;
  }

  export type Zone = Zone.Fragment
}

export namespace CreateZone {
  export type Variables = {
    input: CreateZoneInput;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    createZone: CreateZone;
  }

  export type CreateZone = Zone.Fragment
}

export namespace UpdateZone {
  export type Variables = {
    input: UpdateZoneInput;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    updateZone: UpdateZone;
  }

  export type UpdateZone = Zone.Fragment
}

export namespace AddMembersToZone {
  export type Variables = {
    zoneId: string;
    memberIds: string[];
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    addMembersToZone: AddMembersToZone;
  }

  export type AddMembersToZone = Zone.Fragment
}

export namespace RemoveMembersFromZone {
  export type Variables = {
    zoneId: string;
    memberIds: string[];
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    removeMembersFromZone: RemoveMembersFromZone;
  }

  export type RemoveMembersFromZone = Zone.Fragment
}

export namespace GetTaxCategories {
  export type Variables = {
  }

  export type Query = {
    __typename?: "Query";
    
    taxCategories: TaxCategories[];
  }

  export type TaxCategories = TaxCategory.Fragment
}

export namespace GetTaxCategory {
  export type Variables = {
    id: string;
  }

  export type Query = {
    __typename?: "Query";
    
    taxCategory: Maybe<TaxCategory>;
  }

  export type TaxCategory = TaxCategory.Fragment
}

export namespace CreateTaxCategory {
  export type Variables = {
    input: CreateTaxCategoryInput;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    createTaxCategory: CreateTaxCategory;
  }

  export type CreateTaxCategory = TaxCategory.Fragment
}

export namespace UpdateTaxCategory {
  export type Variables = {
    input: UpdateTaxCategoryInput;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    updateTaxCategory: UpdateTaxCategory;
  }

  export type UpdateTaxCategory = TaxCategory.Fragment
}

export namespace GetTaxRateList {
  export type Variables = {
    options?: Maybe<TaxRateListOptions>;
  }

  export type Query = {
    __typename?: "Query";
    
    taxRates: TaxRates;
  }

  export type TaxRates = {
    __typename?: "TaxRateList";
    
    items: Items[];
    
    totalItems: number;
  } 

  export type Items = TaxRate.Fragment
}

export namespace GetTaxRate {
  export type Variables = {
    id: string;
  }

  export type Query = {
    __typename?: "Query";
    
    taxRate: Maybe<TaxRate>;
  }

  export type TaxRate = TaxRate.Fragment
}

export namespace CreateTaxRate {
  export type Variables = {
    input: CreateTaxRateInput;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    createTaxRate: CreateTaxRate;
  }

  export type CreateTaxRate = TaxRate.Fragment
}

export namespace UpdateTaxRate {
  export type Variables = {
    input: UpdateTaxRateInput;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    updateTaxRate: UpdateTaxRate;
  }

  export type UpdateTaxRate = TaxRate.Fragment
}

export namespace GetChannels {
  export type Variables = {
  }

  export type Query = {
    __typename?: "Query";
    
    channels: Channels[];
  }

  export type Channels = Channel.Fragment
}

export namespace GetChannel {
  export type Variables = {
    id: string;
  }

  export type Query = {
    __typename?: "Query";
    
    channel: Maybe<Channel>;
  }

  export type Channel = Channel.Fragment
}

export namespace GetActiveChannel {
  export type Variables = {
  }

  export type Query = {
    __typename?: "Query";
    
    activeChannel: ActiveChannel;
  }

  export type ActiveChannel = Channel.Fragment
}

export namespace CreateChannel {
  export type Variables = {
    input: CreateChannelInput;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    createChannel: CreateChannel;
  }

  export type CreateChannel = Channel.Fragment
}

export namespace UpdateChannel {
  export type Variables = {
    input: UpdateChannelInput;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    updateChannel: UpdateChannel;
  }

  export type UpdateChannel = Channel.Fragment
}

export namespace GetPaymentMethodList {
  export type Variables = {
    options: PaymentMethodListOptions;
  }

  export type Query = {
    __typename?: "Query";
    
    paymentMethods: PaymentMethods;
  }

  export type PaymentMethods = {
    __typename?: "PaymentMethodList";
    
    items: Items[];
    
    totalItems: number;
  } 

  export type Items = PaymentMethod.Fragment
}

export namespace GetPaymentMethod {
  export type Variables = {
    id: string;
  }

  export type Query = {
    __typename?: "Query";
    
    paymentMethod: Maybe<PaymentMethod>;
  }

  export type PaymentMethod = PaymentMethod.Fragment
}

export namespace UpdatePaymentMethod {
  export type Variables = {
    input: UpdatePaymentMethodInput;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    updatePaymentMethod: UpdatePaymentMethod;
  }

  export type UpdatePaymentMethod = PaymentMethod.Fragment
}

export namespace GetGlobalSettings {
  export type Variables = {
  }

  export type Query = {
    __typename?: "Query";
    
    globalSettings: GlobalSettings;
  }

  export type GlobalSettings = GlobalSettings.Fragment
}

export namespace UpdateGlobalSettings {
  export type Variables = {
    input: UpdateGlobalSettingsInput;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    updateGlobalSettings: UpdateGlobalSettings;
  }

  export type UpdateGlobalSettings = GlobalSettings.Fragment
}

export namespace GetServerConfig {
  export type Variables = {
  }

  export type Query = {
    __typename?: "Query";
    
    globalSettings: GlobalSettings;
  }

  export type GlobalSettings = {
    __typename?: "GlobalSettings";
    
    serverConfig: ServerConfig;
  } 

  export type ServerConfig = {
    __typename?: "ServerConfig";
    
    customFields: Maybe<Json>;
  } 
}

export namespace GetShippingMethodList {
  export type Variables = {
    options?: Maybe<ShippingMethodListOptions>;
  }

  export type Query = {
    __typename?: "Query";
    
    shippingMethods: ShippingMethods;
  }

  export type ShippingMethods = {
    __typename?: "ShippingMethodList";
    
    items: Items[];
    
    totalItems: number;
  } 

  export type Items = ShippingMethod.Fragment
}

export namespace GetShippingMethod {
  export type Variables = {
    id: string;
  }

  export type Query = {
    __typename?: "Query";
    
    shippingMethod: Maybe<ShippingMethod>;
  }

  export type ShippingMethod = ShippingMethod.Fragment
}

export namespace GetShippingMethodOperations {
  export type Variables = {
  }

  export type Query = {
    __typename?: "Query";
    
    shippingEligibilityCheckers: ShippingEligibilityCheckers[];
    
    shippingCalculators: ShippingCalculators[];
  }

  export type ShippingEligibilityCheckers = AdjustmentOperation.Fragment

  export type ShippingCalculators = AdjustmentOperation.Fragment
}

export namespace CreateShippingMethod {
  export type Variables = {
    input: CreateShippingMethodInput;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    createShippingMethod: CreateShippingMethod;
  }

  export type CreateShippingMethod = ShippingMethod.Fragment
}

export namespace UpdateShippingMethod {
  export type Variables = {
    input: UpdateShippingMethodInput;
  }

  export type Mutation = {
    __typename?: "Mutation";
    
    updateShippingMethod: UpdateShippingMethod;
  }

  export type UpdateShippingMethod = ShippingMethod.Fragment
}

export namespace Administrator {
  export type Fragment = {
    __typename?: "Administrator";
    
    id: string;
    
    firstName: string;
    
    lastName: string;
    
    emailAddress: string;
    
    user: User;
  }

  export type User = {
    __typename?: "User";
    
    id: string;
    
    identifier: string;
    
    lastLogin: Maybe<string>;
    
    roles: Roles[];
  }

  export type Roles = {
    __typename?: "Role";
    
    id: string;
    
    code: string;
    
    description: string;
    
    permissions: Permission[];
  }
}

export namespace Role {
  export type Fragment = {
    __typename?: "Role";
    
    id: string;
    
    code: string;
    
    description: string;
    
    permissions: Permission[];
    
    channels: Channels[];
  }

  export type Channels = {
    __typename?: "Channel";
    
    id: string;
    
    code: string;
    
    token: string;
  }
}

export namespace CurrentUser {
  export type Fragment = {
    __typename?: "CurrentUser";
    
    id: string;
    
    identifier: string;
    
    channelTokens: string[];
  }
}

export namespace Address {
  export type Fragment = {
    __typename?: "Address";
    
    id: string;
    
    fullName: Maybe<string>;
    
    company: Maybe<string>;
    
    streetLine1: string;
    
    streetLine2: Maybe<string>;
    
    city: Maybe<string>;
    
    province: Maybe<string>;
    
    postalCode: Maybe<string>;
    
    country: Country;
    
    phoneNumber: Maybe<string>;
    
    defaultShippingAddress: Maybe<boolean>;
    
    defaultBillingAddress: Maybe<boolean>;
  }

  export type Country = {
    __typename?: "Country";
    
    id: string;
    
    code: string;
    
    name: string;
  }
}

export namespace Customer {
  export type Fragment = {
    __typename?: "Customer";
    
    id: string;
    
    title: Maybe<string>;
    
    firstName: string;
    
    lastName: string;
    
    phoneNumber: Maybe<string>;
    
    emailAddress: string;
    
    user: Maybe<User>;
    
    addresses: Maybe<Addresses[]>;
  }

  export type User = {
    __typename?: "User";
    
    id: string;
    
    identifier: string;
    
    verified: boolean;
    
    lastLogin: Maybe<string>;
  }

  export type Addresses =Address.Fragment
}

export namespace FacetValue {
  export type Fragment = {
    __typename?: "FacetValue";
    
    id: string;
    
    languageCode: LanguageCode;
    
    code: string;
    
    name: string;
    
    translations: Translations[];
    
    facet: Facet;
  }

  export type Translations = {
    __typename?: "FacetValueTranslation";
    
    id: string;
    
    languageCode: LanguageCode;
    
    name: string;
  }

  export type Facet = {
    __typename?: "Facet";
    
    id: string;
    
    name: string;
  }
}

export namespace FacetWithValues {
  export type Fragment = {
    __typename?: "Facet";
    
    id: string;
    
    languageCode: LanguageCode;
    
    code: string;
    
    name: string;
    
    translations: Translations[];
    
    values: Values[];
  }

  export type Translations = {
    __typename?: "FacetTranslation";
    
    id: string;
    
    languageCode: LanguageCode;
    
    name: string;
  }

  export type Values =FacetValue.Fragment
}

export namespace Adjustment {
  export type Fragment = {
    __typename?: "Adjustment";
    
    adjustmentSource: string;
    
    amount: number;
    
    description: string;
    
    type: AdjustmentType;
  }
}

export namespace ShippingAddress {
  export type Fragment = {
    __typename?: "OrderAddress";
    
    fullName: Maybe<string>;
    
    company: Maybe<string>;
    
    streetLine1: Maybe<string>;
    
    streetLine2: Maybe<string>;
    
    city: Maybe<string>;
    
    province: Maybe<string>;
    
    postalCode: Maybe<string>;
    
    country: Maybe<string>;
    
    phoneNumber: Maybe<string>;
  }
}

export namespace Order {
  export type Fragment = {
    __typename?: "Order";
    
    id: string;
    
    createdAt: DateTime;
    
    updatedAt: DateTime;
    
    code: string;
    
    state: string;
    
    total: number;
    
    currencyCode: CurrencyCode;
    
    customer: Maybe<Customer>;
  }

  export type Customer = {
    __typename?: "Customer";
    
    id: string;
    
    firstName: string;
    
    lastName: string;
  }
}

export namespace OrderWithLines {
  export type Fragment = {
    __typename?: "Order";
    
    id: string;
    
    createdAt: DateTime;
    
    updatedAt: DateTime;
    
    code: string;
    
    state: string;
    
    active: boolean;
    
    customer: Maybe<Customer>;
    
    lines: Lines[];
    
    adjustments: Adjustments[];
    
    subTotal: number;
    
    subTotalBeforeTax: number;
    
    totalBeforeTax: number;
    
    currencyCode: CurrencyCode;
    
    shipping: number;
    
    shippingMethod: Maybe<ShippingMethod>;
    
    shippingAddress: Maybe<ShippingAddress>;
    
    payments: Maybe<Payments[]>;
    
    total: number;
  }

  export type Customer = {
    __typename?: "Customer";
    
    id: string;
    
    firstName: string;
    
    lastName: string;
  }

  export type Lines = {
    __typename?: "OrderLine";
    
    id: string;
    
    featuredAsset: Maybe<FeaturedAsset>;
    
    productVariant: ProductVariant;
    
    unitPrice: number;
    
    unitPriceWithTax: number;
    
    quantity: number;
    
    items: Items[];
    
    totalPrice: number;
  }

  export type FeaturedAsset = {
    __typename?: "Asset";
    
    preview: string;
  }

  export type ProductVariant = {
    __typename?: "ProductVariant";
    
    id: string;
    
    name: string;
    
    sku: string;
  }

  export type Items = {
    __typename?: "OrderItem";
    
    id: string;
    
    unitPrice: number;
    
    unitPriceIncludesTax: boolean;
    
    unitPriceWithTax: number;
    
    taxRate: number;
  }

  export type Adjustments =Adjustment.Fragment

  export type ShippingMethod = {
    __typename?: "ShippingMethod";
    
    id: string;
    
    code: string;
    
    description: string;
  }

  export type ShippingAddress =ShippingAddress.Fragment

  export type Payments = {
    __typename?: "Payment";
    
    id: string;
    
    transactionId: Maybe<string>;
    
    amount: number;
    
    method: string;
    
    state: string;
    
    metadata: Maybe<Json>;
  }
}

export namespace Asset {
  export type Fragment = {
    __typename?: "Asset";
    
    id: string;
    
    name: string;
    
    fileSize: number;
    
    mimeType: string;
    
    type: AssetType;
    
    preview: string;
    
    source: string;
  }
}

export namespace ProductVariant {
  export type Fragment = {
    __typename?: "ProductVariant";
    
    id: string;
    
    languageCode: LanguageCode;
    
    name: string;
    
    price: number;
    
    currencyCode: CurrencyCode;
    
    priceIncludesTax: boolean;
    
    priceWithTax: number;
    
    taxRateApplied: TaxRateApplied;
    
    taxCategory: TaxCategory;
    
    sku: string;
    
    options: Options[];
    
    facetValues: FacetValues[];
    
    featuredAsset: Maybe<FeaturedAsset>;
    
    assets: Assets[];
    
    translations: Translations[];
  }

  export type TaxRateApplied = {
    __typename?: "TaxRate";
    
    id: string;
    
    name: string;
    
    value: number;
  }

  export type TaxCategory = {
    __typename?: "TaxCategory";
    
    id: string;
    
    name: string;
  }

  export type Options = {
    __typename?: "ProductOption";
    
    id: string;
    
    code: Maybe<string>;
    
    languageCode: Maybe<LanguageCode>;
    
    name: Maybe<string>;
  }

  export type FacetValues = {
    __typename?: "FacetValue";
    
    id: string;
    
    code: string;
    
    name: string;
    
    facet: Facet;
  }

  export type Facet = {
    __typename?: "Facet";
    
    id: string;
    
    name: string;
  }

  export type FeaturedAsset =Asset.Fragment

  export type Assets =Asset.Fragment

  export type Translations = {
    __typename?: "ProductVariantTranslation";
    
    id: string;
    
    languageCode: LanguageCode;
    
    name: string;
  }
}

export namespace ProductWithVariants {
  export type Fragment = {
    __typename?: "Product";
    
    id: string;
    
    languageCode: LanguageCode;
    
    name: string;
    
    slug: string;
    
    description: string;
    
    featuredAsset: Maybe<FeaturedAsset>;
    
    assets: Assets[];
    
    translations: Translations[];
    
    optionGroups: OptionGroups[];
    
    variants: Variants[];
    
    facetValues: FacetValues[];
  }

  export type FeaturedAsset =Asset.Fragment

  export type Assets =Asset.Fragment

  export type Translations = {
    __typename?: "ProductTranslation";
    
    languageCode: LanguageCode;
    
    name: string;
    
    slug: string;
    
    description: string;
  }

  export type OptionGroups = {
    __typename?: "ProductOptionGroup";
    
    id: string;
    
    languageCode: LanguageCode;
    
    code: string;
    
    name: string;
  }

  export type Variants =ProductVariant.Fragment

  export type FacetValues = {
    __typename?: "FacetValue";
    
    id: string;
    
    code: string;
    
    name: string;
    
    facet: Facet;
  }

  export type Facet = {
    __typename?: "Facet";
    
    id: string;
    
    name: string;
  }
}

export namespace ProductOptionGroup {
  export type Fragment = {
    __typename?: "ProductOptionGroup";
    
    id: string;
    
    languageCode: LanguageCode;
    
    code: string;
    
    name: string;
    
    translations: Translations[];
    
    options: Options[];
  }

  export type Translations = {
    __typename?: "ProductOptionGroupTranslation";
    
    name: string;
  }

  export type Options = {
    __typename?: "ProductOption";
    
    id: string;
    
    languageCode: Maybe<LanguageCode>;
    
    name: Maybe<string>;
    
    code: Maybe<string>;
    
    translations: _Translations[];
  }

  export type _Translations = {
    __typename?: "ProductOptionTranslation";
    
    name: string;
  }
}

export namespace Collection {
  export type Fragment = {
    __typename?: "Collection";
    
    id: string;
    
    name: string;
    
    description: string;
    
    languageCode: Maybe<LanguageCode>;
    
    featuredAsset: Maybe<FeaturedAsset>;
    
    assets: Assets[];
    
    facetValues: FacetValues[];
    
    translations: Translations[];
    
    parent: Parent;
    
    children: Maybe<Children[]>;
  }

  export type FeaturedAsset =Asset.Fragment

  export type Assets =Asset.Fragment

  export type FacetValues = {
    __typename?: "FacetValue";
    
    id: string;
    
    name: string;
    
    code: string;
  }

  export type Translations = {
    __typename?: "CollectionTranslation";
    
    id: string;
    
    languageCode: LanguageCode;
    
    name: string;
    
    description: string;
  }

  export type Parent = {
    __typename?: "Collection";
    
    id: string;
    
    name: string;
  }

  export type Children = {
    __typename?: "Collection";
    
    id: string;
    
    name: string;
  }
}

export namespace AdjustmentOperation {
  export type Fragment = {
    __typename?: "AdjustmentOperation";
    
    args: Args[];
    
    code: string;
    
    description: string;
  }

  export type Args = {
    __typename?: "ConfigArg";
    
    name: string;
    
    type: string;
    
    value: Maybe<string>;
  }
}

export namespace Promotion {
  export type Fragment = {
    __typename?: "Promotion";
    
    id: string;
    
    createdAt: DateTime;
    
    updatedAt: DateTime;
    
    name: string;
    
    enabled: boolean;
    
    conditions: Conditions[];
    
    actions: Actions[];
  }

  export type Conditions =AdjustmentOperation.Fragment

  export type Actions =AdjustmentOperation.Fragment
}

export namespace Country {
  export type Fragment = {
    __typename?: "Country";
    
    id: string;
    
    code: string;
    
    name: string;
    
    enabled: boolean;
    
    translations: Translations[];
  }

  export type Translations = {
    __typename?: "CountryTranslation";
    
    id: string;
    
    languageCode: LanguageCode;
    
    name: string;
  }
}

export namespace Zone {
  export type Fragment = {
    __typename?: "Zone";
    
    id: string;
    
    name: string;
    
    members: Members[];
  }

  export type Members =Country.Fragment
}

export namespace TaxCategory {
  export type Fragment = {
    __typename?: "TaxCategory";
    
    id: string;
    
    name: string;
  }
}

export namespace TaxRate {
  export type Fragment = {
    __typename?: "TaxRate";
    
    id: string;
    
    name: string;
    
    enabled: boolean;
    
    value: number;
    
    category: Category;
    
    zone: Zone;
    
    customerGroup: Maybe<CustomerGroup>;
  }

  export type Category = {
    __typename?: "TaxCategory";
    
    id: string;
    
    name: string;
  }

  export type Zone = {
    __typename?: "Zone";
    
    id: string;
    
    name: string;
  }

  export type CustomerGroup = {
    __typename?: "CustomerGroup";
    
    id: string;
    
    name: string;
  }
}

export namespace Channel {
  export type Fragment = {
    __typename?: "Channel";
    
    id: string;
    
    code: string;
    
    token: string;
    
    pricesIncludeTax: boolean;
    
    currencyCode: CurrencyCode;
    
    defaultLanguageCode: LanguageCode;
    
    defaultShippingZone: Maybe<DefaultShippingZone>;
    
    defaultTaxZone: Maybe<DefaultTaxZone>;
  }

  export type DefaultShippingZone = {
    __typename?: "Zone";
    
    id: string;
    
    name: string;
  }

  export type DefaultTaxZone = {
    __typename?: "Zone";
    
    id: string;
    
    name: string;
  }
}

export namespace PaymentMethod {
  export type Fragment = {
    __typename?: "PaymentMethod";
    
    id: string;
    
    code: string;
    
    enabled: boolean;
    
    configArgs: ConfigArgs[];
  }

  export type ConfigArgs = {
    __typename?: "ConfigArg";
    
    name: string;
    
    type: string;
    
    value: Maybe<string>;
  }
}

export namespace GlobalSettings {
  export type Fragment = {
    __typename?: "GlobalSettings";
    
    availableLanguages: LanguageCode[];
  }
}

export namespace ShippingMethod {
  export type Fragment = {
    __typename?: "ShippingMethod";
    
    id: string;
    
    createdAt: DateTime;
    
    updatedAt: DateTime;
    
    code: string;
    
    description: string;
    
    checker: Checker;
    
    calculator: Calculator;
  }

  export type Checker =AdjustmentOperation.Fragment

  export type Calculator =AdjustmentOperation.Fragment
}




// ====================================================
// Scalars
// ====================================================





// ====================================================
// Interfaces
// ====================================================



export interface PaginatedList {
  
  items: Node[];
  
  totalItems: number;
}


export interface Node {
  
  id: string;
}




// ====================================================
// Types
// ====================================================



export interface Query {
  
  administrators: AdministratorList;
  
  administrator?: Maybe<Administrator>;
  
  assets: AssetList;
  
  asset?: Maybe<Asset>;
  
  me?: Maybe<CurrentUser>;
  
  channels: Channel[];
  
  channel?: Maybe<Channel>;
  
  activeChannel: Channel;
  
  collections: CollectionList;
  
  collection?: Maybe<Collection>;
  
  config: Config;
  
  countries: CountryList;
  
  country?: Maybe<Country>;
  
  customerGroups: CustomerGroup[];
  
  customerGroup?: Maybe<CustomerGroup>;
  
  customers: CustomerList;
  
  customer?: Maybe<Customer>;
  
  facets: FacetList;
  
  facet?: Maybe<Facet>;
  
  globalSettings: GlobalSettings;
  
  order?: Maybe<Order>;
  
  orders: OrderList;
  
  paymentMethods: PaymentMethodList;
  
  paymentMethod?: Maybe<PaymentMethod>;
  
  productOptionGroups: ProductOptionGroup[];
  
  productOptionGroup?: Maybe<ProductOptionGroup>;
  
  search: SearchResponse;
  
  products: ProductList;
  
  product?: Maybe<Product>;
  
  promotion?: Maybe<Promotion>;
  
  promotions: PromotionList;
  
  adjustmentOperations: AdjustmentOperations;
  
  roles: RoleList;
  
  role?: Maybe<Role>;
  
  shippingMethods: ShippingMethodList;
  
  shippingMethod?: Maybe<ShippingMethod>;
  
  shippingEligibilityCheckers: AdjustmentOperation[];
  
  shippingCalculators: AdjustmentOperation[];
  
  taxCategories: TaxCategory[];
  
  taxCategory?: Maybe<TaxCategory>;
  
  taxRates: TaxRateList;
  
  taxRate?: Maybe<TaxRate>;
  
  zones: Zone[];
  
  zone?: Maybe<Zone>;
  
  temp__?: Maybe<boolean>;
  
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
  
  verified: boolean;
  
  roles: Role[];
  
  lastLogin?: Maybe<string>;
  
  customFields?: Maybe<Json>;
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
  
  defaultTaxZone?: Maybe<Zone>;
  
  defaultShippingZone?: Maybe<Zone>;
  
  defaultLanguageCode: LanguageCode;
  
  currencyCode: CurrencyCode;
  
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


export interface CollectionList extends PaginatedList {
  
  items: Collection[];
  
  totalItems: number;
}


export interface Collection extends Node {
  
  id: string;
  
  createdAt: DateTime;
  
  updatedAt: DateTime;
  
  languageCode?: Maybe<LanguageCode>;
  
  name: string;
  
  position: number;
  
  description: string;
  
  featuredAsset?: Maybe<Asset>;
  
  assets: Asset[];
  
  parent: Collection;
  
  children?: Maybe<Collection[]>;
  
  facetValues: FacetValue[];
  
  descendantFacetValues: FacetValue[];
  
  ancestorFacetValues: FacetValue[];
  
  translations: CollectionTranslation[];
  
  customFields?: Maybe<Json>;
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
  
  customFields?: Maybe<Json>;
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
  
  customFields?: Maybe<Json>;
}


export interface FacetTranslation {
  
  id: string;
  
  createdAt: DateTime;
  
  updatedAt: DateTime;
  
  languageCode: LanguageCode;
  
  name: string;
}


export interface FacetValueTranslation {
  
  id: string;
  
  createdAt: DateTime;
  
  updatedAt: DateTime;
  
  languageCode: LanguageCode;
  
  name: string;
}


export interface CollectionTranslation {
  
  id: string;
  
  createdAt: DateTime;
  
  updatedAt: DateTime;
  
  languageCode: LanguageCode;
  
  name: string;
  
  description: string;
}


export interface Config {
  
  customFields?: Maybe<Json>;
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
  
  title?: Maybe<string>;
  
  firstName: string;
  
  lastName: string;
  
  phoneNumber?: Maybe<string>;
  
  emailAddress: string;
  
  addresses?: Maybe<Address[]>;
  
  orders: OrderList;
  
  user?: Maybe<User>;
  
  customFields?: Maybe<Json>;
}


export interface Address extends Node {
  
  id: string;
  
  createdAt: DateTime;
  
  updatedAt: DateTime;
  
  fullName?: Maybe<string>;
  
  company?: Maybe<string>;
  
  streetLine1: string;
  
  streetLine2?: Maybe<string>;
  
  city?: Maybe<string>;
  
  province?: Maybe<string>;
  
  postalCode?: Maybe<string>;
  
  country: Country;
  
  phoneNumber?: Maybe<string>;
  
  defaultShippingAddress?: Maybe<boolean>;
  
  defaultBillingAddress?: Maybe<boolean>;
  
  customFields?: Maybe<Json>;
}


export interface OrderList extends PaginatedList {
  
  items: Order[];
  
  totalItems: number;
}


export interface Order extends Node {
  
  id: string;
  
  createdAt: DateTime;
  
  updatedAt: DateTime;
  
  code: string;
  
  state: string;
  
  active: boolean;
  
  customer?: Maybe<Customer>;
  
  shippingAddress?: Maybe<OrderAddress>;
  
  billingAddress?: Maybe<OrderAddress>;
  
  lines: OrderLine[];
  
  adjustments: Adjustment[];
  
  payments?: Maybe<Payment[]>;
  
  subTotalBeforeTax: number;
  
  subTotal: number;
  
  currencyCode: CurrencyCode;
  
  shipping: number;
  
  shippingMethod?: Maybe<ShippingMethod>;
  
  totalBeforeTax: number;
  
  total: number;
}


export interface OrderAddress {
  
  fullName?: Maybe<string>;
  
  company?: Maybe<string>;
  
  streetLine1?: Maybe<string>;
  
  streetLine2?: Maybe<string>;
  
  city?: Maybe<string>;
  
  province?: Maybe<string>;
  
  postalCode?: Maybe<string>;
  
  country?: Maybe<string>;
  
  countryCode?: Maybe<string>;
  
  phoneNumber?: Maybe<string>;
}


export interface OrderLine extends Node {
  
  id: string;
  
  createdAt: DateTime;
  
  updatedAt: DateTime;
  
  productVariant: ProductVariant;
  
  featuredAsset?: Maybe<Asset>;
  
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
  
  featuredAsset?: Maybe<Asset>;
  
  assets: Asset[];
  
  price: number;
  
  currencyCode: CurrencyCode;
  
  priceIncludesTax: boolean;
  
  priceWithTax: number;
  
  taxRateApplied: TaxRate;
  
  taxCategory: TaxCategory;
  
  options: ProductOption[];
  
  facetValues: FacetValue[];
  
  translations: ProductVariantTranslation[];
  
  customFields?: Maybe<Json>;
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
  
  customerGroup?: Maybe<CustomerGroup>;
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
  
  languageCode?: Maybe<LanguageCode>;
  
  code?: Maybe<string>;
  
  name?: Maybe<string>;
  
  translations: ProductOptionTranslation[];
  
  customFields?: Maybe<Json>;
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
  
  transactionId?: Maybe<string>;
  
  metadata?: Maybe<Json>;
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
  
  value?: Maybe<string>;
}


export interface FacetList extends PaginatedList {
  
  items: Facet[];
  
  totalItems: number;
}


export interface GlobalSettings {
  
  id: string;
  
  createdAt: DateTime;
  
  updatedAt: DateTime;
  
  availableLanguages: LanguageCode[];
  
  serverConfig: ServerConfig;
  
  customFields?: Maybe<Json>;
}


export interface ServerConfig {
  
  customFields?: Maybe<Json>;
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


export interface ProductOptionGroup extends Node {
  
  id: string;
  
  createdAt: DateTime;
  
  updatedAt: DateTime;
  
  languageCode: LanguageCode;
  
  code: string;
  
  name: string;
  
  options: ProductOption[];
  
  translations: ProductOptionGroupTranslation[];
  
  customFields?: Maybe<Json>;
}


export interface ProductOptionGroupTranslation {
  
  id: string;
  
  createdAt: DateTime;
  
  updatedAt: DateTime;
  
  languageCode: LanguageCode;
  
  name: string;
}


export interface SearchResponse {
  
  items: SearchResult[];
  
  totalItems: number;
  
  facetValues: FacetValue[];
}


export interface SearchResult {
  
  sku: string;
  
  slug: string;
  
  productId: string;
  
  productName: string;
  
  productPreview: string;
  
  productVariantId: string;
  
  productVariantName: string;
  
  productVariantPreview: string;
  
  price: number;
  
  currencyCode: CurrencyCode;
  
  description: string;
  
  facetIds: string[];
  
  facetValueIds: string[];
  
  score: number;
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
  
  featuredAsset?: Maybe<Asset>;
  
  assets: Asset[];
  
  variants: ProductVariant[];
  
  optionGroups: ProductOptionGroup[];
  
  facetValues: FacetValue[];
  
  translations: ProductTranslation[];
  
  customFields?: Maybe<Json>;
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
  /** Create a new Administrator */
  createAdministrator: Administrator;
  /** Update an existing Administrator */
  updateAdministrator: Administrator;
  /** Assign a Role to an Administrator */
  assignRoleToAdministrator: Administrator;
  /** Create a new Asset */
  createAssets: Asset[];
  
  login: LoginResult;
  
  logout: boolean;
  /** Create a new Channel */
  createChannel: Channel;
  /** Update an existing Channel */
  updateChannel: Channel;
  /** Create a new Collection */
  createCollection: Collection;
  /** Update an existing Collection */
  updateCollection: Collection;
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
  /** Add Customers to a CustomerGroup */
  addCustomersToGroup: CustomerGroup;
  /** Remove Customers from a CustomerGroup */
  removeCustomersFromGroup: CustomerGroup;
  /** Create a new Customer. If a password is provided, a new User will also be created an linked to the Customer. */
  createCustomer: Customer;
  /** Update an existing Customer */
  updateCustomer: Customer;
  /** Delete a Customer */
  deleteCustomer: DeletionResponse;
  /** Create a new Address and associate it with the Customer specified by customerId */
  createCustomerAddress: Address;
  /** Update an existing Address */
  updateCustomerAddress: Address;
  /** Update an existing Address */
  deleteCustomerAddress: boolean;
  /** Create a new Facet */
  createFacet: Facet;
  /** Update an existing Facet */
  updateFacet: Facet;
  /** Delete an existing Facet */
  deleteFacet: DeletionResponse;
  /** Create one or more FacetValues */
  createFacetValues: FacetValue[];
  /** Update one or more FacetValues */
  updateFacetValues: FacetValue[];
  /** Delete one or more FacetValues */
  deleteFacetValues: DeletionResponse[];
  
  updateGlobalSettings: GlobalSettings;
  
  importProducts?: Maybe<ImportInfo>;
  /** Update an existing PaymentMethod */
  updatePaymentMethod: PaymentMethod;
  /** Create a new ProductOptionGroup */
  createProductOptionGroup: ProductOptionGroup;
  /** Update an existing ProductOptionGroup */
  updateProductOptionGroup: ProductOptionGroup;
  
  reindex: SearchReindexResponse;
  /** Create a new Product */
  createProduct: Product;
  /** Update an existing Product */
  updateProduct: Product;
  /** Delete a Product */
  deleteProduct: DeletionResponse;
  /** Add an OptionGroup to a Product */
  addOptionGroupToProduct: Product;
  /** Remove an OptionGroup from a Product */
  removeOptionGroupFromProduct: Product;
  /** Create a set of ProductVariants based on the OptionGroups assigned to the given Product */
  generateVariantsForProduct: Product;
  /** Update existing ProductVariants */
  updateProductVariants: (Maybe<ProductVariant>)[];
  
  createPromotion: Promotion;
  
  updatePromotion: Promotion;
  
  deletePromotion: DeletionResponse;
  /** Create a new Role */
  createRole: Role;
  /** Update an existing Role */
  updateRole: Role;
  /** Create a new ShippingMethod */
  createShippingMethod: ShippingMethod;
  /** Update an existing ShippingMethod */
  updateShippingMethod: ShippingMethod;
  /** Create a new TaxCategory */
  createTaxCategory: TaxCategory;
  /** Update an existing TaxCategory */
  updateTaxCategory: TaxCategory;
  /** Create a new TaxRate */
  createTaxRate: TaxRate;
  /** Update an existing TaxRate */
  updateTaxRate: TaxRate;
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
  
  requestStarted: number;
  
  requestCompleted: number;
  
  setAsLoggedIn: UserStatus;
  
  setAsLoggedOut: UserStatus;
  
  setUiLanguage?: Maybe<LanguageCode>;
}


export interface LoginResult {
  
  user: CurrentUser;
}


export interface DeletionResponse {
  
  result: DeletionResult;
  
  message?: Maybe<string>;
}


export interface ImportInfo {
  
  errors?: Maybe<string[]>;
  
  processed: number;
  
  imported: number;
}


export interface SearchReindexResponse {
  
  success: boolean;
  
  timeTaken: number;
  
  indexedItemCount: number;
}


export interface ShippingMethodQuote {
  
  id: string;
  
  price: number;
  
  description: string;
}



// ====================================================
// Arguments
// ====================================================

export interface AdministratorsQueryArgs {
  
  options?: Maybe<AdministratorListOptions>;
}
export interface AdministratorQueryArgs {
  
  id: string;
}
export interface AssetsQueryArgs {
  
  options?: Maybe<AssetListOptions>;
}
export interface AssetQueryArgs {
  
  id: string;
}
export interface ChannelQueryArgs {
  
  id: string;
}
export interface CollectionsQueryArgs {
  
  languageCode?: Maybe<LanguageCode>;
  
  options?: Maybe<CollectionListOptions>;
}
export interface CollectionQueryArgs {
  
  id: string;
  
  languageCode?: Maybe<LanguageCode>;
}
export interface CountriesQueryArgs {
  
  options?: Maybe<CountryListOptions>;
}
export interface CountryQueryArgs {
  
  id: string;
}
export interface CustomerGroupQueryArgs {
  
  id: string;
}
export interface CustomersQueryArgs {
  
  options?: Maybe<CustomerListOptions>;
}
export interface CustomerQueryArgs {
  
  id: string;
}
export interface FacetsQueryArgs {
  
  languageCode?: Maybe<LanguageCode>;
  
  options?: Maybe<FacetListOptions>;
}
export interface FacetQueryArgs {
  
  id: string;
  
  languageCode?: Maybe<LanguageCode>;
}
export interface OrderQueryArgs {
  
  id: string;
}
export interface OrdersQueryArgs {
  
  options?: Maybe<OrderListOptions>;
}
export interface PaymentMethodsQueryArgs {
  
  options?: Maybe<PaymentMethodListOptions>;
}
export interface PaymentMethodQueryArgs {
  
  id: string;
}
export interface ProductOptionGroupsQueryArgs {
  
  languageCode?: Maybe<LanguageCode>;
  
  filterTerm?: Maybe<string>;
}
export interface ProductOptionGroupQueryArgs {
  
  id: string;
  
  languageCode?: Maybe<LanguageCode>;
}
export interface SearchQueryArgs {
  
  input: SearchInput;
}
export interface ProductsQueryArgs {
  
  languageCode?: Maybe<LanguageCode>;
  
  options?: Maybe<ProductListOptions>;
}
export interface ProductQueryArgs {
  
  id: string;
  
  languageCode?: Maybe<LanguageCode>;
}
export interface PromotionQueryArgs {
  
  id: string;
}
export interface PromotionsQueryArgs {
  
  options?: Maybe<PromotionListOptions>;
}
export interface RolesQueryArgs {
  
  options?: Maybe<RoleListOptions>;
}
export interface RoleQueryArgs {
  
  id: string;
}
export interface ShippingMethodsQueryArgs {
  
  options?: Maybe<ShippingMethodListOptions>;
}
export interface ShippingMethodQueryArgs {
  
  id: string;
}
export interface TaxCategoryQueryArgs {
  
  id: string;
}
export interface TaxRatesQueryArgs {
  
  options?: Maybe<TaxRateListOptions>;
}
export interface TaxRateQueryArgs {
  
  id: string;
}
export interface ZoneQueryArgs {
  
  id: string;
}
export interface OrdersCustomerArgs {
  
  options?: Maybe<OrderListOptions>;
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
  
  rememberMe?: Maybe<boolean>;
}
export interface CreateChannelMutationArgs {
  
  input: CreateChannelInput;
}
export interface UpdateChannelMutationArgs {
  
  input: UpdateChannelInput;
}
export interface CreateCollectionMutationArgs {
  
  input: CreateCollectionInput;
}
export interface UpdateCollectionMutationArgs {
  
  input: UpdateCollectionInput;
}
export interface MoveCollectionMutationArgs {
  
  input: MoveCollectionInput;
}
export interface CreateCountryMutationArgs {
  
  input: CreateCountryInput;
}
export interface UpdateCountryMutationArgs {
  
  input: UpdateCountryInput;
}
export interface DeleteCountryMutationArgs {
  
  id: string;
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
  
  password?: Maybe<string>;
}
export interface UpdateCustomerMutationArgs {
  
  input: UpdateCustomerInput;
}
export interface DeleteCustomerMutationArgs {
  
  id: string;
}
export interface CreateCustomerAddressMutationArgs {
  
  customerId: string;
  
  input: CreateAddressInput;
}
export interface UpdateCustomerAddressMutationArgs {
  
  input: UpdateAddressInput;
}
export interface DeleteCustomerAddressMutationArgs {
  
  id: string;
}
export interface CreateFacetMutationArgs {
  
  input: CreateFacetInput;
}
export interface UpdateFacetMutationArgs {
  
  input: UpdateFacetInput;
}
export interface DeleteFacetMutationArgs {
  
  id: string;
  
  force?: Maybe<boolean>;
}
export interface CreateFacetValuesMutationArgs {
  
  input: CreateFacetValueInput[];
}
export interface UpdateFacetValuesMutationArgs {
  
  input: UpdateFacetValueInput[];
}
export interface DeleteFacetValuesMutationArgs {
  
  ids: string[];
  
  force?: Maybe<boolean>;
}
export interface UpdateGlobalSettingsMutationArgs {
  
  input: UpdateGlobalSettingsInput;
}
export interface ImportProductsMutationArgs {
  
  csvFile: Upload;
}
export interface UpdatePaymentMethodMutationArgs {
  
  input: UpdatePaymentMethodInput;
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
export interface DeleteProductMutationArgs {
  
  id: string;
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
  
  defaultTaxCategoryId?: Maybe<string>;
  
  defaultPrice?: Maybe<number>;
  
  defaultSku?: Maybe<string>;
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
export interface DeletePromotionMutationArgs {
  
  id: string;
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
export interface DeleteZoneMutationArgs {
  
  id: string;
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
  
  languageCode?: Maybe<LanguageCode>;
}


