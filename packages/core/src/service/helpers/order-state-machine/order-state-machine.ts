import { Injectable } from '@nestjs/common';

import { RequestContext } from '../../../api/common/request-context';
import { IllegalOperationError } from '../../../common/error/errors';
import { FSM } from '../../../common/finite-state-machine/finite-state-machine';
import { mergeTransitionDefinitions } from '../../../common/finite-state-machine/merge-transition-definitions';
import { StateMachineConfig, Transitions } from '../../../common/finite-state-machine/types';
import { validateTransitionDefinition } from '../../../common/finite-state-machine/validate-transition-definition';
import { awaitPromiseOrObservable } from '../../../common/utils';
import { ConfigService } from '../../../config/config.service';
import { OrderProcess } from '../../../config/index';
import { TransactionalConnection } from '../../../connection/transactional-connection';
import { Order } from '../../../entity/order/order.entity';
import { EventBus } from '../../../event-bus/index';
import { HistoryService } from '../../services/history.service';
import { ProductVariantService } from '../../services/product-variant.service';
import { PromotionService } from '../../services/promotion.service';
import { StockMovementService } from '../../services/stock-movement.service';

import { OrderState, OrderTransitionData } from './order-state';

@Injectable()
export class OrderStateMachine {
    readonly config: StateMachineConfig<OrderState, OrderTransitionData>;
    private readonly initialState: OrderState = 'Created';

    constructor(
        private connection: TransactionalConnection,
        private configService: ConfigService,
        private stockMovementService: StockMovementService,
        private historyService: HistoryService,
        private promotionService: PromotionService,
        private eventBus: EventBus,
        private productVariantService: ProductVariantService,
    ) {
        this.config = this.initConfig();
    }

    getInitialState(): OrderState {
        return this.initialState;
    }

    canTransition(currentState: OrderState, newState: OrderState): boolean {
        return new FSM(this.config, currentState).canTransitionTo(newState);
    }

    getNextStates(order: Order): ReadonlyArray<OrderState> {
        const fsm = new FSM(this.config, order.state);
        return fsm.getNextStates();
    }

    async transition(ctx: RequestContext, order: Order, state: OrderState) {
        const fsm = new FSM(this.config, order.state);
        await fsm.transitionTo(state, { ctx, order });
        order.state = fsm.currentState;
    }

    private initConfig(): StateMachineConfig<OrderState, OrderTransitionData> {
        const orderProcesses = this.configService.orderOptions.process ?? [];

        const emptyProcess: OrderProcess<any> = { transitions: {} };
        const allTransitions = orderProcesses.reduce(
            (transitions, process) =>
                mergeTransitionDefinitions(transitions, process.transitions as Transitions<any>),
            {} as Transitions<OrderState>,
        );

        const validationResult = validateTransitionDefinition(allTransitions, 'AddingItems');

        return {
            transitions: allTransitions,
            onTransitionStart: async (fromState, toState, data) => {
                for (const process of orderProcesses) {
                    if (typeof process.onTransitionStart === 'function') {
                        const result = await awaitPromiseOrObservable(
                            process.onTransitionStart(fromState, toState, data),
                        );
                        if (result === false || typeof result === 'string') {
                            return result;
                        }
                    }
                }
            },
            onTransitionEnd: async (fromState, toState, data) => {
                for (const process of orderProcesses) {
                    if (typeof process.onTransitionEnd === 'function') {
                        await awaitPromiseOrObservable(process.onTransitionEnd(fromState, toState, data));
                    }
                }
            },
            onError: async (fromState, toState, message) => {
                for (const process of orderProcesses) {
                    if (typeof process.onTransitionError === 'function') {
                        await awaitPromiseOrObservable(
                            process.onTransitionError(fromState, toState, message),
                        );
                    }
                }
                throw new IllegalOperationError(message || 'message.cannot-transition-order-from-to', {
                    fromState,
                    toState,
                });
            },
        };
    }
}
