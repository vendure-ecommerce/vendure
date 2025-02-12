import { NgModule } from '@angular/core';
import { HlmSelectContentDirective } from './lib/hlm-select-content.directive';
import { HlmSelectGroupDirective } from './lib/hlm-select-group.directive';
import { HlmSelectLabelDirective } from './lib/hlm-select-label.directive';
import { HlmSelectOptionComponent } from './lib/hlm-select-option.component';
import { HlmSelectScrollDownComponent } from './lib/hlm-select-scroll-down.component';
import { HlmSelectScrollUpComponent } from './lib/hlm-select-scroll-up.component';
import { HlmSelectTriggerComponent } from './lib/hlm-select-trigger.component';
import { HlmSelectValueDirective } from './lib/hlm-select-value.directive';
import { HlmSelectDirective } from './lib/hlm-select.directive';

export * from './lib/hlm-select-content.directive';
export * from './lib/hlm-select-group.directive';
export * from './lib/hlm-select-label.directive';
export * from './lib/hlm-select-option.component';
export * from './lib/hlm-select-scroll-down.component';
export * from './lib/hlm-select-scroll-up.component';
export * from './lib/hlm-select-trigger.component';
export * from './lib/hlm-select-value.directive';
export * from './lib/hlm-select.directive';

export const HlmSelectImports = [
	HlmSelectContentDirective,
	HlmSelectTriggerComponent,
	HlmSelectOptionComponent,
	HlmSelectValueDirective,
	HlmSelectDirective,
	HlmSelectScrollUpComponent,
	HlmSelectScrollDownComponent,
	HlmSelectLabelDirective,
	HlmSelectGroupDirective,
] as const;

@NgModule({
	imports: [...HlmSelectImports],
	exports: [...HlmSelectImports],
})
export class HlmSelectModule {}
