import { getConfig } from '../config/config-helpers';
import { MoneyStrategy } from '../config/entity/money-strategy';

let moneyStrategy: MoneyStrategy;

export function roundMoney(value: number, quantity = 1): number {
    if (!moneyStrategy) {
        moneyStrategy = getConfig().entityOptions.moneyStrategy;
    }
    return moneyStrategy.round(value, quantity);
}
