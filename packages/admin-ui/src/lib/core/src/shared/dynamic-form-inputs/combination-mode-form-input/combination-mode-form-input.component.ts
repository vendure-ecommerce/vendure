import { ChangeDetectionStrategy, Component, Optional } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ConfigurableInputComponent } from '@vendure/admin-ui/core';
import { DefaultFormComponentConfig, DefaultFormComponentId } from '@vendure/common/lib/shared-types';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { FormInputComponent, InputComponentConfig } from '../../../common/component-registry-types';

/**
 * @description
 * A special input used to display the "Combination mode" AND/OR toggle.
 *
 * @docsCategory custom-input-components
 * @docsPage default-inputs
 */
@Component({
    selector: 'vdr-combination-mode-form-input',
    templateUrl: './combination-mode-form-input.component.html',
    styleUrls: ['./combination-mode-form-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CombinationModeFormInputComponent implements FormInputComponent {
    static readonly id: DefaultFormComponentId = 'combination-mode-form-input';
    readonly: boolean;
    formControl: FormControl;
    config: DefaultFormComponentConfig<'combination-mode-form-input'>;
    selectable$: Observable<boolean>;

    constructor(@Optional() private configurableInputComponent: ConfigurableInputComponent) {
        const selectable$ = configurableInputComponent
            ? configurableInputComponent.positionChange$.pipe(map(position => 0 < position))
            : of(true);

        this.selectable$ = selectable$.pipe(
            tap(selectable => {
                if (!selectable) {
                    this.setCombinationModeAnd();
                }
            }),
        );
    }

    setCombinationModeAnd() {
        this.formControl.setValue(true);
    }

    setCombinationModeOr() {
        this.formControl.setValue(false);
    }
}
