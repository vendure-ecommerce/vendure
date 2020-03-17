import { ConfigArgType } from '@vendure/common/lib/shared-types';
import { assertNever } from '@vendure/common/lib/shared-utils';

import { ConfigArg, ConfigArgDefinition } from '../generated-types';

export function getDefaultConfigArgValue(arg: ConfigArg | ConfigArgDefinition): any {
    const type = arg.type as ConfigArgType;
    switch (type) {
        case 'boolean':
            return false;
        case 'int':
        case 'float':
            return '0';
        case 'facetValueIds':
            return [];
        case 'string':
            return '';
        case 'datetime':
            return new Date();
        default:
            assertNever(type);
    }
}
