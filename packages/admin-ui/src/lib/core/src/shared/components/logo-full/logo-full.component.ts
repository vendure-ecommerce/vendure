import { Component, Input } from '@angular/core';

@Component({
    selector: 'vdr-logo-full',
    templateUrl: './logo-full.component.svg',
})
export class LogoFullComponent {
    @Input() class: string = '';
}
