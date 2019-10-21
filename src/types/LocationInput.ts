import { Field, Float, InputType } from "type-graphql";

@InputType()
export class LocationInputGQL {
    @Field(type => Float)
    longitude: number;

    @Field(type => Float)
    latitude: number;
}