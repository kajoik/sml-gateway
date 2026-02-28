import { IsUUID } from "class-validator";

export class FindObisMappingParams {
  @IsUUID(4)
  id!: string;
}
