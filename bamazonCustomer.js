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
    start();
});

function queryAllProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            productId.push(res[i].item_id);
            console.log(`
            Id: ${res[i].item_id}
            Item Name:${res[i].product_name}
            Price:${res[i].price}
            `);
        }
    });
}


// 6. The app should then prompt users with two messages.
// * The first should ask them the ID of the product they would like to buy.
// * The second message should ask how many units of the product they would like to buy.
const inquirer = require('inquirer');
function start() {
    inquirer
        .prompt({
            name: "idRequest",
            type: "input",
            message: "Which product ID would you like to buy?"
        })
        .then(function(answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.idRequest === productId) {
                console.log('user input'+answer.idRequest);
            }
            // else if(answer.postOrBid === "BID") {
            //     bidAuction();}
                else{
                connection.end();
            }
        });
    console.log('product Id array after input'+productId);
}

