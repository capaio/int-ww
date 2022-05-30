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
    const user = await this.userService.isLoggedInAndCheckClub(
      messageData.uuid,
      messageData.clubId
    );

    if (!user) {
      throw new UnauthorizedException(
        "You must be logged and belong to the club in to send messages"
      );
    }

    await this.messageService.create(user, user.clubs[0], messageData);
  }
}
