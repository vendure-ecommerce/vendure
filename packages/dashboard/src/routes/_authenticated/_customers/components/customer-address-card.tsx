import { ResultOf } from "@/graphql/graphql.js";

import { addressFragment } from "../customers.graphql.js";
import { DialogContent, Dialog, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog.js";
import { Trans } from "@lingui/react/macro";
import { CustomerAddressForm } from "./customer-address-form.js";
import { EditIcon, TrashIcon } from "lucide-react";

export function CustomerAddressCard({ 
  address, 
  editable = false,
  deletable = false
}: { 
  address: ResultOf<typeof addressFragment>
  editable?: boolean
  deletable?: boolean
}) {
  return (
    <div className="border border-border rounded-md p-4 relative">
      {(address.defaultShippingAddress || address.defaultBillingAddress) && (
        <div className="absolute top-2 right-2 flex gap-1">
          {address.defaultShippingAddress && (
            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md">Default Shipping</span>
          )}
          {address.defaultBillingAddress && (
            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md">Default Billing</span>
          )}
        </div>
      )}
      
      <div className="flex flex-col gap-1">
        <div className="font-semibold">{address.fullName}</div>
        {address.company && <div>{address.company}</div>}
        <div>{address.streetLine1}</div>
        {address.streetLine2 && <div>{address.streetLine2}</div>}
        <div>
          {address.city}
          {address.province && `, ${address.province}`}
          {address.postalCode && ` ${address.postalCode}`}
        </div>
        <div>{address.country.name}</div>
        {address.phoneNumber && <div>{address.phoneNumber}</div>}
      </div>

      {(editable || deletable) && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-border">
          {editable && (
            <Dialog>
            <DialogTrigger>
                <EditIcon className="w-4 h-4"/>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Address</DialogTitle>
                <DialogDescription>
                  <Trans>Edit the address details below.</Trans>
                </DialogDescription>
              </DialogHeader>
              <CustomerAddressForm address={address} />
            </DialogContent>
          </Dialog>
          )}
          {deletable && (
            <button 
              onClick={() => {}}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              <TrashIcon className="w-4 h-4 text-destructive"/>
            </button>
          )}
        </div>
      )}
    </div>
  );
}