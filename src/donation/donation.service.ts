import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../user/entity/user.entity";
import { DonationRequestEntity } from "./donation.entity";
import { ClubEntity } from "../club/club.entity";

@Injectable()
export class DonationService {
  constructor(
    @InjectRepository(DonationRequestEntity)
    private readonly requestRepository: Repository<DonationRequestEntity>
  ) {}

  async createRequest(user: UserEntity, club: ClubEntity, amount: number) {
    const donationRequest = new DonationRequestEntity();
    donationRequest.user = user;
    donationRequest.club = club;
    donationRequest.amount = amount;

    return this.requestRepository.save(donationRequest);
  }

  async getRequest(id: number) {
    return this.requestRepository.findOne({
      where: {
        id: id,
      },
      relations: ["user"],
    });
  }

  async update(request: DonationRequestEntity) {
    await this.requestRepository.save(request);
  }
}
