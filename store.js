// var mysql = require("mysql");
// var inquire = require("inquirer");

// var connection = mysql.createConnection({
//     host: "localhost",
//     port:3306,
//     password: "password",
//     database: "bamazon"
// });

// connection.connect(function(error) {
//     if (error) {
//         console.log(error);
//     }
//     console.log("connected as id " + connection.threadId);
//     displayStore();
//     start();
// })

// function displayStore() {

// };



var mysql = require("mysql");
var inquirer = require("inquirer");

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

var nodeArray = process.argv;

// connect to the mysql server and sql database
connection.connect(function (error) {
    if (error) throw error;
    // run the start function after the connection is made to prompt the user
    console.log("CONNECTED!");
    console.log("connected as id " + connection.threadId);
    if (nodeArray[2] === "view-products-for-sale") {
        console.log("view products for sale");
        displayStore();
       }
       
    if (nodeArray[2] === "view-low-inventory") {
        console.log("view low inventory");
        lowInventory();
       }

    if (nodeArray[2] === "add-to-inventory") {
        console.log("add-to-inventory");
    }
    
    if (nodeArray[2] === "add-new-product") {
        console.log("add-new-product");
    }
    else {
        // displayStore();
        // start();
    }
});

function displayStore() {
    console.log("Welcome to Bamazon!");
    console.log("Here is a list of what we have in stock.");
    connection.query("SELECT * FROM products", function(error, results){
    if (error) throw error;
    console.log("product name|     price    |    quantity    |");
    console.log("---------------------------------------------");

    for (i=0; i<results.length; i++){
        console.log("|" + results[i].product_name + "     |     $" + results[i].price + "   |   " + results[i].stock_quantity + "|");
    }
    connection.end()
    })
};

function start() {
    inquirer.prompt({
        name: "buy",
        type: "rawlist",
        message: "What is the ID of the item you would like to buy?",
        choices: ["1.Jeans", "2.Shorts", "3. T-Shirts", "4. Button-Up Shirt"]
    }).then(function (answer) {
        if (answer.buy === "1.Jeans") {
            console.log("PANTS!");
            howManyPants();
        }
    })
}

function howManyPants() {
    inquirer.prompt([
        {
            name: "numberPants",
            type: "input",
            message: "How many pairs of pants would you like to order?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (answer) {
        connection.query(

            "SELECT stock_quantity FROM products", function (error, results) {
                if (error) throw error;
                console.log(results[0].stock_quantity);
                console.log(answer.numberPants);
                if (results[0].stock_quantity < answer.numberPants) {
                    console.log("we don't have that many pants in stock.");
                }
                else {
                    newStockQuantity = (results[0].stock_quantity - answer.numberPants)
                    console.log(newStockQuantity);
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: newStockQuantity
                            },
                            {
                                item_id: 1
                            }
                        ],
                        function (error) {
                            if (error) throw err;
                            console.log("database was updated!");
                            connection.query("SELECT price FROM products", function(error, results){
                                if (error) throw error;
                                console.log(results[0].price);
                                console.log(answer.numberPants);
                                var total = (results[0].price * answer.numberPants)
                                console.log("Your total is $" + total);
                                connection.end();
                            })
                            // start();
                        }
                    )
                }
            }
        )
    })
}

function lowInventory() {
    connection.query("SELECT * FROM products", function(error, results){
        if (error) throw error;
        var lowInventoryArray = [];
        for (i=0; i < results.length; i++) {
            if (results[i].stock_quantity < 5){
                lowInventoryArray.push(results[i])
            }
        }
        console.log(lowInventoryArray);
        connection.end();
    })
};

function addToInventory() {
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What product would you like to add more inventory to?"
        },
        {
           name:"amount",
           type:"input",
           message:"How many would you like to add?" 
        }
    ])
    .then(function(answer){
        connection.query("INPUT INTO products SET ?", function(error, results){
            if (error) throw error;
            
        })

    })
}

