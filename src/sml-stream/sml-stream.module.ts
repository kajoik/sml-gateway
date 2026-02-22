import { Module } from "@nestjs/common";
import { SmlStreamController } from "./sml-stream.controller";
import { SmlStreamService } from "./sml-stream.service";

@Module({
  providers: [SmlStreamService],
  controllers: [SmlStreamController],
})
export class SMLStreamModule {}
