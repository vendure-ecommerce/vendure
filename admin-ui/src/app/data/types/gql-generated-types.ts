

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RequestStarted
// ====================================================

export interface RequestStarted {
  requestStarted: number;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RequestCompleted
// ====================================================

export interface RequestCompleted {
  requestCompleted: number;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: LogIn
// ====================================================

export interface LogIn_logIn {
  __typename: "UserStatus";
  username: string;
  isLoggedIn: boolean;
  loginTime: string;
}

export interface LogIn {
  logIn: LogIn_logIn | null;
}

export interface LogInVariables {
  username: string;
  loginTime: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: LogOut
// ====================================================

export interface LogOut_logOut {
  __typename: "UserStatus";
  username: string;
  isLoggedIn: boolean;
  loginTime: string;
}

export interface LogOut {
  logOut: LogOut_logOut | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetNetworkStatus
// ====================================================

export interface GetNetworkStatus_networkStatus {
  __typename: "NetworkStatus";
  inFlightRequests: number;
}

export interface GetNetworkStatus {
  networkStatus: GetNetworkStatus_networkStatus;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUserStatus
// ====================================================

export interface GetUserStatus_userStatus {
  __typename: "UserStatus";
  username: string;
  isLoggedIn: boolean;
  loginTime: string;
}

export interface GetUserStatus {
  userStatus: GetUserStatus_userStatus;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetProductById
// ====================================================

export interface GetProductById_product_translations {
  __typename: "ProductTranslation";
  languageCode: LanguageCode;
  name: string;
  slug: string;
  description: string | null;
}

export interface GetProductById_product {
  __typename: "Product";
  id: string;
  languageCode: LanguageCode;
  name: string | null;
  slug: string | null;
  description: string | null;
  translations: (GetProductById_product_translations | null)[] | null;
}

export interface GetProductById {
  product: GetProductById_product;
}

export interface GetProductByIdVariables {
  id: string;
  languageCode?: LanguageCode | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetProductList
// ====================================================

export interface GetProductList_products_items {
  __typename: "Product";
  id: string;
  languageCode: LanguageCode;
  name: string | null;
  slug: string | null;
  description: string | null;
}

export interface GetProductList_products {
  __typename: "ProductList";
  items: GetProductList_products_items[];
  totalItems: number;
}

export interface GetProductList {
  products: GetProductList_products;
}

export interface GetProductListVariables {
  take?: number | null;
  skip?: number | null;
  languageCode?: LanguageCode | null;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

// ISO 639-1 language code
export enum LanguageCode {
  aa = "aa",
  ab = "ab",
  ae = "ae",
  af = "af",
  ak = "ak",
  am = "am",
  an = "an",
  ar = "ar",
  as = "as",
  av = "av",
  ay = "ay",
  az = "az",
  ba = "ba",
  be = "be",
  bg = "bg",
  bh = "bh",
  bi = "bi",
  bm = "bm",
  bn = "bn",
  bo = "bo",
  br = "br",
  bs = "bs",
  ca = "ca",
  ce = "ce",
  ch = "ch",
  co = "co",
  cr = "cr",
  cs = "cs",
  cu = "cu",
  cv = "cv",
  cy = "cy",
  da = "da",
  de = "de",
  dv = "dv",
  dz = "dz",
  ee = "ee",
  el = "el",
  en = "en",
  eo = "eo",
  es = "es",
  et = "et",
  eu = "eu",
  fa = "fa",
  ff = "ff",
  fi = "fi",
  fj = "fj",
  fo = "fo",
  fr = "fr",
  fy = "fy",
  ga = "ga",
  gd = "gd",
  gl = "gl",
  gn = "gn",
  gu = "gu",
  gv = "gv",
  ha = "ha",
  he = "he",
  hi = "hi",
  ho = "ho",
  hr = "hr",
  ht = "ht",
  hu = "hu",
  hy = "hy",
  hz = "hz",
  ia = "ia",
  id = "id",
  ie = "ie",
  ig = "ig",
  ii = "ii",
  ik = "ik",
  io = "io",
  is = "is",
  it = "it",
  iu = "iu",
  ja = "ja",
  jv = "jv",
  ka = "ka",
  kg = "kg",
  ki = "ki",
  kj = "kj",
  kk = "kk",
  kl = "kl",
  km = "km",
  kn = "kn",
  ko = "ko",
  kr = "kr",
  ks = "ks",
  ku = "ku",
  kv = "kv",
  kw = "kw",
  ky = "ky",
  la = "la",
  lb = "lb",
  lg = "lg",
  li = "li",
  ln = "ln",
  lo = "lo",
  lt = "lt",
  lu = "lu",
  lv = "lv",
  mg = "mg",
  mh = "mh",
  mi = "mi",
  mk = "mk",
  ml = "ml",
  mn = "mn",
  mr = "mr",
  ms = "ms",
  mt = "mt",
  my = "my",
  na = "na",
  nb = "nb",
  nd = "nd",
  ne = "ne",
  ng = "ng",
  nl = "nl",
  nn = "nn",
  no = "no",
  nr = "nr",
  nv = "nv",
  ny = "ny",
  oc = "oc",
  oj = "oj",
  om = "om",
  or = "or",
  os = "os",
  pa = "pa",
  pi = "pi",
  pl = "pl",
  ps = "ps",
  pt = "pt",
  qu = "qu",
  rm = "rm",
  rn = "rn",
  ro = "ro",
  ru = "ru",
  rw = "rw",
  sa = "sa",
  sc = "sc",
  sd = "sd",
  se = "se",
  sg = "sg",
  si = "si",
  sk = "sk",
  sl = "sl",
  sm = "sm",
  sn = "sn",
  so = "so",
  sq = "sq",
  sr = "sr",
  ss = "ss",
  st = "st",
  su = "su",
  sv = "sv",
  sw = "sw",
  ta = "ta",
  te = "te",
  tg = "tg",
  th = "th",
  ti = "ti",
  tk = "tk",
  tl = "tl",
  tn = "tn",
  to = "to",
  tr = "tr",
  ts = "ts",
  tt = "tt",
  tw = "tw",
  ty = "ty",
  ug = "ug",
  uk = "uk",
  ur = "ur",
  uz = "uz",
  ve = "ve",
  vi = "vi",
  vo = "vo",
  wa = "wa",
  wo = "wo",
  xh = "xh",
  yi = "yi",
  yo = "yo",
  za = "za",
  zh = "zh",
  zu = "zu",
}

//==============================================================
// END Enums and Input Objects
//==============================================================