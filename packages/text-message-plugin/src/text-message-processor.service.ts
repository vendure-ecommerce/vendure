import { Inject, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { EventBus, Injector, Logger, RequestContext } from '@vendure/core';
import fs from 'fs-extra';

import { deserializeAttachments } from './attachment-utils';
import { isDevModeOptions, resolveTransportSettings } from './common';
import { TEXT_MESSAGE_PLUGIN, loggerCtx } from './constants';
import { HandlebarsMjmlGenerator } from './generator/handlebars-mjml-generator';
import { TextMessageGenerator } from './generator/text-message-generator';
import { TestingTextMessageSender } from "./sender/testing-text-message-sender";
import { TextMessageSender } from './sender/text-message-sender';
import { TextMessageSendEvent } from './text-message-send-event';
import { TextMessageDetails, TextMessageTransportOptions, InitializedTextMessagePluginOptions, IntermediateTextMessageDetails } from './types';

/**
 * This class combines the template loading, generation, and text message sending - the actual "work" of
 * the TextMessagePlugin. It is arranged this way primarily to accommodate easier testing, so that the
 * tests can be run without needing all the JobQueue stuff which would require a full e2e test.
 */
@Injectable()
export class TextMessageProcessor {
    protected textMessageSender: TextMessageSender;
    protected generator: TextMessageGenerator;

    constructor(
        @Inject(TEXT_MESSAGE_PLUGIN) protected options: InitializedTextMessagePluginOptions,
        private moduleRef: ModuleRef,
        private eventBus: EventBus,
    ) {}

    async init() {
        this.textMessageSender = this.options.textMessageSender ? this.options.textMessageSender : new TestingTextMessageSender();
        this.generator = this.options.textMessageGenerator
            ? this.options.textMessageGenerator
            : new HandlebarsMjmlGenerator();
        if (this.generator.onInit) {
            await this.generator.onInit.call(this.generator, this.options);
        }
        const transport = await this.getTransportSettings();
        if (transport.type === 'file') {
            // ensure the configured directory exists before
            // we attempt to write files to it
            const textMessagePath = transport.outputPath;
            await fs.ensureDir(textMessagePath);
        }
    }

    async process(data: IntermediateTextMessageDetails) {
        const ctx = RequestContext.deserialize(data.ctx);
        let textMessageDetails: TextMessageDetails = {} as any;
        try {
            const bodySource = await this.options.templateLoader.loadTemplate(
                new Injector(this.moduleRef),
                ctx,
                {
                    templateName: data.templateFile,
                    type: data.type,
                    templateVars: data.templateVars,
                },
            );
            const generated = this.generator.generate(data.from, bodySource, data.templateVars);
            textMessageDetails = {
                ...generated,
                recipient: data.recipient,
                to: data.recipient,
                attachments: deserializeAttachments(data.attachments),
                cc: data.cc,
                bcc: data.bcc,
                replyTo: data.replyTo,
            };
            const transportSettings = await this.getTransportSettings(ctx);
            await this.textMessageSender.send(textMessageDetails, transportSettings);
            await this.eventBus.publish(new TextMessageSendEvent(ctx, textMessageDetails, true));
            return true;
        } catch (err: unknown) {
            if (err instanceof Error) {
                Logger.error(err.message, loggerCtx, err.stack);
            } else {
                Logger.error(String(err), loggerCtx);
            }

            await this.eventBus.publish(new TextMessageSendEvent(ctx, textMessageDetails, false, err as Error));
            throw err;
        }
    }

    async getTransportSettings(ctx?: RequestContext): Promise<TextMessageTransportOptions> {
        const transport = await resolveTransportSettings(this.options, new Injector(this.moduleRef), ctx);
        if (isDevModeOptions(this.options)) {
            if (transport && transport.type !== 'file') {
                Logger.warn(
                    `The TextMessagePlugin is running in dev mode. The configured '${transport.type}' transport will be replaced by the 'file' transport.`,
                    loggerCtx,
                );
            }
            return {
                type: 'file',
                raw: false,
                outputPath: this.options.outputPath,
            };
        } else {
            return transport;
        }
    }
}
