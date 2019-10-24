import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, Index } from "typeorm";
import { LocationGQL } from "../types/Location";
import { UserEntity } from "./UserEntity";
import { ParcelResolver } from "../resolvers/ParcelResolver";
import { Status } from "../types/statusEnum";

@Entity()
export class ParcelEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    status: string;

    @Index({ spatial: true })
    @Column("geometry", {
        spatialFeatureType: "point",
        srid: 4326
    })
    location: string;

    @Column()
    deliveryAddress: string;

    @ManyToOne(type => UserEntity, user => user.parcels)
    user: UserEntity;
}