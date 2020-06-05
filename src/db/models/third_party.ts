import {Table, Column, Model, Unique, DataType} from "sequelize-typescript";

@Table
export class third_party extends Model<third_party> {
  
  @Column
  skill!: string;

  @Column(DataType.TEXT)
  data!: string;

}