import { Resolver, Query, Authorized } from "type-graphql";
import { ParcelGQL } from "../types/Parcel";

@Resolver(type => ParcelGQL)
export class ParcelResolver {
    @Authorized()
    @Query(returns => String)
    async test(parent, args) {
        console.log('Hello World!')
    }
}