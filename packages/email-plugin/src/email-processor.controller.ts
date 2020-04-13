import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { asyncObservable } from '@vendure/core';
import { Observable } from 'rxjs';

import { EMAIL_PLUGIN_OPTIONS } from './constants';
import { EmailProcessor } from './email-processor';
import { EmailPluginOptions, EmailWorkerMessage } from './types';

/**
 * Runs on the Worker process and does the actual work of generating and sending the emails.
 */
@Controller()
export class EmailProcessorController extends EmailProcessor implements OnModuleInit {
    constructor(@Inject(EMAIL_PLUGIN_OPTIONS) protected options: EmailPluginOptions) {
        super(options);
    }

    async onModuleInit() {
        await super.init();
    }

    @MessagePattern(EmailWorkerMessage.pattern)
    sendEmail(data: EmailWorkerMessage['data']): Observable<EmailWorkerMessage['response']> {
        return asyncObservable(async () => {
            return this.process(data);
        });
    }
}
