import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "../user/entity/user.entity";
import { ClubEntity } from "../club/club.entity";

@Entity({ name: "fund_requests" })
export class DonationRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity)
  @JoinColumn({
    name: "user_id",
  })
  user: UserEntity;

  @OneToOne(() => ClubEntity)
  @JoinColumn({
    name: "club_id",
  })
  club: ClubEntity;

  @Column()
  amount: number;

  @Column()
  funded: number;

  @Column()
  fulfilled: number;

  isFulfilled() {
    return this.funded >= this.amount;
  }
}
