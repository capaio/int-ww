import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class CreateMessageDto {
  @IsNotEmpty()
  uuid: string;

  @IsNotEmpty()
  clubId: number;

  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(65535)
  message: string;
}
