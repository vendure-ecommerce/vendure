import { PubSub } from '@google-cloud/pubsub';
import { ModuleRef } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { Injector, Job } from '@vendure/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PUB_SUB_OPTIONS } from './constants';
import { PubSubOptions } from './options';
import { PubSubJobQueueStrategy } from './pub-sub-job-queue-strategy';

describe('PubSubJobQueueStrategy', () => {
    let strategy: PubSubJobQueueStrategy;
    let pubsub: any;
    let topic: any;

    beforeEach(async () => {
        topic = {
            publish: vi.fn(),
        };
        pubsub = {
            topic: vi.fn(() => {
                return topic;
            }),
        };

        const options = {
            concurrency: 1,
            queueNamePubSubPair: new Map([['test-queue', ['test-topic', 'test-subscription']]]),
        } as PubSubOptions;

        const moduleRef = await Test.createTestingModule({
            providers: [
                { provide: PubSub, useValue: pubsub },
                { provide: PUB_SUB_OPTIONS, useValue: options },
            ],
        }).compile();

        strategy = new PubSubJobQueueStrategy();
        strategy.init(new Injector(moduleRef.get(ModuleRef)));
    });

    it('cannot publish to not configured queue', async () => {
        expect.assertions(2);
        try {
            await strategy.add(
                new Job({
                    queueName: 'some-queue',
                    data: {},
                }),
            );
        } catch (err: any) {
            expect(err).toEqual(new Error('Topic name not set for queue: some-queue'));
        }
        expect(pubsub.topic).not.toHaveBeenCalled();
    });

    it('publishes new jobs to topic', async () => {
        const data = {
            some: 'data',
        };
        await strategy.add(
            new Job({
                queueName: 'test-queue',
                data,
            }),
        );
        expect(pubsub.topic).toHaveBeenCalledWith('test-topic');
        expect(topic.publish).toHaveBeenCalledWith(Buffer.from(JSON.stringify(data)));
    });
});
