import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { WalletEntity } from "./wallet.entity";

@Entity({ name: "users" })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  username: string;

  @Column({ length: 255 })
  pwd: string;

  @OneToOne(() => WalletEntity)
  @JoinColumn({
    name: "wallet_id",
  })
  wallet: WalletEntity;
}
