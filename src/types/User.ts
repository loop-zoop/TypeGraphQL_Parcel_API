import { ObjectType, Field, InputType } from "type-graphql";
import { BaseEntity } from "typeorm";

@ObjectType()
export class UserGQL extends BaseEntity {
    @Field()
    fullName: string;

    @Field()
    email: string;
    
    @Field()
    token: string;
}