import { Migration } from "@mikro-orm/migrations";

export class Migration20260227112908 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table \`obis_mapping\` (\`id\` text not null, \`obis_id\` text not null, \`created_at\` datetime not null default CURRENT_TIMESTAMP, \`updated_at\` datetime not null default CURRENT_TIMESTAMP, \`unique_entity_id\` text not null, \`version\` integer not null default 1, primary key (\`id\`));`,
    );
    this.addSql(
      `create unique index \`obis_mapping_obis_id_unique\` on \`obis_mapping\` (\`obis_id\`);`,
    );
    this.addSql(
      `create unique index \`obis_mapping_unique_entity_id_unique\` on \`obis_mapping\` (\`unique_entity_id\`);`,
    );
  }
}
