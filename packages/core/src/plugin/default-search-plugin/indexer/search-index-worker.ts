/* tslint:disable:no-non-null-assertion no-console */
import { IndexBuilder } from './index-builder';
import { ConnectionOptionsMessage, GetRawBatchByIdsMessage, GetRawBatchMessage, SaveVariantsMessage, sendIPCMessage } from './ipc';

export type IncomingMessage = ConnectionOptionsMessage | GetRawBatchMessage | GetRawBatchByIdsMessage | SaveVariantsMessage;

const indexBuilder = new IndexBuilder();

process.on('message', async (messageString) => {
    const message: IncomingMessage = JSON.parse(messageString);
    const result = await indexBuilder.processMessage(message);
    if (result) {
        result.channelId = message.channelId;
        sendIPCMessage(process, result);
    }
});
