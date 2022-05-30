import { IsNotEmpty, Max, Min } from "class-validator";
import { SOFT_MAX } from "../../common/constants";

export class DonationRequestDto {
  @IsNotEmpty()
  uuid: string;

  @IsNotEmpty()
  @Min(1)
  @Max(SOFT_MAX)
  amount: number;
}
