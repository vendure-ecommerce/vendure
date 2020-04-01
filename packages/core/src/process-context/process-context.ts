import { Injectable } from '@nestjs/common';

/**
 * @description
 * The ProcessContext can be injected into your providers in order to know whether that provider
 * is being executed in the context of the main Vendure server or the worker.
 *
 * @docsCategory common
 */
@Injectable()
export class ProcessContext {
    protected _isServer: boolean;

    get isServer(): boolean {
        return this._isServer;
    }
    get isWorker(): boolean {
        return !this._isServer;
    }
}

@Injectable()
export class ServerProcessContext extends ProcessContext {
    protected _isServer = true;
}

@Injectable()
export class WorkerProcessContext extends ProcessContext {
    protected _isServer = false;
}
