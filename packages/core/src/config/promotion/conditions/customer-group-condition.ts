import { LanguageCode } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../../api/common/request-context';
import { TtlCache } from '../../../common/ttl-cache';
import { idsAreEqual } from '../../../common/utils';
import { Order } from '../../../entity/order/order.entity';
import { PromotionCondition } from '../promotion-condition';

let customerService: import('../../../service/services/customer.service').CustomerService;

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
        const { CustomerService } = await import('../../../service/services/customer.service');
        customerService = injector.get(CustomerService);
    },
    async check(ctx: RequestContext, order: Order, args) {
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
        return !!groupIds.find((id) => idsAreEqual(id, args.customerGroupId));
    },
});
