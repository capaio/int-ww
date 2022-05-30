import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ClubEntity } from "./club.entity";
import { UserEntity } from "../user/entity/user.entity";

@Injectable()
export class ClubService {
  constructor(
    @InjectRepository(ClubEntity)
    private readonly clubRepository: Repository<ClubEntity>
  ) {}

  async create(user: UserEntity, clubName) {
    const club = new ClubEntity();
    club.manager = user;
    club.club_name = clubName;

    const res = await this.clubRepository.save(club);

    return res;
  }

  async getAll() {
    return this.clubRepository.find();
  }
}
