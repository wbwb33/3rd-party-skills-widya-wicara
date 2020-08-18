import {Table, Column, Model, PrimaryKey, AutoIncrement, Default} from "sequelize-typescript";

@Table({tableName: 'adzan_status'})
export class AdzanStatus extends Model<AdzanStatus> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  uuid!: string;

  @Default(0)
  @Column
  last_subuh!: number;

  @Default(0)
  @Column
  last_dzuhur!: number;

  @Default(0)
  @Column
  last_ashar!: number;

  @Default(0)
  @Column
  last_maghrib!: number;

  @Default(0)
  @Column
  last_isya!: number;

  @Default(0)
  @Column
  last_all!: number;
}