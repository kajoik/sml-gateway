import { Injectable } from "@nestjs/common";
import { MqttConfig } from "./lib/MqttConfig";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class SettingsService {
  mqttConfig$: Observable<MqttConfig>;

  constructor() {
    this.mqttConfig$ = new BehaviorSubject(this.getMqttConfig());
  }

  getMqttConfig(): MqttConfig {
    return {
      url: process.env["MQTT_URL"] || "mqtt://localhost:1883",
      options: {
        username: process.env["MQTT_USERNAME"],
        password: process.env["MQTT_PASSWORD"],
      },
    };
  }
}
