/**
 * All possible authorization roles for registered users.
 */
export enum Role {
    // The Authenticated role means simply that the user is logged in
    Authenticated = 'Authenticated',
    Customer = 'Customer',
    Superadmin = 'Superadmin'
}
