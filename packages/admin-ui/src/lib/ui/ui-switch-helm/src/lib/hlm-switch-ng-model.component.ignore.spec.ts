import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmSwitchComponent } from './hlm-switch.component';
@Component({
	selector: 'hlm-switch-ng-model',
	standalone: true,
	template: `
		<!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
		<label class="flex items-center" hlmLabel>
			<hlm-switch
				[(ngModel)]="switchValue"
				id="testSwitchForm"
				aria-label="test switch"
				(changed)="handleChange($event)"
			/>
		</label>

		<p data-testid="switchValue">{{ switchValue }}</p>
		<p data-testid="changedValue">{{ changedValueTo }}</p>
	`,
	imports: [HlmSwitchComponent, FormsModule],
})
export class SwitchFormComponent {
	@Input()
	public switchValue = false;

	protected changedValueTo: boolean | undefined;

	handleChange(value: boolean) {
		this.changedValueTo = value;
	}
}
