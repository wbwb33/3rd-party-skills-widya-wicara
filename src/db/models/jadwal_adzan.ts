import {Table, Column, Model} from "sequelize-typescript";

@Table
export class JadwalAdzan extends Model<JadwalAdzan> {
    @Column
    uuid!: string;

    @Column
    subuh!: Date;

    @Column
    dzuhur!: Date;

    @Column
    ashar!: Date;

    @Column
    maghrib!: Date;

    @Column
    isya!: Date;
}