import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SMLStreamModule } from "./sml-stream/sml-stream.module";
import { MqttModule } from "./mqtt/mqtt.module";
import { SettingsModule } from "./settings/settings.module";

@Module({
  imports: [SMLStreamModule, MqttModule, SettingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
