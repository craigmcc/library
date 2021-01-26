'use strict';

const TABLE_NAME = "authors";

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
      active: {
        allowNull: false,
        comment: "Is this Author active?",
        defaultValue: true,
        field: "active",
        type: Sequelize.DataTypes.BOOLEAN,
      },
      firstName: {
        allowNull: false,
        comment: "First name of this Author.",
        field: "first_name",
        type: Sequelize.DataTypes.STRING,
      },
      lastName: {
        allowNull: false,
        comment: "Last name of this Author",
        field: "last_name",
        type: Sequelize.DataTypes.STRING,
      },
      libraryId: {
        allowNull: false,
        comment: "Library to which this Author belongs.",
        field: "library_id",
        references: { model: "libraries" },
        type: Sequelize.DataTypes.INTEGER,
      },
      notes: {
        allowNull: true,
        comment: "General comments about this Library.",
        field: "notes",
        type: Sequelize.DataTypes.STRING,
      },
    }, {
      comment: "Authors of content in each library.",
      modelName: "author",
      tableName: TABLE_NAME,
      uniqueKeys: {
        unique_tag: {
          customIndex: true,
          fields: [ "library_id", "last_name", "first_name"],
        }
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.dropTable(TABLE_NAME);
  }

};
