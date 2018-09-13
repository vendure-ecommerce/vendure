/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAdministrators
// ====================================================

export interface GetAdministrators_administrators_items_user_roles {
  __typename: "Role";
  code: string;
  description: string;
  permissions: Permission[];
}

export interface GetAdministrators_administrators_items_user {
  __typename: "User";
  id: string;
  identifier: string;
  lastLogin: string | null;
  roles: GetAdministrators_administrators_items_user_roles[];
}

export interface GetAdministrators_administrators_items {
  __typename: "Administrator";
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  user: GetAdministrators_administrators_items_user;
}

export interface GetAdministrators_administrators {
  __typename: "AdministratorList";
  items: GetAdministrators_administrators_items[];
  totalItems: number;
}

export interface GetAdministrators {
  administrators: GetAdministrators_administrators;
}

export interface GetAdministratorsVariables {
  options?: AdministratorListOptions | null;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAdministrator
// ====================================================

export interface GetAdministrator_administrator_user_roles {
  __typename: "Role";
  code: string;
  description: string;
  permissions: Permission[];
}

export interface GetAdministrator_administrator_user {
  __typename: "User";
  id: string;
  identifier: string;
  lastLogin: string | null;
  roles: GetAdministrator_administrator_user_roles[];
}

export interface GetAdministrator_administrator {
  __typename: "Administrator";
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  user: GetAdministrator_administrator_user;
}

export interface GetAdministrator {
  administrator: GetAdministrator_administrator | null;
}

export interface GetAdministratorVariables {
  id: string;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateAdministrator
// ====================================================

export interface CreateAdministrator_createAdministrator_user_roles {
  __typename: "Role";
  code: string;
  description: string;
  permissions: Permission[];
}

export interface CreateAdministrator_createAdministrator_user {
  __typename: "User";
  id: string;
  identifier: string;
  lastLogin: string | null;
  roles: CreateAdministrator_createAdministrator_user_roles[];
}

export interface CreateAdministrator_createAdministrator {
  __typename: "Administrator";
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  user: CreateAdministrator_createAdministrator_user;
}

export interface CreateAdministrator {
  /**
   * Create a new Administrator
   */
  createAdministrator: CreateAdministrator_createAdministrator;
}

export interface CreateAdministratorVariables {
  input: CreateAdministratorInput;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateAdministrator
// ====================================================

export interface UpdateAdministrator_updateAdministrator_user_roles {
  __typename: "Role";
  code: string;
  description: string;
  permissions: Permission[];
}

export interface UpdateAdministrator_updateAdministrator_user {
  __typename: "User";
  id: string;
  identifier: string;
  lastLogin: string | null;
  roles: UpdateAdministrator_updateAdministrator_user_roles[];
}

export interface UpdateAdministrator_updateAdministrator {
  __typename: "Administrator";
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  user: UpdateAdministrator_updateAdministrator_user;
}

export interface UpdateAdministrator {
  /**
   * Update an existing Administrator
   */
  updateAdministrator: UpdateAdministrator_updateAdministrator;
}

export interface UpdateAdministratorVariables {
  input: UpdateAdministratorInput;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetRoles
// ====================================================

export interface GetRoles_roles_items_channels {
  __typename: "Channel";
  id: string;
  code: string;
  token: string;
}

export interface GetRoles_roles_items {
  __typename: "Role";
  id: string;
  code: string;
  description: string;
  permissions: Permission[];
  channels: GetRoles_roles_items_channels[];
}

export interface GetRoles_roles {
  __typename: "RoleList";
  items: GetRoles_roles_items[];
  totalItems: number;
}

export interface GetRoles {
  roles: GetRoles_roles;
}

export interface GetRolesVariables {
  options?: RoleListOptions | null;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetRole
// ====================================================

export interface GetRole_role_channels {
  __typename: "Channel";
  id: string;
  code: string;
  token: string;
}

export interface GetRole_role {
  __typename: "Role";
  id: string;
  code: string;
  description: string;
  permissions: Permission[];
  channels: GetRole_role_channels[];
}

export interface GetRole {
  role: GetRole_role | null;
}

export interface GetRoleVariables {
  id: string;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateRole
// ====================================================

export interface CreateRole_createRole_channels {
  __typename: "Channel";
  id: string;
  code: string;
  token: string;
}

export interface CreateRole_createRole {
  __typename: "Role";
  id: string;
  code: string;
  description: string;
  permissions: Permission[];
  channels: CreateRole_createRole_channels[];
}

export interface CreateRole {
  /**
   * Create a new Role
   */
  createRole: CreateRole_createRole;
}

export interface CreateRoleVariables {
  input: CreateRoleInput;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateRole
// ====================================================

export interface UpdateRole_updateRole_channels {
  __typename: "Channel";
  id: string;
  code: string;
  token: string;
}

export interface UpdateRole_updateRole {
  __typename: "Role";
  id: string;
  code: string;
  description: string;
  permissions: Permission[];
  channels: UpdateRole_updateRole_channels[];
}

export interface UpdateRole {
  /**
   * Update an existing new Role
   */
  updateRole: UpdateRole_updateRole;
}

export interface UpdateRoleVariables {
  input: UpdateRoleInput;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AssignRoleToAdministrator
// ====================================================

export interface AssignRoleToAdministrator_assignRoleToAdministrator_user_roles {
  __typename: "Role";
  code: string;
  description: string;
  permissions: Permission[];
}

export interface AssignRoleToAdministrator_assignRoleToAdministrator_user {
  __typename: "User";
  id: string;
  identifier: string;
  lastLogin: string | null;
  roles: AssignRoleToAdministrator_assignRoleToAdministrator_user_roles[];
}

export interface AssignRoleToAdministrator_assignRoleToAdministrator {
  __typename: "Administrator";
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  user: AssignRoleToAdministrator_assignRoleToAdministrator_user;
}

export interface AssignRoleToAdministrator {
  /**
   * Assign a Role to an Administrator
   */
  assignRoleToAdministrator: AssignRoleToAdministrator_assignRoleToAdministrator;
}

export interface AssignRoleToAdministratorVariables {
  administratorId: string;
  roleId: string;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AttemptLogin
// ====================================================

export interface AttemptLogin_login_user {
  __typename: "CurrentUser";
  id: string;
  identifier: string;
  channelTokens: string[];
  roles: string[];
}

export interface AttemptLogin_login {
  __typename: "LoginResult";
  user: AttemptLogin_login_user;
  authToken: string;
}

export interface AttemptLogin {
  login: AttemptLogin_login;
}

export interface AttemptLoginVariables {
  username: string;
  password: string;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCurrentUser
// ====================================================

export interface GetCurrentUser_me {
  __typename: "CurrentUser";
  id: string;
  identifier: string;
  channelTokens: string[];
  roles: string[];
}

export interface GetCurrentUser {
  me: GetCurrentUser_me | null;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateFacet
// ====================================================

export interface CreateFacet_createFacet_translations {
  __typename: "FacetTranslation";
  id: string;
  languageCode: LanguageCode;
  name: string;
}

export interface CreateFacet_createFacet_values_translations {
  __typename: "FacetValueTranslation";
  id: string;
  languageCode: LanguageCode;
  name: string;
}

export interface CreateFacet_createFacet_values {
  __typename: "FacetValue";
  id: string;
  languageCode: LanguageCode | null;
  code: string;
  name: string;
  translations: CreateFacet_createFacet_values_translations[];
}

export interface CreateFacet_createFacet {
  __typename: "Facet";
  id: string;
  languageCode: LanguageCode;
  code: string;
  name: string;
  translations: CreateFacet_createFacet_translations[];
  values: CreateFacet_createFacet_values[];
}

export interface CreateFacet {
  /**
   * Create a new Facet
   */
  createFacet: CreateFacet_createFacet;
}

export interface CreateFacetVariables {
  input: CreateFacetInput;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateFacet
// ====================================================

export interface UpdateFacet_updateFacet_translations {
  __typename: "FacetTranslation";
  id: string;
  languageCode: LanguageCode;
  name: string;
}

export interface UpdateFacet_updateFacet_values_translations {
  __typename: "FacetValueTranslation";
  id: string;
  languageCode: LanguageCode;
  name: string;
}

export interface UpdateFacet_updateFacet_values {
  __typename: "FacetValue";
  id: string;
  languageCode: LanguageCode | null;
  code: string;
  name: string;
  translations: UpdateFacet_updateFacet_values_translations[];
}

export interface UpdateFacet_updateFacet {
  __typename: "Facet";
  id: string;
  languageCode: LanguageCode;
  code: string;
  name: string;
  translations: UpdateFacet_updateFacet_translations[];
  values: UpdateFacet_updateFacet_values[];
}

export interface UpdateFacet {
  /**
   * Update an existing Facet
   */
  updateFacet: UpdateFacet_updateFacet;
}

export interface UpdateFacetVariables {
  input: UpdateFacetInput;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateFacetValues
// ====================================================

export interface CreateFacetValues_createFacetValues_translations {
  __typename: "FacetValueTranslation";
  id: string;
  languageCode: LanguageCode;
  name: string;
}

export interface CreateFacetValues_createFacetValues {
  __typename: "FacetValue";
  id: string;
  languageCode: LanguageCode | null;
  code: string;
  name: string;
  translations: CreateFacetValues_createFacetValues_translations[];
}

export interface CreateFacetValues {
  /**
   * Create one or more FacetValues
   */
  createFacetValues: CreateFacetValues_createFacetValues[];
}

export interface CreateFacetValuesVariables {
  input: CreateFacetValueInput[];
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateFacetValues
// ====================================================

export interface UpdateFacetValues_updateFacetValues_translations {
  __typename: "FacetValueTranslation";
  id: string;
  languageCode: LanguageCode;
  name: string;
}

export interface UpdateFacetValues_updateFacetValues {
  __typename: "FacetValue";
  id: string;
  languageCode: LanguageCode | null;
  code: string;
  name: string;
  translations: UpdateFacetValues_updateFacetValues_translations[];
}

export interface UpdateFacetValues {
  /**
   * Update one or more FacetValues
   */
  updateFacetValues: UpdateFacetValues_updateFacetValues[];
}

export interface UpdateFacetValuesVariables {
  input: UpdateFacetValueInput[];
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetFacetList
// ====================================================

export interface GetFacetList_facets_items_translations {
  __typename: "FacetTranslation";
  id: string;
  languageCode: LanguageCode;
  name: string;
}

export interface GetFacetList_facets_items_values_translations {
  __typename: "FacetValueTranslation";
  id: string;
  languageCode: LanguageCode;
  name: string;
}

export interface GetFacetList_facets_items_values {
  __typename: "FacetValue";
  id: string;
  languageCode: LanguageCode | null;
  code: string;
  name: string;
  translations: GetFacetList_facets_items_values_translations[];
}

export interface GetFacetList_facets_items {
  __typename: "Facet";
  id: string;
  languageCode: LanguageCode;
  code: string;
  name: string;
  translations: GetFacetList_facets_items_translations[];
  values: GetFacetList_facets_items_values[];
}

export interface GetFacetList_facets {
  __typename: "FacetList";
  items: GetFacetList_facets_items[];
  totalItems: number;
}

export interface GetFacetList {
  facets: GetFacetList_facets;
}

export interface GetFacetListVariables {
  options?: FacetListOptions | null;
  languageCode?: LanguageCode | null;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetFacetWithValues
// ====================================================

export interface GetFacetWithValues_facet_translations {
  __typename: "FacetTranslation";
  id: string;
  languageCode: LanguageCode;
  name: string;
}

export interface GetFacetWithValues_facet_values_translations {
  __typename: "FacetValueTranslation";
  id: string;
  languageCode: LanguageCode;
  name: string;
}

export interface GetFacetWithValues_facet_values {
  __typename: "FacetValue";
  id: string;
  languageCode: LanguageCode | null;
  code: string;
  name: string;
  translations: GetFacetWithValues_facet_values_translations[];
}

export interface GetFacetWithValues_facet {
  __typename: "Facet";
  id: string;
  languageCode: LanguageCode;
  code: string;
  name: string;
  translations: GetFacetWithValues_facet_translations[];
  values: GetFacetWithValues_facet_values[];
}

export interface GetFacetWithValues {
  facet: GetFacetWithValues_facet | null;
}

export interface GetFacetWithValuesVariables {
  id: string;
  languageCode?: LanguageCode | null;
}

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
// GraphQL mutation operation: SetAsLoggedIn
// ====================================================

export interface SetAsLoggedIn_setAsLoggedIn {
  __typename: "UserStatus";
  username: string;
  isLoggedIn: boolean;
  loginTime: string;
}

export interface SetAsLoggedIn {
  setAsLoggedIn: SetAsLoggedIn_setAsLoggedIn | null;
}

export interface SetAsLoggedInVariables {
  username: string;
  loginTime: string;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetAsLoggedOut
// ====================================================

export interface SetAsLoggedOut_setAsLoggedOut {
  __typename: "UserStatus";
  username: string;
  isLoggedIn: boolean;
  loginTime: string;
}

export interface SetAsLoggedOut {
  setAsLoggedOut: SetAsLoggedOut_setAsLoggedOut | null;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetUiLanguage
// ====================================================

export interface SetUiLanguage {
  setUiLanguage: LanguageCode | null;
}

export interface SetUiLanguageVariables {
  languageCode: LanguageCode;
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
// GraphQL query operation: GetUiState
// ====================================================

export interface GetUiState_uiState {
  __typename: "UiState";
  language: LanguageCode;
}

export interface GetUiState {
  uiState: GetUiState_uiState;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateProduct
// ====================================================

export interface UpdateProduct_updateProduct_assets {
  __typename: "Asset";
  description: string | null;
  name: string;
  preview: string;
  type: AssetType;
}

export interface UpdateProduct_updateProduct_translations {
  __typename: "ProductTranslation";
  languageCode: LanguageCode;
  name: string;
  slug: string;
  description: string;
}

export interface UpdateProduct_updateProduct_optionGroups {
  __typename: "ProductOptionGroup";
  id: string;
  languageCode: LanguageCode;
  code: string;
  name: string;
}

export interface UpdateProduct_updateProduct_variants_options {
  __typename: "ProductOption";
  id: string;
  code: string | null;
  languageCode: LanguageCode | null;
  name: string | null;
}

export interface UpdateProduct_updateProduct_variants_facetValues {
  __typename: "FacetValue";
  id: string;
  code: string;
  name: string;
}

export interface UpdateProduct_updateProduct_variants_translations {
  __typename: "ProductVariantTranslation";
  id: string;
  languageCode: LanguageCode;
  name: string;
}

export interface UpdateProduct_updateProduct_variants {
  __typename: "ProductVariant";
  id: string;
  languageCode: LanguageCode;
  name: string;
  price: number;
  sku: string;
  image: string | null;
  options: UpdateProduct_updateProduct_variants_options[];
  facetValues: UpdateProduct_updateProduct_variants_facetValues[];
  translations: UpdateProduct_updateProduct_variants_translations[];
}

export interface UpdateProduct_updateProduct {
  __typename: "Product";
  id: string;
  languageCode: LanguageCode;
  name: string;
  slug: string;
  image: string;
  description: string;
  assets: UpdateProduct_updateProduct_assets[];
  translations: UpdateProduct_updateProduct_translations[];
  optionGroups: UpdateProduct_updateProduct_optionGroups[];
  variants: UpdateProduct_updateProduct_variants[];
}

export interface UpdateProduct {
  /**
   * Update an existing Product
   */
  updateProduct: UpdateProduct_updateProduct;
}

export interface UpdateProductVariables {
  input: UpdateProductInput;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateProduct
// ====================================================

export interface CreateProduct_createProduct_assets {
  __typename: "Asset";
  description: string | null;
  name: string;
  preview: string;
  type: AssetType;
}

export interface CreateProduct_createProduct_translations {
  __typename: "ProductTranslation";
  languageCode: LanguageCode;
  name: string;
  slug: string;
  description: string;
}

export interface CreateProduct_createProduct_optionGroups {
  __typename: "ProductOptionGroup";
  id: string;
  languageCode: LanguageCode;
  code: string;
  name: string;
}

export interface CreateProduct_createProduct_variants_options {
  __typename: "ProductOption";
  id: string;
  code: string | null;
  languageCode: LanguageCode | null;
  name: string | null;
}

export interface CreateProduct_createProduct_variants_facetValues {
  __typename: "FacetValue";
  id: string;
  code: string;
  name: string;
}

export interface CreateProduct_createProduct_variants_translations {
  __typename: "ProductVariantTranslation";
  id: string;
  languageCode: LanguageCode;
  name: string;
}

export interface CreateProduct_createProduct_variants {
  __typename: "ProductVariant";
  id: string;
  languageCode: LanguageCode;
  name: string;
  price: number;
  sku: string;
  image: string | null;
  options: CreateProduct_createProduct_variants_options[];
  facetValues: CreateProduct_createProduct_variants_facetValues[];
  translations: CreateProduct_createProduct_variants_translations[];
}

export interface CreateProduct_createProduct {
  __typename: "Product";
  id: string;
  languageCode: LanguageCode;
  name: string;
  slug: string;
  image: string;
  description: string;
  assets: CreateProduct_createProduct_assets[];
  translations: CreateProduct_createProduct_translations[];
  optionGroups: CreateProduct_createProduct_optionGroups[];
  variants: CreateProduct_createProduct_variants[];
}

export interface CreateProduct {
  /**
   * Create a new Product
   */
  createProduct: CreateProduct_createProduct;
}

export interface CreateProductVariables {
  input: CreateProductInput;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: GenerateProductVariants
// ====================================================

export interface GenerateProductVariants_generateVariantsForProduct_assets {
  __typename: "Asset";
  description: string | null;
  name: string;
  preview: string;
  type: AssetType;
}

export interface GenerateProductVariants_generateVariantsForProduct_translations {
  __typename: "ProductTranslation";
  languageCode: LanguageCode;
  name: string;
  slug: string;
  description: string;
}

export interface GenerateProductVariants_generateVariantsForProduct_optionGroups {
  __typename: "ProductOptionGroup";
  id: string;
  languageCode: LanguageCode;
  code: string;
  name: string;
}

export interface GenerateProductVariants_generateVariantsForProduct_variants_options {
  __typename: "ProductOption";
  id: string;
  code: string | null;
  languageCode: LanguageCode | null;
  name: string | null;
}

export interface GenerateProductVariants_generateVariantsForProduct_variants_facetValues {
  __typename: "FacetValue";
  id: string;
  code: string;
  name: string;
}

export interface GenerateProductVariants_generateVariantsForProduct_variants_translations {
  __typename: "ProductVariantTranslation";
  id: string;
  languageCode: LanguageCode;
  name: string;
}

export interface GenerateProductVariants_generateVariantsForProduct_variants {
  __typename: "ProductVariant";
  id: string;
  languageCode: LanguageCode;
  name: string;
  price: number;
  sku: string;
  image: string | null;
  options: GenerateProductVariants_generateVariantsForProduct_variants_options[];
  facetValues: GenerateProductVariants_generateVariantsForProduct_variants_facetValues[];
  translations: GenerateProductVariants_generateVariantsForProduct_variants_translations[];
}

export interface GenerateProductVariants_generateVariantsForProduct {
  __typename: "Product";
  id: string;
  languageCode: LanguageCode;
  name: string;
  slug: string;
  image: string;
  description: string;
  assets: GenerateProductVariants_generateVariantsForProduct_assets[];
  translations: GenerateProductVariants_generateVariantsForProduct_translations[];
  optionGroups: GenerateProductVariants_generateVariantsForProduct_optionGroups[];
  variants: GenerateProductVariants_generateVariantsForProduct_variants[];
}

export interface GenerateProductVariants {
  /**
   * Create a set of ProductVariants based on the OptionGroups assigned to the given Product
   */
  generateVariantsForProduct: GenerateProductVariants_generateVariantsForProduct;
}

export interface GenerateProductVariantsVariables {
  productId: string;
  defaultPrice?: number | null;
  defaultSku?: string | null;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateProductVariants
// ====================================================

export interface UpdateProductVariants_updateProductVariants_options {
  __typename: "ProductOption";
  id: string;
  code: string | null;
  languageCode: LanguageCode | null;
  name: string | null;
}

export interface UpdateProductVariants_updateProductVariants_facetValues {
  __typename: "FacetValue";
  id: string;
  code: string;
  name: string;
}

export interface UpdateProductVariants_updateProductVariants_translations {
  __typename: "ProductVariantTranslation";
  id: string;
  languageCode: LanguageCode;
  name: string;
}

export interface UpdateProductVariants_updateProductVariants {
  __typename: "ProductVariant";
  id: string;
  languageCode: LanguageCode;
  name: string;
  price: number;
  sku: string;
  image: string | null;
  options: UpdateProductVariants_updateProductVariants_options[];
  facetValues: UpdateProductVariants_updateProductVariants_facetValues[];
  translations: UpdateProductVariants_updateProductVariants_translations[];
}

export interface UpdateProductVariants {
  /**
   * Update existing ProductVariants
   */
  updateProductVariants: (UpdateProductVariants_updateProductVariants | null)[];
}

export interface UpdateProductVariantsVariables {
  input: UpdateProductVariantInput[];
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateProductOptionGroup
// ====================================================

export interface CreateProductOptionGroup_createProductOptionGroup_translations {
  __typename: "ProductOptionGroupTranslation";
  name: string;
}

export interface CreateProductOptionGroup_createProductOptionGroup_options_translations {
  __typename: "ProductOptionTranslation";
  name: string;
}

export interface CreateProductOptionGroup_createProductOptionGroup_options {
  __typename: "ProductOption";
  id: string;
  languageCode: LanguageCode | null;
  name: string | null;
  code: string | null;
  translations: CreateProductOptionGroup_createProductOptionGroup_options_translations[];
}

export interface CreateProductOptionGroup_createProductOptionGroup {
  __typename: "ProductOptionGroup";
  id: string;
  languageCode: LanguageCode;
  code: string;
  name: string;
  translations: CreateProductOptionGroup_createProductOptionGroup_translations[];
  options: CreateProductOptionGroup_createProductOptionGroup_options[];
}

export interface CreateProductOptionGroup {
  /**
   * Create a new ProductOptionGroup
   */
  createProductOptionGroup: CreateProductOptionGroup_createProductOptionGroup;
}

export interface CreateProductOptionGroupVariables {
  input: CreateProductOptionGroupInput;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddOptionGroupToProduct
// ====================================================

export interface AddOptionGroupToProduct_addOptionGroupToProduct_optionGroups_options {
  __typename: "ProductOption";
  id: string;
  code: string | null;
}

export interface AddOptionGroupToProduct_addOptionGroupToProduct_optionGroups {
  __typename: "ProductOptionGroup";
  id: string;
  code: string;
  options: AddOptionGroupToProduct_addOptionGroupToProduct_optionGroups_options[];
}

export interface AddOptionGroupToProduct_addOptionGroupToProduct {
  __typename: "Product";
  id: string;
  optionGroups: AddOptionGroupToProduct_addOptionGroupToProduct_optionGroups[];
}

export interface AddOptionGroupToProduct {
  /**
   * Add an OptionGroup to a Product
   */
  addOptionGroupToProduct: AddOptionGroupToProduct_addOptionGroupToProduct;
}

export interface AddOptionGroupToProductVariables {
  productId: string;
  optionGroupId: string;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RemoveOptionGroupFromProduct
// ====================================================

export interface RemoveOptionGroupFromProduct_removeOptionGroupFromProduct_optionGroups_options {
  __typename: "ProductOption";
  id: string;
  code: string | null;
}

export interface RemoveOptionGroupFromProduct_removeOptionGroupFromProduct_optionGroups {
  __typename: "ProductOptionGroup";
  id: string;
  code: string;
  options: RemoveOptionGroupFromProduct_removeOptionGroupFromProduct_optionGroups_options[];
}

export interface RemoveOptionGroupFromProduct_removeOptionGroupFromProduct {
  __typename: "Product";
  id: string;
  optionGroups: RemoveOptionGroupFromProduct_removeOptionGroupFromProduct_optionGroups[];
}

export interface RemoveOptionGroupFromProduct {
  /**
   * Remove an OptionGroup from a Product
   */
  removeOptionGroupFromProduct: RemoveOptionGroupFromProduct_removeOptionGroupFromProduct;
}

export interface RemoveOptionGroupFromProductVariables {
  productId: string;
  optionGroupId: string;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ApplyFacetValuesToProductVariants
// ====================================================

export interface ApplyFacetValuesToProductVariants_applyFacetValuesToProductVariants_options {
  __typename: "ProductOption";
  id: string;
  code: string | null;
  languageCode: LanguageCode | null;
  name: string | null;
}

export interface ApplyFacetValuesToProductVariants_applyFacetValuesToProductVariants_facetValues {
  __typename: "FacetValue";
  id: string;
  code: string;
  name: string;
}

export interface ApplyFacetValuesToProductVariants_applyFacetValuesToProductVariants_translations {
  __typename: "ProductVariantTranslation";
  id: string;
  languageCode: LanguageCode;
  name: string;
}

export interface ApplyFacetValuesToProductVariants_applyFacetValuesToProductVariants {
  __typename: "ProductVariant";
  id: string;
  languageCode: LanguageCode;
  name: string;
  price: number;
  sku: string;
  image: string | null;
  options: ApplyFacetValuesToProductVariants_applyFacetValuesToProductVariants_options[];
  facetValues: ApplyFacetValuesToProductVariants_applyFacetValuesToProductVariants_facetValues[];
  translations: ApplyFacetValuesToProductVariants_applyFacetValuesToProductVariants_translations[];
}

export interface ApplyFacetValuesToProductVariants {
  /**
   * Applies a FacetValue to the given ProductVariants
   */
  applyFacetValuesToProductVariants: ApplyFacetValuesToProductVariants_applyFacetValuesToProductVariants[];
}

export interface ApplyFacetValuesToProductVariantsVariables {
  facetValueIds: string[];
  productVariantIds: string[];
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetProductWithVariants
// ====================================================

export interface GetProductWithVariants_product_assets {
  __typename: "Asset";
  description: string | null;
  name: string;
  preview: string;
  type: AssetType;
}

export interface GetProductWithVariants_product_translations {
  __typename: "ProductTranslation";
  languageCode: LanguageCode;
  name: string;
  slug: string;
  description: string;
}

export interface GetProductWithVariants_product_optionGroups {
  __typename: "ProductOptionGroup";
  id: string;
  languageCode: LanguageCode;
  code: string;
  name: string;
}

export interface GetProductWithVariants_product_variants_options {
  __typename: "ProductOption";
  id: string;
  code: string | null;
  languageCode: LanguageCode | null;
  name: string | null;
}

export interface GetProductWithVariants_product_variants_facetValues {
  __typename: "FacetValue";
  id: string;
  code: string;
  name: string;
}

export interface GetProductWithVariants_product_variants_translations {
  __typename: "ProductVariantTranslation";
  id: string;
  languageCode: LanguageCode;
  name: string;
}

export interface GetProductWithVariants_product_variants {
  __typename: "ProductVariant";
  id: string;
  languageCode: LanguageCode;
  name: string;
  price: number;
  sku: string;
  image: string | null;
  options: GetProductWithVariants_product_variants_options[];
  facetValues: GetProductWithVariants_product_variants_facetValues[];
  translations: GetProductWithVariants_product_variants_translations[];
}

export interface GetProductWithVariants_product {
  __typename: "Product";
  id: string;
  languageCode: LanguageCode;
  name: string;
  slug: string;
  image: string;
  description: string;
  assets: GetProductWithVariants_product_assets[];
  translations: GetProductWithVariants_product_translations[];
  optionGroups: GetProductWithVariants_product_optionGroups[];
  variants: GetProductWithVariants_product_variants[];
}

export interface GetProductWithVariants {
  product: GetProductWithVariants_product | null;
}

export interface GetProductWithVariantsVariables {
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
  name: string;
  slug: string;
  description: string;
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
  options?: ProductListOptions | null;
  languageCode?: LanguageCode | null;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetProductOptionGroups
// ====================================================

export interface GetProductOptionGroups_productOptionGroups_options {
  __typename: "ProductOption";
  id: string;
  languageCode: LanguageCode | null;
  code: string | null;
  name: string | null;
}

export interface GetProductOptionGroups_productOptionGroups {
  __typename: "ProductOptionGroup";
  id: string;
  languageCode: LanguageCode;
  code: string;
  name: string;
  options: GetProductOptionGroups_productOptionGroups_options[];
}

export interface GetProductOptionGroups {
  productOptionGroups: GetProductOptionGroups_productOptionGroups[];
}

export interface GetProductOptionGroupsVariables {
  filterTerm?: string | null;
  languageCode?: LanguageCode | null;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAssetList
// ====================================================

export interface GetAssetList_assets_items {
  __typename: "Asset";
  id: string;
  name: string;
  mimetype: string;
  type: AssetType;
  preview: string;
  source: string;
}

export interface GetAssetList_assets {
  __typename: "AssetList";
  items: GetAssetList_assets_items[];
  totalItems: number;
}

export interface GetAssetList {
  assets: GetAssetList_assets;
}

export interface GetAssetListVariables {
  options?: AssetListOptions | null;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateAsset
// ====================================================

export interface CreateAsset_createAsset {
  __typename: "Asset";
  id: string;
  name: string;
  mimetype: string;
  type: AssetType;
  preview: string;
  source: string;
}

export interface CreateAsset {
  /**
   * Create a new Asset
   */
  createAsset: CreateAsset_createAsset;
}

export interface CreateAssetVariables {
  input: CreateAssetInput;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Administrator
// ====================================================

export interface Administrator_user_roles {
  __typename: "Role";
  code: string;
  description: string;
  permissions: Permission[];
}

export interface Administrator_user {
  __typename: "User";
  id: string;
  identifier: string;
  lastLogin: string | null;
  roles: Administrator_user_roles[];
}

export interface Administrator {
  __typename: "Administrator";
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  user: Administrator_user;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Role
// ====================================================

export interface Role_channels {
  __typename: "Channel";
  id: string;
  code: string;
  token: string;
}

export interface Role {
  __typename: "Role";
  id: string;
  code: string;
  description: string;
  permissions: Permission[];
  channels: Role_channels[];
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CurrentUser
// ====================================================

export interface CurrentUser {
  __typename: "CurrentUser";
  id: string;
  identifier: string;
  channelTokens: string[];
  roles: string[];
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FacetValue
// ====================================================

export interface FacetValue_translations {
  __typename: "FacetValueTranslation";
  id: string;
  languageCode: LanguageCode;
  name: string;
}

export interface FacetValue {
  __typename: "FacetValue";
  id: string;
  languageCode: LanguageCode | null;
  code: string;
  name: string;
  translations: FacetValue_translations[];
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FacetWithValues
// ====================================================

export interface FacetWithValues_translations {
  __typename: "FacetTranslation";
  id: string;
  languageCode: LanguageCode;
  name: string;
}

export interface FacetWithValues_values_translations {
  __typename: "FacetValueTranslation";
  id: string;
  languageCode: LanguageCode;
  name: string;
}

export interface FacetWithValues_values {
  __typename: "FacetValue";
  id: string;
  languageCode: LanguageCode | null;
  code: string;
  name: string;
  translations: FacetWithValues_values_translations[];
}

export interface FacetWithValues {
  __typename: "Facet";
  id: string;
  languageCode: LanguageCode;
  code: string;
  name: string;
  translations: FacetWithValues_translations[];
  values: FacetWithValues_values[];
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ProductVariant
// ====================================================

export interface ProductVariant_options {
  __typename: "ProductOption";
  id: string;
  code: string | null;
  languageCode: LanguageCode | null;
  name: string | null;
}

export interface ProductVariant_facetValues {
  __typename: "FacetValue";
  id: string;
  code: string;
  name: string;
}

export interface ProductVariant_translations {
  __typename: "ProductVariantTranslation";
  id: string;
  languageCode: LanguageCode;
  name: string;
}

export interface ProductVariant {
  __typename: "ProductVariant";
  id: string;
  languageCode: LanguageCode;
  name: string;
  price: number;
  sku: string;
  image: string | null;
  options: ProductVariant_options[];
  facetValues: ProductVariant_facetValues[];
  translations: ProductVariant_translations[];
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ProductWithVariants
// ====================================================

export interface ProductWithVariants_assets {
  __typename: "Asset";
  description: string | null;
  name: string;
  preview: string;
  type: AssetType;
}

export interface ProductWithVariants_translations {
  __typename: "ProductTranslation";
  languageCode: LanguageCode;
  name: string;
  slug: string;
  description: string;
}

export interface ProductWithVariants_optionGroups {
  __typename: "ProductOptionGroup";
  id: string;
  languageCode: LanguageCode;
  code: string;
  name: string;
}

export interface ProductWithVariants_variants_options {
  __typename: "ProductOption";
  id: string;
  code: string | null;
  languageCode: LanguageCode | null;
  name: string | null;
}

export interface ProductWithVariants_variants_facetValues {
  __typename: "FacetValue";
  id: string;
  code: string;
  name: string;
}

export interface ProductWithVariants_variants_translations {
  __typename: "ProductVariantTranslation";
  id: string;
  languageCode: LanguageCode;
  name: string;
}

export interface ProductWithVariants_variants {
  __typename: "ProductVariant";
  id: string;
  languageCode: LanguageCode;
  name: string;
  price: number;
  sku: string;
  image: string | null;
  options: ProductWithVariants_variants_options[];
  facetValues: ProductWithVariants_variants_facetValues[];
  translations: ProductWithVariants_variants_translations[];
}

export interface ProductWithVariants {
  __typename: "Product";
  id: string;
  languageCode: LanguageCode;
  name: string;
  slug: string;
  image: string;
  description: string;
  assets: ProductWithVariants_assets[];
  translations: ProductWithVariants_translations[];
  optionGroups: ProductWithVariants_optionGroups[];
  variants: ProductWithVariants_variants[];
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ProductOptionGroup
// ====================================================

export interface ProductOptionGroup_translations {
  __typename: "ProductOptionGroupTranslation";
  name: string;
}

export interface ProductOptionGroup_options_translations {
  __typename: "ProductOptionTranslation";
  name: string;
}

export interface ProductOptionGroup_options {
  __typename: "ProductOption";
  id: string;
  languageCode: LanguageCode | null;
  name: string | null;
  code: string | null;
  translations: ProductOptionGroup_options_translations[];
}

export interface ProductOptionGroup {
  __typename: "ProductOptionGroup";
  id: string;
  languageCode: LanguageCode;
  code: string;
  name: string;
  translations: ProductOptionGroup_translations[];
  options: ProductOptionGroup_options[];
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Asset
// ====================================================

export interface Asset {
  __typename: "Asset";
  id: string;
  name: string;
  mimetype: string;
  type: AssetType;
  preview: string;
  source: string;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum AssetType {
  BINARY = "BINARY",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
}

/**
 * ISO 639-1 language code
 */
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

/**
 *  Permissions for administrators 
 */
export enum Permission {
  Authenticated = "Authenticated",
  CreateAdministrator = "CreateAdministrator",
  CreateCatalog = "CreateCatalog",
  CreateCustomer = "CreateCustomer",
  CreateOrder = "CreateOrder",
  DeleteAdministrator = "DeleteAdministrator",
  DeleteCatalog = "DeleteCatalog",
  DeleteCustomer = "DeleteCustomer",
  DeleteOrder = "DeleteOrder",
  ReadAdministrator = "ReadAdministrator",
  ReadCatalog = "ReadCatalog",
  ReadCustomer = "ReadCustomer",
  ReadOrder = "ReadOrder",
  SuperAdmin = "SuperAdmin",
  UpdateAdministrator = "UpdateAdministrator",
  UpdateCatalog = "UpdateCatalog",
  UpdateCustomer = "UpdateCustomer",
  UpdateOrder = "UpdateOrder",
}

export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}

export interface AdministratorFilterParameter {
  firstName?: StringOperators | null;
  lastName?: StringOperators | null;
  emailAddress?: StringOperators | null;
  createdAt?: DateOperators | null;
  updatedAt?: DateOperators | null;
}

export interface AdministratorListOptions {
  take?: number | null;
  skip?: number | null;
  sort?: AdministratorSortParameter | null;
  filter?: AdministratorFilterParameter | null;
}

export interface AdministratorSortParameter {
  id?: SortOrder | null;
  createdAt?: SortOrder | null;
  updatedAt?: SortOrder | null;
  firstName?: SortOrder | null;
  lastName?: SortOrder | null;
  emailAddress?: SortOrder | null;
}

export interface AssetFilterParameter {
  name?: StringOperators | null;
  description?: StringOperators | null;
  type?: StringOperators | null;
  createdAt?: DateOperators | null;
  updatedAt?: DateOperators | null;
}

export interface AssetListOptions {
  take?: number | null;
  skip?: number | null;
  sort?: AssetSortParameter | null;
  filter?: AssetFilterParameter | null;
}

export interface AssetSortParameter {
  id?: SortOrder | null;
  createdAt?: SortOrder | null;
  updatedAt?: SortOrder | null;
  name?: SortOrder | null;
  description?: SortOrder | null;
}

export interface BooleanOperators {
  eq?: boolean | null;
}

export interface CreateAdministratorInput {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
  roleIds: string[];
}

export interface CreateAssetInput {
  file: any;
}

export interface CreateFacetCustomFieldsInput {
  searchable?: boolean | null;
}

export interface CreateFacetInput {
  code: string;
  translations: FacetTranslationInput[];
  values?: CreateFacetValueWithFacetInput[] | null;
  customFields?: CreateFacetCustomFieldsInput | null;
}

export interface CreateFacetValueCustomFieldsInput {
  link?: string | null;
  available?: boolean | null;
}

export interface CreateFacetValueInput {
  facetId: string;
  code: string;
  translations: FacetValueTranslationInput[];
  customFields?: CreateFacetValueCustomFieldsInput | null;
}

export interface CreateFacetValueWithFacetInput {
  code: string;
  translations: FacetValueTranslationInput[];
}

export interface CreateProductCustomFieldsInput {
  infoUrl?: string | null;
  downloadable?: boolean | null;
}

export interface CreateProductInput {
  image?: string | null;
  translations: ProductTranslationInput[];
  optionGroupCodes?: string[] | null;
  customFields?: CreateProductCustomFieldsInput | null;
}

export interface CreateProductOptionGroupInput {
  code: string;
  translations: ProductOptionGroupTranslationInput[];
  options: CreateProductOptionInput[];
  customFields?: any | null;
}

export interface CreateProductOptionInput {
  code: string;
  translations: ProductOptionGroupTranslationInput[];
  customFields?: any | null;
}

export interface CreateRoleInput {
  code: string;
  description: string;
  permissions: Permission[];
}

export interface DateOperators {
  eq?: any | null;
  before?: any | null;
  after?: any | null;
  between?: DateRange | null;
}

export interface DateRange {
  start: any;
  end: any;
}

export interface FacetFilterParameter {
  name?: StringOperators | null;
  code?: StringOperators | null;
  createdAt?: DateOperators | null;
  updatedAt?: DateOperators | null;
  searchable?: BooleanOperators | null;
}

export interface FacetListOptions {
  take?: number | null;
  skip?: number | null;
  sort?: FacetSortParameter | null;
  filter?: FacetFilterParameter | null;
}

export interface FacetSortParameter {
  id?: SortOrder | null;
  createdAt?: SortOrder | null;
  updatedAt?: SortOrder | null;
  name?: SortOrder | null;
  code?: SortOrder | null;
  searchable?: SortOrder | null;
}

export interface FacetTranslationInput {
  id?: string | null;
  languageCode: LanguageCode;
  name: string;
  customFields?: any | null;
}

export interface FacetValueTranslationInput {
  id?: string | null;
  languageCode: LanguageCode;
  name: string;
  customFields?: any | null;
}

export interface ProductFilterParameter {
  name?: StringOperators | null;
  slug?: StringOperators | null;
  description?: StringOperators | null;
  createdAt?: DateOperators | null;
  updatedAt?: DateOperators | null;
  infoUrl?: StringOperators | null;
  downloadable?: BooleanOperators | null;
  nickname?: StringOperators | null;
}

export interface ProductListOptions {
  take?: number | null;
  skip?: number | null;
  sort?: ProductSortParameter | null;
  filter?: ProductFilterParameter | null;
}

export interface ProductOptionGroupTranslationInput {
  id?: string | null;
  languageCode: LanguageCode;
  name: string;
  customFields?: any | null;
}

export interface ProductSortParameter {
  id?: SortOrder | null;
  createdAt?: SortOrder | null;
  updatedAt?: SortOrder | null;
  name?: SortOrder | null;
  slug?: SortOrder | null;
  description?: SortOrder | null;
  image?: SortOrder | null;
  infoUrl?: SortOrder | null;
  downloadable?: SortOrder | null;
  nickname?: SortOrder | null;
}

export interface ProductTranslationCustomFieldsInput {
  nickname?: string | null;
}

export interface ProductTranslationInput {
  id?: string | null;
  languageCode: LanguageCode;
  name: string;
  slug: string;
  description: string;
  customFields?: ProductTranslationCustomFieldsInput | null;
}

export interface ProductVariantTranslationInput {
  id?: string | null;
  languageCode: LanguageCode;
  name: string;
  customFields?: any | null;
}

export interface RoleFilterParameter {
  code?: StringOperators | null;
  description?: StringOperators | null;
  createdAt?: DateOperators | null;
  updatedAt?: DateOperators | null;
}

export interface RoleListOptions {
  take?: number | null;
  skip?: number | null;
  sort?: RoleSortParameter | null;
  filter?: RoleFilterParameter | null;
}

export interface RoleSortParameter {
  id?: SortOrder | null;
  createdAt?: SortOrder | null;
  updatedAt?: SortOrder | null;
  code?: SortOrder | null;
  description?: SortOrder | null;
}

export interface StringOperators {
  eq?: string | null;
  contains?: string | null;
}

export interface UpdateAdministratorInput {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  password?: string | null;
  roleIds: string[];
}

export interface UpdateFacetCustomFieldsInput {
  searchable?: boolean | null;
}

export interface UpdateFacetInput {
  id: string;
  code: string;
  translations: FacetTranslationInput[];
  customFields?: UpdateFacetCustomFieldsInput | null;
}

export interface UpdateFacetValueCustomFieldsInput {
  link?: string | null;
  available?: boolean | null;
}

export interface UpdateFacetValueInput {
  id: string;
  code: string;
  translations: FacetValueTranslationInput[];
  customFields?: UpdateFacetValueCustomFieldsInput | null;
}

export interface UpdateProductCustomFieldsInput {
  infoUrl?: string | null;
  downloadable?: boolean | null;
}

export interface UpdateProductInput {
  id: string;
  image?: string | null;
  translations: ProductTranslationInput[];
  optionGroupCodes?: string[] | null;
  customFields?: UpdateProductCustomFieldsInput | null;
}

export interface UpdateProductVariantInput {
  id: string;
  translations: ProductVariantTranslationInput[];
  sku: string;
  image?: string | null;
  price: number;
  customFields?: any | null;
}

export interface UpdateRoleInput {
  id: string;
  code: string;
  description: string;
  permissions: Permission[];
}

//==============================================================
// END Enums and Input Objects
//==============================================================
