import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import {
    EmailEventFragment,
    GetEmailEventsForResendDocument,
    Scalars,
} from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';

const EMAIL_EVENT_FRAGMENT = gql`
    fragment EmailEvent on EmailEvent {
        type
        entityType
        label {
            languageCode
            value
        }
        description {
            languageCode
            value
        }
        operationDefinitions {
            args {
                name
                type
                list
                required
                defaultValue
                label
                description
                ui
            }
            description
        }
    }
`;

const GET_EMAIL_EVENTS_FOR_RESEND = gql`
    query GetEmailEventsForResend($entityType: String!, $entityId: ID!) {
        emailEventsForResend(entityType: $entityType, entityId: $entityId) {
            ...EmailEvent
        }
    }
    ${EMAIL_EVENT_FRAGMENT}
`;

const RESEND_EMAIL_EVENT = gql`
    mutation ResendEmailEvent($input: ResendEmailInput!) {
        resendEmailEvent(input: $input)
    }
`;

@Component({
    selector: 'vdr-email-event-list',
    templateUrl: './email-event-list.component.html',
    styleUrls: ['./email-event-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailEventListComponent implements OnInit {
    emailHandlers$: Observable<EmailEventFragment[]>;
    @Input() entityId: Scalars['ID']['input'];
    @Input() entityType: string;

    constructor(private dataService: DataService) {}

    ngOnInit() {
        console.log(this.entityType, this.entityId);
        this.emailHandlers$ = this.dataService
            .query(GetEmailEventsForResendDocument, {
                entityType: this.entityType as any,
                entityId: this.entityId,
            })
            .mapSingle(data => data.emailEventsForResend);

        this.emailHandlers$.subscribe(data => {
            console.log(data);
        });
    }

    resendEmail(input: { arguments: Array<{ name: string; value: any }> }) {
        this.dataService.mutate(GetEmailEventsForResendDocument, {
            entityType: this.entityType as any,
            entityId: this.entityId,
            ...input,
        });
    }
}
