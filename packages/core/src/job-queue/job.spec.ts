import { describe, expect, it } from 'vitest';

import { Job } from './job';

describe('Job class', () => {
    describe('ensuring job data is serializable', () => {
        it('getters are converted to plain properties', () => {
            class Order {
                code = 123;
                get totalPrice() {
                    return 42;
                }
            }

            const job = new Job({
                queueName: 'test',
                data: new Order(),
            });

            expect(job.data).toEqual({
                code: 123,
                totalPrice: 42,
            });
        });

        it('getters are converted to plain properties (nested)', () => {
            class Order {
                code = 123;
                get totalPrice() {
                    return 42;
                }
            }

            const data: any = {
                order: new Order(),
            };

            const job = new Job({
                queueName: 'test',
                data,
            });

            expect(job.data).toEqual({
                order: {
                    code: 123,
                    totalPrice: 42,
                },
            });
        });

        it('getters are converted to plain properties (nested array)', () => {
            class Order {
                code = 123;
                get totalPrice() {
                    return 42;
                }
            }

            const data: any = {
                orders: [new Order()],
            };

            const job = new Job({
                queueName: 'test',
                data,
            });

            expect(job.data).toEqual({
                orders: [
                    {
                        code: 123,
                        totalPrice: 42,
                    },
                ],
            });
        });

        it('handles dates', () => {
            const date = new Date('2020-03-01T10:00:00Z');

            const job = new Job({
                queueName: 'test',
                data: date as any,
            });

            expect(job.data).toEqual(date.toISOString());
        });

        it('handles dates (nested)', () => {
            const date = new Date('2020-03-01T10:00:00Z');

            const job = new Job({
                queueName: 'test',
                data: { createdAt: date as any },
            });

            expect(job.data).toEqual({ createdAt: date.toISOString() });
        });

        it('handles objects with cycles', () => {
            const parent = {
                name: 'parent',
                child: {
                    name: 'child',
                    parent: {} as any,
                },
            };
            parent.child.parent = parent;

            const job = new Job({
                queueName: 'test',
                data: parent,
            });

            expect(job.data).toEqual({
                name: 'parent',
                child: {
                    name: 'child',
                    parent: {
                        child: {
                            name: 'child',
                            parent: {
                                child: {
                                    name: 'child',
                                    parent: {
                                        child: {
                                            name: 'child',
                                            parent: {
                                                child: {
                                                    name: 'child',
                                                    parent: {
                                                        child: '[max depth reached]',
                                                        name: '[max depth reached]',
                                                    },
                                                },
                                                name: 'parent',
                                            },
                                        },
                                        name: 'parent',
                                    },
                                },
                                name: 'parent',
                            },
                        },
                        name: 'parent',
                    },
                },
            });
        });
    });
});
