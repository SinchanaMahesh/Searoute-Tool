import { createClient, ClickHouseClient } from "@clickhouse/client";
import "dotenv/config";

const isCI = process.env.CI === "true";
const enableClickhouse =
  process.env.ENABLE_CLICKHOUSE === "true" && !isCI;

let clickhouseClient: ClickHouseClient | null = null;

if (enableClickhouse) {
  clickhouseClient = createClient({
    host: `https://${process.env.CLICKHOUSE_HOST}:${process.env.CLICKHOUSE_PORT || "8123"}`,
    username: process.env.CLICKHOUSE_USERNAME || "default",
    password: process.env.CLICKHOUSE_PASSWORD || "",
    database: process.env.CLICKHOUSE_DATABASE || "cruise_master",
  });

  console.log("✅ ClickHouse client initialized");
} else {
  console.log("🚫 ClickHouse disabled (CI or flag)");
}

console.log(clickhouseClient);

export { clickhouseClient };
