import { ChangeDetectionStrategy, Component, ElementRef } from '@angular/core';

@Component({
    selector: 'vdr-dropdown',
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent {
    private isOpen = false;
    private onOpenChangeCallbacks: Array<(isOpen: boolean) => void> = [];
    public trigger: ElementRef;

    toggleOpen() {
        this.isOpen = !this.isOpen;
        this.onOpenChangeCallbacks.forEach(fn => fn(this.isOpen));
    }

    onOpenChange(callback: (isOpen: boolean) => void) {
        this.onOpenChangeCallbacks.push(callback);
    }

    setTriggerElement(elementRef: ElementRef) {
        this.trigger = elementRef;
    }
}
