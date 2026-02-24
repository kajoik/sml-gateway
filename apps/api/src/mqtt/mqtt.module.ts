import { Module } from "@nestjs/common";
import { MqttPublisherService } from "./mqtt-publisher.service";
import { SMLStreamModule } from "src/sml-stream/sml-stream.module";
import { SettingsModule } from "src/settings/settings.module";

@Module({
  imports: [SMLStreamModule, SettingsModule],
  providers: [MqttPublisherService],
})
export class MqttModule {}
