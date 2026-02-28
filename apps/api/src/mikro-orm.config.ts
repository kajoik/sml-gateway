import { defineConfig } from "@mikro-orm/sqlite";
import { Migrator } from "@mikro-orm/migrations";

export default defineConfig({
  entities: ["./dist/**/*.entity.js"],
  entitiesTs: ["./src/**/*.entity.ts"],
  dbName: "sml-gateway.sqlite3",
  extensions: [Migrator],
  debug: true,
  logger: (msg) => console.debug("[mikro-orm]", msg),
});
