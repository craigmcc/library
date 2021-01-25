'use strict';

const TABLE_NAME = "libraries";

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
        comment: "Is this Library active?",
        defaultValue: true,
        field: "active",
        type: Sequelize.DataTypes.BOOLEAN,
      },
      name: {
        allowNull: false,
        comment: "Unique name of this Library.",
        field: "name",
        type: Sequelize.DataTypes.STRING,
        unique: true,
      },
      notes: {
        allowNull: true,
        comment: "General comments about this Library.",
        field: "notes",
        type: Sequelize.DataTypes.STRING,
      },
      scope: {
        allowNull: false,
        comment: "Scope required to access this Library.",
        field: "scope",
        type: Sequelize.DataTypes.STRING,
      },
    }, {
      comment: "Overall collection of authors, series, stories, and volumes.",
      modelName: "library",
      tableName: "libraries",
    });
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.dropTable(TABLE_NAME);
  }

};
