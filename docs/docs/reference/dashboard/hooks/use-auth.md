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

<GenerationInfo sourceFile="packages/dashboard/src/lib/hooks/use-auth.tsx" sourceLine="15" packageName="@vendure/dashboard" since="3.3.0" />

Provides access to the <a href='/reference/dashboard/hooks/use-auth#authcontext'>AuthContext</a> which contains information
about the active channel.

```ts title="Signature"
function useAuth(): void
```


## AuthContext

<GenerationInfo sourceFile="packages/dashboard/src/lib/providers/auth.tsx" sourceLine="16" packageName="@vendure/dashboard" since="3.3.0" />

Provides information about the current user & their authentication & authorization
status.

```ts title="Signature"
interface AuthContext {
    status: 'initial' | 'authenticated' | 'verifying' | 'unauthenticated';
    authenticationError?: string;
    isAuthenticated: boolean;
    login: (username: string, password: string, onSuccess?: () => void) => void;
    logout: (onSuccess?: () => void) => Promise<void>;
    user: ResultOf<typeof CurrentUserQuery>['activeAdministrator'] | undefined;
    channels: NonNullable<ResultOf<typeof CurrentUserQuery>['me']>['channels'] | undefined;
    refreshCurrentUser: () => void;
}
```

<div className="members-wrapper">

### status

<MemberInfo kind="property" type={`'initial' | 'authenticated' | 'verifying' | 'unauthenticated'`}   />

The status of the authentication.
### authenticationError

<MemberInfo kind="property" type={`string`}   />

The error message if the authentication fails.
### isAuthenticated

<MemberInfo kind="property" type={`boolean`}   />

Whether the user is authenticated.
### login

<MemberInfo kind="property" type={`(username: string, password: string, onSuccess?: () =&#62; void) =&#62; void`}   />

The function to login the user.
### logout

<MemberInfo kind="property" type={`(onSuccess?: () =&#62; void) =&#62; Promise&#60;void&#62;`}   />

The function to logout the user.
### user

<MemberInfo kind="property" type={`ResultOf&#60;typeof CurrentUserQuery&#62;['activeAdministrator'] | undefined`}   />

The user object.
### channels

<MemberInfo kind="property" type={`NonNullable&#60;ResultOf&#60;typeof CurrentUserQuery&#62;['me']&#62;['channels'] | undefined`}   />

The channels object.
### refreshCurrentUser

<MemberInfo kind="property" type={`() =&#62; void`}   />

The function to refresh the current user.


</div>
