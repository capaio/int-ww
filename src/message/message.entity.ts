import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "../user/entity/user.entity";
import { ClubEntity } from "../club/club.entity";

@Entity({ name: "messages" })
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @ManyToOne(() => ClubEntity)
  @JoinColumn({
    name: "club_id",
  })
  club: ClubEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({
    name: "user_id",
  })
  user: UserEntity;

  @Column({ type: "timestamp" })
  created_at: Date;
}
