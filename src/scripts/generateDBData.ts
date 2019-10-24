import * as faker from 'faker'
import * as bcrypt from 'bcrypt';
import { ParcelEntity } from "../entity/ParcelEntity";
import { createConnection, getConnection, createQueryBuilder } from "typeorm";
import { UserEntity } from '../entity/UserEntity';

const amountOfParcelRecords = 500;
const amountOfUserRecords = 50;

async function seedParcels() {
    await createConnection()
    let users = []

    for (let i = 0; i < amountOfUserRecords; i++) {
        let user = new UserEntity();
        user.fullName = faker.name.findName()
        user.password = bcrypt.hashSync('qwerty', 10)
        user.email = faker.internet.email()
        users.push(user)
    }
    if (users.length % amountOfUserRecords === 0) {
        await createQueryBuilder(UserEntity)
                .insert()
                .values(users)
                .execute()
    }

    let parcels = []
    for (let i = 0; i < amountOfParcelRecords; i++) {
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
        parcels.push(`(DEFAULT, "${parcel.name}", "${parcel.status}", ${parcel.location}, "${parcel.deliveryAddress}")` )

        const query = `INSERT INTO \`parcel_entity\`(\`id\`, \`name\`, \`status\`, \`location\`, \`deliveryAddress\`) VALUES `

        if (parcels.length % amountOfParcelRecords === 0) {
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