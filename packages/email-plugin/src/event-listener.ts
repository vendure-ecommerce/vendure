import { Type } from '@vendure/common/lib/shared-types';
import { LanguageCode } from '@vendure/common/src/generated-types';

import { EventWithContext } from './types';

export interface EmailEventHandlerConfig<T extends string, Event extends EventWithContext> {
    channelCode?: string;
    languageCode?: LanguageCode;
    setRecipient: (event: Event) => string;
    subject: string;
    templateVars: (event: Event) => { [key: string]: any; };
}

export class EmailEventListener<T extends string> {
    public type: T;
    constructor(type: T) {
        this.type = type;
    }

    on<Event extends EventWithContext>(event: Type<Event>) {
        return new EmailEventHandler<T, Event>(this, event);
    }
}

export class EmailEventHandler<T extends string = string, Event extends EventWithContext = EventWithContext> {
    private filterFns: Array<(event: Event) => boolean> = [];
    private configurations: Array<EmailEventHandlerConfig<T, Event>> = [];

    constructor(public listener: EmailEventListener<T>, public event: Type<Event>) {}

    get type(): T {
        return this.listener.type;
    }

    filter(filterFn: (event: Event) => boolean) {
        this.filterFns.push(filterFn);
        return this;
    }

    configure(templateConfig: EmailEventHandlerConfig<T, Event>) {
        this.configurations.push(templateConfig);
        return this;
    }

    handle(event: Event) {
        for (const filterFn of this.filterFns) {
            if (!filterFn(event)) {
                return;
            }
        }
        const { ctx } = event;
        const configuration = this.getBestConfiguration(ctx.channel.code, ctx.languageCode);
        const recipient = configuration.setRecipient(event);
        const templateVars = configuration.templateVars(event);
        return {
            recipient,
            templateVars,
            subject: configuration.subject,
        };
    }

    private getBestConfiguration(channelCode: string, languageCode: LanguageCode) {
        if ( this.configurations.length === 0) {
            throw new Error(`This handler has not yet been configured`);
        }
        if (this.configurations.length === 1) {
            return this.configurations[0];
        }
        const exactMatch = this.configurations.find(c => c.channelCode === channelCode && c.languageCode === languageCode);
        if (exactMatch) {
            return exactMatch;
        }
        const channelMatch = this.configurations.find(c => c.channelCode === channelCode && c.languageCode === undefined);
        if (channelMatch) {
            return channelMatch;
        }
        return this.configurations[0];
    }
}
