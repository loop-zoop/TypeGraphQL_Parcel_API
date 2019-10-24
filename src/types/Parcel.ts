import { ObjectType, Field, ID } from "type-graphql";
import { registerEnumType } from "type-graphql";
import { Status } from "./statusEnum";
import { LocationGQL } from "./Location";

registerEnumType(Status, {
    name: "Status"
});

@ObjectType()
export class ParcelGQL {
    @Field(type => ID)
    id: number;

    @Field()
    name: string;

    @Field(type => Status)
    status: Status;

    @Field()
    location: LocationGQL;

    @Field()
    deliveryAddress: string;
}