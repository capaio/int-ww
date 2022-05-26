import { IsInt, Max, Min } from "class-validator";
import { Type } from "class-transformer";
import { HARD_MAX, SOFT_MAX } from "../../common/constants";

export class AddCurrencyDto {
  @IsInt()
  @Min(0)
  @Max(HARD_MAX)
  @Type(() => Number)
  hard_currency: number;

  @IsInt()
  @Min(0)
  @Max(SOFT_MAX)
  @Type(() => Number)
  soft_currency: number;
}
