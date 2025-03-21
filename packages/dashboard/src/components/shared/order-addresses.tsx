import { FC } from 'react';
import { AddressDisplay } from './address-display';
import type { OrderAddress } from '@/graphql/types';

interface OrderAddressesProps {
  shippingAddress?: OrderAddress | null;
  billingAddress?: OrderAddress | null;
  customerName?: string;
  showBothAddresses?: boolean;
}

export const OrderAddresses: FC<OrderAddressesProps> = ({
  shippingAddress,
  billingAddress,
  customerName,
  showBothAddresses = true,
}) => {
  const title = customerName ? `${customerName}'s Address` : undefined;

  return (
    <AddressDisplay
      shippingAddress={shippingAddress || undefined}
      billingAddress={billingAddress || undefined}
      showBothAddresses={showBothAddresses}
      title={title}
    />
  );
};

// Example usage with the GraphQL fragment
/*
import { orderDetailDocument } from '@/routes/_authenticated/_orders/orders.graphql';

const OrderDetails: FC<{ orderId: string }> = ({ orderId }) => {
  const { data } = useSuspenseQuery(orderDetailDocument, { variables: { id: orderId } });
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Order {data.order.code}</h2>
      
      <div className="my-6">
        <h3 className="text-lg font-medium mb-3">Addresses</h3>
        <OrderAddresses
          shippingAddress={data.order.shippingAddress}
          billingAddress={data.order.billingAddress}
          customerName={`${data.order.customer.firstName} ${data.order.customer.lastName}`}
        />
      </div>
      
      {/* Other order details *//*}
    </div>
  );
};
*/

export default OrderAddresses; 