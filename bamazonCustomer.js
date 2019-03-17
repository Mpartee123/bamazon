// connect to the mysql server and sql database
const mysql = require("mysql");
const connection = mysql.createConnection({
    host: "localhost",
    user: 'root',
    database: "bamazon",
});


// create the connection information for the sql database
connection.connect(function (err) {
    if (err) throw err;
    queryAllProducts();
});

//Shows available inventory to user
function queryAllProducts() {
    let productId = [];
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            productId.push(res[i].item_id);
            console.log(`Id: ${res[i].item_id}, Item Name: ${res[i].product_name}, Price: ${res[i].price}, Qty: ${res[i].stock_quantity}`);
        }
        start();
    });
}

//Asks for user input to place order
function start() {
    const inquirer = require('inquirer');
    const questions = [
        {
            name: "idRequest",
            type: "input",
            message: "Which product ID would you like to buy?"
        },
        {
            name: "idQuantity",
            type: "input",
            message: "How many would you like to purchase?"
        }
    ];

    inquirer.prompt(questions).then(answer => {
        checkQuantity(answer.idRequest, answer.idQuantity);
    });
}

//Checks inventory and processes request if stock is available
function checkQuantity(id, userReqQty) {
    connection.query('SELECT * FROM products WHERE item_id =' + id, function (error, results) {
        var res = results[0];
        if (error) throw error;
        if (userReqQty > res.stock_quantity || userReqQty < 0) {
            console.log(`We're so sorry but there are ${res.stock_quantity} ${res.product_name} available please revise your quantity...`);
            queryAllProducts();
        } else {

            var newQuantity = res.stock_quantity - userReqQty;
            updateInventory(id, userReqQty, newQuantity, res.price, res.product_name);
        }
    });
}

//Updates inventory if inventory is available for purchase
function updateInventory(id, userReqQty, newQuantity, price, name) {
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: newQuantity
            },
            {
                item_id: id
            }

        ],
        function (error) {
            if (error) throw err;
            // console.log("Item " + name + " has been successfully updated!");
            console.log(`
                    Thank your for your purchase!
                    Your total for ${name} is ${price * userReqQty}
            `);
            newStockQty(id);
        });
}

//Displays stock for item to show that the purchase was processed
function newStockQty(id) {
    connection.query('SELECT * FROM products WHERE item_id =' + id, function (error, results) {
        var res = results[0];
        if (error) throw error;
        console.log(`The quantity for ${res.product_name} is now ${res.stock_quantity}`);
        restart()
    });
}

//Restarts prompts if user would like to continue
function restart() {
    let inquirer = require('inquirer');

    inquirer
        .prompt([
            {
                type:'list',
                name:'exit',
                message:'Would you like to keep shopping?',
                choices:['Yes','NO']
            }])
        .then(answers => {
            if(answers.exit==='Yes'){
                queryAllProducts();
            }else {
                connection.end();
            }
        })
}