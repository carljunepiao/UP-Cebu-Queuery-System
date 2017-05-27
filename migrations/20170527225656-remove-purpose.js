'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('students','purpose');
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.addColumn('students','purpose',{
      type: Sequelize.SRING
    });
  }
};
