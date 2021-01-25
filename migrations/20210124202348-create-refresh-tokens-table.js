'use strict';

const TABLE_NAME = "refresh_tokens";

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
      accessToken: {
        allowNull: false,
        comment: "Access token value of the owning Access Token.",
        field: "access_token",
        references: { model: "access_tokens", key: "token" },
        type: Sequelize.DataTypes.STRING,
      },
      expires: {
        allowNull: false,
        comment: "Date and time this refresh token expires.",
        field: "expires",
        type: Sequelize.DataTypes.DATE,
      },
      token: {
        allowNull: false,
        comment: "Refresh token value for this refresh token.",
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
      comment: "OAuth refresh tokens created via @craigmcc/oauth-orchestrator",
      tableName: TABLE_NAME,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.dropTable(TABLE_NAME);
  }

};
