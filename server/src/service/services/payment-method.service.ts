import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { UpdatePaymentMethodInput } from '../../../../shared/generated-types';
import { omit } from '../../../../shared/omit';
import { ID, PaginatedList } from '../../../../shared/shared-types';
import { assertNever } from '../../../../shared/shared-utils';
import { UserInputError } from '../../common/error/errors';
import { ListQueryOptions } from '../../common/types/common-types';
import { ConfigService } from '../../config/config.service';
import {
    PaymentMethodArgs,
    PaymentMethodArgType,
    PaymentMethodHandler,
} from '../../config/payment-method/payment-method-handler';
import { Order } from '../../entity/order/order.entity';
import { PaymentMethod } from '../../entity/payment-method/payment-method.entity';
import { Payment, PaymentMetadata } from '../../entity/payment/payment.entity';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { getEntityOrThrow } from '../helpers/utils/get-entity-or-throw';
import { patchEntity } from '../helpers/utils/patch-entity';

@Injectable()
export class PaymentMethodService {
    constructor(
        @InjectConnection() private connection: Connection,
        private configService: ConfigService,
        private listQueryBuilder: ListQueryBuilder,
    ) {}

    async initPaymentMethods() {
        await this.ensurePaymentMethodsExist();
    }

    findAll(options?: ListQueryOptions<PaymentMethod>): Promise<PaginatedList<PaymentMethod>> {
        return this.listQueryBuilder
            .build(PaymentMethod, options)
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items,
                totalItems,
            }));
    }

    findOne(paymentMethodId: ID): Promise<PaymentMethod | undefined> {
        return this.connection.manager.findOne(PaymentMethod, paymentMethodId);
    }

    async update(input: UpdatePaymentMethodInput): Promise<PaymentMethod> {
        const paymentMethod = await getEntityOrThrow(this.connection, PaymentMethod, input.id);
        const updatedPaymentMethod = patchEntity(paymentMethod, omit(input, ['configArgs']));
        if (input.configArgs) {
            const handler = this.configService.paymentOptions.paymentMethodHandlers.find(
                h => h.code === paymentMethod.code,
            );
            if (handler) {
                updatedPaymentMethod.configArgs = input.configArgs.map(a => ({
                    name: a.name,
                    type: handler.args[a.name],
                    value: a.value,
                }));
            }
        }
        return this.connection.getRepository(PaymentMethod).save(updatedPaymentMethod);
    }

    async createPayment(order: Order, method: string, metadata: PaymentMetadata): Promise<Payment> {
        const paymentMethod = await this.connection.getRepository(PaymentMethod).findOne({
            where: {
                code: method,
                enabled: true,
            },
        });
        if (!paymentMethod) {
            throw new UserInputError(`error.payment-method-not-found`, { method });
        }
        const payment = await paymentMethod.createPayment(order, metadata);
        return this.connection.getRepository(Payment).save(payment);
    }

    private async ensurePaymentMethodsExist() {
        const paymentMethodHandlers: Array<PaymentMethodHandler<PaymentMethodArgs>> = this.configService
            .paymentOptions.paymentMethodHandlers;
        const existingPaymentMethods = await this.connection.getRepository(PaymentMethod).find();
        const missing = paymentMethodHandlers.filter(
            h => !existingPaymentMethods.find(pm => pm.code === h.code),
        );

        for (const handler of paymentMethodHandlers) {
            let paymentMethod = existingPaymentMethods.find(pm => pm.code === handler.code);

            if (!paymentMethod) {
                paymentMethod = new PaymentMethod({
                    code: handler.code,
                    enabled: true,
                    configArgs: [],
                });
            }

            for (const [name, type] of Object.entries(handler.args)) {
                if (!paymentMethod.configArgs.find(ca => ca.name === name)) {
                    paymentMethod.configArgs.push({
                        name,
                        type,
                        value: this.getDefaultValue(type),
                    });
                }
            }
            paymentMethod.configArgs = paymentMethod.configArgs.filter(ca =>
                handler.args.hasOwnProperty(ca.name),
            );
            await this.connection.getRepository(PaymentMethod).save(paymentMethod);
        }
    }

    private getDefaultValue(type: PaymentMethodArgType): string {
        switch (type) {
            case 'string':
                return '';
            case 'boolean':
                return 'false';
            case 'int':
                return '0';
            default:
                assertNever(type);
                return '';
        }
    }
}
