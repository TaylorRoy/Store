var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

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

    else if (nodeArray[2] === "view-low-inventory") {
        console.log("view low inventory");
        lowInventory();
    }

    else if (nodeArray[2] === "add-to-inventory") {
        console.log("add-to-inventory");
        addToInventory();
    }

    else if (nodeArray[2] === "add-new-product") {
        console.log("add-new-product");
        addNewProduct();
    }
    // if (nodeArray[2]==="null") {
    //     displayStore();
    //     start();
    // }
    else {
        displayStore();
        start();
    }
});

function displayStore() {
    var MAX_PRODUCT_NAME_LENGTH = 30;
    console.log("Welcome to Bamazon!");
    console.log("Here is a list of what we have in stock.");
    connection.query("SELECT * FROM products", function (error, results) {
        if (error) throw error;
        console.log("product name|     price    |    quantity    |");
        console.log("---------------------------------------------");

        for (i = 0; i < results.length; i++) {
            let product = results[i];
            let length = product.product_name.length;
            let displayName = '';// = results[i].product_name;
            if (length > MAX_PRODUCT_NAME_LENGTH) {
                displayName = product.product_name.slice(0, MAX_PRODUCT_NAME_LENGTH - 3);
                displayName += '...';
            } else if (length <= MAX_PRODUCT_NAME_LENGTH) {
                let emptySpaces = '';
                for (let j = 0; j < MAX_PRODUCT_NAME_LENGTH - length; j++) {
                    emptySpaces += " ";
                }
                displayName = product.product_name;
                displayName += emptySpaces;
            }
            console.log(displayName + " | $" + results[i].price + " | " + results[i].stock_quantity);
        }
        // connection.end()
    })
};

function start() {
    inquirer.prompt({
        name: "buy",
        type: "list",
        message: "What is the ID of the item you would like to buy?",
        choices: ["1.Jeans", "2.Shorts", "3.T-Shirts", "4.Button-Up Shirt", "5.Flannel Shirt", "6.Flip Flops", "7.Shoes", "8.Trucker Hat", "9.Radio"]
    }).then(function (answer) {
        if (answer.buy === "1.Jeans") {
            item = "jeans";
            choice = 1;
            arrayPosition = 0;
            howMany();
        }
        if (answer.buy === "2.Shorts") {
            item = "short";
            choice = 2;
            arrayPosition = 1;
            howMany();
        }
        if (answer.buy === "3.T-Shirts") {
            item = "t-shirt";
            choice = 3;
            arrayPosition = 2;
            howMany();
        }
        if (answer.buy === "4.Button-Up Shirt") {
            item = "button-up shirt";
            choice = 4;
            arrayPosition = 3;
            howMany();
        }
        if (answer.buy === "5.Flannel Shirt") {
            item = "flannel shirt";
            choice = 5;
            arrayPosition = 4;
            howMany();
        }
        if (answer.buy === "6.Flip Flops") {
            item = "flip flop";
            choice = 6;
            arrayPosition = 5;
            howMany();
        }
        if (answer.buy === "7.Shoes") {
            item = "shoe";
            item = "shoes"
            choice = 7;
            arrayPosition = 6;
            howMany();
        }
        if (answer.buy === "8.Trucker Hat") {
            item = "trucker hat";
            choice = 8;
            arrayPosition = 7;
            howMany();
        }
        if (answer.buy === "9.Radio") {
            item = "radio";
            choice = 9;
            arrayPosition = 8;
            howMany();
        }
    })
}

var item;
var choice;
var arrayPosition;

function howMany() {
    // console.log("choice: ",choice)
    // console.log("arrayposition: ",arrayPosition);
    inquirer.prompt([
        {
            name: "numberPants",
            type: "input",
            message: "How many " + item + "(s) would you like to order?",
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
                // console.log(results[arrayPosition].stock_quantity);
                // console.log(answer.numberPants);
                if (results[arrayPosition].stock_quantity < answer.numberPants) {
                    console.log("We don't have that many in stock.");
                    console.log("Try again.")
                    start();
                }
                else {
                    var newStockQuantity = (results[arrayPosition].stock_quantity - answer.numberPants)
                    // console.log(newStockQuantity);
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: newStockQuantity
                            },
                            {
                                item_id: choice
                            }
                        ],
                        function (error) {
                            if (error) throw err;
                            // console.log("database was updated!");
                            connection.query("SELECT price FROM products", function (error, results) {
                                if (error) throw error;
                                // console.log(results[arrayPosition].price);
                                // console.log(answer.numberPants);
                                var total = (results[arrayPosition].price * answer.numberPants)
                                console.log("You ordered:" + item);
                                console.log("Quantity: " + answer.numberPants);
                                console.log("The price per unit is: " + results[arrayPosition].price)
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
    connection.query("SELECT * FROM products", function (error, results) {
        if (error) throw error;
        var lowInventoryArray = [];
        for (i = 0; i < results.length; i++) {
            if (results[i].stock_quantity < 5) {
                lowInventoryArray.push(results[i])
            }
        }
        if (lowInventoryArray.length <= 0) {

            console.log("All items have a stock quantity of more than 5.")
            connection.end();
        }
        else {
            console.log(lowInventoryArray);
            connection.end();
        }
        
    })
};

function addToInventory() {
    inquirer.prompt([
        {
            name: "id",
            type: "list",
            message: "What is the ID of the product would you like to add more inventory to?",
            choices: ["1.Jeans", "2.Shorts", "3.T-Shirts", "4.Button-Up Shirt", "5.Flannel Shirt", "6.Flip Flops", "7.Shoes", "8.Trucker Hat", "9.Radio"]
        },
        {
            name: "amount",
            type: "input",
            message: "How many would you like to add?",
        }
    ]).then(function (answer) {
        console.log("ANSWER: " + answer.id.slice(0,1));
        var addAnswer = parseInt(answer.id.slice(0,1));
        console.log(typeof(addAnswer));
        connection.query(
            "SELECT * FROM products", function (error, results) {
                if (error) throw error;
                console.log(results)
                console.log("product_name: " + results[(addAnswer - 1)].product_name);
                var addStock = (parseInt(results[(addAnswer - 1)].stock_quantity) + parseInt(answer.amount))
                console.log("ADDSTOCK" + addStock);
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: addStock
                        },
                        {
                            item_id: addAnswer
                        }
                    ],
                    function (error) {
                        if (error) throw error;
                        console.log("UPDATE: " + results[(addAnswer - 1)].product_name + " with ID:" + answer.id + " now has a stock quantity of " + addStock + ".");
                        connection.end();
                    })
            }
        )

    }
    )
}

function addNewProduct() {
    console.log("in addnewproduct");
    inquirer.prompt([
        {
            name: "newItem",
            type: "input",
            message: "What product do you want to add to store?"
        },
        {
            name: "newItemAmount",
            type: "input",
            message: "How many do you want to add to store?"
        },
        {
            name: "newItemPrice",
            type: "input",
            message: "How much per does the new product cost?"
        }
    ]).then(function (answer) {
        connection.query("INSERT INTO products SET ?",
            {
                product_name: answer.newItem,
                stock_quantity: answer.newItemAmount,
                price: answer.newItemPrice
            }, function (error) {
                if (error) throw error;
                console.log("Item was added.");
            }
        )
    })
}

