const Sequelize = require('sequelize');

const connectionUrl = 'postgres://pgQueue:pgQueue@localhost:5432/pgQueue';
const database = new Sequelize(connectionUrl);

const Student = database.define('students', {
	studentno: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		allowNull: false
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
    office: {
        type: Sequelize.STRING,
		allowNull: false
    },
	priorityno: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false
	},
	contactno: {
		type: Sequelize.INTEGER,
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