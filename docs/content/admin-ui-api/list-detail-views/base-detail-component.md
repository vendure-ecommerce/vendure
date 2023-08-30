---
title: "BaseDetailComponent"
weight: 10
date: 2023-07-14T16:57:51.024Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# BaseDetailComponent
<div class="symbol">


# BaseDetailComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/common/base-detail.component.ts" sourceLine="56" packageName="@vendure/admin-ui">}}

A base class for entity detail views. It should be used in conjunction with the
<a href='/admin-ui-api/list-detail-views/base-entity-resolver#baseentityresolver'>BaseEntityResolver</a>.

*Example*

```TypeScript
@Component({
  selector: 'app-my-entity',
  templateUrl: './my-entity.component.html',
  styleUrls: ['./my-entity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSettingsComponent extends BaseDetailComponent<MyEntityFragment> implements OnInit {
  detailForm: FormGroup;

  constructor(
    router: Router,
    route: ActivatedRoute,
    serverConfigService: ServerConfigService,
    protected dataService: DataService,
    private formBuilder: FormBuilder,
  ) {
    super(route, router, serverConfigService, dataService);
    this.detailForm = this.formBuilder.group({
      name: [''],
    });
  }

  protected setFormValues(entity: MyEntityFragment, languageCode: LanguageCode): void {
    this.detailForm.patchValue({
      name: entity.name,
    });
  }
}
```

## Signature

```TypeScript
class BaseDetailComponent<Entity extends { id: string; updatedAt?: string }> implements DeactivateAware {
  entity$: Observable<Entity>;
  availableLanguages$: Observable<LanguageCode[]>;
  languageCode$: Observable<LanguageCode>;
  languageCode: LanguageCode;
  isNew$: Observable<boolean>;
  id: string;
  abstract abstract detailForm: UntypedFormGroup;
  protected protected destroy$ = new Subject<void>();
  constructor(route: ActivatedRoute, router: Router, serverConfigService: ServerConfigService, dataService: DataService)
  init() => ;
  protected setUpStreams() => ;
  destroy() => ;
  setLanguage(code: LanguageCode) => ;
  canDeactivate() => boolean;
  protected abstract setFormValues(entity: Entity, languageCode: LanguageCode) => void;
  protected setCustomFieldFormValues(customFields: CustomFieldConfig[], formGroup: AbstractControl | null, entity: T, currentTranslation?: TranslationOf<T>) => ;
  protected getCustomFieldConfig(key: Exclude<keyof CustomFields, '__typename'>) => CustomFieldConfig[];
  protected setQueryParam(key: string, value: any) => ;
}
```
## Implements

 * DeactivateAware


## Members

### entity$

{{< member-info kind="property" type="Observable&#60;Entity&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### availableLanguages$

{{< member-info kind="property" type="Observable&#60;<a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>[]&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### languageCode$

{{< member-info kind="property" type="Observable&#60;<a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### languageCode

{{< member-info kind="property" type="<a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### isNew$

{{< member-info kind="property" type="Observable&#60;boolean&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### id

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### detailForm

{{< member-info kind="property" type="UntypedFormGroup"  >}}

{{< member-description >}}{{< /member-description >}}

### destroy$

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(route: ActivatedRoute, router: Router, serverConfigService: ServerConfigService, dataService: <a href='/admin-ui-api/providers/data-service#dataservice'>DataService</a>) => BaseDetailComponent"  >}}

{{< member-description >}}{{< /member-description >}}

### init

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### setUpStreams

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### destroy

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### setLanguage

{{< member-info kind="method" type="(code: <a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>) => "  >}}

{{< member-description >}}{{< /member-description >}}

### canDeactivate

{{< member-info kind="method" type="() => boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### setFormValues

{{< member-info kind="method" type="(entity: Entity, languageCode: <a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>) => void"  >}}

{{< member-description >}}{{< /member-description >}}

### setCustomFieldFormValues

{{< member-info kind="method" type="(customFields: <a href='/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[], formGroup: AbstractControl | null, entity: T, currentTranslation?: TranslationOf&#60;T&#62;) => "  >}}

{{< member-description >}}{{< /member-description >}}

### getCustomFieldConfig

{{< member-info kind="method" type="(key: Exclude&#60;keyof <a href='/typescript-api/custom-fields/#customfields'>CustomFields</a>, '__typename'&#62;) => <a href='/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### setQueryParam

{{< member-info kind="method" type="(key: string, value: any) => "  >}}

{{< member-description >}}{{< /member-description >}}


</div>
