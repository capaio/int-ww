import {IsInt, IsNotEmpty, Max, Min} from "class-validator";
import { SOFT_MAX } from "../../common/constants";

export class DonationRequestDto {
  @IsNotEmpty()
  uuid: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(SOFT_MAX)
  amount: number;
}
