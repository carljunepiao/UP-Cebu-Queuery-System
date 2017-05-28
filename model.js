const Sequelize = require('sequelize');
const database = require('./database');

const Student = database.define('students', {
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
    }
}, {
	timestamps: true
});

const Admin = database.define('admins', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false
	},
	email: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false
	},
    name: {
        type: Sequelize.STRING
    },
	password: {
		type: Sequelize.STRING,
		allowNull: false
	}
}, {
	timestamps: true
});

module.exports.Student = Student;
module.exports.Admin = Admin;
