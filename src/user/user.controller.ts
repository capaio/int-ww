import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UserDto } from "./dto/user.dto";
import { AddCurrencyDto } from "./dto/addCurrency.dto";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: UserDto) {
    return this.userService.create(createUserDto);
  }

  @Post("login")
  async loginUser(@Body() userDto: UserDto) {
    const uuid = await this.userService.login(userDto);

    if (uuid === null) {
      throw new UnauthorizedException("Username or password are wrong");
    } else return { uuid: uuid };
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userService.findOne(+id);
  }


  @Patch(":id/addCurrency")
  @HttpCode(204)
  async update(@Param("id") id: string, @Body() updateUserDto: AddCurrencyDto) {
    await this.userService.updateCurrency(+id, updateUserDto);
  }
}
