import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { MoreThan, Repository } from "typeorm";
import { UserDto } from "./dto/user.dto";
import { WalletEntity } from "./entity/wallet.entity";
import { encrypt, getRandomInt } from "../helpers/helpers";
import { AddCurrencyDto } from "./dto/addCurrency.dto";
import * as crypto from "crypto";
import { HARD_MAX, HARD_MIN, SOFT_MAX, SOFT_MIN } from "../common/constants";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(WalletEntity)
    private readonly walletRepository: Repository<WalletEntity>
  ) {}

  async create(createUserDto: UserDto) {
    const checkUser = await this.userRepository.findOneBy({
      username: createUserDto.username,
    });

    if (checkUser) {
      throw new BadRequestException("Username already taken");
    }

    const wallet = new WalletEntity();
    wallet.hard_currency = getRandomInt(HARD_MIN, HARD_MAX);
    wallet.soft_currency = getRandomInt(SOFT_MIN, SOFT_MAX);

    const user = new UserEntity();
    user.username = createUserDto.username;
    user.pwd = encrypt(createUserDto.password);
    user.wallet = wallet;

    await this.walletRepository.save(wallet);
    return await this.userRepository.save(user);
  }

  async login(userData: UserDto): Promise<string | null> {
    const user = await this.checkUser(userData);
    if (!user) return null;

    user.session_id = crypto.randomUUID();
    const expiration = new Date();
    console.log(expiration);
    expiration.setTime(expiration.getTime() + 60 * 60 * 1000);
    user.session_expiration = expiration;

    console.log(expiration);

    await this.userRepository.save(user);

    return user.session_id;
  }

  async checkUser(userData: UserDto) {
    return this.userRepository.findOne({
      where: { username: userData.username, pwd: encrypt(userData.password) },
      relations: ["wallet"],
    });
  }

  async isLoggedIn(uuid: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { session_id: uuid, session_expiration: MoreThan(new Date()) },
      relations: ["wallet", "clubs"],
    });
  }

  async isLoggedInAndCheckClub(uuid: string, id: number): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: {
        session_id: uuid,
        session_expiration: MoreThan(new Date()),
        clubs: {
          id: id,
        },
      },
      relations: ["wallet", "clubs"],
    });
  }

  async findOne(id: number) {
    return this.userRepository.findOne({
      where: { id: id },
      relations: ["wallet", "clubs"],
    });
  }

  async findOneWithRequests(id: number, request_id: number) {
    return this.userRepository.findOne({
      where: { id: id, donationRequests: { id: request_id } },
      relations: ["wallet", "clubs", "donationRequests"],
    });
  }

  async findByUsername(username: string) {
    return this.userRepository.findOne({
      where: { username: username },
      relations: ["wallet"],
    });
  }

  async updateCurrency(id: number, updateUserDto: AddCurrencyDto) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    user.wallet.soft_currency =
      user.wallet.soft_currency + updateUserDto.soft_currency > SOFT_MAX
        ? SOFT_MAX
        : user.wallet.soft_currency + updateUserDto.soft_currency;
    user.wallet.hard_currency =
      user.wallet.hard_currency + updateUserDto.hard_currency > HARD_MAX
        ? +HARD_MAX
        : +user.wallet.hard_currency + +updateUserDto.hard_currency;

    await this.walletRepository.save(user.wallet);
  }

  async updateUser(user: UserEntity) {
    await this.userRepository.save(user);
  }

  async updateWallet(wallet: WalletEntity) {
    await this.walletRepository.save(wallet);
  }
}
