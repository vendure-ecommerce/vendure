import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context.host';
import { of } from 'rxjs';

import { MockConfigService } from '../config/config.service.mock';
import { Asset } from '../entity/asset/asset.entity';

import { AssetInterceptor } from './asset-interceptor';

describe('AssetInterceptor', () => {
    function testInterceptor<T>(
        response: T,
        assertFn: (response: T, result: T, toAbsoluteUrlFn: jest.Mock) => void,
    ) {
        return (done: jest.DoneCallback) => {
            const toAbsoluteUrl = jest.fn().mockReturnValue('visited');
            const configService = new MockConfigService();
            configService.assetStorageStrategy = { toAbsoluteUrl };
            const interceptor = new AssetInterceptor(configService as any);
            const executionContext = new ExecutionContextHost([0, 0, { req: {} }]);
            const call$ = of(response);

            interceptor.intercept(executionContext, call$).subscribe(result => {
                assertFn(response, result, toAbsoluteUrl);
                done();
            });
        };
    }

    function mockAsset() {
        return new Asset({ preview: 'original', source: 'original' });
    }

    it(
        'passes through responses without Assets',
        testInterceptor(
            {
                foo: 1,
                bar: {
                    baz: false,
                },
            },
            (response, result, toAbsoluteUrl) => {
                expect(result).toBe(response);
                expect(toAbsoluteUrl).toHaveBeenCalledTimes(0);
            },
        ),
    );

    it(
        'visits a top-level Asset',
        testInterceptor(
            {
                foo: 1,
                bar: mockAsset(),
            },
            (response, result, toAbsoluteUrl) => {
                expect(result.bar.source).toBe('visited');
                expect(result.bar.preview).toBe('visited');
                expect(toAbsoluteUrl).toHaveBeenCalledTimes(2);
            },
        ),
    );

    it(
        'visits a top-level array of Assets',
        testInterceptor(
            {
                foo: 1,
                bar: [mockAsset(), mockAsset()],
            },
            (response, result, toAbsoluteUrl) => {
                expect(result.bar[0].source).toBe('visited');
                expect(result.bar[0].preview).toBe('visited');
                expect(result.bar[1].source).toBe('visited');
                expect(result.bar[1].preview).toBe('visited');
                expect(toAbsoluteUrl).toHaveBeenCalledTimes(4);
            },
        ),
    );

    it(
        'visits a nested Asset',
        testInterceptor(
            {
                foo: 1,
                bar: [
                    {
                        baz: {
                            quux: mockAsset(),
                        },
                    },
                ],
            },
            (response, result, toAbsoluteUrl) => {
                expect(result.bar[0].baz.quux.source).toBe('visited');
                expect(result.bar[0].baz.quux.preview).toBe('visited');
                expect(toAbsoluteUrl).toHaveBeenCalledTimes(2);
            },
        ),
    );

    it(
        'handles null values',
        testInterceptor(
            {
                foo: 1,
                bar: null,
            },
            (response, result, toAbsoluteUrl) => {
                expect(result).toEqual({ foo: 1, bar: null });
                expect(toAbsoluteUrl).toHaveBeenCalledTimes(0);
            },
        ),
    );

    it(
        'handles undefined values',
        testInterceptor(
            {
                foo: 1,
                bar: undefined,
            },
            (response, result, toAbsoluteUrl) => {
                expect(result).toEqual({ foo: 1, bar: undefined });
                expect(toAbsoluteUrl).toHaveBeenCalledTimes(0);
            },
        ),
    );
});
