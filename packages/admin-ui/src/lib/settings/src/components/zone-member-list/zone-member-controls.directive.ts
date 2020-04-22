import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: '[vdrZoneMemberControls]',
})
export class ZoneMemberControlsDirective {
    constructor(public templateRef: TemplateRef<any>) {}
}
