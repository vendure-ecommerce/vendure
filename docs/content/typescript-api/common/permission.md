---
title: "Permission"
weight: 10
date: 2023-07-04T11:02:13.609Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Permission
<div class="symbol">


# Permission

{{< generation-info sourceFile="packages/common/src/generated-types.ts" sourceLine="4197" packageName="@vendure/common">}}

Permissions for administrators and customers. Used to control access to
GraphQL resolvers via the <a href='/typescript-api/request/allow-decorator#allow'>Allow</a> decorator.

## Understanding Permission.Owner

`Permission.Owner` is a special permission which is used in some Vendure resolvers to indicate that that resolver should only
be accessible to the "owner" of that resource.

For example, the Shop API `activeCustomer` query resolver should only return the Customer object for the "owner" of that Customer, i.e.
based on the activeUserId of the current session. As a result, the resolver code looks like this:

*Example*

```TypeScript
@Query()
@Allow(Permission.Owner)
async activeCustomer(@Ctx() ctx: RequestContext): Promise<Customer | undefined> {
  const userId = ctx.activeUserId;
  if (userId) {
    return this.customerService.findOneByUserId(ctx, userId);
  }
}
```

Here we can see that the "ownership" must be enforced by custom logic inside the resolver. Since "ownership" cannot be defined generally
nor statically encoded at build-time, any resolvers using `Permission.Owner` **must** include logic to enforce that only the owner
of the resource has access. If not, then it is the equivalent of using `Permission.Public`.

## Signature

```TypeScript
enum Permission {
  Authenticated = 'Authenticated'
  CreateAdministrator = 'CreateAdministrator'
  CreateAsset = 'CreateAsset'
  CreateCatalog = 'CreateCatalog'
  CreateChannel = 'CreateChannel'
  CreateCollection = 'CreateCollection'
  CreateCountry = 'CreateCountry'
  CreateCustomer = 'CreateCustomer'
  CreateCustomerGroup = 'CreateCustomerGroup'
  CreateFacet = 'CreateFacet'
  CreateOrder = 'CreateOrder'
  CreatePaymentMethod = 'CreatePaymentMethod'
  CreateProduct = 'CreateProduct'
  CreatePromotion = 'CreatePromotion'
  CreateSeller = 'CreateSeller'
  CreateSettings = 'CreateSettings'
  CreateShippingMethod = 'CreateShippingMethod'
  CreateStockLocation = 'CreateStockLocation'
  CreateSystem = 'CreateSystem'
  CreateTag = 'CreateTag'
  CreateTaxCategory = 'CreateTaxCategory'
  CreateTaxRate = 'CreateTaxRate'
  CreateZone = 'CreateZone'
  DeleteAdministrator = 'DeleteAdministrator'
  DeleteAsset = 'DeleteAsset'
  DeleteCatalog = 'DeleteCatalog'
  DeleteChannel = 'DeleteChannel'
  DeleteCollection = 'DeleteCollection'
  DeleteCountry = 'DeleteCountry'
  DeleteCustomer = 'DeleteCustomer'
  DeleteCustomerGroup = 'DeleteCustomerGroup'
  DeleteFacet = 'DeleteFacet'
  DeleteOrder = 'DeleteOrder'
  DeletePaymentMethod = 'DeletePaymentMethod'
  DeleteProduct = 'DeleteProduct'
  DeletePromotion = 'DeletePromotion'
  DeleteSeller = 'DeleteSeller'
  DeleteSettings = 'DeleteSettings'
  DeleteShippingMethod = 'DeleteShippingMethod'
  DeleteStockLocation = 'DeleteStockLocation'
  DeleteSystem = 'DeleteSystem'
  DeleteTag = 'DeleteTag'
  DeleteTaxCategory = 'DeleteTaxCategory'
  DeleteTaxRate = 'DeleteTaxRate'
  DeleteZone = 'DeleteZone'
  Owner = 'Owner'
  Public = 'Public'
  ReadAdministrator = 'ReadAdministrator'
  ReadAsset = 'ReadAsset'
  ReadCatalog = 'ReadCatalog'
  ReadChannel = 'ReadChannel'
  ReadCollection = 'ReadCollection'
  ReadCountry = 'ReadCountry'
  ReadCustomer = 'ReadCustomer'
  ReadCustomerGroup = 'ReadCustomerGroup'
  ReadFacet = 'ReadFacet'
  ReadOrder = 'ReadOrder'
  ReadPaymentMethod = 'ReadPaymentMethod'
  ReadProduct = 'ReadProduct'
  ReadPromotion = 'ReadPromotion'
  ReadSeller = 'ReadSeller'
  ReadSettings = 'ReadSettings'
  ReadShippingMethod = 'ReadShippingMethod'
  ReadStockLocation = 'ReadStockLocation'
  ReadSystem = 'ReadSystem'
  ReadTag = 'ReadTag'
  ReadTaxCategory = 'ReadTaxCategory'
  ReadTaxRate = 'ReadTaxRate'
  ReadZone = 'ReadZone'
  SuperAdmin = 'SuperAdmin'
  UpdateAdministrator = 'UpdateAdministrator'
  UpdateAsset = 'UpdateAsset'
  UpdateCatalog = 'UpdateCatalog'
  UpdateChannel = 'UpdateChannel'
  UpdateCollection = 'UpdateCollection'
  UpdateCountry = 'UpdateCountry'
  UpdateCustomer = 'UpdateCustomer'
  UpdateCustomerGroup = 'UpdateCustomerGroup'
  UpdateFacet = 'UpdateFacet'
  UpdateGlobalSettings = 'UpdateGlobalSettings'
  UpdateOrder = 'UpdateOrder'
  UpdatePaymentMethod = 'UpdatePaymentMethod'
  UpdateProduct = 'UpdateProduct'
  UpdatePromotion = 'UpdatePromotion'
  UpdateSeller = 'UpdateSeller'
  UpdateSettings = 'UpdateSettings'
  UpdateShippingMethod = 'UpdateShippingMethod'
  UpdateStockLocation = 'UpdateStockLocation'
  UpdateSystem = 'UpdateSystem'
  UpdateTag = 'UpdateTag'
  UpdateTaxCategory = 'UpdateTaxCategory'
  UpdateTaxRate = 'UpdateTaxRate'
  UpdateZone = 'UpdateZone'
}
```
</div>
