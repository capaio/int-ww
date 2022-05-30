import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { ClubEntity } from "./club.entity";
import { ClubService } from "./club.service";
import { ClubController } from "./club.controller";
import { UserModule } from "../user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([ClubEntity]), UserModule],
  providers: [ClubService],
  controllers: [ClubController],
})
export class ClubModule {}
