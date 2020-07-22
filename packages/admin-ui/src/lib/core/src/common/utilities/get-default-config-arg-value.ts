import { ConfigArgType } from '@vendure/common/lib/shared-types';
import { assertNever } from '@vendure/common/lib/shared-utils';

export function getDefaultConfigArgValue(type: ConfigArgType): any {
    switch (type) {
        case 'boolean':
            return false;
        case 'int':
        case 'float':
            return '0';
        case 'ID':
            return '';
        case 'string':
            return '';
        case 'datetime':
            return new Date();
        default:
            assertNever(type);
    }
}
