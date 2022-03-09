"use strict";

exports.up = async (knex) => {
  await knex.schema.alterTable("streams", (table) => {
    table.boolean("isBatch").notNullable().defaultTo(false);
    table.specificType("projectIds", "text ARRAY");
  });
};

exports.down = async (knex) => {
  await knex.schema.alterTable("streams", (table) => {
    table.dropColumn("isBatch");
    table.dropColumn("projectIds");
  });
};
