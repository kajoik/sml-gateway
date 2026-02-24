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

    // react to future config changes if available
    if (this.settingsService.mqttConfig$) {
      this.configSub = this.settingsService.mqttConfig$.subscribe((newCfg) =>
        this.applyConfig(newCfg),
      );
    }

    // batch stream updates to avoid flooding
    this.streamSub = this.smlStreamService.stream$.subscribe((batches) => {
      const payload = JSON.stringify(batches.flat());
      if (!this.client || !this.client.connected) {
        // optionally buffer or drop until connected
        return;
      }
      try {
        this.client.publish(
          this.currentConfig!.topic ?? "sml/samples",
          payload,
          { qos: 0 },
        );
      } catch (err) {
        console.error("MQTT publish error", err);
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
