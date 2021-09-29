import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, switchMap, takeUntil, tap } from 'rxjs/operators';

import { DataService } from '../data/providers/data.service';
import { ServerConfigService } from '../data/server-config';

import { DeactivateAware } from './deactivate-aware';
import { CustomFieldConfig, CustomFields, LanguageCode } from './generated-types';
import { getDefaultUiLanguage } from './utilities/get-default-ui-language';

export abstract class BaseDetailComponent<Entity extends { id: string; updatedAt?: string }>
    implements DeactivateAware {
    entity$: Observable<Entity>;
    availableLanguages$: Observable<LanguageCode[]>;
    languageCode$: Observable<LanguageCode>;
    isNew$: Observable<boolean>;
    id: string;
    abstract detailForm: FormGroup;
    protected destroy$ = new Subject<void>();

    protected constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected serverConfigService: ServerConfigService,
        protected dataService: DataService,
    ) {}

    init() {
        this.entity$ = this.route.data.pipe(
            switchMap(data => (data.entity as Observable<Entity>).pipe(takeUntil(this.destroy$))),
            tap(entity => (this.id = entity.id)),
            shareReplay(1),
        );
        this.isNew$ = this.entity$.pipe(
            map(entity => entity.id === ''),
            shareReplay(1),
        );
        this.languageCode$ = this.route.paramMap.pipe(
            map(paramMap => paramMap.get('lang')),
            switchMap(lang => {
                if (lang) {
                    return of(lang as LanguageCode);
                } else {
                    return this.dataService.client.uiState().mapSingle(data => data.uiState.contentLanguage);
                }
            }),
            distinctUntilChanged(),
            shareReplay(1),
        );

        this.availableLanguages$ = this.serverConfigService.getAvailableLanguages();

        combineLatest(this.entity$, this.languageCode$)
            .pipe(takeUntil(this.destroy$))
            .subscribe(([entity, languageCode]) => {
                this.setFormValues(entity, languageCode);
                this.detailForm.markAsPristine();
            });
    }

    destroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    setLanguage(code: LanguageCode) {
        this.setQueryParam('lang', code);
        this.dataService.client.setContentLanguage(code).subscribe();
    }

    canDeactivate(): boolean {
        return this.detailForm && this.detailForm.pristine;
    }

    protected abstract setFormValues(entity: Entity, languageCode: LanguageCode): void;

    protected getCustomFieldConfig(key: Exclude<keyof CustomFields, '__typename'>): CustomFieldConfig[] {
        return this.serverConfigService.getCustomFieldsFor(key);
    }

    protected setQueryParam(key: string, value: any) {
        this.router.navigate(
            [
                './',
                {
                    ...this.route.snapshot.params,
                    [key]: value,
                },
            ],
            {
                relativeTo: this.route,
                queryParamsHandling: 'merge',
            },
        );
    }
}
