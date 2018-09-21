import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { LanguageCode } from 'shared/generated-types';
import { CustomFieldConfig, CustomFields } from 'shared/shared-types';

import { ServerConfigService } from '../data/server-config';

import { getDefaultLanguage } from './utilities/get-default-language';

export abstract class BaseDetailComponent<Entity extends { id: string }> {
    entity$: Observable<Entity>;
    availableLanguages$: Observable<LanguageCode[]>;
    languageCode$: Observable<LanguageCode>;
    isNew$: Observable<boolean>;
    protected destroy$ = new Subject<void>();

    protected constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        private serverConfigService: ServerConfigService,
    ) {}

    init() {
        this.entity$ = this.route.data.pipe(switchMap(data => data.entity));
        this.isNew$ = this.entity$.pipe(map(entity => entity.id === ''));
        this.languageCode$ = this.route.queryParamMap.pipe(
            map(qpm => qpm.get('lang')),
            map(lang => (!lang ? getDefaultLanguage() : (lang as LanguageCode))),
        );

        this.availableLanguages$ = of([LanguageCode.en]);

        combineLatest(this.entity$, this.languageCode$)
            .pipe(takeUntil(this.destroy$))
            .subscribe(([facet, languageCode]) => this.setFormValues(facet, languageCode));
    }

    destroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    protected abstract setFormValues(entity: Entity, languageCode: LanguageCode): void;

    protected getCustomFieldConfig(key: keyof CustomFields): CustomFieldConfig[] {
        return this.serverConfigService.serverConfig.customFields[key] || [];
    }

    protected setQueryParam(key: string, value: any) {
        this.router.navigate(['./'], {
            queryParams: { [key]: value },
            relativeTo: this.route,
            queryParamsHandling: 'merge',
        });
    }
}
