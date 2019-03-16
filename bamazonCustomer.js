// connect to the mysql server and sql database
const mysql = require("mysql");
const connection = mysql.createConnection({
    host: "localhost",
    user: 'root',
    database: "bamazon",
});
let productId=[];

// create the connection information for the sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    queryAllProducts();
});

function queryAllProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            productId.push(res[i].item_id);
            console.log(`Id: ${res[i].item_id}, Item Name:${res[i].product_name}, Price:${res[i].price}`);
        }
        start();
    });

}


// 6. The app should then prompt users with two messages.
// * The first should ask them the ID of the product they would like to buy.
// * The second message should ask how many units of the product they would like to buy.

function start() {
    const inquirer = require('inquirer');
    const questions=[
        {
                name: "idRequest",
                type: "input",
                message: "Which product ID would you like to buy?"
            },
            {
                name:"idQuantity",
                type: "input",
                message: "How many would you like to purchase?"
            }
    ];
    inquirer.prompt(questions).then(answer => {
         console.log('Id request answer '+answer.idRequest);
         console.log('quantity answer '+answer.idQuantity);

        });
}

