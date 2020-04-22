import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: '[vdrZoneMemberListHeader]',
})
export class ZoneMemberListHeaderDirective {
    constructor(public templateRef: TemplateRef<any>) {}
}
