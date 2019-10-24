import { Field, Float, InputType } from "type-graphql";

@InputType()
export class LocationInputGQL {
    @Field(type => Float, {description: 'Must be in [−180, 180] range'})
    longitude: number;

    @Field(type => Float, {description: 'Must be in [-90, 90] range'})
    latitude: number;
}