import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {Field, ID, ObjectType} from 'type-graphql';
import {Address} from './Address';

@ObjectType()
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Column()
    @Field()
    firstName: string;

    @Column()
    @Field()
    lastName: string;

    @Column()
    @Field()
    phoneNumber: string;

    @Column()
    @Field()
    emailAddress: string;

    @Field(type => [Address])
    @OneToMany(type => Address, address => address.user)
    addresses: Address[]

    @CreateDateColumn()
    @Field()
    createdAt: string;

    @UpdateDateColumn()
    @Field()
    updatedAt: string;
}
