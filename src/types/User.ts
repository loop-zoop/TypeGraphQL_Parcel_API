import { ObjectType, Field, Int} from "type-graphql";
import { BaseEntity } from "typeorm";

@ObjectType()
export class UserGQL extends BaseEntity {
    @Field(type => Int)
    id: number;

    @Field()
    fullName: string;

    @Field()
    token: string;
}