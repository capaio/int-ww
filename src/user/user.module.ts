import {TypeOrmModule} from "@nestjs/typeorm";
import {Module} from "@nestjs/common";
import {UserController} from "./user.controller";
import {UserEntity} from "./entity/user.entity";
import {UserService} from "./user.service";
import {WalletEntity} from "./entity/wallet.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity,WalletEntity])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
