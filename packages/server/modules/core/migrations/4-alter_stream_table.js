"use strict";

exports.up = async (knex) => {
  await knex.schema.alterTable("streams", (table) => {
    table.string("deadline");
  });
};

exports.down = async (knex) => {
  await knex.schema.alterTable("streams", (table) => {
    table.dropColumn("deadline");
  });
};
