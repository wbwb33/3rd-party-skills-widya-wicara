import {Table, Column, Model, Unique} from "sequelize-typescript";

@Table
export class kuis_score_ramadan extends Model<kuis_score_ramadan> {
  
  // @Unique
  @Column
  uuid!: string;

  @Column
  score!: number;

  @Column
  done_today!: boolean;
}