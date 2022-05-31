import {IsNotEmpty, IsString, MaxLength, MinLength} from "class-validator";

export class CreateClubDto {
  @IsNotEmpty()
  @IsString()
  uuid: string;

  @IsNotEmpty()
  @MaxLength(64)
  @MinLength(3)
  name: string;
}
