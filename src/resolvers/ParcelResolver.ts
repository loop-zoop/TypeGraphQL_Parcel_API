import { Resolver, Query, Authorized, Mutation, Arg, Int, Ctx } from "type-graphql";
import { ParcelGQL } from "../types/Parcel";
import { ParcelEntity } from "../entity/ParcelEntity";
import { createQueryBuilder, getRepository } from "typeorm";
import { ApolloError } from "apollo-server";

@Resolver(type => ParcelGQL)
export class ParcelResolver {
    @Authorized()
    @Query(returns => String)
    async test(parent, args) {
        console.log('Hello World!')
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

        const updatedParcel = await getRepository(ParcelEntity)
                            .createQueryBuilder('parcel')
                            .select([
                                    "parcel.id",
                                    "parcel.name",
                                    "parcel.deliveryAddress",
                                    "parcel.status"
                                ]
                            )
                            .addSelect("ST_AsText(parcel.location)", "parcel_location")
                            .where('parcel.id = :id', {id: parcelId})
                            .getRawOne()

        const location = updatedParcel.parcel_location.split(' ');
        const longitude = location[0].slice(6, location[0].length)
        const latitude = location[1].slice(0, location[1].length-1)

        const result : ParcelGQL = {
            id: updatedParcel.parcel_id,
            name: updatedParcel.parcel_name,
            deliveryAddress: updatedParcel.parcel_deliveryAddress,
            status: updatedParcel.parcel_status,
            location: {
                longitude: longitude,
                latitude: latitude
            }
        }
        console.log(`Parcel with ID ${updatedParcel.parcel_id} assigned to user with ID ${current_user}`);

        return result

    }
}