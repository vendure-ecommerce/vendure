import { Query, Resolver } from '@nestjs/graphql';

import Car from '../entitiy/car.entity';

@Resolver('Car')
export class CarResolver {
    @Query(returns => [Car])
    cars() {
        return [
            {
                id: 1,
                brand: 'Honda',
                model: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];
    }
}
