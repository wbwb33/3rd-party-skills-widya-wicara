import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @MinLength(3)
    @Column("varchar", { length: 60, unique: true })
    username: string;

    @MinLength(8)
    @Column("varchar", { length: 60, select: false })
    password: string;

    @MinLength(3)
    @Column("varchar", { length: 60 })
    name: string;

    @IsEmail()
    @Column("varchar", { length: 50, unique: true })
    email: string;

    @IsNotEmpty({
        message: "Required"
    })
    @Column({ type: "int", select: false })
    token: number;

    @IsNotEmpty({
        message: "Required"
    })
    @Column("varchar", { length: 10 })
    method: string;

    @Column("varchar", { length: 32, nullable: true })
    googleid: string;
}