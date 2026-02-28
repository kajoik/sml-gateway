import { PartialType } from "@nestjs/swagger";
import { CreateObisMappingDto } from "./create-obis-mapping.dto";

export class UpdateObisMappingDto extends PartialType(CreateObisMappingDto) {}
