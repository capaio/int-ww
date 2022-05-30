import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { DonationRequestEntity } from "./donation.entity";
import { DonationService } from "./donation.service";
import { DonationController } from "./donation.controller";

@Module({
  imports: [TypeOrmModule.forFeature([DonationRequestEntity]), UserModule],
  providers: [DonationService],
  exports: [DonationService],
  controllers: [DonationController],
})
export class DonationModule {}
