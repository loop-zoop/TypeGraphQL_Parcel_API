import * as faker from 'faker'
import { ParcelEntity } from "../entity/ParcelEntity";
import { createConnection, createQueryBuilder, getConnection } from "typeorm";

async function seedParcels() {
    await createConnection()
    let parcels = []
    for (let i = 0; i < 15; i++) {
        let parcel = new ParcelEntity();
        parcel.name = faker.commerce.productName();
        parcel.status = 'waiting';
        parcel.deliveryAddress = faker.address.streetAddress();
        let longitude = faker.random.number({
            min: -180,
            max: 180,
            precision: 0.00001,
        })
        let latitude = faker.random.number({
            min: -90,
            max: 90,
            precision: 0.00001,
        })
        parcel.location = `( ST_GeomFromText( 'POINT( ${latitude} ${longitude} )', 4326 ) )`;
        console.log(parcel.location)
        parcels.push(`(DEFAULT, "${parcel.name}", "${parcel.status}", ${parcel.location}, "${parcel.deliveryAddress}")` )

        const query = `INSERT INTO \`parcel_entity\`(\`id\`, \`name\`, \`status\`, \`location\`, \`deliveryAddress\`) VALUES `

        if (parcels.length % 15 === 0) {
            let finalQuery = `${query} ${parcels.join(',\n')};`;
            await getConnection().query(
                finalQuery
            )
        }
    }

}

seedParcels()
.then(() => {
    console.log('done')
    process.exit()
})
.catch(err => {
    console.error(err.message)
    process.exit()
})