import { Module } from "@nestjs/common";
import { ObisMappingService } from "./obis-mapping.service";
import { ObisMappingController } from "./obis-mapping.controller";

@Module({
  controllers: [ObisMappingController],
  providers: [ObisMappingService],
})
export class ObisMappingModule {}
