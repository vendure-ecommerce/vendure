import {Field, ObjectType, ID} from 'type-graphql';
import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {User} from './User';

@ObjectType()
@Entity()
export class Address {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Field(type => User)
    @ManyToOne(type => User, user => user.addresses)
    user: User

    @Column()
    @Field()
    fullName: string;

    @Column()
    @Field({ nullable: true })
    company: string;

    @Column()
    @Field()
    streetLine1: string;

    @Column()
    @Field({ nullable: true })
    streetLine2: string;

    @Column()
    @Field()
    city: string;

    @Column()
    @Field({ nullable: true })
    province: string;

    @Column()
    @Field({ nullable: true })
    postalCode: string;

    @Column()
    @Field()
    country: string;

    @Column()
    @Field({ nullable: true })
    phoneNumber: string;

    @Column()
    @Field()
    defaultShippingAddress: boolean;

    @Column()
    @Field()
    defaultBillingAddress: boolean;

    @CreateDateColumn()
    @Field()
    createdAt: string;

    @UpdateDateColumn()
    @Field()
    updatedAt: string;
}
