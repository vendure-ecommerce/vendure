import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

import { Observable, map } from 'rxjs';
import { NotificationType } from '../../providers/notification/notification.service';

import { DataService } from '../../data/providers/data.service';
import { I18nService } from '../../providers/i18n/i18n.service';
import { LanguageCode } from '../../common/generated-types';

@Component({
    selector: 'vdr-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
    uiLanguageAndLocale$: Observable<[LanguageCode, string | undefined]>;
    direction$: Observable<'ltr' | 'rtl'>;

    @ViewChild('wrapper', { static: true }) wrapper: ElementRef;
    offsetTop = 0;
    message = '';
    translationVars: { [key: string]: string | number } = {};
    type: NotificationType = 'info';
    isVisible = true;
    private onClickFn: () => void = () => {
        /* */
    };

    /**
     *
     */
    constructor(private i18nService: I18nService, private dataService: DataService) {}

    ngOnInit(): void {
        this.uiLanguageAndLocale$ = this.dataService.client
            ?.uiState()
            ?.stream$?.pipe(map(({ uiState }) => [uiState.language, uiState.locale ?? undefined]));

        this.direction$ = this.uiLanguageAndLocale$?.pipe(
            map(([languageCode]) => {
                return this.i18nService.isRTL(languageCode) ? 'rtl' : 'ltr';
            }),
        );
    }

    registerOnClickFn(fn: () => void): void {
        this.onClickFn = fn;
    }

    @HostListener('click')
    onClick(): void {
        if (this.isVisible) {
            this.onClickFn();
        }
    }

    /**
     * Fade out the toast. When promise resolves, toast is invisible and
     * can be removed.
     */
    fadeOut(): Promise<any> {
        this.isVisible = false;
        return new Promise(resolve => setTimeout(resolve, 1000));
    }

    /**
     * Returns the height of the toast element in px.
     */
    getHeight(): number {
        if (!this.wrapper) {
            return 0;
        }
        const el: HTMLElement = this.wrapper.nativeElement;
        return el.getBoundingClientRect().height;
    }

    getIcon(): string {
        switch (this.type) {
            case 'info':
                return 'info-circle';
            case 'success':
                return 'check-circle';
            case 'error':
                return 'exclamation-circle';
            case 'warning':
                return 'exclamation-triangle';
        }
    }

    stringifyMessage(message: unknown) {
        if (typeof message === 'string') {
            return message;
        } else {
            return JSON.stringify(message, null, 2);
        }
    }
}
