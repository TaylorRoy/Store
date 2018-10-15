DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

use bamazon;

CREATE TABLE products (
item_id INT(50) AUTO_INCREMENT NOT NULL,
product_name VARCHAR(30),
price INT(10),
stock_quantity INT(200),
PRIMARY KEY(item_id) 
);

CREATE TABLE departments (
department_id INT(50) AUTO_INCREMENT NOT NULL,
department_name VARCHAR(30),
over_head_costs INT(20) NOT NULL,
PRIMARY KEY(department_id)
);

INSERT INTO products (product_name, price, stock_quantity)
VALUES ("jeans", "50", "10"), ("shorts", "30", "10"), ("t-shirt", "15", "10"), ("button-up shirt", "30", "10"), ("flannel shirt", "40", "10"), ("flip flops", "20", "10"), ("shoes", "60", "10"), ("trucker hat", "20", "10");

INSERT INTO departments()
