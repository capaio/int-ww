import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { ClubService } from "./club.service";
import { CreateClubDto } from "./dto/createClub.dto";
import { UserService } from "../user/user.service";

@Controller("club")
export class ClubController {
  constructor(
    private readonly clubService: ClubService,
    private readonly userService: UserService
  ) {}

  @Get("")
  findOne() {
    return this.clubService.getAll();
  }

  @Post("")
  async create(@Body() createClubData: CreateClubDto) {
    const user = await this.userService.isLoggedIn(createClubData.uuid);
    if (!user) {
      throw new UnauthorizedException(
        "You must be logged in to create a new club"
      );
    }

    if (!user.canCreateClub()) {
      throw new UnauthorizedException(`'You don't have enough money'`);
    }

    const club = await this.clubService.create(user, createClubData.name);

    user.payCreateFeeClub();
    await this.userService.updateWallet(user.wallet);

    return { clubId: club.id };
  }
}
