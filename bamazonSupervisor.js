// Challenge #3: Supervisor View (Final Level)

// View Product Sales by Department
// Create New Department

// Require section to utilize external libraries
var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    supervisorView();
});

// Function supervisorView displays the menu options and allows the user to select what they want to do
function supervisorView() {
    console.log('\r\n');
    inquirer
        .prompt(
            {
                name: "supervisorOptions",
                type: "list",
                message: "Please select an option from the following list: \r\n",
                choices: [
                    "View Product Sales by Department",
                    "Create New Department"
                ]

            })
        .then(function (answer) {
            switch (answer.supervisorOptions) {
                case "View Product Sales by Department":
                    viewProductsSalesByDept();
                    break;

                case "Create New Department":
                    createNewDept();
                    break;
            }
        })
}

// Function view Products queries the bamazon database and lists the products available for sale in the products table, then displays the result
function viewProductsSalesByDept() {
    console.log('\r\n');
    var query = "SELECT d.department_name AS Department, SUM(p.product_sales) AS Sales_To_Date, SUM(d.over_head_costs) AS Over_Head FROM products p RIGHT JOIN departments d ON d.department_name=p.department_name GROUP BY Department;";
    connection.query(query, function (err, res) {
        // console.log(res);
        if (err) throw err;
        var productSalesList = [];
        var deptSalesData = {};
        var deptRevenue = 0;

        for (var i = 0; i < res.length; i++) {
            // Calculate the Revenue by taking the Overhead from Departments table and Total Sales from the Products table.
            deptRevenue = parseFloat(res[i].Sales_To_Date - parseFloat(res[i].Over_Head)).toFixed(2);
            // Create an object to contain the data from mysql and then push for each department
            deptSalesData = {Department: res[i].Department, Sales_To_Date: res[i].Sales_To_Date, Over_Head: res[i].Over_Head, Revenue: parseFloat(deptRevenue)};
            productSalesList.push(deptSalesData);     
        }
        // console.table displays the array of objects as a table
        console.table(productSalesList);
        supervisorView();
    })
}

// Function to allow the user to create a new department, after asking for the necessary details it updates the departments table via an INSERT query.
function createNewDept() {
    console.log("\r\n");
    inquirer
        .prompt([
            {
                name: "newDeptName",
                type: "input",
                message: "Please enter the New Department Name: ",
            },
            {
                name: "newDeptID",
                type: "input",
                message: "Please enter the Department ID: (example 5000)",
            },
            {
                name: "deptOverhead",
                type: "input",
                message: "Please enter the Overhead Costs $",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            var query = "INSERT INTO departments (department_id, department_name, over_head_costs) VALUES (?,?,?);"
            connection.query(query, [answer.newDeptID, answer.newDeptName, answer.deptOverhead], function (err, res) {
                if (err) throw err;
                // console.log(res);
                console.log("\r\n***** Department has been added to the Department List *****\r\n");
                supervisorView();
            })
        });
}