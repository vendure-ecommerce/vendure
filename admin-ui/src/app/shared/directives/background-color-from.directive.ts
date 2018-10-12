import { Directive, HostBinding, Input, OnChanges } from '@angular/core';

import { stringToColor } from '../../common/utilities/string-to-color';

/**
 * Sets the background color of the element based on the string argument
 * passed in.
 */
@Directive({
    selector: '[vdrBackgroundColorFrom]',
})
export class BackgroundColorFromDirective implements OnChanges {
    @HostBinding('style.backgroundColor') private backgroundColor: string;

    @Input() private vdrBackgroundColorFrom: string;

    ngOnChanges(): void {
        this.backgroundColor = stringToColor(this.vdrBackgroundColorFrom);
    }
}
