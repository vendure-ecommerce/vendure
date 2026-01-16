---
title: "BaseDetailComponent"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## BaseDetailComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/common/base-detail.component.ts" sourceLine="57" packageName="@vendure/admin-ui" />

A base class for entity detail views. It should be used in conjunction with the
<a href='/reference/admin-ui-api/list-detail-views/base-entity-resolver#baseentityresolver'>BaseEntityResolver</a>.

*Example*

```ts
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

```ts title="Signature"
class BaseDetailComponent<Entity extends { id: string; updatedAt?: string }> implements DeactivateAware {
    entity$: Observable<Entity>;
    availableLanguages$: Observable<LanguageCode[]>;
    languageCode$: Observable<LanguageCode>;
    languageCode: LanguageCode;
    isNew$: Observable<boolean>;
    id: string;
    abstract detailForm: UntypedFormGroup;
    protected destroy$ = new Subject<void>();
    constructor(route: ActivatedRoute, router: Router, serverConfigService: ServerConfigService, dataService: DataService, permissionsService: PermissionsService)
    init() => ;
    setUpStreams() => ;
    destroy() => ;
    setLanguage(code: LanguageCode) => ;
    canDeactivate() => boolean;
    setFormValues(entity: Entity, languageCode: LanguageCode) => void;
    setCustomFieldFormValues(customFields: CustomFieldConfig[], formGroup: AbstractControl | null, entity: T, currentTranslation?: TranslationOf<T>) => ;
    getCustomFieldConfig(key: Exclude<keyof CustomFields, '__typename'>) => CustomFieldConfig[];
    setQueryParam(key: string, value: any) => ;
}
```
* Implements: <code>DeactivateAware</code>



<div className="members-wrapper">

### entity$

<MemberInfo kind="property" type={`Observable&#60;Entity&#62;`}   />


### availableLanguages$

<MemberInfo kind="property" type={`Observable&#60;<a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>[]&#62;`}   />


### languageCode$

<MemberInfo kind="property" type={`Observable&#60;<a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>&#62;`}   />


### languageCode

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>`}   />


### isNew$

<MemberInfo kind="property" type={`Observable&#60;boolean&#62;`}   />


### id

<MemberInfo kind="property" type={`string`}   />


### detailForm

<MemberInfo kind="property" type={`UntypedFormGroup`}   />


### destroy$

<MemberInfo kind="property" type={``}   />


### constructor

<MemberInfo kind="method" type={`(route: ActivatedRoute, router: Router, serverConfigService: ServerConfigService, dataService: <a href='/reference/admin-ui-api/services/data-service#dataservice'>DataService</a>, permissionsService: PermissionsService) => BaseDetailComponent`}   />


### init

<MemberInfo kind="method" type={`() => `}   />


### setUpStreams

<MemberInfo kind="method" type={`() => `}   />


### destroy

<MemberInfo kind="method" type={`() => `}   />


### setLanguage

<MemberInfo kind="method" type={`(code: <a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>) => `}   />


### canDeactivate

<MemberInfo kind="method" type={`() => boolean`}   />


### setFormValues

<MemberInfo kind="method" type={`(entity: Entity, languageCode: <a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>) => void`}   />


### setCustomFieldFormValues

<MemberInfo kind="method" type={`(customFields: <a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[], formGroup: AbstractControl | null, entity: T, currentTranslation?: TranslationOf&#60;T&#62;) => `}   />


### getCustomFieldConfig

<MemberInfo kind="method" type={`(key: Exclude&#60;keyof <a href='/reference/typescript-api/custom-fields/#customfields'>CustomFields</a>, '__typename'&#62;) => <a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]`}   />


### setQueryParam

<MemberInfo kind="method" type={`(key: string, value: any) => `}   />




</div>
