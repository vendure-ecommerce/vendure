import { Field, Int, ObjectType } from '@nestjs/graphql';

interface PaginatedList<T> {
    items: T[];
    itemsCount: number;
}

export default function PaginatedResponse<TItem>(TItemClass: TItem): any {
    // `isAbstract` decorator option is mandatory to prevent registering in schema
    @ObjectType({ isAbstract: true })
    abstract class PaginatedResponseClass {
        // here we use the runtime argument
        @Field(type => [TItemClass])
        // and here the generic type
        items: TItem[];

        @Field(type => Int)
        itemsCount: number;
    }
    return PaginatedResponseClass;
}
