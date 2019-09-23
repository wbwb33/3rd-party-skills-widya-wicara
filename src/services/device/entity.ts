import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { IsNotEmpty } from "class-validator";
import { User } from "../users/entity";

@Entity()
export class Device {
    /**
     * Column id, int, auto increment
     */
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * Column device_key, required, varchar(60).
     * Used to save device key widya speaker.
     */
    // TODO: device_key is unique
    @IsNotEmpty({ message: "Required" })
    @Column("varchar", { length: 60, unique: true })
    device_key: string;

    /**
     * Column device_ip, varchar(60).
     * Used to save the device ip address.
     */
    @Column("varchar", { length: 60, nullable: true })
    device_ip: string;

    /**
     * Column connected_ssid, varchar(60).
     * Used to save the device ip address.
     */
    @Column("varchar", { length: 32, nullable: true })
    connected_ssid: string;

    /**
     * Column firmware_version, required, varchar(60).
     * Used to save the device widya speaker firmware version.
     */
    @Column("varchar", { length: 60 })
    firmware_version: string;

    /**
    * Column device_name, required, varchar(20).
    * Used to save the device name, alias to the speaker
    */
    @Column("varchar", { length: 20, nullable: true })
    device_name: string;

    /**
     * Column device_type, required, varchar(20).
     * Used to save the widya device type, either "WOW" or "PRIMA".
     */
    @Column("varchar", { length: 20, nullable: true })
    device_type: string;

    /**
     * Column paired_to, required, integer.
     * Used to save user_id. Foreign key User -> id
     * It can be used to check is device has been paired or not
     */
    // @Column({ nullable: true })
    @ManyToOne(type => User, user => user.id)
    pairedTo: User | null;
}