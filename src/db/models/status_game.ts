import {Table, Column, Model, Default} from "sequelize-typescript";

@Table
export class status_game extends Model<status_game> {
  
  @Column
  uuid!: string;

  @Default(false)
  @Column
  sambung_ayat!: boolean;

}