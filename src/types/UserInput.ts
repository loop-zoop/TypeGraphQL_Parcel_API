import { Field, InputType, Int } from "type-graphql";
import { BaseEntity } from "typeorm";

@InputType()
export class UserInputGQL extends BaseEntity {

    @Field()
    fullName: string;

    @Field()
    email: string;

    @Field()
    password: string;
}