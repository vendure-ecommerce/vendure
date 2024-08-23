import { ConfigArgs, ConfigurableOperationDef } from '@vendure/core/src/common/configurable-operation';

export class EmailEventConfigurableOperationDef<
    T extends ConfigArgs = ConfigArgs,
> extends ConfigurableOperationDef<T> {}
