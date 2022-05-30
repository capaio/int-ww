import { IsNotEmpty } from "class-validator";

export class JoinClubDto {
  @IsNotEmpty()
  uuid: string;

  @IsNotEmpty()
  id: number;
}
