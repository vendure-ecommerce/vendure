import { Module, OnModuleInit } from '@nestjs/common';
import fs from 'fs-extra';

import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { EmailTypeConfig } from '../config/email/email-options';
import { EventBus } from '../event-bus/event-bus';
import { EventBusModule } from '../event-bus/event-bus.module';
import { VendureEvent } from '../event-bus/vendure-event';

import { EmailContext } from './email-context';
import { EmailSender } from './email-sender';
import { TemplateLoader } from './template-loader';

@Module({
    imports: [ConfigModule, EventBusModule],
    providers: [TemplateLoader, EmailSender],
})
export class EmailModule implements OnModuleInit {
    constructor(
        private configService: ConfigService,
        private eventBus: EventBus,
        private templateLoader: TemplateLoader,
        private emailSender: EmailSender,
    ) {}

    async onModuleInit() {
        await this.setupEventSubscribers();
        const { generator } = this.configService.emailOptions;
        if (generator.onInit) {
            await generator.onInit.call(generator, this.configService);
        }
    }

    async setupEventSubscribers() {
        const { emailTypes } = this.configService.emailOptions;
        for (const [type, config] of Object.entries(emailTypes)) {
            this.eventBus.subscribe(config.triggerEvent, event => {
                return this.handleEvent(type, config, event);
            });
        }
        if (this.configService.emailOptions.transport.type === 'file') {
            // ensure the configured directory exists before
            // we attempt to write files to it
            const emailPath = this.configService.emailOptions.transport.outputPath;
            await fs.ensureDir(emailPath);
        }
    }

    private async handleEvent(type: string, config: EmailTypeConfig<any>, event: VendureEvent) {
        const { generator, transport, templateVars } = this.configService.emailOptions;
        const contextConfig = config.createContext(event);
        if (contextConfig) {
            const emailContext = new EmailContext({
                ...contextConfig,
                type,
                event,
                templateVars,
            });
            const { subject, body, templateContext } = await this.templateLoader.loadTemplate(
                type,
                emailContext,
            );
            const generatedEmailContext = await generator.generate(
                subject,
                body,
                templateContext,
                emailContext,
            );
            await this.emailSender.send(generatedEmailContext, transport);
        }
    }
}
