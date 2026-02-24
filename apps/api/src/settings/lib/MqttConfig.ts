import { IClientOptions } from "mqtt";

export type MqttConfig = {
  url: string;
  topic?: string;
  options?: IClientOptions;
};
