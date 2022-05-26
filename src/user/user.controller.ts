import {Body, Controller, Delete, Get, HttpCode, Param, Patch, Post} from "@nestjs/common";
import {UserService} from "./user.service";
import {CreateUserDto} from "./dto/create-user.dto";
import {AddCurrencyDto} from "./dto/addCurrency.dto";


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id/addCurrency')
  @HttpCode(204)
  async update(@Param('id') id: string, @Body() updateUserDto: AddCurrencyDto) {
    await this.userService.updateCurrency(+id, updateUserDto);

  }




}
