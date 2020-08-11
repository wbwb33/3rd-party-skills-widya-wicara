import {Table, Column, Model, PrimaryKey, AutoIncrement, Default} from "sequelize-typescript";

@Table({tableName: 'adzan_status'})
export class AdzanStatus extends Model<AdzanStatus> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  uuid!: string;

  @Column
  lastDay!: number;

  @Column
  lastMonth!: number;

  @Column
  lastYear!: number;

  @Default(true)
  @Column
  week!: boolean;
}