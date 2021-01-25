'use strict';

const bcrypt = require("bcrypt");

const INITIAL_USERS_PERSONAL = [
  {
    active: true,
    level: "info",
    name: "Me",
    password: "me",
    scope: "personal",
    username: "me",
  },
];
const INITIAL_USERS_TEST = [
  {
    active: true,
    level: "info",
    name: "Superuser",
    password: "superuser",
    scope: "superuser",
    username: "superuser",
  },
];

const LIBRARY_NAME_PERSONAL = "Personal Library";
const LIBRARY_NAME_TEST = "Test Library";

const TABLE_NAME_LIBRARIES = "libraries";
const TABLE_NAME_USERS = "users";

const LIBRARY_SELECT
    = "SELECT " + "id FROM " + TABLE_NAME_LIBRARIES + " WHERE name = :name";

const hashPassword = async (password) => {
  const SALT_ROUNDS = 10; // MUST MATCH oauth-utils.ts SETTING!!!!
  return await bcrypt.hash(password, SALT_ROUNDS);
}

const hashPasswords = async (users) => {
  const promises = await users.map(user => hashPassword(user.password));
  const hashedPasswords = await Promise.all(promises);
  for (let i = 0; i < users.length; i++) {
    users[i].password = hashedPasswords[i];
  }
}

const lookupLibraryId = async (queryInterface, name) => {
  const results = await queryInterface.sequelize.query(
      LIBRARY_SELECT,
      {
        replacements: { name: name }
      }
  )
  return results[0][0].id;
}

module.exports = {

  up: async (queryInterface, Sequelize) => {

    const libraryPersonalId =
      await lookupLibraryId(queryInterface, LIBRARY_NAME_PERSONAL);
    console.info(`Inserting users for Library '${LIBRARY_NAME_PERSONAL}' at id ${libraryPersonalId}`);
    INITIAL_USERS_PERSONAL.forEach(initialUser => {
      initialUser.library_id = libraryPersonalId;
    });
    await hashPasswords(INITIAL_USERS_PERSONAL);
    await queryInterface.bulkInsert(TABLE_NAME_USERS, INITIAL_USERS_PERSONAL);

    const libraryTestId =
      await lookupLibraryId(queryInterface, LIBRARY_NAME_TEST);
    console.info(`Inserting users for Library '${LIBRARY_NAME_TEST}' at id ${libraryTestId}`);
    INITIAL_USERS_TEST.forEach(initialUser => {
      initialUser.library_id = libraryTestId;
    });
    await hashPasswords(INITIAL_USERS_TEST);
    await queryInterface.bulkInsert(TABLE_NAME_USERS, INITIAL_USERS_TEST);

  },

  down: async (queryInterface, Sequelize) => {

    const libraryPersonalId =
        await lookupLibraryId(queryInterface, LIBRARY_NAME_PERSONAL);
    console.info(`Deleting users for Library '${LIBRARY_NAME_PERSONAL}' at id ${libraryPersonalId}`);
    await queryInterface.bulkDelete(TABLE_NAME_USERS,
        { library_id: libraryPersonalId });

    const libraryTestId =
        await lookupLibraryId(queryInterface, LIBRARY_NAME_TEST);
    console.info(`Deleting users for Library '${LIBRARY_NAME_TEST}' at id ${libraryTestId}`);
    await queryInterface.bulkDelete(TABLE_NAME_USERS,
        { library_id: libraryTestId });

  }

};
