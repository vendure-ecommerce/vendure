import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
    PluginCommonModule,
    ProcessContext,
    VendurePlugin,
    WorkerMessage,
    WorkerService,
} from '@vendure/core';
import { of } from 'rxjs';

class TestWorkerMessage extends WorkerMessage<string, boolean> {
    static readonly pattern = 'TestWorkerMessage';
}

@Controller('process-context')
export class TestProcessContextController {
    constructor(private processContext: ProcessContext, private workerService: WorkerService) {}

    @Get('server')
    isServer() {
        return this.processContext.isServer;
    }

    @Get('worker')
    isWorker() {
        return this.workerService.send(new TestWorkerMessage('hello'));
    }
}

@Controller()
export class TestProcessContextWorkerController {
    constructor(private processContext: ProcessContext) {}

    @MessagePattern(TestWorkerMessage.pattern)
    isWorker() {
        return of(this.processContext.isWorker);
    }
}

@VendurePlugin({
    imports: [PluginCommonModule],
    controllers: [TestProcessContextController],
    workers: [TestProcessContextWorkerController],
})
export class TestProcessContextPlugin {}
