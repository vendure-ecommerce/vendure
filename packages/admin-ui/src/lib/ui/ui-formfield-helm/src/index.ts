import { NgModule } from '@angular/core';
import { HlmErrorDirective } from './lib/hlm-error.directive';
import { HlmFormFieldComponent } from './lib/hlm-form-field.component';
import { HlmHintDirective } from './lib/hlm-hint.directive';

export * from './lib/hlm-error.directive';
export * from './lib/hlm-form-field.component';
export * from './lib/hlm-hint.directive';

@NgModule({
	imports: [HlmFormFieldComponent, HlmErrorDirective, HlmHintDirective],
	exports: [HlmFormFieldComponent, HlmErrorDirective, HlmHintDirective],
})
export class HlmFormFieldModule {}
