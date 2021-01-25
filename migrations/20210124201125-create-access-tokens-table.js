'use strict';

const TABLE_NAME = "access_tokens";

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
      expires: {
        allowNull: false,
        comment: "Date and time this access token expires.",
        field: "expires",
        type: Sequelize.DataTypes.DATE,
      },
      scope: {
        allowNull: false,
        comment: "Authorized scope(s) (space separated) for this access token.",
        field: "scope",
        type: Sequelize.DataTypes.STRING,
      },
      token: {
        allowNull: false,
        comment: "Access token value for this access token.",
        field: "token",
        type: Sequelize.DataTypes.STRING,
        unique: true,
      },
      userId: {
        allowNull: false,
        comment: "Primary key of the owning User.",
        field: "user_id",
        references: { model: "users" },
        type: Sequelize.DataTypes.INTEGER,
      }
    }, {
      comment: "OAuth access tokens created via @craigmcc/oauth-orchestrator",
      tableName: TABLE_NAME,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.dropTable(TABLE_NAME);
  }

};
