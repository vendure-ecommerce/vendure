import { NgModule } from '@angular/core';

import { HlmCheckboxComponent } from './lib/hlm-checkbox.component';

export * from './lib/hlm-checkbox.component';

export const HlmCheckboxImports = [HlmCheckboxComponent] as const;
@NgModule({
	imports: [...HlmCheckboxImports],
	exports: [...HlmCheckboxImports],
})
export class HlmCheckboxModule {}
