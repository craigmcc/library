'use strict';

const TABLE_NAME = "volumes";

module.exports = {

  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable(TABLE_NAME, {
      id: {
        allowNull: false,
        autoIncrement: true,
        comment: "Primary key for this instance.",
        field: "id",
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      isbn: {
        allowNull: true,
        comment: "ISBN identifier for this Volume.",
        field: "isbn",
        type: Sequelize.DataTypes.STRING,
      },
      libraryId: {
        allowNull: false,
        comment: "Library to which this Volume belongs.",
        field: "library_id",
        references: { model: "libraries" },
        type: Sequelize.DataTypes.INTEGER,
      },
      location: {
        allowNull: true,
        comment: "Location (box or pathname) where this Volume exists.",
        field: "location",
        type: Sequelize.DataTypes.STRING,
      },
      media: {
        allowNull: true,
        comment: "Physical or electronic media type of this Volume.",
        field: "media",
        type: Sequelize.DataTypes.STRING,
      },
      name: {
        allowNull: false,
        comment: "Name of this Volume",
        field: "name",
        type: Sequelize.DataTypes.STRING,
      },
      notes: {
        allowNull: true,
        comment: "General comments about this Volume.",
        field: "notes",
        type: Sequelize.DataTypes.STRING,
      },
      read: {
        allowNull: false,
        comment: "Has this Volume been read?",
        defaultValue: false,
        field: "read",
        type: Sequelize.DataTypes.BOOLEAN,
      },
    }, {
      comment: "Physical or electronic object containing stories.",
      modelName: "volume",
      tableName: TABLE_NAME,
      uniqueKeys: {
        unique_tag: {
          customIndex: true,
          fields: [ "library_id", "name" ],
        }
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.dropTable(TABLE_NAME);
  }

};
