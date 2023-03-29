import { S3ClientConfig } from '@aws-sdk/client-s3';
import { AssetStorageStrategy, Logger } from '@vendure/core';
import { Request } from 'express';
import * as path from 'node:path';
import { Readable } from 'node:stream';

import { getAssetUrlPrefixFn } from './common';
import { loggerCtx } from './constants';
import { AssetServerOptions } from './types';

export type S3Credentials = {
    accessKeyId: string;
    secretAccessKey: string;
};

export type S3CredentialsProfile = {
    profile: string;
};

/**
 * @description
 * Configuration for connecting to AWS S3.
 *
 * @docsCategory asset-server-plugin
 * @docsPage S3AssetStorageStrategy
 */
export interface S3Config {
    /**
     * @description
     * The credentials used to access your s3 account. You can supply either the access key ID & secret,
     * or you can make use of a
     * [shared credentials file](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html)
     * and supply the profile name (e.g. `'default'`).
     */
    credentials?: S3Credentials | S3CredentialsProfile;
    /**
     * @description
     * The S3 bucket in which to store the assets. If it does not exist, it will be created on startup.
     */
    bucket: string;
    /**
     * @description
     * Configuration object passed directly to the AWS SDK.
     * S3.Types.ClientConfiguration can be used after importing aws-sdk.
     * Using type `any` in order to avoid the need to include `aws-sdk` dependency in general.
     */
    nativeS3Configuration?: any;
    /**
     * @description
     * Configuration object passed directly to the AWS SDK.
     * ManagedUpload.ManagedUploadOptions can be used after importing aws-sdk.
     * Using type `any` in order to avoid the need to include `aws-sdk` dependency in general.
     */
    nativeS3UploadConfiguration?: any;
}

/**
 * @description
 * Returns a configured instance of the {@link S3AssetStorageStrategy} which can then be passed to the {@link AssetServerOptions}
 * `storageStrategyFactory` property.
 *
 * Before using this strategy, make sure you have the `aws-sdk` package installed:
 *
 * ```sh
 * npm install aws-sdk
 * ```
 *
 * @example
 * ```TypeScript
 * import { AssetServerPlugin, configureS3AssetStorage } from '\@vendure/asset-server-plugin';
 * import { DefaultAssetNamingStrategy } from '\@vendure/core';
 *
 * // ...
 *
 * plugins: [
 *   AssetServerPlugin.init({
 *     route: 'assets',
 *     assetUploadDir: path.join(__dirname, 'assets'),
 *     namingStrategy: new DefaultAssetNamingStrategy(),
 *     storageStrategyFactory: configureS3AssetStorage({
 *       bucket: 'my-s3-bucket',
 *       credentials: {
 *         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
 *         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
 *       },
 *     }),
 * }),
 * ```
 *
 * ## Usage with MinIO
 *
 * Reference: [How to use AWS SDK for Javascript with MinIO Server](https://docs.min.io/docs/how-to-use-aws-sdk-for-javascript-with-minio-server.html)
 *
 * @example
 * ```TypeScript
 * import { AssetServerPlugin, configureS3AssetStorage } from '\@vendure/asset-server-plugin';
 * import { DefaultAssetNamingStrategy } from '\@vendure/core';
 *
 * // ...
 *
 * plugins: [
 *   AssetServerPlugin.init({
 *     route: 'assets',
 *     assetUploadDir: path.join(__dirname, 'assets'),
 *     namingStrategy: new DefaultAssetNamingStrategy(),
 *     storageStrategyFactory: configureS3AssetStorage({
 *       bucket: 'my-minio-bucket',
 *       credentials: {
 *         accessKeyId: process.env.MINIO_ACCESS_KEY_ID,
 *         secretAccessKey: process.env.MINIO_SECRET_ACCESS_KEY,
 *       },
 *       nativeS3Configuration: {
 *         endpoint: process.env.MINIO_ENDPOINT ?? 'http://localhost:9000',
 *         s3ForcePathStyle: true,
 *         signatureVersion: 'v4',
 *       },
 *     }),
 * }),
 * ```
 * @docsCategory asset-server-plugin
 * @docsPage S3AssetStorageStrategy
 */
export function configureS3AssetStorage(s3Config: S3Config) {
    return (options: AssetServerOptions) => {
        const prefixFn = getAssetUrlPrefixFn(options);
        const toAbsoluteUrlFn = (request: Request, identifier: string): string => {
            if (!identifier) {
                return '';
            }
            const prefix = prefixFn(request, identifier);
            return identifier.startsWith(prefix) ? identifier : `${prefix}${identifier}`;
        };
        return new S3AssetStorageStrategy(s3Config, toAbsoluteUrlFn);
    };
}

/**
 * @description
 * An {@link AssetStorageStrategy} which uses [Amazon S3](https://aws.amazon.com/s3/) object storage service.
 * To us this strategy you must first have access to an AWS account.
 * See their [getting started guide](https://aws.amazon.com/s3/getting-started/?nc=sn&loc=5) for how to get set up.
 *
 * Before using this strategy, make sure you have the `aws-sdk` package installed:
 *
 * ```sh
 * npm install aws-sdk
 * ```
 *
 * **Note:** Rather than instantiating this manually, use the {@link configureS3AssetStorage} function.
 *
 * ## Use with S3-compatible services (MinIO)
 * This strategy will also work with any S3-compatible object storage solutions, such as [MinIO](https://min.io/).
 * See the {@link configureS3AssetStorage} for an example with MinIO.
 *
 * @docsCategory asset-server-plugin
 * @docsPage S3AssetStorageStrategy
 * @docsWeight 0
 */
export class S3AssetStorageStrategy implements AssetStorageStrategy {
    private AWS: typeof import('@aws-sdk/client-s3');
    private s3: import('@aws-sdk/client-s3').S3;
    constructor(
        private s3Config: S3Config,
        public readonly toAbsoluteUrl: (request: Request, identifier: string) => string,
    ) {}

    async init() {
        try {
            this.AWS = await import('@aws-sdk/client-s3');
        } catch (err: any) {
            Logger.error(
                'Could not find the "aws-sdk" package. Make sure it is installed',
                loggerCtx,
                err.stack,
            );
        }

        const config = {
            credentials: await this.getS3Credentials(),
            ...this.s3Config.nativeS3Configuration,
        } satisfies S3ClientConfig

        this.s3 = new this.AWS.S3(config);
        await this.ensureBucket(this.s3Config.bucket);
    }

    destroy?: (() => void | Promise<void>) | undefined;

    async writeFileFromBuffer(fileName: string, data: Buffer): Promise<string> {
        const upload = new (await import('@aws-sdk/lib-storage')).Upload({
            client: this.s3,
            params: {
                ...this.s3Config.nativeS3UploadConfiguration,
                Bucket: this.s3Config.bucket,
                Key: fileName,
                Body: data,
            }
        })

        return upload.done().then((result) => {
            if (!('Key' in result) || !result.Key) {
                Logger.error(`Got undefined Key for ${fileName}`, loggerCtx);
                throw new Error(`Got undefined Key for ${fileName}`);
            }

            return result.Key;
        })
    }

    async writeFileFromStream(fileName: string, data: Readable): Promise<string> {
        const upload = new (await import('@aws-sdk/lib-storage')).Upload({
            client: this.s3,
            params: {
                ...this.s3Config.nativeS3UploadConfiguration,
                Bucket: this.s3Config.bucket,
                Key: fileName,
                Body: data,
            },
        });

        return upload.done().then((result) => {
            if (!('Key' in result) || !result.Key) {
                Logger.error(`Got undefined Key for ${fileName}`, loggerCtx);
                throw new Error(`Got undefined Key for ${fileName}`);
            }

            return result.Key;
        });
    }

    async readFileToBuffer(identifier: string): Promise<Buffer> {
        const result = await this.s3.getObject(this.getObjectParams(identifier));
        const body = result.Body as Readable | undefined;

        if (!body) {
            Logger.error(`Got undefined Body for ${identifier}`, loggerCtx);
            return Buffer.from('');
        }

        const chunks: Buffer[] = [];
        for await (const chunk of body) {
            chunks.push(chunk);
        }

        return Buffer.concat(chunks);
    }

    async readFileToStream(identifier: string): Promise<Readable> {
        const result = await this.s3.getObject(this.getObjectParams(identifier));
        const body = result.Body as Readable | undefined;

        if (!body) {
            return new Readable({ read() { this.push(null); } });
        }

        return body;
    }

    async deleteFile(identifier: string): Promise<void> {
        await this.s3.deleteObject(this.getObjectParams(identifier));
    }

    async fileExists(fileName: string): Promise<boolean> {
        try {
            await this.s3.headObject(this.getObjectParams(fileName));
            return true;
        } catch (err: any) {
            return false;
        }
    }

    private getObjectParams(identifier: string) {
        return {
            Bucket: this.s3Config.bucket,
            Key: path.join(identifier.replace(/^\//, '')),
        };
    }

    private async getS3Credentials() {
        const { credentials } = this.s3Config;
        if (credentials == null) {
            return undefined;
        } else if (this.isCredentialsProfile(credentials)) {
            return (await import('@aws-sdk/credential-provider-ini')).fromIni(credentials);
        }
        return credentials
    }

    private async ensureBucket(bucket: string) {
        let bucketExists = false;
        try {
            await this.s3.headBucket({ Bucket: this.s3Config.bucket });
            bucketExists = true;
            Logger.verbose(`Found S3 bucket "${bucket}"`, loggerCtx);
        } catch (err: any) {
            Logger.verbose(
                `Could not find bucket "${bucket}: ${JSON.stringify(err.message)}". Attempting to create...`,
            );
        }
        if (!bucketExists) {
            try {
                await this.s3.createBucket({ Bucket: bucket, ACL: 'private' });
                Logger.verbose(`Created S3 bucket "${bucket}"`, loggerCtx);
            } catch (err: any) {
                Logger.error(
                    `Could not find nor create the S3 bucket "${bucket}: ${JSON.stringify(err.message)}"`,
                    loggerCtx,
                    err.stack,
                );
            }
        }
    }

    private isCredentialsProfile(
        credentials: S3Credentials | S3CredentialsProfile,
    ): credentials is S3CredentialsProfile {
        return credentials.hasOwnProperty('profile');
    }
}
