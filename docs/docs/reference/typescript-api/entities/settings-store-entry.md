---
title: "SettingsStoreEntry"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## SettingsStoreEntry

<GenerationInfo sourceFile="packages/core/src/entity/settings-store-entry/settings-store-entry.entity.ts" sourceLine="15" packageName="@vendure/core" since="3.4.0" />

An entity for storing arbitrary settings data with scoped isolation.
This is used by the SettingsStore system to provide flexible key-value storage
with support for user, channel, and custom scoping.

```ts title="Signature"
class SettingsStoreEntry extends VendureEntity {
    constructor(input?: Partial<SettingsStoreEntry>)
    @Index()
    @Column()
    key: string;
    @Column('json', { nullable: true })
    value: any | null;
    @Index()
    @Column({ type: 'varchar', nullable: true })
    scope: string | null;
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input?: Partial&#60;<a href='/reference/typescript-api/entities/settings-store-entry#settingsstoreentry'>SettingsStoreEntry</a>&#62;) => SettingsStoreEntry`}   />


### key

<MemberInfo kind="property" type={`string`}   />

The settings key, typically in the format 'namespace.fieldName'
### value

<MemberInfo kind="property" type={`any | null`}   />

The JSON value stored for this setting
### scope

<MemberInfo kind="property" type={`string | null`}   />

The scope string that isolates this setting (e.g., 'user:123', 'channel:456', '')


</div>
