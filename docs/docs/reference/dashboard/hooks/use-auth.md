---
title: "UseAuth"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## useAuth

<GenerationInfo sourceFile="packages/dashboard/src/lib/hooks/use-auth.tsx" sourceLine="17" packageName="@vendure/dashboard" since="3.3.0" />

**Status: Developer Preview**

Provides access to the <a href='/reference/dashboard/hooks/use-channel#channelcontext'>ChannelContext</a> which contains information
about the active channel.

```ts title="Signature"
function useAuth(): void
```


## AuthContext

<GenerationInfo sourceFile="packages/dashboard/src/lib/providers/auth.tsx" sourceLine="17" packageName="@vendure/dashboard" since="3.3.0" />

**Status: Developer Preview**

```ts title="Signature"
interface AuthContext {
    status: 'authenticated' | 'verifying' | 'unauthenticated';
    authenticationError?: string;
    isAuthenticated: boolean;
    login: (username: string, password: string, onSuccess?: () => void) => void;
    logout: (onSuccess?: () => void) => Promise<void>;
    user: ResultOf<typeof CurrentUserQuery>['activeAdministrator'] | undefined;
    channels: NonNullable<ResultOf<typeof CurrentUserQuery>['me']>['channels'] | undefined;
}
```

<div className="members-wrapper">

### status

<MemberInfo kind="property" type={`'authenticated' | 'verifying' | 'unauthenticated'`}   />


### authenticationError

<MemberInfo kind="property" type={`string`}   />


### isAuthenticated

<MemberInfo kind="property" type={`boolean`}   />


### login

<MemberInfo kind="property" type={`(username: string, password: string, onSuccess?: () =&#62; void) =&#62; void`}   />


### logout

<MemberInfo kind="property" type={`(onSuccess?: () =&#62; void) =&#62; Promise&#60;void&#62;`}   />


### user

<MemberInfo kind="property" type={`ResultOf&#60;typeof CurrentUserQuery&#62;['activeAdministrator'] | undefined`}   />


### channels

<MemberInfo kind="property" type={`NonNullable&#60;ResultOf&#60;typeof CurrentUserQuery&#62;['me']&#62;['channels'] | undefined`}   />




</div>
