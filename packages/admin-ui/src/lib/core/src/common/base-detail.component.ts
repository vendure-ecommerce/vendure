import { AbstractControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, switchMap, takeUntil, tap } from 'rxjs/operators';

import { DataService } from '../data/providers/data.service';
import { ServerConfigService } from '../data/server-config';

import { DeactivateAware } from './deactivate-aware';
import { CustomFieldConfig, CustomFields, LanguageCode } from './generated-types';
import { TranslationOf } from './utilities/find-translation';
import { getDefaultUiLanguage } from './utilities/get-default-ui-language';

/**
 * @description
 * A base class for entity detail views. It should be used in conjunction with the
 * {@link BaseEntityResolver}.
 *
 * @example
 * ```TypeScript
 * \@Component({
 *   selector: 'app-my-entity',
 *   templateUrl: './my-entity.component.html',
 *   styleUrls: ['./my-entity.component.scss'],
 *   changeDetection: ChangeDetectionStrategy.OnPush,
 * })
 * export class GlobalSettingsComponent extends BaseDetailComponent<MyEntity.Fragment> implements OnInit {
 *   detailForm: FormGroup;
 *
 *   constructor(
 *     router: Router,
 *     route: ActivatedRoute,
 *     serverConfigService: ServerConfigService,
 *     protected dataService: DataService,
 *     private formBuilder: FormBuilder,
 *   ) {
 *     super(route, router, serverConfigService, dataService);
 *     this.detailForm = this.formBuilder.group({
 *       name: [''],
 *     });
 *   }
 *
 *   protected setFormValues(entity: MyEntity.Fragment, languageCode: LanguageCode): void {
 *     this.detailForm.patchValue({
 *       name: entity.name,
 *     });
 *   }
 * }
 * ```
 *
 * @docsCategory list-detail-views
 */
export abstract class BaseDetailComponent<Entity extends { id: string; updatedAt?: string }>
    implements DeactivateAware
{
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

    protected setCustomFieldFormValues<T = Entity>(
        customFields: CustomFieldConfig[],
        formGroup: AbstractControl | null,
        entity: T,
        currentTranslation?: TranslationOf<T>,
    ) {
        for (const fieldDef of customFields) {
            const key = fieldDef.name;
            const value =
                fieldDef.type === 'localeString'
                    ? (currentTranslation as any).customFields?.[key]
                    : (entity as any).customFields?.[key];
            const control = formGroup?.get(key);
            if (control) {
                control.patchValue(value);
            }
        }
    }

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
