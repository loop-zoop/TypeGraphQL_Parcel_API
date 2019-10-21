import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { LocationGQL } from "../types/Location";

@Entity()
export class ParcelEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    status: string;

    @Column({
        type: "point",
        srid: 4326
    })
    location: string;

    @Column()
    deliveryAddress: string;
}