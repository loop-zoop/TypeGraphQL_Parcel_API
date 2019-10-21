import { ObjectType, Field, Float } from "type-graphql";

@ObjectType()
export class LocationGQL {
    @Field(type => Float)
    longitude: number;

    @Field(type => Float)
    latitude: number;
}