import { Options } from "@mikro-orm/core";

const config: Options = {
  entities: ["dist/src/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],
  dbName: "attendance",
  type: "mongo"
};

export default config;
