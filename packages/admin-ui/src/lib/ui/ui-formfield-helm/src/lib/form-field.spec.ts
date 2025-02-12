/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { HlmInputDirective } from '@spartan-ng/ui-input-helm';

import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@spartan-ng/brain/forms';
import { HlmErrorDirective } from './hlm-error.directive';
import { HlmFormFieldComponent } from './hlm-form-field.component';
import { HlmHintDirective } from './hlm-hint.directive';

const DIRECTIVES = [HlmFormFieldComponent, HlmErrorDirective, HlmHintDirective, HlmInputDirective];

@Component({
	standalone: true,
	selector: 'single-form-field-example',
	imports: [ReactiveFormsModule, ...DIRECTIVES],
	template: `
		<hlm-form-field>
			<input
				data-testid="hlm-input"
				aria-label="Your Name"
				[formControl]="name"
				class="w-80"
				hlmInput
				type="text"
				placeholder="Your Name"
			/>
			<hlm-error data-testid="hlm-error">Your name is required</hlm-error>
			<hlm-hint data-testid="hlm-hint">This is your public display name.</hlm-hint>
		</hlm-form-field>
	`,
})
class SingleFormFieldMock {
	public name = new FormControl('', Validators.required);
}

@Component({
	standalone: true,
	selector: 'single-form-field-dirty-example',
	imports: [ReactiveFormsModule, ...DIRECTIVES],
	template: `
		<hlm-form-field>
			<input
				data-testid="hlm-input"
				aria-label="Your Name"
				[formControl]="name"
				class="w-80"
				hlmInput
				type="text"
				placeholder="Your Name"
			/>
			<hlm-error data-testid="hlm-error">Your name is required</hlm-error>
			<hlm-hint data-testid="hlm-hint">This is your public display name.</hlm-hint>
		</hlm-form-field>
	`,
	providers: [{ provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }],
})
class SingleFormFieldDirtyMock {
	public name = new FormControl('', Validators.required);
}

describe('Hlm Form Field Component', () => {
	const TEXT_HINT = 'This is your public display name.';
	const TEXT_ERROR = 'Your name is required';

	const setupFormField = async () => {
		const { fixture } = await render(SingleFormFieldMock);
		return {
			user: userEvent.setup(),
			fixture,
			hint: screen.getByTestId('hlm-hint'),
			error: () => screen.queryByTestId('hlm-error'),
			trigger: screen.getByTestId('hlm-input'),
		};
	};

	const setupFormFieldWithErrorStateDirty = async () => {
		const { fixture } = await render(SingleFormFieldDirtyMock);
		return {
			user: userEvent.setup(),
			fixture,
			hint: screen.getByTestId('hlm-hint'),
			error: () => screen.queryByTestId('hlm-error'),
			trigger: screen.getByTestId('hlm-input'),
		};
	};

	describe('SingleFormField', () => {
		it('should show the hint if the errorState is false', async () => {
			const { hint } = await setupFormField();

			expect(hint.textContent).toBe(TEXT_HINT);
		});

		it('should show the error if the errorState is true', async () => {
			const { user, error, trigger } = await setupFormField();

			expect(error()).toBeNull();

			await user.click(trigger);

			await user.click(document.body);

			expect(screen.queryByTestId('hlm-hint')).toBeNull();
			expect(error()?.textContent?.trim()).toBe(TEXT_ERROR);
		});
	});

	describe('SingleFormFieldDirty', () => {
		it('should not display the error if the input does not have the dirty state due to the ErrorStateMatcher', async () => {
			const { error, user, trigger } = await setupFormFieldWithErrorStateDirty();

			await user.click(trigger);

			await user.click(document.body);

			expect(error()).toBeNull();
		});

		it('should display the error if the input has the dirty state due to the ErrorStateMatcher', async () => {
			const { error, user, trigger } = await setupFormFieldWithErrorStateDirty();

			await user.click(trigger);
			await user.type(trigger, 'a');
			await user.clear(trigger);

			await user.click(document.body);

			expect(error()?.textContent?.trim()).toBe(TEXT_ERROR);
		});
	});
});
