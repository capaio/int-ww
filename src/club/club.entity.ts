import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "../user/entity/user.entity";

@Entity({ name: "clubs" })
export class ClubEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity)
  @JoinColumn({
    name: "manager_id",
  })
  manager: UserEntity;

  @Column({ length: 255 })
  club_name: string;
}
