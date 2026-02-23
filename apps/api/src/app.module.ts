import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SMLStreamModule } from "./sml-stream/sml-stream.module";

@Module({
  imports: [SMLStreamModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
