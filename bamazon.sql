-- Challenge #1: Customer View (Minimum Requirement)

-- Here are the commands to create and populate the bamazon database

-- Create a MySQL Database called bamazon.
CREATE DATABASE bamazon;

USE bamazon;

-- Then create a Table inside of that database called products.
-- The products table should have each of the following columns:
-- item_id (unique id for each product)
-- product_name (Name of product)
-- department_name
-- price (cost to customer)
-- stock_quantity (how much of the product is available in stores)
CREATE TABLE IF NOT EXISTS products (
    item_id INT AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
	price DECIMAL (6,2) NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY (item_id)
);

-- Populate this database with around 10 different products. (i.e. Insert "mock" data rows into this database and table). 
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES
("Keurig K55/K-Classic Coffee Maker", "Kitchen", 59.99, 10),
("15 Piece Knife Set", "Kitchen", 64.99, 10),
("Cast Iron Skillet", "Kitchen", 15.99, 10),
("Video Game Chair", "Furniture", 39.99, 10),
("Recliner", "Furniture", 219.99, 10),
("Rocking Chair", "Furniture", 169.99, 10),
("Playstation 4", "Electronics", 299.90, 10),
("Nintendo Switch", "Electronics", 299.00, 10),
("Samsung 55 Inch Smart TV", "Electronics", 849.99, 10),
("Lawn Mower", "Garden", 329.99, 10),
("Leaf Blower", "Garden", 49.49, 10),
("Chainsaw", "Garden", 125.00, 10);

SELECT * FROM products;

SELECT p.item_id AS Product_ID, p.product_name AS Item_Name, p.price AS Sale_Price
FROM products p;

UPDATE products 
SET stock_quantity = 6 
WHERE item_id = 5;

CREATE TABLE IF NOT EXISTS departments (
department_id INT NOT NULL,
department_name VARCHAR(25) NOT NULL,
over_head_costs DECIMAL (6,2) NOT NULL,
PRIMARY KEY (department_id)
);

ALTER TABLE products
ADD COLUMN product_sales DECIMAL (6,2);

SELECT * FROM products;
SELECT * FROM departments;

INSERT INTO departments (department_id, department_name, over_head_costs) VALUES 
(1000, "Kitchen", 1200), (2000, "Furniture", 1500), (3000, "Electronics", 800), (4000, "Garden", 1000);

UPDATE departments
SET over_head_costs = 4000.00
WHERE department_id = 4000;

SELECT d.department_name AS Department, SUM(p.product_sales) AS Sales_To_Date, SUM(d.over_head_costs) AS Over_Head
FROM products p
RIGHT JOIN departments d
ON d.department_name=p.department_name
GROUP BY Department;


DESCRIBE departments;
DESCRIBE products;


ALTER TABLE products
ADD FOREIGN KEY (department_name) REFERENCES departments(department_name);

SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));