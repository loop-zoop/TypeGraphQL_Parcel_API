import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";
import { ParcelEntity } from "./ParcelEntity";

@Entity()
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column() 
    fullName: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @OneToMany(type => ParcelEntity, parcel => parcel.user)
    parcels: ParcelEntity[];

    @Column({nullable: true})
    token: string;
}