import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { DonationDto } from "./dto/donation.dto";
import { UserService } from "../user/user.service";
import { DonationService } from "./donation.service";

@Controller("funding")
export class DonationController {
  constructor(
    private readonly userService: UserService,
    private readonly donationService: DonationService
  ) {}

  @Post(":id")
  async create(@Param("id") id: number, @Body() donationDto: DonationDto) {
    const user = await this.userService.isLoggedIn(donationDto.uuid);
    if (!user) {
      throw new UnauthorizedException("You have to login");
    }

    const donationRequest = await this.donationService.getRequest(id);
    if (!donationRequest) {
      throw new BadRequestException("Donation request does not exists");
    }
    if (donationRequest.fulfilled) {
      throw new BadRequestException("Donations are closed");
    }


    if (!user.clubs.some((club) => club.id == donationRequest.club.id)) {
      throw new UnauthorizedException(`Before donate you must join the club ${donationRequest.club.club_name}`);
    }

    if (user.wallet.soft_currency < donationDto.amount) {
      throw new BadRequestException(`You don't have enough money`);
    }

    user.wallet.soft_currency -= donationDto.amount;
    donationRequest.funded += donationDto.amount;
    await this.userService.updateUser(user);
    await this.donationService.update(donationRequest);

    if (donationRequest.isFulfilled()) {

      const recipient = await this.userService.findOneWithRequests(
        donationRequest.user.id,
        donationRequest.id
      );

      recipient.donationRequests[0].funded = 0;
      recipient.donationRequests[0].fulfilled = 1;
      await this.userService.updateCurrency(recipient.id, {hard_currency:0, soft_currency: recipient.wallet.soft_currency + donationRequest.funded});
      await this.donationService.update(recipient.donationRequests[0]);
    }
  }
}
