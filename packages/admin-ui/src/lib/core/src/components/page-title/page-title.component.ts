import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostListener,
    Input,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, throttleTime } from 'rxjs/operators';

@Component({
    selector: 'vdr-page-title',
    template: `
        <div class="page-title">
            <h1 [class.folded]="isFolded">{{ value | translate }}</h1>
        </div>
    `,
    styleUrls: [`./page-title.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageTitleComponent implements AfterViewInit {
    @Input() value = '';
    isFolded = false;
    private lastScrollTop = 0;

    constructor(private changeDetector: ChangeDetectorRef) {}

    ngAfterViewInit() {
        const contentContainer = document.querySelector('.content-container');
        if (contentContainer) {
            // fromEvent(contentContainer, 'scroll', { passive: true }).subscribe(() => {
            //     const scrollTop = contentContainer.scrollTop;
            //     const delta = this.lastScrollTop - scrollTop;
            //     this.lastScrollTop = scrollTop;
            //     if (100 < scrollTop && this.isFolded === false) {
            //         this.isFolded = true;
            //         this.changeDetector.markForCheck();
            //     }
            //     if ((scrollTop === 0 || (scrollTop < 50 && 0 < delta)) && this.isFolded === true) {
            //         this.isFolded = false;
            //         this.changeDetector.markForCheck();
            //     }
            // });
        }
    }
}
