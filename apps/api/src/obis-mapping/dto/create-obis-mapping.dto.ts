import { MaxLength, MinLength } from "class-validator";

export class CreateObisMappingDto {
  @MinLength(1)
  @MaxLength(32)
  obisId!: string;

  @MinLength(1)
  @MaxLength(36)
  uniqueEntityId!: string;
}
