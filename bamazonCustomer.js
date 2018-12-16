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
    displaySaleItems();
});

// Start function displays the current list of items for sale
function displaySaleItems() {
    var query = "SELECT p.item_id AS Product_ID, p.product_name AS Item_Name, p.price AS Sale_Price FROM products p;";
    connection.query(query, function (err, res) {
        if (err) throw err;
        var productList = [];
        var productData = {};
        for (var i = 0; i < res.length; i++) {
            productData = { Product_ID: res[i].Product_ID, Item_Name: res[i].Item_Name, Sale_Price: res[i].Sale_Price };
            productList.push(productData);
        }
        console.log("\r\n***** PRODUCT LIST *****\r\n")
        console.table(productList, "\r\n");
        purchaseItems();
    })
}

// Function to allow the user to purchase items...  Asks the user which item and how many they'd like to purchase, then provides information about the purchase and updates mysql db via an UPDATE query
function purchaseItems() {
    inquirer
        .prompt([
            {
                name: "itemPurchased",
                type: "input",
                message: "Please enter the ID of the item you'd like to purchase?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "How many would you like to purchase?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            var query = "SELECT p.product_name AS Item_Name, p.stock_quantity AS Num_In_Stock, p.price AS item_price, p.product_sales AS Total_Sales from products p WHERE p.item_id = ?;"
            var itemId = parseInt(answer.itemPurchased);
            connection.query(query, [itemId], function (err, res) {
                if (err) throw err;
                var itemPurchased = res[0].Item_Name;
                var StockQuantity = res[0].Num_In_Stock;
                var itemPrice = res[0].item_price;
                var totalSales = res[0].Total_Sales;

                console.log("\r\nYou have chosen to purchase " + answer.quantity + "x " + itemPurchased + "\r\n")

                if (answer.quantity > StockQuantity) {
                    console.log("Unfortunately we don't have enough " + itemPurchased + "'s in stock.  Please place a new order\r\n");
                    purchaseItems();
                }
                else {
                    console.log("Congratulations, we have successfully placed your order!\r\n");
                    var customerCost = answer.itemPurchased * itemPrice;
                    console.log("The cost of your order is $" + customerCost + "\r\n")
                    // console.log ("Old Total Sales Amount $"+totalSales);
                    totalSales += customerCost;
                    console.log("New Total Sales Amount $" + totalSales + "\r\n");
                    var newStockQuantity = parseInt(StockQuantity - answer.quantity);
                    console.log("New Stock Amount: " + newStockQuantity + "\r\n");
                    var query = "UPDATE products SET stock_quantity = ?, product_sales = ? WHERE item_id = ?;"
                    connection.query(query, [newStockQuantity, totalSales, itemId], function (err, res) {
                        if (err) throw err;
                        // console.log("Update Stock Res", res);
                        console.log("Stock Quantity has been updated\r\n");
                        displaySaleItems();
                    })
                }
            })
        });
}