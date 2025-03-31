import { CUSTOMER_ROLE_CODE, SUPER_ADMIN_ROLE_CODE } from '@/constants.js';
import { Trans } from '@/lib/trans.js';

export function RoleCodeLabel({ code }: { code: string } | { code: undefined }) {
    return code === SUPER_ADMIN_ROLE_CODE ? <Trans>Super Admin</Trans> : 
    code === CUSTOMER_ROLE_CODE ? <Trans>Customer</Trans> : code;
}

