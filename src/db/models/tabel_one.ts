import {Table, Column, Model} from "sequelize-typescript";

@Table
export class TabelOne extends Model<TabelOne> {
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