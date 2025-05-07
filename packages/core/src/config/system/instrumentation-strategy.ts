import { Type } from '@vendure/common/lib/shared-types';

import { InjectableStrategy } from '../../common/types/injectable-strategy';

export interface WrappedMethodArgs {
    instance: any;
    target: Type<any>;
    methodName: string;
    args: any[];
    applyOriginalFunction: () => any | Promise<any>;
}

export interface InstrumentationStrategy extends InjectableStrategy {
    wrapMethod(args: WrappedMethodArgs): any;
}
