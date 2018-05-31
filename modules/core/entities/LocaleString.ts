import {Field, ID} from 'type-graphql';
import {Column, PrimaryGeneratedColumn} from 'typeorm';

export class LocaleString {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Column()
    @Field()
    sku: string;

    @Column()
    @Field()
    name: string;
}
