import { Message, PubSub, Subscription, Topic } from '@google-cloud/pubsub';
import { JobState } from '@vendure/common/lib/generated-types';
import { InjectableJobQueueStrategy, Injector, Job, JobData, JobQueueStrategy, Logger } from '@vendure/core';

import { loggerCtx, PUB_SUB_OPTIONS } from './constants';
import { PubSubOptions } from './options';

export class PubSubJobQueueStrategy extends InjectableJobQueueStrategy implements JobQueueStrategy {
    private concurrency: number;
    private queueNamePubSubPair: Map<string, [string, string]>;
    private pubSubClient: PubSub;
    private topics = new Map<string, Topic>();
    private subscriptions = new Map<string, Subscription>();

    init(injector: Injector) {
        this.pubSubClient = injector.get(PubSub);
        const options = injector.get<PubSubOptions>(PUB_SUB_OPTIONS);
        this.concurrency = options.concurrency ?? 20;
        this.queueNamePubSubPair = options.queueNamePubSubPair ?? new Map();

        super.init(injector);
    }

    destroy() {
        super.destroy();
        for (const subscription of this.subscriptions.values()) {
            subscription.removeAllListeners('message');
        }
        this.subscriptions.clear();
        this.topics.clear();
    }

    async add<Data extends JobData<Data> = {}>(job: Job<Data>): Promise<Job<Data>> {
        if (!this.hasInitialized) {
            throw new Error('Cannot add job before init');
        }

        const id = await this.topic(job.queueName).publish(Buffer.from(JSON.stringify(job.data)));
        Logger.debug(`Sent message ${job.queueName}: ${id}`);

        return new Job<Data>({
            id,
            queueName: job.queueName,
            data: job.data,
            attempts: 0,
            state: JobState.PENDING,
            createdAt: new Date(),
        });
    }

    start<Data extends JobData<Data> = {}>(queueName: string, process: (job: Job<Data>) => Promise<any>) {
        if (!this.hasInitialized) {
            this.started.set(queueName, process);
            return;
        }

        const subscription = this.subscription(queueName);

        subscription.on('message', (message: Message) => {
            Logger.debug(`Received message: ${queueName}: ${message.id}`, loggerCtx);

            const job = new Job<Data>({
                id: message.id,
                queueName,
                data: JSON.parse(message.data.toString()),
                attempts: message.deliveryAttempt,
                state: JobState.RUNNING,
                startedAt: new Date(),
                createdAt: message.publishTime,
            });

            process(job)
                .then(() => {
                    message.ack();
                })
                .catch(err => {
                    message.nack();
                });
        });
    }

    stop(queueName: string) {
        this.subscription(queueName).removeAllListeners('message');
        return Promise.resolve();
    }

    topic(queueName: string): Topic {
        let topic = this.topics.get(queueName);
        if (topic) {
            return topic;
        }

        const pair = this.queueNamePubSubPair.get(queueName);
        if (!pair) {
            throw new Error(`Topic name not set for queue: ${queueName}`);
        }

        const [topicName, subscriptionName] = pair;
        topic = this.pubSubClient.topic(topicName);
        this.topics.set(queueName, topic);

        return topic;
    }

    subscription(queueName: string): Subscription {
        let subscription = this.subscriptions.get(queueName);
        if (subscription) {
            return subscription;
        }

        const pair = this.queueNamePubSubPair.get(queueName);
        if (!pair) {
            throw new Error(`Subscription name not set for queue: ${queueName}`);
        }

        const [topicName, subscriptionName] = pair;
        subscription = this.topic(queueName).subscription(subscriptionName, {
            flowControl: {
                maxMessages: this.concurrency,
            },
        });
        this.subscriptions.set(queueName, subscription);

        return subscription;
    }
}
