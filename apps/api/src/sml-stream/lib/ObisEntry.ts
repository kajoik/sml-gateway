import { ObisMeasurement } from "smartmeter-obis";
import { ObisMeasurementNames } from "smartmeter-obis/lib/ObisNames";

export interface ObisEntry extends ObisMeasurementNames {
  obisId: string;
  values: ObisMeasurement["values"];
}
