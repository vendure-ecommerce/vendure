import { OnApplicationBootstrap } from '@nestjs/common';
import { Type } from '@vendure/common/lib/shared-types';
export declare class FioBankPlugin implements OnApplicationBootstrap {
    private static options;
    /** @internal */
    constructor();
    static init(): Type<FioBankPlugin>;
    /** @internal */
    onApplicationBootstrap(): void | Promise<void>;
}
