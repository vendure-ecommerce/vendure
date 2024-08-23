import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { lastValueFrom, Observable } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';
import {
    ConfigurableOperation,
    EmailEventFragment,
    GetEmailEventsForResendDocument,
    ResendEmailEventDocument,
    Scalars,
} from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';
import {
    configurableDefinitionToInstance,
    configurableOperationValueIsValid,
} from '../../../common/utilities/configurable-operation-utils';

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

    constructor(
        private dataService: DataService,
        private fb: FormBuilder,
    ) {
        this.emailEventFormGroup = this.fb.group<{
            [key in string]: FormControl<ConfigurableOperation | undefined>;
        }>({}); // Initialize an empty form group
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
            if (this.emailEventFormGroup.contains(event.type)) {
                this.emailEventFormGroup
                    .get(event.type)
                    ?.patchValue(
                        event.operationDefinitions
                            ? configurableDefinitionToInstance(event.operationDefinitions)
                            : undefined,
                    );
            } else {
                const formControl = new FormControl(
                    event.operationDefinitions
                        ? configurableDefinitionToInstance(event.operationDefinitions)
                        : undefined,
                );
                this.emailEventFormGroup.addControl(event.type, formControl);
            }
        });
    }

    onResend(emailEventType: string) {
        // TODO: my form control value not getting updated, idk why
        const formControlValue = this.emailEventFormGroup.get(emailEventType)?.value;
        console.log(formControlValue);
        this.dataService
            .mutate(ResendEmailEventDocument, {
                input: {
                    type: emailEventType,
                    arguments: formControlValue.args.map(arg => ({
                        name: arg.name,
                        value: JSON.stringify(arg.value),
                    })),
                    entityId: this.entityId,
                    entityType: this.entityType,
                },
            })
            .subscribe(data => {
                console.log(data);
            });
    }

    protected readonly configurableDefinitionToInstance = configurableDefinitionToInstance;
}
