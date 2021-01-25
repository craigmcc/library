'use strict';

const INITIAL_LIBRARIES = [
  {
    active: true,
    name: "Test Library",
    scope: "test"
  },
  {
    active: true,
    name: "Personal Library",
    scope: "personal",
  },
];

const TABLE_NAME = "libraries";

module.exports = {

  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(TABLE_NAME, INITIAL_LIBRARIES);
  },

  down: async (queryInterface, Sequelize) => {
    const names = [];
    INITIAL_LIBRARIES.forEach(initialLibrary => {
      names.push(initialLibrary.name);
    });
    await queryInterface.bulkDelete(TABLE_NAME, {name: {[Sequelize.Op.in]: names} });
  }

};
