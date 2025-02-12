import { NgModule } from '@angular/core';

import { HlmAlertDescriptionDirective } from './lib/hlm-alert-description.directive';
import { HlmAlertIconDirective } from './lib/hlm-alert-icon.directive';
import { HlmAlertTitleDirective } from './lib/hlm-alert-title.directive';
import { HlmAlertDirective } from './lib/hlm-alert.directive';

export * from './lib/hlm-alert-description.directive';
export * from './lib/hlm-alert-icon.directive';
export * from './lib/hlm-alert-title.directive';
export * from './lib/hlm-alert.directive';

export const HlmAlertImports = [
	HlmAlertDirective,
	HlmAlertTitleDirective,
	HlmAlertDescriptionDirective,
	HlmAlertIconDirective,
] as const;

@NgModule({
	imports: [...HlmAlertImports],
	exports: [...HlmAlertImports],
})
export class HlmAlertModule {}
