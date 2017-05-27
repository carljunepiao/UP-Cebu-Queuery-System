const Sequelize = require('sequelize');

const connectionUrl = 'postgres://pgdemo:pgdemo@localhost:5432/pgdemo';
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
		type: Sequelize.STRING,
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