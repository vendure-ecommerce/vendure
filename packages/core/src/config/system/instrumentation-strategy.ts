import { Type } from '../../common/types/common-types';
import { InjectableStrategy } from '../../common/types/injectable-strategy';

export interface WrappedMethodArgs {
    target: Type<any>;
    methodName: string;
    args: any[];
    applyOriginalFunction: () => any | Promise<any>;
}

export interface InstrumentationStrategy extends InjectableStrategy {
    wrapMethod(args: WrappedMethodArgs): any;
}
