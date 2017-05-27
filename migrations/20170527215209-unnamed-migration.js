'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    queryInterface.createTable('students', {
      priorityno: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    fname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    studentno: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    },
    contactno: {
      type: Sequelize.BIGINT,
      allowNull: false
    },
      office: {
          type: Sequelize.STRING,
      allowNull: false
      },
    purpose: {
      type: Sequelize.STRING,
      allowNull: false
    },
    createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    queryInterface.dropTable('students');
  }
};
