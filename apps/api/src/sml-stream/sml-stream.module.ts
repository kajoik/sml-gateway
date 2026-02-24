import { Module } from "@nestjs/common";
import { SmlStreamController } from "./sml-stream.controller";
import { SmlStreamService } from "./sml-stream.service";
import { SmlStreamGateway } from "./sml-stream.gateway";

@Module({
  providers: [SmlStreamService, SmlStreamGateway],
  controllers: [SmlStreamController],
})
export class SMLStreamModule {}
