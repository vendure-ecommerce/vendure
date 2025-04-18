import { PluginCommonModule, VendurePlugin } from '@vendure/core';

import { TraceService } from './tracing/trace.service';
import { TracingPluginOptions } from './types';

@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [TraceService],
    exports: [TraceService],
})
export class TracingPlugin {
    static options: TracingPluginOptions;

    static init(options: TracingPluginOptions) {
        this.options = options;
    }
}
