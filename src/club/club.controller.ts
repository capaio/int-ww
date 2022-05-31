import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { ClubService } from "./club.service";
import { CreateClubDto } from "./dto/createClub.dto";
import { UserService } from "../user/user.service";
import { DonationRequestDto } from "../donation/dto/donationRequest.dto";
import { DonationService } from "../donation/donation.service";

@Controller("club")
export class ClubController {
  constructor(
    private readonly clubService: ClubService,
    private readonly userService: UserService,
    private readonly donationService: DonationService
  ) {}

  @Get("")
  findAll() {
    return this.clubService.getAllWithManager();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.clubService.get(id);
  }

  @Get(":id/messages")
  getMessages(@Param("id") id: string) {
    return this.clubService.getMessages(id);
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
      throw new UnauthorizedException(`You don't have enough money`);
    }

    const club = await this.clubService.create(user, createClubData.name);
    user.payCreateClubFee();
    user.clubs.push(club);

    await this.userService.updateUser(user);

    return { clubId: club.id };
  }

  @Post(":id/donationRequest")
  async donationRequest(
    @Param("id") id: number,
    @Body() donationRequestDto: DonationRequestDto
  ) {
    const user = await this.userService.isLoggedInAndCheckClub(
      donationRequestDto.uuid,
      id
    );
    if (!user) {
      throw new UnauthorizedException("Unlogged or not belonging to club");
    }

    const res = await this.donationService.createRequest(
      user,
      user.clubs[0],
      donationRequestDto.amount
    );

  }

  @Post("/join/:id")
  async join(@Param("id") id: number, @Body() loggedString: { uuid: string }) {
    const user = await this.userService.isLoggedIn(loggedString.uuid);

    if (!user) {
      throw new UnauthorizedException("You must be logged in to join new club");
    }

    if (user.clubs.some((club) => club.id == id)) {
      throw new UnauthorizedException(`You already joined this club`);
    }

    if (!user.canJoinClub()) {
      throw new UnauthorizedException(`You don't have enough money`);
    }

    const club = await this.clubService.get(id);

    if (club.isFull()) {
      throw new UnauthorizedException(`The Club is Full`);
    }

    user.payJoinClubFee();
    user.clubs.push(club);

    await this.userService.updateUser(user);

    return { clubId: club.id };
  }
}
