import {Table, Column, Model, Unique} from "sequelize-typescript";

@Table
export class kuis_score extends Model<kuis_score> {
  
  // @Unique
  @Column
  uuid!: string;

  @Column
  score!: number;

  @Column
  done_today!: boolean;
}