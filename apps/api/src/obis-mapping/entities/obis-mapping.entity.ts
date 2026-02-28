import { type InferEntity, defineEntity } from "@mikro-orm/core";

export const ObisMapping = defineEntity({
  name: "ObisMapping",
  properties: (p) => ({
    id: p.uuid().primary(),
    obisId: p.string().unique(),
    createdAt: p.datetime().defaultRaw("CURRENT_TIMESTAMP"),
    updatedAt: p
      .datetime()
      .defaultRaw("CURRENT_TIMESTAMP")
      .onUpdate(() => new Date()),
    uniqueEntityId: p.string().unique(),
    version: p.integer().version(),
  }),
});

export interface IObisMapping extends InferEntity<typeof ObisMapping> {}
