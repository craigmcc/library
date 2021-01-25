'use strict';

const TABLE_NAME = "users";

module.exports = {

  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable(TABLE_NAME, {
      id: {
        allowNull: false,
        autoIncrement: true,
        field: "id",
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      active: {
        allowNull: false,
        defaultValue: true,
        field: "active",
        type: Sequelize.DataTypes.BOOLEAN,
      },
      level: {
        allowNull: false,
        defaultValue: "info",
        field: "level",
        type: Sequelize.DataTypes.STRING,
      },
      libraryId: {
        allowNull: false,
        field: "library_id",
        references: { model: "libraries" },
        type: Sequelize.DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        comment: "Name of this user.",
        field: "name",
        type: Sequelize.DataTypes.STRING,
      },
      password: {
        allowNull: false,
        comment: "Hashed password for this user.",
        field: "password",
        type: Sequelize.DataTypes.STRING,
      },
      scope: {
        allowNull: false,
        comment: "Authorized scope(s) (space separated) for this user.",
        field: "scope",
        type: Sequelize.DataTypes.STRING,
      },
      username: {
        allowNull: false,
        comment: "Unique username for this user.",
        field: "username",
        type: Sequelize.DataTypes.STRING,
        unique: true,
      },
    }, {
      comment: "Users authenticated via @craigmcc/oauth-orchestrator",
      modelName: "user",
      tableName: TABLE_NAME,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.dropTable(TABLE_NAME);
  }

};
