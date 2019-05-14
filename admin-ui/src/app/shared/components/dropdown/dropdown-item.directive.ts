import { Directive, HostListener } from '@angular/core';

import { DropdownComponent } from './dropdown.component';

@Directive({
    selector: '[vdrDropdownItem]',
    // tslint:disable-next-line
    host: { '[class.dropdown-item]': 'true' },
})
export class DropdownItemDirective {
    constructor(private dropdown: DropdownComponent) {}

    @HostListener('click', ['$event'])
    onDropdownItemClick(event: any): void {
        this.dropdown.toggleOpen();
    }
}
