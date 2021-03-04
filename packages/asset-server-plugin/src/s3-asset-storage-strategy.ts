import { AssetStorageStrategy, Logger } from '@vendure/core';
import { Request } from 'express';
import * as path from 'path';
import { Readable, Stream } from 'stream';

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
     * and supply the profile name (e.g. `'default'`)
     */
    credentials: S3Credentials | S3CredentialsProfile;
    /**
     * @description
     * The S3 bucket in which to store the assets. If it does not exist, it will be created on startup.
     */
    bucket: string;
    /**
     * @description
     * The AWS region in which to host the assets.
     * @deprecated
     * Use nativeS3Configuration instead.
     */
    region?: string;
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
 * plugins: [
 *   AssetServerPlugin.init({
 *     route: 'assets',
 *     assetUploadDir: path.join(__dirname, 'assets'),
 *     port: 5002,
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
 * @docsCategory asset-server-plugin
 * @docsPage S3AssetStorageStrategy
 */
export function configureS3AssetStorage(s3Config: S3Config) {
    return (options: AssetServerOptions) => {
        const { assetUrlPrefix, route } = options;
        const toAbsoluteUrlFn = (request: Request, identifier: string): string => {
            if (!identifier) {
                return '';
            }
            const prefix = assetUrlPrefix || `${request.protocol}://${request.get('host')}/${route}/`;
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
 * @docsCategory asset-server-plugin
 * @docsPage S3AssetStorageStrategy
 * @docsWeight 0
 */
export class S3AssetStorageStrategy implements AssetStorageStrategy {
    private AWS: typeof import('aws-sdk');
    private s3: import('aws-sdk').S3;
    constructor(
        private s3Config: S3Config,
        public readonly toAbsoluteUrl: (request: Request, identifier: string) => string,
    ) {}

    async init() {
        try {
            this.AWS = await import('aws-sdk');
        } catch (e) {
            Logger.error(
                `Could not find the "aws-sdk" package. Make sure it is installed`,
                loggerCtx,
                e.stack,
            );
        }

        const config = {
            credentials: this.getS3Credentials(),
            region: this.s3Config.region,
            ...this.s3Config.nativeS3Configuration,
        };
        this.s3 = new this.AWS.S3(config);
        await this.ensureBucket(this.s3Config.bucket);
    }

    destroy?: (() => void | Promise<void>) | undefined;

    async writeFileFromBuffer(fileName: string, data: Buffer): Promise<string> {
        const result = await this.s3
            .upload(
                {
                    Bucket: this.s3Config.bucket,
                    Key: fileName,
                    Body: data,
                },
                this.s3Config.nativeS3UploadConfiguration,
            )
            .promise();
        return result.Key;
    }

    async writeFileFromStream(fileName: string, data: Stream): Promise<string> {
        const result = await this.s3
            .upload(
                {
                    Bucket: this.s3Config.bucket,
                    Key: fileName,
                    Body: data,
                },
                this.s3Config.nativeS3UploadConfiguration,
            )
            .promise();
        return result.Key;
    }

    async readFileToBuffer(identifier: string): Promise<Buffer> {
        const result = await this.s3.getObject(this.getObjectParams(identifier)).promise();
        const body = result.Body;
        if (!body) {
            Logger.error(`Got undefined Body for ${identifier}`, loggerCtx);
            return Buffer.from('');
        }
        if (body instanceof Buffer) {
            return body;
        }
        if (body instanceof Uint8Array || typeof body === 'string') {
            return Buffer.from(body);
        }
        if (body instanceof Readable) {
            return new Promise((resolve, reject) => {
                const buf: any[] = [];
                body.on('data', data => buf.push(data));
                body.on('error', err => reject(err));
                body.on('end', () => {
                    const intArray = Uint8Array.from(buf);
                    resolve(Buffer.concat([intArray]));
                });
            });
        }
        return Buffer.from(body as any);
    }

    async readFileToStream(identifier: string): Promise<Stream> {
        const result = await this.s3.getObject(this.getObjectParams(identifier)).promise();
        const body = result.Body;
        if (!(body instanceof Stream)) {
            const readable = new Readable();
            readable._read = () => {
                /* noop */
            };
            readable.push(body);
            readable.push(null);
            return readable;
        }
        return body;
    }

    async deleteFile(identifier: string): Promise<void> {
        await this.s3.deleteObject(this.getObjectParams(identifier)).promise();
    }

    async fileExists(fileName: string): Promise<boolean> {
        try {
            await this.s3.headObject(this.getObjectParams(fileName)).promise();
            return true;
        } catch (e) {
            return false;
        }
    }

    private getObjectParams(identifier: string) {
        return {
            Bucket: this.s3Config.bucket,
            Key: path.join(identifier.replace(/^\//, '')),
        };
    }

    private getS3Credentials() {
        const { credentials } = this.s3Config;
        if (this.isCredentialsProfile(credentials)) {
            return new this.AWS.SharedIniFileCredentials(credentials);
        }
        return new this.AWS.Credentials(credentials);
    }

    private async ensureBucket(bucket: string) {
        let bucketExists = false;
        try {
            await this.s3.headBucket({ Bucket: this.s3Config.bucket }).promise();
            bucketExists = true;
            Logger.verbose(`Found S3 bucket "${bucket}"`, loggerCtx);
        } catch (e) {
            Logger.verbose(`Could not find bucket "${bucket}". Attempting to create...`);
        }
        if (!bucketExists) {
            try {
                await this.s3.createBucket({ Bucket: bucket, ACL: 'private' }).promise();
                Logger.verbose(`Created S3 bucket "${bucket}"`, loggerCtx);
            } catch (e) {
                Logger.error(`Could not find nor create the S3 bucket "${bucket}"`, loggerCtx, e.stack);
            }
        }
    }

    private isCredentialsProfile(
        credentials: S3Credentials | S3CredentialsProfile,
    ): credentials is S3CredentialsProfile {
        return credentials.hasOwnProperty('profile');
    }
}
