import { Permission } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/index';
import { ConfigArgs, ConfigArgValues } from '../../common/configurable-operation';
import { InjectableStrategy } from '../../common/index';
import { VendureEntity } from '../../entity/index';

export type InputArgValues<Strategy extends EntityDuplicationStrategy> = ConfigArgValues<
    ReturnType<Strategy['defineInputArgs']>
>;

export interface EntityDuplicationStrategy extends InjectableStrategy {
    readonly requiresPermission: Array<Permission | string> | Permission | string;
    readonly canDuplicateEntities: string[];
    defineInputArgs(): ConfigArgs;
    duplicate(input: {
        ctx: RequestContext;
        entityName: string;
        id: ID;
        args: InputArgValues<EntityDuplicationStrategy>;
    }): Promise<VendureEntity>;
}
