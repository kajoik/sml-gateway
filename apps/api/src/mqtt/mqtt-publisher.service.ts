import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { Subscription } from "rxjs";
import { SmlStreamService } from "src/sml-stream/sml-stream.service";
import * as mqtt from "mqtt";
import { SettingsService } from "src/settings/settings.service";
import { MqttConfig } from "src/settings/lib/MqttConfig";

@Injectable()
export class MqttPublisherService implements OnModuleInit, OnModuleDestroy {
  private client?: mqtt.MqttClient;
  private streamSub?: Subscription;
  private configSub?: Subscription;
  private currentConfig: MqttConfig | null = null;

  constructor(
    private readonly smlStreamService: SmlStreamService,
    private readonly settingsService: SettingsService,
  ) {}

  async onModuleInit() {
    const cfg = await this.settingsService.getMqttConfig();
    this.applyConfig(cfg);

    if (this.settingsService.mqttConfig$) {
      this.configSub = this.settingsService.mqttConfig$.subscribe((newCfg) =>
        this.applyConfig(newCfg),
      );
    }

    this.streamSub = this.smlStreamService.stream$.subscribe((obisEntries) => {
      if (!this.client || !this.client.connected) {
        return;
      }
      const currentTotalPower = obisEntries.find(
        ({ obisId }) => obisId === "1-0:1.7.0*255",
      )?.values[0]?.value;
      if (currentTotalPower !== undefined) {
        try {
          this.client.publish(
            "homeassistant/device/test123/state",
            currentTotalPower.toString(),
            {
              qos: 0,
            },
          );
        } catch (err) {
          console.error("MQTT publish error", err);
        }
      }
    });
  }

  private applyConfig(cfg: MqttConfig | null) {
    // if identical, do nothing
    if (JSON.stringify(cfg) === JSON.stringify(this.currentConfig)) return;
    this.disconnectClient();
    this.currentConfig = cfg;
    this.connectClient();
  }

  private connectClient() {
    if (!this.currentConfig) {
      return;
    }
    const currentConfig = this.currentConfig;
    this.client = mqtt.connect(
      this.currentConfig.url,
      this.currentConfig.options,
    );
    this.client.on("connect", () => {
      console.info("MQTT connected to", currentConfig.url);
      this.client?.publish(
        "homeassistant/device/test123/config",
        JSON.stringify({
          dev: {
            ids: "ea334450945af",
            name: "Kitchen",
            mf: "Bla electronics",
            mdl: "xya",
            sw: "1.0",
            sn: "ea334450945afc",
            hw: "1.0rev2",
          },
          o: {
            name: "bla2mqtt",
            sw: "2.1",
            url: "https://bla2mqtt.example.com/support",
          },
          cmps: {
            some_unique_component_id16: {
              p: "sensor",
              device_class: "power",
              unit_of_measurement: "W",
              unique_id: "pwr_12345",
              state_topic: "homeassistant/device/test123/state",
            },
          },
        }),
        {
          qos: 1,
        },
      );
    });
    this.client.on("reconnect", () => {
      console.info("MQTT reconnecting", currentConfig.url);
    });
    this.client.on("error", (err) => {
      console.error("MQTT error", err);
    });
    this.client.on("close", () => {
      console.info("MQTT connection closed");
    });
  }

  private disconnectClient() {
    if (!this.client) return;
    try {
      this.client.end(true);
    } catch {
      /* ignore */
    }
    this.client = undefined;
  }

  onModuleDestroy() {
    this.streamSub?.unsubscribe();
    this.configSub?.unsubscribe();
    this.disconnectClient();
  }
}
