'use strict';

const TABLE_NAME_LIBRARIES = "libraries";
const TABLE_NAME_AUTHORS = "authors";

// Must seed with valid libraryId
const INITIAL_AUTHORS_TEST = [
  {
    active: true,
    first_name: "Barney",
    last_name: "Rubble",
    notes: "Barney Author",
  },
  {
    active: true,
    first_name: "Betty",
    last_name: "Rubble",
    notes: "Betty Author",
  },
  {
    active: true,
    first_name: "Bam Bam",
    last_name: "Rubble",
    notes: "Bam Bam Author",
  },
  {
    active: true,
    first_name: "Fred",
    last_name: "Flintstone",
    notes: "Fred Author",
  },
  {
    active: true,
    first_name: "Wilma",
    last_name: "Flintstone",
    notes: "Wilma Author",
  },
  {
    active: true,
    first_name: "Pebbles",
    last_name: "Flintstone",
    notes: "Fred Author",
  },
];

const LIBRARY_NAME_TEST = "Test Library";
const LIBRARY_SELECT
  = "SELECT " + "id FROM " + TABLE_NAME_LIBRARIES + " WHERE name = :name";

// Returns Promise<Author>
const insertAuthor = async (queryInterface, libraryId, author) => {
  author.library_id = libraryId;
  return queryInterface.create()
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

    const libraryId =
        await lookupLibraryId(queryInterface, LIBRARY_NAME_TEST);
    console.info(`Inserting Authors for Library '${LIBRARY_NAME_TEST}'`);
    INITIAL_AUTHORS_TEST.forEach(initialAuthor => {
      initialAuthor.library_id = libraryId;
    });
    await queryInterface.bulkInsert(TABLE_NAME_AUTHORS, INITIAL_AUTHORS_TEST);

  },

  down: async (queryInterface, Sequelize) => {

    const libraryId =
        await lookupLibraryId(queryInterface, LIBRARY_NAME_TEST);
    console.info(`Removing Authors for Library '${LIBRARY_NAME_TEST}`);
    await queryInterface.bulkDelete(TABLE_NAME_AUTHORS,
        { library_id: libraryId });

  }

};
