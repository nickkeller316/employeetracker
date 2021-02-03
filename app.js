//requirements
const mysql = require("mysql2");
const inquirer = require("inquirer");
const conTable = require("console.table");
//creating connection
const connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "Bodhi4251!",
	database: "businessDB",
});
//initializing connection
connection.connect((err, result) => {
	if (err) throw err;
	runSearch();
});
//this is called once connected to DB, inquirer prompts that will result in functionality depending on what the user chooses
const runSearch = () => {
	inquirer
		.prompt({
			name: "action",
			type: "rawlist",
			message: "What would you like to do?",
			choices: [
				"View All Employees",
				"View All Employees by Department",
				"View All Employees by Roles",
				"View All Employees by Manager",
				"Add Employee",
				"Add Role",
				"Add Department",
				"Remove Employee",
				"Update Employee Role",
				"Update Employee Manager",
				"Quit",
			],
		})
		.then((answer) => {
			switch (answer.action) {
				case "View All Employees":
					allEmployees();
					break;
				case "View All Employees by Department":
					byDepartment();
					break;
				case "View All Employees by Roles":
					byRoles();
					break;
				case "View All Employees by Manager":
					byManager();
					break;
				case "Add Employee":
					addEmployee();
					break;
				case "Add Role":
					addRole();
					break;
				case "Add Department":
					addDepartment();
					break;
				case "Remove Employee":
					removeEmployee();
					break;
				case "Update Employee Role":
					updateRole();
					break;
				case "Update Employee Manager":
					updateManager();
					break;
				case "Quit":
					connection.end();
					break;
				default:
					console.log(`Invalid action: ${answer.action}`);
					break;
			}
		});
};
//view all employees
const allEmployees = () => {
	const query = "SELECT * FROM employees";
	connection.query(query, (err, res) => {
		if (err) throw err;
		console.table(res);
		runSearch();
	});
};
//view by department (departments are also shown in table)
const byDepartment = () => {
	const query =
		"SELECT employees.id, employees.first_name, employees.last_name, employees.role_id, employees.manager_id, department.id, department.department_name, roles.id, roles.title FROM employees LEFT JOIN roles ON employees.role_id=roles.id LEFT JOIN department ON roles.department_id=department.id;";
	connection.query(query, (err, res) => {
		if (err) throw err;
		console.table(res);
		runSearch();
	});
};
//view by roles (roles are also shown in table)
const byRoles = () => {
	const query =
		"SELECT employees.id, employees.first_name, employees.last_name, employees.role_id, employees.manager_id, department.id, department.department_name, roles.id, roles.title FROM employees LEFT JOIN roles ON employees.role_id=roles.id";
	connection.query(query, (err, res) => {
		if (err) throw err;
		console.table(res);
		runSearch();
	});
};
//view by manager (manager is also shown in table)
const byManager = () => {
	const query =
		"SELECT employees.id, employees.first_name, employees.last_name, department.id, department.department_name, roles.id, roles.title, employees.manager_id,CONCAT(manager.first_name, ' ', manager.last_name) AS 'manager_name' FROM employees LEFT JOIN roles ON employees.role_id=roles.id LEFT JOIN department ON roles.department_id=department.id LEFT JOIN employees AS manager ON manager.id = employees.manager_id ORDER BY manager.id ";
	connection.query(query, (err, res) => {
		if (err) throw err;
		console.table(res);
		runSearch();
	});
};
//add an employee
const addEmployee = () => {
	inquirer
		.prompt([
			{
				name: "firstName",
				type: "input",
				message: "What is the employees first name?",
			},
			{
				name: "lastName",
				type: "input",
				message: "What is the employees last name?",
			},
			{
				name: "roleId",
				type: "number",
				message: "What is the employee's role id?",
			},
			{
				name: "managerId",
				type: "number",
				message: "What is the employee's manager's id?",
			},
		])
		.then((answer) => {
			connection.query(
				"INSERT INTO employees SET ?",
				{
					first_name: answer.firstName,
					last_name: answer.lastName,
					role_id: answer.roleId,
					manager_id: answer.managerId,
				},
				(err, res) => {
					if (err) throw err;
					console.log(`${res.affectedRows} Employee inserted!`);
					runSearch();
				}
			);
		});
};
//add a role
const addRole = () => {
	inquirer
		.prompt([
			{
				name: "title",
				type: "input",
				message: "What is the title of the role you wish to add?",
			},
			{
				name: "salary",
				type: "number",
				message: "What is the yearly salary for the role you'd like to add?",
			},
			{
				name: "depart",
				type: "number",
				message: "What department does this new role belong to?",
			},
		])
		.then((answer) => {
			connection.query(
				"INSERT INTO roles SET ?",
				{
					title: answer.title,
					salary: answer.salary,
					department_id: answer.depart,
				},
				(err, res) => {
					if (err) throw err;
					console.log(`${res.affectedRows} Role inserted!\n`);
					runSearch();
				}
			);
		});
};
//add a department
const addDepartment = () => {
	inquirer
		.prompt([
			{
				name: "departmentName",
				type: "input",
				message: "What is the name of the department you would like to add?",
			},
		])
		.then((answer) => {
			connection.query(
				"INSERT INTO department SET ?",
				{
					department_name: answer.departmentName,
				},
				(err, res) => {
					if (err) throw err;
					console.log(`${res.affectedRows} Department inserted!`);
					runSearch();
				}
			);
		});
};
//delete a employee from the table
const removeEmployee = () => {
	connection.query("SELECT * FROM employees", (err, res) => {
		if (err) throw err;
		console.table(res);
		inquirer
			.prompt([
				{
					name: "delemp",
					type: "input",
					message:
						"Please type the last name of the employee you would like to remove",
				},
			])
			.then((answer) => {
				connection.query(
					"DELETE FROM employees WHERE ?",
					{
						last_name: answer.delemp,
					},
					(err, res) => {
						if (err) throw err;
						console.log(`${res.affectedRows} Employee deleted!`);
						runSearch();
					}
				);
			});
	});
};
//update a certain employees role
const updateRole = () => {
	connection.query("SELECT * FROM employees", (err, res) => {
		if (err) throw err;
		console.table(res);
		inquirer
			.prompt([
				{
					name: "updateId",
					type: "number",
					message:
						"Please enter the id of the employee whos role you would like to update",
				},
				{
					name: "roleId",
					type: "number",
					message: "Which role would you like to change to?",
				},
			])
			.then((answer) => {
				connection.query(
					`UPDATE employees SET role_id = ${answer.roleId} WHERE id = ${answer.updateId}`,
					(err, res) => {
						if (err) throw err;
						console.log(`${res.affectedRows} Updated role!`);
						runSearch();
					}
				);
			});
	});
};
//update a certain employees manager
const updateManager = () => {
	connection.query("SELECT * FROM employees", (err, res) => {
		if (err) throw err;
		console.table(res);
		inquirer
			.prompt([
				{
					name: "updateMan",
					type: "number",
					message:
						"Please enter the id of the employee whos manager you would like to update",
				},
				{
					name: "manId",
					type: "number",
					message: "Which manager would you like to change to?",
				},
			])
			.then((answer) => {
				connection.query(
					`UPDATE employees SET manager_id = ${answer.manId} WHERE id = ${answer.updateMan}`,
					(err, res) => {
						if (err) throw err;
						console.log(`${res.affectedRows} Manager updated!`);
						runSearch();
					}
				);
			});
	});
};
