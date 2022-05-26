import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "./entity/user.entity";
import {Repository} from "typeorm";
import {CreateUserDto} from "./dto/create-user.dto";
import {WalletEntity} from "./entity/wallet.entity";
import {encrypt, getRandomInt} from "../helpers/helpers";
import {AddCurrencyDto} from "./dto/addCurrency.dto";
import {HARD_MAX, HARD_MIN, SOFT_MAX, SOFT_MIN} from "../common/constants";

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(WalletEntity)
    private readonly walletRepository: Repository<WalletEntity>,
  ) {
  }

  async create(createUserDto: CreateUserDto) {

    const checkUser = await this.userRepository.findOneBy({username: createUserDto.username})

    if(checkUser) {
      throw new BadRequestException('Username already taken');
    }

    const wallet = new WalletEntity()
    wallet.hard_currency = getRandomInt(HARD_MIN,HARD_MAX)
    wallet.soft_currency = getRandomInt(SOFT_MIN,SOFT_MAX)

    const user = new UserEntity()
    user.username = createUserDto.username
    user.pwd = encrypt(createUserDto.password)
    user.wallet = wallet;

    await this.walletRepository.save(wallet);
    return await this.userRepository.save(user);

  }

  async findOne(id: number) {
    return this.userRepository.findOne({
      where: { id: id },
      relations: ['wallet'],
    })
  }

  async updateCurrency(id: number, updateUserDto: AddCurrencyDto) {
    const user = await this.findOne(id);

    if(!user) {
      throw new NotFoundException(`User ${id} not found`)
    }
    user.wallet.soft_currency = (user.wallet.soft_currency + updateUserDto.soft_currency > SOFT_MAX) ? SOFT_MAX : user.wallet.soft_currency + updateUserDto.soft_currency
    user.wallet.hard_currency = (user.wallet.hard_currency + updateUserDto.hard_currency > HARD_MAX) ? +HARD_MAX : +user.wallet.hard_currency + +updateUserDto.hard_currency

    await this.walletRepository.save(user.wallet);
  }



}
