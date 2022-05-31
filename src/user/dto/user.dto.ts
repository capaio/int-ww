import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class UserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  @MinLength(3)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  password: string;
}
