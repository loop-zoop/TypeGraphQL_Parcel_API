import { ParcelEntity } from "../entity/ParcelEntity";
import { LocationInputGQL } from "../types/LocationInput";
import { getRepository } from "typeorm";
import { ParcelGQL } from "../types/Parcel";

export async function getFormatedListOfLocationsByRadius(radius: number, location: LocationInputGQL) {
    function toRad(grad: number): number {
        return (grad / 180) * Math.PI
    }
    function toGrad(rad: number): number {
        return (rad / (2 * Math.PI)) * 360
    }

    //длинна земного шара в метрах
    const R = 6371 * 1000
    const dist: number = radius

    const longitude: number = location.longitude
    const latitude: number = location.latitude

    const deltaLat = toGrad(dist / R)
    const deltaLon = toGrad(dist / (R * Math.cos(toRad(latitude))))

    console.log(deltaLat)
    console.log(deltaLon)

    const polygon = `POLYGON((
      ${latitude - deltaLat} ${longitude - deltaLon},
      ${latitude + deltaLat} ${longitude - deltaLon} ,
      ${latitude + deltaLat} ${longitude + deltaLon} ,
      ${latitude - deltaLat} ${longitude + deltaLon} ,
      ${latitude - deltaLat} ${longitude - deltaLon}  
    ))`

    const rawParcels = await getRepository(ParcelEntity).createQueryBuilder('parcel')
        .select(["parcel.id",
            "parcel.name",
            "parcel.deliveryAddress",
            "parcel.status"])
        .addSelect(
            `ST_Distance(location, ST_SRID(Point(${longitude},${latitude}),4326),"metre") as distance`,
        )
        .addSelect('ST_ASTEXT(location) as location')
        .where(
            `ST_CONTAINS(ST_GEOMFROMTEXT("${polygon}",4326),location)`,
        )
        .having(`distance < ${dist}`)
        .orderBy('distance', 'ASC')
        .getRawMany()


    const formatedResult = []


    if (!rawParcels) {
        return formatedResult
    } else {
        for (let i = 0; i < rawParcels.length; i++) {
            const location = rawParcels[i].location.split(' ');
            const latitude = location[0].slice(6, location[0].length);
            const longitude = location[1].slice(0, location[1].length - 1);

            let rawParcel: ParcelGQL = {
                id: rawParcels[i].parcel_id,
                name: rawParcels[i].parcel_name,
                deliveryAddress: rawParcels[i].parcel_deliveryAddress,
                status: rawParcels[i].parcel_status,
                location: {
                    latitude: latitude,
                    longitude: longitude
                }
            }

            formatedResult.push(rawParcel)
        }
    }

    return formatedResult
}