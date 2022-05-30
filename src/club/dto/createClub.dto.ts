import { IsNotEmpty } from "class-validator";

export class CreateClubDto {
  @IsNotEmpty()
  uuid: string;

  @IsNotEmpty()
  name: string;
}
