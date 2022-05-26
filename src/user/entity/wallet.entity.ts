import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "wallets" })
export class WalletEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int")
  hard_currency: number;

  @Column("int")
  soft_currency: number;
}
