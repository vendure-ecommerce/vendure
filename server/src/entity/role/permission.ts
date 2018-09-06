/**
 * Permissions for administrators.
 */
export enum Permission {
    // The Authenticated role means simply that the user is logged in
    Authenticated = 'Authenticated',
    // CRUD permissions on the various classes of entity
    CreateCatalog = 'CreateCatalog',
    ReadCatalog = 'ReadCatalog',
    UpdateCatalog = 'UpdateCatalog',
    DeleteCatalog = 'DeleteCatalog',
    CreateCustomer = 'CreateCustomer',
    ReadCustomer = 'ReadCustomer',
    UpdateCustomer = 'UpdateCustomer',
    DeleteCustomer = 'DeleteCustomer',
    CreateOrder = 'CreateOrder',
    ReadOrder = 'ReadOrder',
    UpdateOrder = 'UpdateOrder',
    DeleteOrder = 'DeleteOrder',
}
