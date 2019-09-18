import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { Device } from "../device/entity";

@Entity()
export class User {
    /**
     * Kolom id, auto increment
     */
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * Kolom username, min 3 karakter, tipe data varchar(60), dengan atribut unik
     */
    @MinLength(3)
    @Column("varchar", { length: 60, unique: true })
    username: string;

    /**
     * Kolom password, min 8 karakter, tipe data varchar(60). select: false agar tidak di ikutkan dalam query dan operasi find
     */
    @MinLength(8)
    @Column("varchar", { length: 60, select: false })
    password: string;

    /**
     * Kolom username, min 3 karakter, tipe data varchar(60).
     */
    @MinLength(3)
    @Column("varchar", { length: 60 })
    name: string;

    /**
     * Kolom username, validasi email, tipe data varchar(50), dengan atribut unik
     */
    @IsEmail()
    @Column("varchar", { length: 50, unique: true })
    email: string;

    /**
     * Kolom token, tipe data integer. select: false agar tidak di ikutkan dalam query dan operasi find
     */
    @Column({ type: "int", select: false })
    token: number;

    /**
     * Relation declaration
     */
    @OneToMany(type => Device, device => device.pairedTo)
    device: Device[];
}