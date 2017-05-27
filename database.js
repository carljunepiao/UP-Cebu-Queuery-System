const Sequelize = require('sequelize');

const connectionUrl = 'postgres://pgQueue:pgQueue@localhost:5432/pgQueue';
const database = new Sequelize(connectionUrl);

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
		type: Sequelize.INTEGER,
		primaryKey: true,
		allowNull: false
	},
	contactno: {
		type: Sequelize.INTEGER,
		allowNull: false
	},
    office: {
        type: Sequelize.STRING,
		allowNull: false
    },
	purpose: {
		type: Sequelize.STRING,
		allowNull: false
	}
}, {
	timestamps: true
});



database.sync();

module.exports.Student = Student;