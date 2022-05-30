import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { MessageEntity } from "./message.entity";
import { UserModule } from "../user/user.module";
import { MessageService } from "./message.service";
import { MessageController } from "./message.controller";
import { ClubModule } from "../club/club.module";

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity]), UserModule, ClubModule],
  providers: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
