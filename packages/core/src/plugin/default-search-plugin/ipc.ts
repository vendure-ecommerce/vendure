import { ChildProcess } from 'child_process';
import { ConnectionOptions } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';

export enum MessageType {
    CONNECTION_OPTIONS,
    CONNECTED,
    GET_RAW_BATCH,
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
}

export class ConnectionOptionsMessage implements IPCMessage {
    readonly type = MessageType.CONNECTION_OPTIONS;
    constructor(public value: ConnectionOptions) {}
}

export class ConnectedMessage implements IPCMessage {
    readonly type = MessageType.CONNECTED;
    constructor(public value: boolean) {}
}

export class GetRawBatchMessage implements IPCMessage {
    readonly type = MessageType.GET_RAW_BATCH;
    constructor(public value: { batchNumber: number; }) {}
}

export class ReturnRawBatchMessage implements IPCMessage {
    readonly type = MessageType.RETURN_RAW_BATCH;
    constructor(public value: { variants: ProductVariant[]; }) {}
}

export class SaveVariantsMessage implements IPCMessage {
    readonly type = MessageType.SAVE_VARIANTS;
    constructor(public value: SaveVariantsPayload) {}
}

export class VariantsSavedMessage implements IPCMessage {
    readonly type = MessageType.VARIANTS_SAVED;
    constructor(public value: { batchNumber: number; }) {}
}

export class CompletedMessage implements IPCMessage {
    readonly type = MessageType.COMPLETED;
    constructor(public value: boolean) {}
}

export type Message = ConnectionOptionsMessage |
    ConnectedMessage |
    GetRawBatchMessage |
    ReturnRawBatchMessage |
    SaveVariantsMessage |
    VariantsSavedMessage |
    CompletedMessage;

export type MessageOfType<T extends MessageType> = Extract<Message, { type: T }>;

export function sendIPCMessage(target: NodeJS.Process | ChildProcess, message: Message) {
    // tslint:disable-next-line:no-non-null-assertion
    target.send!(JSON.stringify({ type: message.type, value: message.value }));
}
