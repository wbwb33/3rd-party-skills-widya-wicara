import {Table, Column, Model, Unique} from "sequelize-typescript";

@Table
export class kuis_availability extends Model<kuis_availability> {
  
  @Unique
  @Column
  uuid!: string;

  @Column
  score!: number;

  @Column
  done_today!: boolean;
}