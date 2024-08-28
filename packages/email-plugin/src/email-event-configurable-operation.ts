import {
    ConfigArgs,
    ConfigArgValues,
    ConfigurableOperationDef,
} from '@vendure/core/dist/common/configurable-operation';
import { ConfigArg } from 'dev-server/test-plugins/reviews/ui/generated-types';

import { EmailEventHandler } from './handler/event-handler';

export class EmailEventConfigurableOperationDef<
    T extends ConfigArgs = ConfigArgs,
> extends ConfigurableOperationDef<T> {
    argsArrayToHash(args: ConfigArg[]): ConfigArgValues<T> {
        return super.argsArrayToHash(args);
    }
}

export class ConfigurableEmailEventHandler {
    _configurableOperationDef?: EmailEventConfigurableOperationDef;

    constructor(protected handler: EmailEventHandler) {
        if (handler.resendOptions && handler.resendOptions.operationDefinitions) {
            this._configurableOperationDef = new EmailEventConfigurableOperationDef(
                handler.resendOptions.operationDefinitions,
            );
        }
    }

    get configurableOperationDef(): EmailEventConfigurableOperationDef | undefined {
        return this._configurableOperationDef;
    }

    argsArrayToHash(args: ConfigArg[]) {
        return this.configurableOperationDef?.argsArrayToHash(args) ?? {};
    }
}
