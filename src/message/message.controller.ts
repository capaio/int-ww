import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
import { MessageService } from "./message.service";
import { UserService } from "../user/user.service";
import { CreateMessageDto } from "./dto/createMessage.dto";

@Controller("messages")
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly userService: UserService
  ) {}

  @Post()
  async create(@Body() messageData: CreateMessageDto) {
    const user = await this.userService.isLoggedIn(messageData.uuid);

    if (!user) {
      throw new UnauthorizedException("You must be logged in to send messages");
    }

    const club = user.clubs.filter((club) => club.id == messageData.clubId);
    if (club.length === 0) {
      throw new UnauthorizedException(`You don't belong to this club`);
    }

    await this.messageService.create(user, club[0], messageData);
  }
}
