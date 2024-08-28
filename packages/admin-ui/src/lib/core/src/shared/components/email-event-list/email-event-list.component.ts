import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    ConfigurableOperation,
    EmailEventFragment,
    GetEmailEventsForResendDocument,
    ResendEmailEventDocument,
    ResendEmailEventInput,
    Scalars,
} from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';
import { configurableDefinitionToInstance } from '../../../common/utilities/configurable-operation-utils';
import { NotificationService } from '../../../providers/notification/notification.service';

@Component({
    selector: 'vdr-email-event-list',
    templateUrl: './email-event-list.component.html',
    styleUrls: ['./email-event-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailEventListComponent implements OnInit {
    emailEvents$: Observable<EmailEventFragment[]>;
    @Input() entityId: Scalars['ID']['input'];
    @Input() entityType: string;
    emailEventFormGroup: FormGroup; // Define the FormGroup to hold dynamic controls
    emailEventsOperations: Map<string, ConfigurableOperation | null>;

    constructor(
        private changeDetector: ChangeDetectorRef,
        private notificationService: NotificationService,
        private dataService: DataService,
        private fb: FormBuilder,
    ) {
        this.emailEventFormGroup = this.fb.group<{
            [key in string]: FormControl<ConfigurableOperation | undefined>;
        }>({}); // Initialize an empty form group
        this.emailEventsOperations = new Map(); // Initialize an empty map
    }

    ngOnInit() {
        this.emailEvents$ = this.dataService
            .query(GetEmailEventsForResendDocument, {
                entityType: this.entityType as any,
                entityId: this.entityId,
            })
            .mapSingle(data => data.emailEventsForResend);

        this.emailEvents$.subscribe(data => {
            this.initFormControls(data); // Initialize form controls based on email events
        });
    }

    private initFormControls(emailEvents: EmailEventFragment[]) {
        emailEvents.forEach(event => {
            const operation = event.operationDefinitions
                ? configurableDefinitionToInstance(event.operationDefinitions)
                : null;
            this.emailEventsOperations.set(event.type, operation);
            if (this.emailEventFormGroup.contains(event.type)) {
                this.emailEventFormGroup.get(event.type)?.patchValue(operation);
            } else {
                this.emailEventFormGroup.addControl(event.type, new FormControl(operation));
            }
        });
        this.emailEventFormGroup.markAsPristine();
        this.changeDetector.markForCheck();
    }

    onResend(emailEventType: string) {
        const formControlValue = this.emailEventFormGroup.get(emailEventType)?.value;
        console.log(formControlValue);
        let operation: ResendEmailEventInput['operation'] = undefined;
        if (formControlValue.args) {
            operation = {
                code: formControlValue.code,
                arguments: Object.entries(formControlValue.args).map(([name, value]) => ({
                    name: name,
                    value: JSON.stringify(value),
                })),
            };
        }
        this.dataService
            .mutate(ResendEmailEventDocument, {
                input: {
                    type: emailEventType,
                    operation,
                    entityId: this.entityId,
                    entityType: this.entityType,
                },
            })
            .subscribe({
                next: data => {
                    this.notificationService.success(_('common.notify-send-success'), {
                        entity: emailEventType,
                    });
                    this.emailEventFormGroup.markAsPristine();
                    this.changeDetector.markForCheck();
                },
                error: () => {
                    this.notificationService.error(_('common.notify-send-error'), {
                        entity: emailEventType,
                    });
                },
            });
    }

    protected readonly configurableDefinitionToInstance = configurableDefinitionToInstance;
}
