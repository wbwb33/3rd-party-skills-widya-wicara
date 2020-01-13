import {Table, Column, Model} from "sequelize-typescript";

@Table
export class reminder extends Model<reminder> {
  @Column
  uuid!: string;

  @Column
  about_rem!: string;

  @Column
  date_rem!: Date;
}