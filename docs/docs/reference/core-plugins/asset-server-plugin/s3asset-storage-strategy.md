---
title: "S3AssetStorageStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## S3AssetStorageStrategy

<GenerationInfo sourceFile="packages/asset-server-plugin/src/s3-asset-storage-strategy.ts" sourceLine="155" packageName="@vendure/asset-server-plugin" />

An <a href='/reference/typescript-api/assets/asset-storage-strategy#assetstoragestrategy'>AssetStorageStrategy</a> which uses [Amazon S3](https://aws.amazon.com/s3/) object storage service.
To us this strategy you must first have access to an AWS account.
See their [getting started guide](https://aws.amazon.com/s3/getting-started/) for how to get set up.

Before using this strategy, make sure you have the `@aws-sdk/client-s3` and `@aws-sdk/lib-storage` package installed:

```sh
npm install @aws-sdk/client-s3 @aws-sdk/lib-storage
```

**Note:** Rather than instantiating this manually, use the <a href='/reference/core-plugins/asset-server-plugin/s3asset-storage-strategy#configures3assetstorage'>configureS3AssetStorage</a> function.

## Use with S3-compatible services (MinIO)
This strategy will also work with any S3-compatible object storage solutions, such as [MinIO](https://min.io/).
See the <a href='/reference/core-plugins/asset-server-plugin/s3asset-storage-strategy#configures3assetstorage'>configureS3AssetStorage</a> for an example with MinIO.

```ts title="Signature"
class S3AssetStorageStrategy implements AssetStorageStrategy {
    constructor(s3Config: S3Config, toAbsoluteUrl: (request: Request, identifier: string) => string)
    init() => ;
    destroy?: (() => void | Promise<void>) | undefined;
    writeFileFromBuffer(fileName: string, data: Buffer) => ;
    writeFileFromStream(fileName: string, data: Readable) => ;
    readFileToBuffer(identifier: string) => ;
    readFileToStream(identifier: string) => ;
    deleteFile(identifier: string) => ;
    fileExists(fileName: string) => ;
}
```
* Implements: <code><a href='/reference/typescript-api/assets/asset-storage-strategy#assetstoragestrategy'>AssetStorageStrategy</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(s3Config: <a href='/reference/core-plugins/asset-server-plugin/s3asset-storage-strategy#s3config'>S3Config</a>, toAbsoluteUrl: (request: Request, identifier: string) =&#62; string) => S3AssetStorageStrategy`}   />


### init

<MemberInfo kind="method" type={`() => `}   />


### destroy

<MemberInfo kind="property" type={`(() =&#62; void | Promise&#60;void&#62;) | undefined`}   />


### writeFileFromBuffer

<MemberInfo kind="method" type={`(fileName: string, data: Buffer) => `}   />


### writeFileFromStream

<MemberInfo kind="method" type={`(fileName: string, data: Readable) => `}   />


### readFileToBuffer

<MemberInfo kind="method" type={`(identifier: string) => `}   />


### readFileToStream

<MemberInfo kind="method" type={`(identifier: string) => `}   />


### deleteFile

<MemberInfo kind="method" type={`(identifier: string) => `}   />


### fileExists

<MemberInfo kind="method" type={`(fileName: string) => `}   />




</div>


## S3Config

<GenerationInfo sourceFile="packages/asset-server-plugin/src/s3-asset-storage-strategy.ts" sourceLine="19" packageName="@vendure/asset-server-plugin" />

Configuration for connecting to AWS S3.

```ts title="Signature"
interface S3Config {
    credentials: AwsCredentialIdentity | AwsCredentialIdentityProvider;
    bucket: string;
    nativeS3Configuration?: any;
    nativeS3UploadConfiguration?: any;
}
```

<div className="members-wrapper">

### credentials

<MemberInfo kind="property" type={`AwsCredentialIdentity | AwsCredentialIdentityProvider`}   />

The credentials used to access your s3 account. You can supply either the access key ID & secret, or you can make use of a
[shared credentials file](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html)
To use a shared credentials file, import the `fromIni()` function from the "@aws-sdk/credential-provider-ini" or "@aws-sdk/credential-providers" package and supply
the profile name (e.g. `{ profile: 'default' }`) as its argument.
### bucket

<MemberInfo kind="property" type={`string`}   />

The S3 bucket in which to store the assets. If it does not exist, it will be created on startup.
### nativeS3Configuration

<MemberInfo kind="property" type={`any`}   />

Configuration object passed directly to the AWS SDK.
S3.Types.ClientConfiguration can be used after importing aws-sdk.
Using type `any` in order to avoid the need to include `aws-sdk` dependency in general.
### nativeS3UploadConfiguration

<MemberInfo kind="property" type={`any`}   />

Configuration object passed directly to the AWS SDK.
ManagedUpload.ManagedUploadOptions can be used after importing aws-sdk.
Using type `any` in order to avoid the need to include `aws-sdk` dependency in general.


</div>


## configureS3AssetStorage

<GenerationInfo sourceFile="packages/asset-server-plugin/src/s3-asset-storage-strategy.ts" sourceLine="119" packageName="@vendure/asset-server-plugin" />

Returns a configured instance of the <a href='/reference/core-plugins/asset-server-plugin/s3asset-storage-strategy#s3assetstoragestrategy'>S3AssetStorageStrategy</a> which can then be passed to the <a href='/reference/core-plugins/asset-server-plugin/asset-server-options#assetserveroptions'>AssetServerOptions</a>
`storageStrategyFactory` property.

Before using this strategy, make sure you have the `@aws-sdk/client-s3` and `@aws-sdk/lib-storage` package installed:

```sh
npm install @aws-sdk/client-s3 @aws-sdk/lib-storage
```

*Example*

```ts
import { AssetServerPlugin, configureS3AssetStorage } from '@vendure/asset-server-plugin';
import { DefaultAssetNamingStrategy } from '@vendure/core';
import { fromEnv } from '@aws-sdk/credential-providers';

// ...

plugins: [
  AssetServerPlugin.init({
    route: 'assets',
    assetUploadDir: path.join(__dirname, 'assets'),
    namingStrategy: new DefaultAssetNamingStrategy(),
    storageStrategyFactory: configureS3AssetStorage({
      bucket: 'my-s3-bucket',
      credentials: fromEnv(), // or any other credential provider
      nativeS3Configuration: {
        region: process.env.AWS_REGION,
      },
    }),
}),
```

## Usage with MinIO

Reference: [How to use AWS SDK for Javascript with MinIO Server](https://docs.min.io/docs/how-to-use-aws-sdk-for-javascript-with-minio-server.html)

*Example*

```ts
import { AssetServerPlugin, configureS3AssetStorage } from '@vendure/asset-server-plugin';
import { DefaultAssetNamingStrategy } from '@vendure/core';

// ...

plugins: [
  AssetServerPlugin.init({
    route: 'assets',
    assetUploadDir: path.join(__dirname, 'assets'),
    namingStrategy: new DefaultAssetNamingStrategy(),
    storageStrategyFactory: configureS3AssetStorage({
      bucket: 'my-minio-bucket',
      credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY_ID,
        secretAccessKey: process.env.MINIO_SECRET_ACCESS_KEY,
      },
      nativeS3Configuration: {
        endpoint: process.env.MINIO_ENDPOINT ?? 'http://localhost:9000',
        forcePathStyle: true,
        signatureVersion: 'v4',
        // The `region` is required by the AWS SDK even when using MinIO,
        // so we just use a dummy value here.
        region: 'eu-west-1',
      },
    }),
}),
```

```ts title="Signature"
function configureS3AssetStorage(s3Config: S3Config): void
```
Parameters

### s3Config

<MemberInfo kind="parameter" type={`<a href='/reference/core-plugins/asset-server-plugin/s3asset-storage-strategy#s3config'>S3Config</a>`} />

