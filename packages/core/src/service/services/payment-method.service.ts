import { Injectable } from '@nestjs/common';
import { PaymentMethodQuote } from '@vendure/common/lib/generated-shop-types';
import {
    ConfigurableOperationDefinition,
    CreatePaymentMethodInput,
    UpdatePaymentMethodInput,
} from '@vendure/common/lib/generated-types';
import { omit } from '@vendure/common/lib/omit';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/common/request-context';
import { UserInputError } from '../../common/error/errors';
import { ListQueryOptions } from '../../common/types/common-types';
import { idsAreEqual } from '../../common/utils';
import { ConfigService } from '../../config/config.service';
import { PaymentMethodEligibilityChecker } from '../../config/payment/payment-method-eligibility-checker';
import { PaymentMethodHandler } from '../../config/payment/payment-method-handler';
import { Order } from '../../entity/order/order.entity';
import { PaymentMethod } from '../../entity/payment-method/payment-method.entity';
import { EventBus } from '../../event-bus/event-bus';
import { ConfigArgService } from '../helpers/config-arg/config-arg.service';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { patchEntity } from '../helpers/utils/patch-entity';
import { TransactionalConnection } from '../transaction/transactional-connection';

import { ChannelService } from './channel.service';

@Injectable()
export class PaymentMethodService {
    constructor(
        private connection: TransactionalConnection,
        private configService: ConfigService,
        private listQueryBuilder: ListQueryBuilder,
        private eventBus: EventBus,
        private configArgService: ConfigArgService,
        private channelService: ChannelService,
    ) {}

    findAll(
        ctx: RequestContext,
        options?: ListQueryOptions<PaymentMethod>,
    ): Promise<PaginatedList<PaymentMethod>> {
        return this.listQueryBuilder
            .build(PaymentMethod, options, { ctx, relations: ['channels'], channelId: ctx.channelId })
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items,
                totalItems,
            }));
    }

    findOne(ctx: RequestContext, paymentMethodId: ID): Promise<PaymentMethod | undefined> {
        return this.connection.findOneInChannel(ctx, PaymentMethod, paymentMethodId, ctx.channelId);
    }

    async create(ctx: RequestContext, input: CreatePaymentMethodInput): Promise<PaymentMethod> {
        const paymentMethod = new PaymentMethod(input);
        paymentMethod.handler = this.configArgService.parseInput('PaymentMethodHandler', input.handler);
        if (input.checker) {
            paymentMethod.checker = this.configArgService.parseInput(
                'PaymentMethodEligibilityChecker',
                input.checker,
            );
        }
        this.channelService.assignToCurrentChannel(paymentMethod, ctx);
        return this.connection.getRepository(ctx, PaymentMethod).save(paymentMethod);
    }

    async update(ctx: RequestContext, input: UpdatePaymentMethodInput): Promise<PaymentMethod> {
        const paymentMethod = await this.connection.getEntityOrThrow(ctx, PaymentMethod, input.id);
        const updatedPaymentMethod = patchEntity(paymentMethod, omit(input, ['handler', 'checker']));
        if (input.checker) {
            paymentMethod.checker = this.configArgService.parseInput(
                'PaymentMethodEligibilityChecker',
                input.checker,
            );
        }
        if (input.checker === null) {
            paymentMethod.checker = null;
        }
        if (input.handler) {
            paymentMethod.handler = this.configArgService.parseInput('PaymentMethodHandler', input.handler);
        }
        return this.connection.getRepository(ctx, PaymentMethod).save(updatedPaymentMethod);
    }

    getPaymentMethodEligibilityCheckers(ctx: RequestContext): ConfigurableOperationDefinition[] {
        return this.configArgService
            .getDefinitions('PaymentMethodEligibilityChecker')
            .map(x => x.toGraphQlType(ctx));
    }

    getPaymentMethodHandlers(ctx: RequestContext): ConfigurableOperationDefinition[] {
        return this.configArgService.getDefinitions('PaymentMethodHandler').map(x => x.toGraphQlType(ctx));
    }

    async getEligiblePaymentMethods(ctx: RequestContext, order: Order): Promise<PaymentMethodQuote[]> {
        const paymentMethods = await this.connection
            .getRepository(ctx, PaymentMethod)
            .find({ where: { enabled: true }, relations: ['channels'] });
        const results: PaymentMethodQuote[] = [];
        const paymentMethodsInChannel = paymentMethods.filter(p =>
            p.channels.find(pc => idsAreEqual(pc.id, ctx.channelId)),
        );
        for (const method of paymentMethodsInChannel) {
            let isEligible = true;
            let eligibilityMessage: string | undefined;
            if (method.checker) {
                const checker = this.configArgService.getByCode(
                    'PaymentMethodEligibilityChecker',
                    method.checker.code,
                );
                const eligible = await checker.check(ctx, order, method.checker.args);
                if (eligible === false || typeof eligible === 'string') {
                    isEligible = false;
                    eligibilityMessage = typeof eligible === 'string' ? eligible : undefined;
                }
            }
            results.push({
                id: method.id,
                code: method.code,
                isEligible,
                eligibilityMessage,
            });
        }
        return results;
    }

    async getMethodAndOperations(
        ctx: RequestContext,
        method: string,
    ): Promise<{
        paymentMethod: PaymentMethod;
        handler: PaymentMethodHandler;
        checker: PaymentMethodEligibilityChecker | null;
    }> {
        const paymentMethod = await this.connection
            .getRepository(ctx, PaymentMethod)
            .createQueryBuilder('method')
            .leftJoin('method.channels', 'channel')
            .where('method.code = :code', { code: method })
            .andWhere('channel.id = :channelId', { channelId: ctx.channelId })
            .getOne();
        if (!paymentMethod) {
            throw new UserInputError(`error.payment-method-not-found`, { method });
        }
        const handler = this.configArgService.getByCode('PaymentMethodHandler', paymentMethod.handler.code);
        const checker =
            paymentMethod.checker &&
            this.configArgService.getByCode('PaymentMethodEligibilityChecker', paymentMethod.checker.code);
        return { paymentMethod, handler, checker };
    }
}
