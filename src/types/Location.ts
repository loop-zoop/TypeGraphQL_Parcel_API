import { ObjectType, Field, Float } from "type-graphql";

@ObjectType()
export class LocationGQL {
    @Field(type => Float, {description: 'Must be in [−180, 180] range'})
    longitude: number;

    @Field(type => Float, {description: 'Must be in [-90, 90] range'})
    latitude: number;
}