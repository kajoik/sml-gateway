import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SMLStreamModule } from "./sml-stream/sml-stream.module";
import { MqttModule } from "./mqtt/mqtt.module";
import { SettingsModule } from "./settings/settings.module";
import MikroOrmConfig from "./mikro-orm.config";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { ObisMappingModule } from "./obis-mapping/obis-mapping.module";

@Module({
  imports: [
    SMLStreamModule,
    MqttModule,
    SettingsModule,
    MikroOrmModule.forRoot(MikroOrmConfig),
    ObisMappingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
