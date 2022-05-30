import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { WalletEntity } from "./wallet.entity";
import { CREATE_CLUB_FEE, JOIN_CLUB_FEE } from "../../common/constants";
import { ClubEntity } from "../../club/club.entity";

@Entity({ name: "users" })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  username: string;

  @Column({ length: 255, select: false })
  pwd: string;

  @Column({ length: 255, select: false })
  session_id: string;

  @Column({ type: "timestamp", select: false })
  session_expiration: Date;

  @OneToOne(() => WalletEntity, {
    cascade: true,
  })
  @JoinColumn({
    name: "wallet_id",
  })
  wallet: WalletEntity;

  @ManyToMany(() => ClubEntity, {
    cascade: true,
  })
  @JoinTable({
    name: "club_members",
    joinColumns: [{ name: "user_id" }],
    inverseJoinColumns: [{ name: "club_id" }],
  })
  clubs: ClubEntity[];

  canCreateClub(): boolean {
    return this.wallet.soft_currency >= CREATE_CLUB_FEE;
  }

  canJoinClub(): boolean {
    return this.wallet.soft_currency >= JOIN_CLUB_FEE;
  }

  payCreateFeeClub() {
    if (this.canCreateClub()) {
      this.wallet.soft_currency -= CREATE_CLUB_FEE;
    }
  }
}
