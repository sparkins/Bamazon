# Bamazon:  Week13-Homework:  A node, mysql amazon like store application
---
This homework was to allow us to demonstrate our skills with node.js and mysql.  THis app is an Amazon-like storefront. The app will take in orders from customers and deplete stock from the store's inventory. As a bonus task, you can program your app to track product sales across your store's departments and then provide a summary of the highest-grossing departments in the store.

---
## Challenge #1: Customer View (Minimum Requirement)

* Create a MySQL Database called bamazon.
* Create a Table inside of that database called products.
    - The products table should have each of the following columns:
    - item_id (unique id for each product)
    - product_name (Name of product)
    - department_name
    - price (cost to customer)
    - stock_quantity (how much of the product is available in stores)

* Populate this database with around 10 different products. (i.e. Insert "mock" data rows into this database and table).*
* Then create a Node application called bamazonCustomer.js. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
* The app should then prompt users with two messages.
    - The first should ask them the ID of the product they would like to buy.
    - The second message should ask how many units of the product they would like to buy.

* Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.
If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.
However, if your store does have enough of the product, you should fulfill the customer's order.

---
## Challenge #2: Manager View (Next Level)

* Create a new Node application called bamazonManager.js. Running this application will:
    - List a set of menu options:
    - View Products for Sale
    - View Low Inventory
    - Add to Inventory
    - Add New Product

---
## Challenge #3: Supervisor View (Final Level)

* Create a new MySQL table called departments. Your table should include the following columns:
    - department_id
    - department_name
    - over_head_costs (A dummy number you set for each department)
* Modify the products table so that there's a product_sales column, and modify your bamazonCustomer.js app so that when a customer purchases anything from the store, the price of the product multiplied by the quantity purchased is added to the product's product_sales column.
* Create another Node app called bamazonSupervisor.js. Running this application will list a set of menu options:
    - View Product Sales by Department
    - Create New Department
    - When a supervisor selects View Product Sales by Department, the app should display a summarized table in their terminal/bash window. Use the table below as a guide.
