import { ID } from '@vendure/common/lib/shared-types';
import { ChildProcess } from 'child_process';
import { ConnectionOptions } from 'typeorm';

import { RequestContext } from '../../../api/common/request-context';
import { ProductVariant } from '../../../entity/product-variant/product-variant.entity';

import { IndexBuilder } from './index-builder';

export enum MessageType {
    CONNECTION_OPTIONS,
    CONNECTED,
    GET_RAW_BATCH,
    GET_RAW_BATCH_BY_IDS,
    RETURN_RAW_BATCH,
    SAVE_VARIANTS,
    VARIANTS_SAVED,
    COMPLETED,
}

export interface SaveVariantsPayload {
    variants: ProductVariant[];
    ctx: RequestContext;
    batch: number;
    total: number;
}

export interface IPCMessage {
    type: MessageType;
    value: any;
    channelId: string;
}

export class ConnectionOptionsMessage implements IPCMessage {
    readonly type = MessageType.CONNECTION_OPTIONS;
    channelId: string;
    constructor(public value: ConnectionOptions) {}
}

export class ConnectedMessage implements IPCMessage {
    readonly type = MessageType.CONNECTED;
    channelId: string;
    constructor(public value: boolean) {}
}

export class GetRawBatchMessage implements IPCMessage {
    readonly type = MessageType.GET_RAW_BATCH;
    channelId: string;
    constructor(public value: { batchNumber: number; }) {}
}

export class GetRawBatchByIdsMessage implements IPCMessage {
    readonly type = MessageType.GET_RAW_BATCH_BY_IDS;
    channelId: string;
    constructor(public value: { ids: ID[]; }) {}
}

export class ReturnRawBatchMessage implements IPCMessage {
    readonly type = MessageType.RETURN_RAW_BATCH;
    channelId: string;
    constructor(public value: { variants: ProductVariant[]; }) {}
}

export class SaveVariantsMessage implements IPCMessage {
    readonly type = MessageType.SAVE_VARIANTS;
    channelId: string;
    constructor(public value: SaveVariantsPayload) {}
}

export class VariantsSavedMessage implements IPCMessage {
    readonly type = MessageType.VARIANTS_SAVED;
    channelId: string;
    constructor(public value: { batchNumber: number; }) {}
}

export class CompletedMessage implements IPCMessage {
    readonly type = MessageType.COMPLETED;
    channelId: string;
    constructor(public value: boolean) {}
}

export type Message = ConnectionOptionsMessage |
    ConnectedMessage |
    GetRawBatchMessage |
    GetRawBatchByIdsMessage |
    ReturnRawBatchMessage |
    SaveVariantsMessage |
    VariantsSavedMessage |
    CompletedMessage;

export type MessageOfType<T extends MessageType> = Extract<Message, { type: T }>;

export function sendIPCMessage(target: NodeJS.Process | ChildProcess, message: Message) {
    // tslint:disable-next-line:no-non-null-assertion
    target.send!(JSON.stringify(message));
}

/**
 * An IpcChannel allows safe communication between main thread and worker. It achieves
 * this by adding a unique ID to each outgoing message, which the worker then adds
 * to any responses.
 *
 * If the `target` is an instance of IndexBuilder running on the main process (not in
 * a worker thread), then the channel interacts directly with it, whilst keeping the
 * differences abstracted away from the consuming code.
 */
export class IpcChannel {
    private readonly channelId = Math.random().toString(32);
    private handlers: Array<(m: string) => void> = [];
    constructor(private readonly target: NodeJS.Process | ChildProcess | IndexBuilder) {}

    /**
     * Send a message to the worker process.
     */
    send(message: Message) {
        message.channelId = this.channelId;
        if (this.target instanceof IndexBuilder) {
            this.target.processMessageAndEmitResult(message);
        } else {
            sendIPCMessage(this.target, message);
        }
    }

    /**
     * Subscribes to the given IPC message which is sent from the worker in response to a message
     * send with the `send()` method.
     */
    subscribe<T extends MessageType>(messageType: T, callback: (message: MessageOfType<T>) => void): void {
        const handler = (messageString: string) => {
            const message = JSON.parse(messageString) as Message;
            if (message.type === messageType && message.channelId === this.channelId) {
                callback(message as MessageOfType<T>);
            }
        };
        if (this.target instanceof IndexBuilder) {
            this.target.addMessageListener(handler);
        } else {
            this.target.on('message', handler);
        }
        this.handlers.push(handler);
    }

    /**
     * Clean up all event listeners created by subscriptions.
     */
    close() {
        const target = this.target;
        if (target instanceof IndexBuilder) {
            this.handlers.forEach(handler => target.removeMessageListener(handler));
        } else {
            this.handlers.forEach(handler => target.off('message', handler));
        }
    }
}
