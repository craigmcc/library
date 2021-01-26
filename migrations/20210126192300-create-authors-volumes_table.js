'use strict';

const TABLE_NAME_AUTHORS_VOLUMES = "authors_volumes";

module.exports = {

  up: async (queryInterface, Sequelize) => {

    await queryInterface.createTable(TABLE_NAME_AUTHORS_VOLUMES, {
      authorId: {
        allowNull: false,
        field: "author_id",
        references: { model: "authors" },
        type: Sequelize.DataTypes.INTEGER,
      },
      volumeId: {
        allowNull: false,
        field: "volume_id",
        references: { model: "volumes" },
        type: Sequelize.DataTypes.INTEGER,
      },
    }, {
      comment: "Many-to-many Authors and Volumes join table.",
      modelName: "author_volume",
      tableName: TABLE_NAME_AUTHORS_VOLUMES,
      uniqueKeys: {
        unique_tag: {
          customIndex: true,
          fields: [ "author_id", "volume_id" ],
        },
      },
    });

  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.dropTable(TABLE_NAME_AUTHORS_VOLUMES);
  }

};
