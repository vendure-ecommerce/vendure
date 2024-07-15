import { LanguageCode } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { Subscription } from 'rxjs';

import { TtlCache } from '../../../common/ttl-cache';
import { idsAreEqual } from '../../../common/utils';
import { EventBus } from '../../../event-bus/event-bus';
import { CustomerGroupChangeEvent } from '../../../event-bus/events/customer-group-change-event';
import { PromotionCondition } from '../promotion-condition';

let customerService: import('../../../service/services/customer.service').CustomerService;
let subscription: Subscription | undefined;

const fiveMinutes = 5 * 60 * 1000;
const cache = new TtlCache<ID, ID[]>({ ttl: fiveMinutes });

export const customerGroup = new PromotionCondition({
    code: 'customer_group',
    description: [{ languageCode: LanguageCode.en, value: 'Customer is a member of the specified group' }],
    args: {
        customerGroupId: {
            type: 'ID',
            ui: { component: 'customer-group-form-input' },
            label: [{ languageCode: LanguageCode.en, value: 'Customer group' }],
        },
    },
    async init(injector) {
        // Lazily-imported to avoid circular dependency issues.
        const { CustomerService } = await import('../../../service/services/customer.service.js');
        customerService = injector.get(CustomerService);
        subscription = injector
            .get(EventBus)
            .ofType(CustomerGroupChangeEvent)
            .subscribe(event => {
                // When a customer is added to or removed from a group, we need
                // to invalidate the cache for that customer id
                for (const customer of event.customers) {
                    cache.delete(customer.id);
                }
            });
    },
    destroy() {
        subscription?.unsubscribe();
    },
    async check(ctx, order, args) {
        if (!order.customer) {
            return false;
        }
        const customerId = order.customer.id;
        let groupIds = cache.get(customerId);
        if (!groupIds) {
            const groups = await customerService.getCustomerGroups(ctx, customerId);
            groupIds = groups.map(g => g.id);
            cache.set(customerId, groupIds);
        }
        return !!groupIds.find(id => idsAreEqual(id, args.customerGroupId));
    },
});
