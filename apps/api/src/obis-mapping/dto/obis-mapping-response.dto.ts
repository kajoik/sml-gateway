import { ApiResponseProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ObisMappingResponseDto {
  @Expose() @ApiResponseProperty({ format: "uuid" }) id!: string;
  @Expose() @ApiResponseProperty() obisId!: string;
  @Expose() @ApiResponseProperty() uniqueEntityId!: string;
  @Expose() @ApiResponseProperty() createdAt!: Date;
  @Expose() @ApiResponseProperty() updatedAt!: Date;
  @Expose() @ApiResponseProperty() version!: number;
}
