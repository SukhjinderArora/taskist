/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("users").insert([
    { id: 1, name: "Sukhjinder Arora", email: "test@test.com" },
    { id: 2, name: "John Smith", email: "test1@test.com" },
    { id: 3, name: "Will Smith", email: "test2@test.com" },
  ]);
};
