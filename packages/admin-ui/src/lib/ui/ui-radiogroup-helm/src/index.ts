import { NgModule } from '@angular/core';

import { HlmRadioGroupComponent } from './lib/hlm-radio-group.component';
import { HlmRadioIndicatorComponent } from './lib/hlm-radio-indicator.component';
import { HlmRadioDirective } from './lib/hlm-radio.directive';

export * from './lib/hlm-radio-group.component';
export * from './lib/hlm-radio-indicator.component';
export * from './lib/hlm-radio.directive';

export const HlmRadioGroupImports = [HlmRadioGroupComponent, HlmRadioDirective, HlmRadioIndicatorComponent];

@NgModule({
	imports: [...HlmRadioGroupImports],
	exports: [...HlmRadioGroupImports],
})
export class HlmRadioGroupModule {}
