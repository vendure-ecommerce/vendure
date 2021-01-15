import { Injectable } from '@nestjs/common';
import { Attachment } from 'nodemailer/lib/mailer';
import { Readable } from 'stream';
import { format } from 'url';

import { EmailAttachment, SerializedAttachment } from './types';

export async function serializeAttachments(attachments: EmailAttachment[]): Promise<SerializedAttachment[]> {
    const promises = attachments.map(async a => {
        const stringPath = typeof a.path === 'string' ? a.path : format(a.path);

        return {
            filename: null,
            cid: null,
            encoding: null,
            contentType: null,
            contentTransferEncoding: null,
            contentDisposition: null,
            headers: null,
            ...a,
            path: stringPath,
        };
    });
    return Promise.all(promises);
}

export function deserializeAttachments(serializedAttachments: SerializedAttachment[]): EmailAttachment[] {
    return serializedAttachments.map(a => {
        return {
            filename: nullToUndefined(a.filename),
            cid: nullToUndefined(a.cid),
            encoding: nullToUndefined(a.encoding),
            contentType: nullToUndefined(a.contentType),
            contentTransferEncoding: nullToUndefined(a.contentTransferEncoding),
            contentDisposition: nullToUndefined(a.contentDisposition),
            headers: nullToUndefined(a.headers),
            path: a.path,
        };
    });
}

function nullToUndefined<T>(input: T | null): T | undefined {
    return input == null ? undefined : input;
}
