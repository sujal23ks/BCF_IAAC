"use strict";

exports.up = async (knex) => {
  await knex.schema.alterTable("streams", (table) => {
    table.double("nestingEfficiency");
    table.integer("numberOfBoards");
  });
};

exports.down = async (knex) => {
  await knex.schema.alterTable("streams", (table) => {
    table.dropColumn("nestingEfficiency");
    table.dropColumn("numberOfBoards");
  });
};
