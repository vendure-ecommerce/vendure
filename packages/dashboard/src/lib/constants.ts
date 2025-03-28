export const NEW_ENTITY_PATH = 'new';
export const AUTHENTICATED_ROUTE_PREFIX = '/_authenticated';
export const DEFAULT_CHANNEL_CODE = '__default_channel__';
export const SUPER_ADMIN_ROLE_CODE = '__super_admin_role__';
export const CUSTOMER_ROLE_CODE = '__customer_role__';
/**
 * This is copied from the generated types from @vendure/common/lib/generated-types.d.ts
 * It is used to provide a list of available currency codes for the user to select from.
 * esbuild currently does not support import enums.
 */
export const CurrencyCode = {
    /** United Arab Emirates dirham */
    AED: 'AED',
    /** Afghan afghani */
    AFN: 'AFN',
    /** Albanian lek */
    ALL: 'ALL',
    /** Armenian dram */
    AMD: 'AMD',
    /** Netherlands Antillean guilder */
    ANG: 'ANG',
    /** Angolan kwanza */
    AOA: 'AOA',
    /** Argentine peso */
    ARS: 'ARS',
    /** Australian dollar */
    AUD: 'AUD',
    /** Aruban florin */
    AWG: 'AWG',
    /** Azerbaijani manat */
    AZN: 'AZN',
    /** Bosnia and Herzegovina convertible mark */
    BAM: 'BAM',
    /** Barbados dollar */
    BBD: 'BBD',
    /** Bangladeshi taka */
    BDT: 'BDT',
    /** Bulgarian lev */
    BGN: 'BGN',
    /** Bahraini dinar */
    BHD: 'BHD',
    /** Burundian franc */
    BIF: 'BIF',
    /** Bermudian dollar */
    BMD: 'BMD',
    /** Brunei dollar */
    BND: 'BND',
    /** Boliviano */
    BOB: 'BOB',
    /** Brazilian real */
    BRL: 'BRL',
    /** Bahamian dollar */
    BSD: 'BSD',
    /** Bhutanese ngultrum */
    BTN: 'BTN',
    /** Botswana pula */
    BWP: 'BWP',
    /** Belarusian ruble */
    BYN: 'BYN',
    /** Belize dollar */
    BZD: 'BZD',
    /** Canadian dollar */
    CAD: 'CAD',
    /** Congolese franc */
    CDF: 'CDF',
    /** Swiss franc */
    CHF: 'CHF',
    /** Chilean peso */
    CLP: 'CLP',
    /** Renminbi (Chinese) yuan */
    CNY: 'CNY',
    /** Colombian peso */
    COP: 'COP',
    /** Costa Rican colon */
    CRC: 'CRC',
    /** Cuban convertible peso */
    CUC: 'CUC',
    /** Cuban peso */
    CUP: 'CUP',
    /** Cape Verde escudo */
    CVE: 'CVE',
    /** Czech koruna */
    CZK: 'CZK',
    /** Djiboutian franc */
    DJF: 'DJF',
    /** Danish krone */
    DKK: 'DKK',
    /** Dominican peso */
    DOP: 'DOP',
    /** Algerian dinar */
    DZD: 'DZD',
    /** Egyptian pound */
    EGP: 'EGP',
    /** Eritrean nakfa */
    ERN: 'ERN',
    /** Ethiopian birr */
    ETB: 'ETB',
    /** Euro */
    EUR: 'EUR',
    /** Fiji dollar */
    FJD: 'FJD',
    /** Falkland Islands pound */
    FKP: 'FKP',
    /** Pound sterling */
    GBP: 'GBP',
    /** Georgian lari */
    GEL: 'GEL',
    /** Ghanaian cedi */
    GHS: 'GHS',
    /** Gibraltar pound */
    GIP: 'GIP',
    /** Gambian dalasi */
    GMD: 'GMD',
    /** Guinean franc */
    GNF: 'GNF',
    /** Guatemalan quetzal */
    GTQ: 'GTQ',
    /** Guyanese dollar */
    GYD: 'GYD',
    /** Hong Kong dollar */
    HKD: 'HKD',
    /** Honduran lempira */
    HNL: 'HNL',
    /** Croatian kuna */
    HRK: 'HRK',
    /** Haitian gourde */
    HTG: 'HTG',
    /** Hungarian forint */
    HUF: 'HUF',
    /** Indonesian rupiah */
    IDR: 'IDR',
    /** Israeli new shekel */
    ILS: 'ILS',
    /** Indian rupee */
    INR: 'INR',
    /** Iraqi dinar */
    IQD: 'IQD',
    /** Iranian rial */
    IRR: 'IRR',
    /** Icelandic króna */
    ISK: 'ISK',
    /** Jamaican dollar */
    JMD: 'JMD',
    /** Jordanian dinar */
    JOD: 'JOD',
    /** Japanese yen */
    JPY: 'JPY',
    /** Kenyan shilling */
    KES: 'KES',
    /** Kyrgyzstani som */
    KGS: 'KGS',
    /** Cambodian riel */
    KHR: 'KHR',
    /** Comoro franc */
    KMF: 'KMF',
    /** North Korean won */
    KPW: 'KPW',
    /** South Korean won */
    KRW: 'KRW',
    /** Kuwaiti dinar */
    KWD: 'KWD',
    /** Cayman Islands dollar */
    KYD: 'KYD',
    /** Kazakhstani tenge */
    KZT: 'KZT',
    /** Lao kip */
    LAK: 'LAK',
    /** Lebanese pound */
    LBP: 'LBP',
    /** Sri Lankan rupee */
    LKR: 'LKR',
    /** Liberian dollar */
    LRD: 'LRD',
    /** Lesotho loti */
    LSL: 'LSL',
    /** Libyan dinar */
    LYD: 'LYD',
    /** Moroccan dirham */
    MAD: 'MAD',
    /** Moldovan leu */
    MDL: 'MDL',
    /** Malagasy ariary */
    MGA: 'MGA',
    /** Macedonian denar */
    MKD: 'MKD',
    /** Myanmar kyat */
    MMK: 'MMK',
    /** Mongolian tögrög */
    MNT: 'MNT',
    /** Macanese pataca */
    MOP: 'MOP',
    /** Mauritanian ouguiya */
    MRU: 'MRU',
    /** Mauritian rupee */
    MUR: 'MUR',
    /** Maldivian rufiyaa */
    MVR: 'MVR',
    /** Malawian kwacha */
    MWK: 'MWK',
    /** Mexican peso */
    MXN: 'MXN',
    /** Malaysian ringgit */
    MYR: 'MYR',
    /** Mozambican metical */
    MZN: 'MZN',
    /** Namibian dollar */
    NAD: 'NAD',
    /** Nigerian naira */
    NGN: 'NGN',
    /** Nicaraguan córdoba */
    NIO: 'NIO',
    /** Norwegian krone */
    NOK: 'NOK',
    /** Nepalese rupee */
    NPR: 'NPR',
    /** New Zealand dollar */
    NZD: 'NZD',
    /** Omani rial */
    OMR: 'OMR',
    /** Panamanian balboa */
    PAB: 'PAB',
    /** Peruvian sol */
    PEN: 'PEN',
    /** Papua New Guinean kina */
    PGK: 'PGK',
    /** Philippine peso */
    PHP: 'PHP',
    /** Pakistani rupee */
    PKR: 'PKR',
    /** Polish złoty */
    PLN: 'PLN',
    /** Paraguayan guaraní */
    PYG: 'PYG',
    /** Qatari riyal */
    QAR: 'QAR',
    /** Romanian leu */
    RON: 'RON',
    /** Serbian dinar */
    RSD: 'RSD',
    /** Russian ruble */
    RUB: 'RUB',
    /** Rwandan franc */
    RWF: 'RWF',
    /** Saudi riyal */
    SAR: 'SAR',
    /** Solomon Islands dollar */
    SBD: 'SBD',
    /** Seychelles rupee */
    SCR: 'SCR',
    /** Sudanese pound */
    SDG: 'SDG',
    /** Swedish krona/kronor */
    SEK: 'SEK',
    /** Singapore dollar */
    SGD: 'SGD',
    /** Saint Helena pound */
    SHP: 'SHP',
    /** Sierra Leonean leone */
    SLL: 'SLL',
    /** Somali shilling */
    SOS: 'SOS',
    /** Surinamese dollar */
    SRD: 'SRD',
    /** South Sudanese pound */
    SSP: 'SSP',
    /** São Tomé and Príncipe dobra */
    STN: 'STN',
    /** Salvadoran colón */
    SVC: 'SVC',
    /** Syrian pound */
    SYP: 'SYP',
    /** Swazi lilangeni */
    SZL: 'SZL',
    /** Thai baht */
    THB: 'THB',
    /** Tajikistani somoni */
    TJS: 'TJS',
    /** Turkmenistan manat */
    TMT: 'TMT',
    /** Tunisian dinar */
    TND: 'TND',
    /** Tongan paʻanga */
    TOP: 'TOP',
    /** Turkish lira */
    TRY: 'TRY',
    /** Trinidad and Tobago dollar */
    TTD: 'TTD',
    /** New Taiwan dollar */
    TWD: 'TWD',
    /** Tanzanian shilling */
    TZS: 'TZS',
    /** Ukrainian hryvnia */
    UAH: 'UAH',
    /** Ugandan shilling */
    UGX: 'UGX',
    /** United States dollar */
    USD: 'USD',
    /** Uruguayan peso */
    UYU: 'UYU',
    /** Uzbekistan som */
    UZS: 'UZS',
    /** Venezuelan bolívar soberano */
    VES: 'VES',
    /** Vietnamese đồng */
    VND: 'VND',
    /** Vanuatu vatu */
    VUV: 'VUV',
    /** Samoan tala */
    WST: 'WST',
    /** CFA franc BEAC */
    XAF: 'XAF',
    /** East Caribbean dollar */
    XCD: 'XCD',
    /** CFA franc BCEAO */
    XOF: 'XOF',
    /** CFP franc (franc Pacifique) */
    XPF: 'XPF',
    /** Yemeni rial */
    YER: 'YER',
    /** South African rand */
    ZAR: 'ZAR',
    /** Zambian kwacha */
    ZMW: 'ZMW',
    /** Zimbabwean dollar */
    ZWL: 'ZWL',
};
