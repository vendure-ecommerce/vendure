import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
    configurableDefinitionToInstance,
    ConfigurableOperation,
    ConfigurableOperationDefinition,
    Dialog,
    FulfillmentFragment,
} from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-fulfillment-update-tracking-code-dialog',
    templateUrl: './fulfillment-update-tracking-code-dialog.component.html',
    styleUrls: ['./fulfillment-update-tracking-code-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FulfillmentUpdateTrackingCodeComponent
    implements Dialog<FulfillmentFragment | undefined>, OnInit
{
    fulfillment: FulfillmentFragment;

    fulfillmentHandlerDef: ConfigurableOperationDefinition;
    fulfillmentHandler: ConfigurableOperation;
    fulfillmentHandlerControl = new FormControl();

    constructor(private translate: TranslateService) {}
    resolveWith: (result?: Pick<FulfillmentFragment, 'trackingCode' | 'method'> | undefined) => void;

    ngOnInit() {
        this.fulfillmentHandlerDef = {
            args: [
                {
                    name: 'method',
                    defaultValue: this.fulfillment.method ?? '',
                    type: 'string',
                    list: false,
                    required: true,
                    label: this.translate.instant('order.fulfillment-method'),
                },
                {
                    name: 'trackingCode',
                    defaultValue: this.fulfillment.trackingCode ?? '',
                    type: 'string',
                    list: false,
                    required: true,
                    label: this.translate.instant('order.tracking-code'),
                },
            ],
            code: 'code',
            description:
                this.translate.instant('common.update') +
                ' ' +
                this.translate.instant('order.fulfillment').toLowerCase(),
        };
        this.fulfillmentHandler = configurableDefinitionToInstance(this.fulfillmentHandlerDef);
        this.fulfillmentHandlerControl.patchValue(this.fulfillmentHandler);
    }

    isModified() {
        return 'method' in this.fulfillmentHandlerControl.value.args;
    }

    canSubmit() {
        const isModified = this.isModified();
        const valueMap: { trackingCode: string; method: string } = isModified
            ? this.fulfillmentHandlerControl.value.args
            : {};

        const check =
            this.fulfillmentHandlerControl.valid &&
            isModified &&
            (valueMap.method !== this.fulfillment.method ||
                valueMap.trackingCode !== this.fulfillment.trackingCode);
        return check;
    }

    cancel() {
        this.resolveWith();
    }

    update() {
        if (this.isModified()) this.resolveWith(this.fulfillmentHandlerControl.value.args);
        else this.resolveWith();
    }
}
