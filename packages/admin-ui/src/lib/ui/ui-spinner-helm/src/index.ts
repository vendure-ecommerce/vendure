import { NgModule } from '@angular/core';
import { HlmSpinnerComponent } from './lib/hlm-spinner.component';

export * from './lib/hlm-spinner.component';

@NgModule({
	imports: [HlmSpinnerComponent],
	exports: [HlmSpinnerComponent],
})
export class HlmSpinnerModule {}
