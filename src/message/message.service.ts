import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { MessageEntity } from "./message.entity";
import { UserEntity } from "../user/entity/user.entity";
import { CreateMessageDto } from "./dto/createMessage.dto";
import { ClubEntity } from "../club/club.entity";

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>
  ) {}

  async create(
    user: UserEntity,
    club: ClubEntity,
    messageData: CreateMessageDto
  ) {
    const message = new MessageEntity();

    message.user = user;
    message.club = club;
    message.message = messageData.message;

    return this.messageRepository.save(message);
  }
}
