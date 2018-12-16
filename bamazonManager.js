// Challenge #2: Manager View (Next Level)

// List a set of menu options:
// View Products for Sale
// View Low Inventory
// Add to Inventory
// Add New Product

// Require section to utilize external libraries
var mysql = require("mysql");
var inquirer = require("inquirer");
var _ = require("underscore");
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
    managerView();
});

// Function managerView displays the menu options and allows the user to select what they want to do
function managerView() {
    console.log('\r\n');
    inquirer
        .prompt(
            {
                name: "managerOptions",
                type: "list",
                message: "Please select an option from the following list: \r\n",
                choices: [
                    "View Products",
                    "View Low Inventory",
                    "Add to Inventory",
                    "Add New Product"
                ]

            })
        .then(function (answer) {
            switch (answer.managerOptions) {
                case "View Products":
                    viewProducts();
                    break;

                case "View Low Inventory":
                    viewLowInventory();
                    break;

                case "Add to Inventory":
                    addToInventory();
                    break;

                case "Add New Product":
                    addNewProduct();
                    break;

            }
        })
}

// Function view Products queries the bamazon database and lists the products available for sale in the products table, then displays the result
function viewProducts() {
    console.log('\r\n');
    var query = "SELECT p.item_id AS Product_ID, p.product_name AS Item_Name, p.price AS Sale_Price FROM products p;";
    connection.query(query, function (err, res) {
        if (err) throw err;
        var productList = [];
        var productData = {};
        for (var i = 0; i < res.length; i++) {
            productData = { Product_ID: res[i].Product_ID, Item_Name: res[i].Item_Name, Sale_Price: res[i].Sale_Price };
            productList.push(productData);
        }
        console.table(productList);
        managerView();
    })
}

// viewLowInventory queries the bamazon db and lists the products that has a stock below the low stock threshold.
function viewLowInventory() {
    var query = "SELECT p.item_id AS Product_ID, p.product_name AS Item_Name, p.stock_quantity AS Num_In_Stock FROM products p;";
    connection.query(query, function (err, res) {
        if (err) throw err;
        var lowStockItems = [];
        var productData = {};
        console.log("\r\n***** Low Stock Products *****\n")
        // Loop through the response from the mysql query, checks the stock quanity, if below threshold pushes the results into a lowstockitems array of objects 
        for (var i = 0; i < res.length; i++) {
            if (res[i].Num_In_Stock < 10) {
                productData = { ProductID: res[i].Product_ID, ItemName: res[i].Item_Name, StockQuantity: res[i].Num_In_Stock };
                lowStockItems.push(productData);
            }
        }
        // if there are no Low Stock Items, displays a message to the manager
        if (_.isEmpty(lowStockItems)) {
            console.log("\r\n*** There are No Low Stock Items! ***");
        }
        else {
            console.table(lowStockItems);
        }
        managerView();

    })
}

// Function addToInventory asks the user which item they'd like to add and how many.  Then updates mysql with the new inventory via an Update Query.
function addToInventory() {
    console.log("\r\n");
    inquirer
        .prompt([
            {
                name: "itemAddStock",
                type: "input",
                message: "Please enter the ID of the item for which you'd like to Add Stock?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "addStock",
                type: "input",
                message: "How many would you like to Add?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            var query = "SELECT p.product_name AS Item_Name, p.stock_quantity AS Num_In_Stock FROM products p WHERE p.item_id = ?;"
            var itemId = parseInt(answer.itemAddStock);
            connection.query(query, [itemId], function (err, res) {
                if (err) throw err;
                // console.table("MY RESULT: ", res);
                var itemAddStock = res[0].Item_Name;
                var currentStockQuantity = res[0].Num_In_Stock;
                var newStockQuantity = (parseInt(currentStockQuantity) + parseInt(answer.addStock));
                // Console's the item, the stock to add and the new stock qty on hand
                console.table("\r\n", { 'Item Name': itemAddStock, 'Stock to Add': answer.addStock, 'New Stock Qty': newStockQuantity });
                var query = "UPDATE products SET stock_quantity = ? WHERE item_id = ?;"
                connection.query(query, [newStockQuantity, itemId], function (err, res) {
                    if (err) throw err;
                    // console.log("Update Stock Res", res);
                    // After updating the mysql db, it provides a message to let you know the Inventory has been updated.
                    console.log("\r\n***** Stock inventory has been updated *****\n");
                    managerView();
                })
            });
        })
}

// Function to add a brand spanking new product.  Asks the user for product name, department, price and stock level, then adds to mysql via an INSERT query
function addNewProduct() {
    console.log("\r\n");
    inquirer
        .prompt([
            {
                name: "newProductName",
                type: "input",
                message: "Please enter the Item Name: ",
            }, 
            {
                name: "newProductDept",
                type: "input",
                message: "Please enter the Item Department: ",
            },
            {
                name: "newProductPrice",
                type: "input",
                message: "Please enter the Item Price: ",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
                },
            {
                name: "newProductQty",
                type: "input",
                message: "How many would you like to add to your inventory?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            var query = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?,?,?,?);"
            connection.query(query, [answer.newProductName, answer.newProductDept, answer.newProductPrice, answer.newProductQty], function (err, res) {
                if (err) throw err;
                // console.log(res);
                // Message to let the user know the item has been added.
                console.log("Item has been added to you Product List\r\n");
                managerView();
            })
        });
}
