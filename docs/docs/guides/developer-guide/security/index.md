---
title: "Security"
---

Security of your Vendure application includes considering how to prevent and protect against common security threats such as:

- Data breaches
- Unauthorized access
- Attacks aimed at disrupting the service

Vendure itself is designed with security in mind, but you must also consider the security of your own application code, the server environment, and the network architecture.

## Basics

Here are some basic measures you should use to secure your Vendure application. These are not exhaustive, but they are a good starting point.

### Change the default credentials

Do not deploy any public Vendure instance with the default superadmin credentials (`superadmin:superadmin`). Use your hosting platform's environment variables to set a **strong** password for the Superadmin account.

```ts
import { VendureConfig } from '@vendure/core';

export const config: VendureConfig = {
  authOptions: {
    tokenMethod: ['bearer', 'cookie'],
    superadminCredentials: {
      identifier: process.env.SUPERADMIN_USERNAME,
      password: process.env.SUPERADMIN_PASSWORD,
    },
  },
  // ...
};
```

### Use the HardenPlugin

It is recommended that you install and configure the [HardenPlugin](/reference/core-plugins/harden-plugin/) for all production deployments. This plugin locks down your schema 
(disabling introspection and field suggestions) and protects your Shop API against malicious queries that could otherwise overwhelm your server.

Install the plugin:

```sh
npm install @vendure/harden-plugin

# or

yarn add @vendure/harden-plugin
```

Then add it to your VendureConfig:

```ts
import { VendureConfig } from '@vendure/core';
import { HardenPlugin } from '@vendure/harden-plugin';

const IS_DEV = process.env.APP_ENV === 'dev';

export const config: VendureConfig = {
  // ...
  plugins: [
    HardenPlugin.init({
      maxQueryComplexity: 500,
      apiMode: IS_DEV ? 'dev' : 'prod',
    }),
    // ...
  ]
};
```

:::info
For a detailed explanation of how to best configure this plugin, see the [HardenPlugin docs](/reference/core-plugins/harden-plugin/).
:::

### Harden the AssetServerPlugin

If you are using the [AssetServerPlugin](/reference/core-plugins/asset-server-plugin/), it is possible by default to use the dynamic
image transform feature to overload the server with requests for new image sizes & formats. To prevent this, you can
configure the plugin to only allow transformations for the preset sizes, and limited quality levels and formats.
Since v3.1 we ship the [PresetOnlyStrategy](/reference/core-plugins/asset-server-plugin/preset-only-strategy/) for this purpose, and
you can also create your own strategies.

```ts
import { VendureConfig } from '@vendure/core';
import { AssetServerPlugin, PresetOnlyStrategy } from '@vendure/asset-server-plugin';

export const config: VendureConfig = {
  // ...
  plugins: [
    AssetServerPlugin.init({
      // ...
      // highlight-start  
      imageTransformStrategy: new PresetOnlyStrategy({
        defaultPreset: 'large',
        permittedQuality: [0, 50, 75, 85, 95],
        permittedFormats: ['jpg', 'webp', 'avif'],
        allowFocalPoint: false,
      }),
      // highlight-end
    }),
  ]
};
```

## OWASP Top Ten Security Assessment

The Open Worldwide Application Security Project (OWASP) is a nonprofit foundation that works to improve the security of software.

It publishes a top 10 list of common web application vulnerabilities: https://owasp.org/Top10

This section assesses Vendure against this list, stating what is covered **out of the box** (built in to the framework or easily configurable) and what needs to be **additionally considered.**

### 1. Broken Access Control

Reference: https://owasp.org/Top10/A01_2021-Broken_Access_Control/

Out of the box:

- Vendure uses role-based access control
- We deny by default for non-public API requests
- Built-in CORS controls for session cookies
- Directory listing is not possible via default configuration (e.g. exposing web root dir contents)
- Stateful session identifiers should be invalidated on the server after logout. On logout we delete all session records from the DB & session cache.

To consider:

- Rate limit API and controller access to minimize the harm from automated attack tooling.

### 2. Cryptographic Failures

Reference: https://owasp.org/Top10/A02_2021-Cryptographic_Failures/

Out of the box:

- Vendure defaults to bcrypt with 12 salt rounds for storing passwords. This strategy is configurable if security requirements mandate alternative algorithms.
- No deprecated hash functions (SHA1, MD5) are used in security-related contexts (only for things like creating cache keys).
- Payment information is not stored in Vendure by default. Payment integrations rely on the payment provider to store all sensitive data.

To consider:

- The Vendure server will not use TLS be default. The usual configuration is to handle this at the gateway level on your production platform.
- If a network caching layer is used (e.g. Stellate), ensure it is configured to not cache user-related data (customer details, active order etc)

### 3. Injection

Reference: https://owasp.org/Top10/A03_2021-Injection/

Out of the box:

- GraphQL has built-in validation of incoming data
- All database operations are parameterized - no string concatenation using user-supplied data.
- List queries apply default limits to prevent mass disclosure of records.

To consider:

- If using custom fields, you should consider defining a validation function to prevent bad data from getting into the database.

### 4. Insecure Design

Reference: https://owasp.org/Top10/A04_2021-Insecure_Design/

Out of the box:

- Use of established libraries for the critical underlying components: NestJS, TypeORM, Angular.
- End-to-end tests of security-related flows such as authentication, verification, and RBAC permissions controls.
- Harden plugin provides pre-configured protections against common attack vectors targeting GraphQL APIs.

To consider:

- Tiered exposure such as an API gateway which prevents exposure of the Admin API to the public internet.
- Limit resource usage of Vendure server & worker instances via containerization.
- Rate limiting & other network-level protections (such as Cloudflare) should be considered.

### 5. Security Misconfiguration

Reference: https://owasp.org/Top10/A05_2021-Security_Misconfiguration/

Out of the box:

- Single point of configuration for the entire application, reducing the chance of misconfiguration.
- A default setup only requires a database, which means there are few components to configure and harden.
- Stack traces are not leaked in API errors

To consider:

- Ensure the default superadmin credentials are not used in production
- Use environment variables to turn off development features such as the GraphQL playground
- Use the HardenPlugin in production to automatically turn of development features and restrict system information leaking via API.
- Use fine-grained permissions and roles for your administrator accounts to reduce the attack surface if an account is compromised.

### 6. Vulnerable and Outdated Components

Reference: https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/

Out of the box:

- All dependencies are updated to current versions with each minor release
- Modular design limits the number of dependencies for core packages.
- Automated code & dependency scanning is used in the Vendure repo

To consider:

- Run your own audits on your code base.
- Use version override mechanisms if needed to patch and critical Vendure dependencies that did not yet get updated.

### 7. Identification and Authentication Failures

Reference: https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/

Out of the box:

- Valid usernames are not leaked via mechanisms such as account reset
- Does not permit "knowlege-based" account recovery
- Uses strong password hashing (bcrypt with 12 salt rounds)
- Session identifiers are not exposed in API urls (instead we use headers/cookies)
- New session tokens always regenerated after successful login
- Sessions deleted during logout
- Cryptographically-strong, high-entropy session tokens are used (crypto.randomBytes API)

To consider:

- Implementing a multi-factor authentication flow
- Do not use default superadmin credentials in production
- Implementing a custom PasswordValidationStrategy to disallow weak/common passwords
- Subscribe to AttemptedLoginEvent to implement detection of brute-force attacks

### 8. Software and Data Integrity Failures

Reference: https://owasp.org/Top10/A08_2021-Software_and_Data_Integrity_Failures/

To consider:

- Exercise caution when introducing new dependencies to your project.
- Do not use untrusted Vendure plugins. Where possible review the code prior to use.
- Exercise caution if using auto-updating mechanisms for dependencies.
- If storing serialized data in custom fields, implement validation to prevent untrusted data getting into the database.
- Evaluate your CI/CD pipeline against the OWASP recommendations for this point

### 9. Security Logging and Monitoring Failures

Reference: https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/

Out of the box:

- APIs for integrating logging & monitoring tools & services, e.g. configurable Logger interface & ErrorHandlerStrategy
- Official Sentry integration for application performance monitoring

To consider:

- Integrate with dedicated logging tools for improved log management
- Integrate with monitoring tools such as Sentry
- Use the EventBus to monitor events such as repeated failed login attempts and high-value orders

### 10. Server-Side Request Forgery (SSRF)

Reference: [https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_(SSRF)/](https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/)

Out of the box:

- By default Vendure does not rely on requests to remote servers for core functionality

To consider:

- Review the OWASP recommendations against your network architecture
