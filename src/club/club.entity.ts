import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "../user/entity/user.entity";
import { MAX_USERS_CLUB } from "../common/constants";
import { MessageEntity } from "../message/message.entity";

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

  @OneToMany(() => MessageEntity, (message) => message.club)
  messages: MessageEntity[];

  @ManyToMany(() => UserEntity, {
    cascade: true,
  })
  @JoinTable({
    name: "club_members",
    inverseJoinColumns: [{ name: "user_id" }],
    joinColumns: [{ name: "club_id" }],
  })
  users: UserEntity[];

  isFull() {
    return this.users.length >= MAX_USERS_CLUB;
  }
}
