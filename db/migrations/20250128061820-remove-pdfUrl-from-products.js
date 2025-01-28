"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("products", "pdfFile");
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.addColumn("products", "pdfFile", {
     *   type: Sequelize.STRING,
     *   allowNull: true,
     * });
     */
    await queryInterface.addColumn("products", "pdfFile", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
