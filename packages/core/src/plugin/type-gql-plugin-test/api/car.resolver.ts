import { Query, Resolver } from '@nestjs/graphql';

import { PaginatedCars } from '../entitiy/paginatedCars.entity';

@Resolver('Car')
export class CarResolver {
    @Query(() => PaginatedCars)
    cars() {
        const list = new PaginatedCars();
        list.items = [
            {
                id: 1,
                brand: 'Honda',
                model: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];
        list.itemsCount = 1;
        return list;
    }
}
