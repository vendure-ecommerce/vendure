import { DynamicModule, Global, Module } from '@nestjs/common';

import { ProcessContext, ServerProcessContext, WorkerProcessContext } from './process-context';

@Global()
@Module({})
export class ProcessContextModule {
    static forRoot(): DynamicModule {
        return {
            module: ProcessContextModule,
            providers: [{ provide: ProcessContext, useClass: ServerProcessContext }],
            exports: [ProcessContext],
        };
    }
    static forWorker(): DynamicModule {
        return {
            module: ProcessContextModule,
            providers: [{ provide: ProcessContext, useClass: WorkerProcessContext }],
            exports: [ProcessContext],
        };
    }
}
