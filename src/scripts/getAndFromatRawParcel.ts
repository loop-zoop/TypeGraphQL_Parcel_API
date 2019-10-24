import { getRepository } from "typeorm";
import { ParcelEntity } from "../entity/ParcelEntity";
import { ParcelGQL } from "../types/Parcel";

export async function getAndFormatRawParcel(parcelId) {
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
        .where('parcel.id = :id', { id: parcelId })
        .getRawOne()

    const location = updatedParcel.parcel_location.split(' ');
    const latitude = location[0].slice(6, location[0].length)
    const longitude = location[1].slice(0, location[1].length - 1)

    const result: ParcelGQL = {
        id: updatedParcel.parcel_id,
        name: updatedParcel.parcel_name,
        deliveryAddress: updatedParcel.parcel_deliveryAddress,
        status: updatedParcel.parcel_status,
        location: {
            latitude: latitude,
            longitude: longitude
        }
    }
    return result
}