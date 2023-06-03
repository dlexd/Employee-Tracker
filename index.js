const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');

// Creates connection to the database
// Insert password your own password below
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'employees_db',
});

// Function to display the main menu and handle user choices
const showMainMenu = () => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: [
          'View all employees',
          'Add employee',
          'Update employee role',
          'View all roles',
          'Add role',
          'View all departments',
          'Add department',
          'Quit',
        ],
      },
    ])
    .then((answer) => {
      switch (answer.choice) {
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'Add employee':
          addEmployee();
          break;
        case 'Update employee role':
          updateEmployeeRole();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'Add role':
          addRole();
          break;
        case 'View all departments':
          viewAllDepartments();
          break;
        case 'Add department':
          addDepartment();
          break;
        case 'Quit':
          connection.end();
          console.log('Goodbye!');
          break;
        default:
          console.log('Invalid choice. Please try again.');
          showMainMenu();
          break;
      }
    });
};

// View all employees
const viewAllEmployees = () => {
  connection.query('SELECT * FROM employees', (err, employees) => {
    if (err) {
      console.error('Error retrieving employees:', err);
    } else {
      console.table(employees);
    }
    showMainMenu();
  });
};

// Adds an employee
const addEmployee = () => {
  // Prompt for employee details
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'first_name',
        message: "Enter the employee's first name:",
      },
      {
        type: 'input',
        name: 'last_name',
        message: "Enter the employee's last name:",
      },
      {
        type: 'input',
        name: 'role_id',
        message: "Enter the employee's role ID:",
      },
      {
        type: 'input',
        name: 'manager_id',
        message: "Enter the employee's manager ID:",
      },
    ])
    .then((answers) => {
      // Inserts the employee into the database
      connection.query('INSERT INTO employees SET ?', answers, (err) => {
        if (err) {
          console.error('Error adding employee:', err);
        } else {
          console.log('Employee added successfully!');
        }
        showMainMenu();
      });
    });
};

// Update an employee's role
const updateEmployeeRole = () => {
  // Prompt for employee ID and new role ID
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'employee_id',
        message: "Enter the ID of the employee whose role you want to update:",
      },
      {
        type: 'input',
        name: 'role_id',
        message: "Enter the new role ID for the employee:",
      },
    ])
    .then((answers) => {
      // Update the employee's role in the database
      connection.query('UPDATE employees SET role_id = ? WHERE id = ?', [answers.role_id, answers.employee_id], (err) => {
        if (err) {
          console.error('Error updating employee role:', err);
        } else {
          console.log('Employee role updated successfully!');
        }
        showMainMenu();
      });
    });
};

// View all roles
const viewAllRoles = () => {
  connection.query('SELECT * FROM roles', (err, roles) => {
    if (err) {
      console.error('Error retrieving roles:', err);
    } else {
      console.table(roles);
    }
    showMainMenu();
  });
};

// Adds a role
const addRole = () => {
  // Prompt for role details
  inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the role title:',
    },
    {
      type: 'input',
      name: 'salary',
      message: 'Enter the role salary:',
    },
    {
      type: 'input',
      name: 'department_id',
      message: 'Enter the department ID for the role:',
    },
  ])
    .then((answers) => {
      // Insert the role into the database
      connection.query('INSERT INTO roles SET ?', answers, (err) => {
        if (err) {
          console.error('Error adding role:', err);
        } else {
          console.log('Role added successfully!');
        }
        showMainMenu();
      });
    });
};

// View all departments
const viewAllDepartments = () => {
  connection.query('SELECT * FROM departments', (err, departments) => {
    if (err) {
      console.error('Error retrieving departments:', err);
    } else {
      console.table(departments);
    }
    showMainMenu();
  });
};

// Adds a department
const addDepartment = () => {
  // Prompt for department details
  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter the department name:',
    },
  ])
    .then((answers) => {
      // Insert the department into the database
      connection.query('INSERT INTO departments SET ?', answers, (err) => {
        if (err) {
          console.error('Error adding department:', err);
        } else {
          console.log('Department added successfully!');
        }
        showMainMenu();
      });
    });
};

// Connects to the database and shows the main menu
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the employees_db database.');
    showMainMenu();
  }
});
