import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { FloatingButton, ModalService } from '@vendure/admin-ui/core';
import { FloatingButtonService } from '../../providers/floating-button/floating-button.service';

@Component({
    selector: 'vdr-floating-button',
    templateUrl: './floating-button.component.html',
    styleUrl: './floating-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloatingButtonComponent implements OnInit, OnDestroy {
    constructor(
        private floatingButtonService: FloatingButtonService,
        private router: Router,
        private cdr: ChangeDetectorRef,
    ) {}
    floatingButtons: FloatingButton[] = [];
    private routerSubscription: Subscription;

    handleClick(button: FloatingButton) {
        this.floatingButtonService.handleClick(button);
    }

    shouldShowButton(button: FloatingButton): boolean {
        if (!button.routes || button.routes.length === 0 || button.routes === '*') {
            return true;
        }

        const routes = Array.isArray(button.routes) ? button.routes : [button.routes];
        const currentRoute = this.router.url;
        const result = routes.some(route => {
            if (route === '*') {
                return true;
            }
            const regexPattern = route
                .replace(/\./g, '\\.')
                .replace(/\-/g, '\\-')
                .replace(/\*/g, '.*')
                .replace(/\?/g, '.')
                .replace(/\+/g, '.+')
                .replace(/\(/g, '\\(')
                .replace(/\)/g, '\\)');

            const pattern = new RegExp('.*' + regexPattern + '$');
            return pattern.test(currentRoute);
        });
        return result;
    }

    ngOnInit() {
        this.floatingButtonService.getFloatingButtons().subscribe(buttons => {
            this.floatingButtons = buttons;
            this.updateButtonVisibility();
        });
        this.routerSubscription = this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.updateButtonVisibility();
            }
        });
    }

    ngOnDestroy() {
        if (this.routerSubscription) {
            this.routerSubscription.unsubscribe();
        }
    }

    private updateButtonVisibility() {
        this.floatingButtons.forEach(button => {
            button.visible = this.shouldShowButton(button);
        });
        this.cdr.detectChanges();
    }
}
