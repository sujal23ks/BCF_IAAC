"use strict";

exports.up = async (knex) => {
  await knex.schema.alterTable("streams", (table) => {
    table.string("status").notNullable().defaultTo("waiting");
    table.string("materialType", 512);
    table.double("materialThinkness");
    table.boolean("paid").notNullable().defaultTo(false);
    table.double("tools");
    table.double("areaOfAllPartsTogether");
  });
};

exports.down = async (knex) => {
  await knex.schema.alterTable("streams", (table) => {
    table.dropColumn("status");
    table.dropColumn("materialType");
    table.dropColumn("materialThinkness");
    table.dropColumn("paid");
    table.dropColumn("tools");
    table.dropColumn("areaOfAllPartsTogether");
  });
};
