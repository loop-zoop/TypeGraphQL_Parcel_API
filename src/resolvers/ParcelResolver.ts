import { Resolver, Query, Authorized, Mutation, Arg, Int, Ctx } from "type-graphql";
import { ParcelGQL } from "../types/Parcel";
import { ParcelEntity } from "../entity/ParcelEntity";
import { createQueryBuilder, getRepository } from "typeorm";
import { ApolloError } from "apollo-server";
import { getAndFormatRawParcel } from "../scripts/getAndFromatRawParcel"
import { LocationInputGQL } from "../types/LocationInput";
import { getFormatedListOfLocationsByRadius } from "../scripts/getListOfRawLocations";

@Resolver(type => ParcelGQL)
export class ParcelResolver {
    @Authorized()
    @Query(returns => [ParcelGQL])
    async getNearByParcels(
        @Arg('location', location => LocationInputGQL) location: LocationInputGQL,
        @Arg('radius', radius => Int, {description: 'Provide in meters!'}) radius: number
    ) {
        try {
            const formatedResult = await getFormatedListOfLocationsByRadius(radius, location);
            return formatedResult;
        } catch(error) {
            throw new ApolloError(
                `Something went wrong: ${error}. Make sure to provide radius in meters. Latitudes range from -90 to 90. Longitudes range from -180 to 180.`
            )
        }
    }

    @Authorized()
    @Mutation(returns => ParcelGQL)
    async assignParcel(
        @Arg('parcelId', parcelId => Int) parcelId: number,
        @Ctx() context: any
    ) {
        const current_user = context.user.data.id
        const rawParcel = await getRepository(ParcelEntity)
        .createQueryBuilder('parcel')
        .select("parcel.user")
        .where('parcel.id = :id', {id: parcelId}).getRawOne()

        if (rawParcel.userId && rawParcel.userId !== current_user) {
            throw new ApolloError(
                'Sorry! Parcel is already assigned to another user'
            )
        } else {
            await createQueryBuilder().update(ParcelEntity).set({status: "assigned", user: current_user}).where('id = :id', {id: parcelId}).execute()
        }

        console.log(`Parcel with ID ${parcelId} assigned to user with ID ${current_user}`);

        return getAndFormatRawParcel(parcelId)

    }

    @Authorized()
    @Mutation(returns => ParcelGQL)
    async pickParcel(
        @Arg('parcelId', parcelId => Int) parcelId: number,
        @Ctx() context: any
    ) {
        const current_user = context.user.data.id
        const rawParcel = await getRepository(ParcelEntity)
        .createQueryBuilder('parcel')
        .select(["parcel.user", "parcel.status"])
        .where('parcel.id = :id', {id: parcelId}).getRawOne()

        if (rawParcel.parcel_status !== 'assigned') {
            throw new ApolloError(
                'Sorry! Parcel is not yet assigned or it is already picked up'
            )
        } else if (rawParcel.userId !== current_user) {
            throw new ApolloError(
                'Sorry! Parcel is assigned to another user'
            )
        } else {
            await createQueryBuilder().update(ParcelEntity).set({status: "picked_up"}).where('id = :id', {id: parcelId}).execute()
            console.log(`Parcel with ID ${parcelId} picked up by user with ID ${current_user}`);
        }

        return getAndFormatRawParcel(parcelId)
    }

    @Authorized()
    @Mutation(returns => ParcelGQL)
    async deliverParcel(
        @Arg('parcelId', parcelId => Int) parcelId: number,
        @Ctx() context: any
    ) {
        const current_user = context.user.data.id
        const rawParcel = await getRepository(ParcelEntity)
        .createQueryBuilder('parcel')
        .select(["parcel.user", "parcel.status"])
        .where('parcel.id = :id', {id: parcelId}).getRawOne()

        if (rawParcel.parcel_status !== 'picked_up') {
            throw new ApolloError(
                'Sorry! Parcel is not yet picked_up or it is already delivered'
            )
        } else if (rawParcel.userId !== current_user) {
            throw new ApolloError(
                'Sorry! Parcel is assigned to another user'
            )
        } else {
            await createQueryBuilder().update(ParcelEntity).set({status: "delivered"}).where('id = :id', {id: parcelId}).execute()
        }

        console.log(`Parcel with ID ${parcelId} delivered by user with ID ${current_user}`);

        return getAndFormatRawParcel(parcelId)
    }
    
}