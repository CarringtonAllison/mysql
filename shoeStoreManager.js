const mysql = require("mysql");
const inquire = require("inquirer");
const cTable = require("console.table");
const start = require("./startProgram")

//database info
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "shoeStore_db"
});

//connecting to the database and start running the program
connection.connect(function (err) {
    if (err) throw err;
    console.log("\nWELCOME TO RAIN'S SHOE STORE! \n")
    runProgram();
});


function runProgram() {
    inquire.prompt([
        {
            type: "list",
            name: "menu",
            message: "WHAT WOULD YOU LIKE TO DO?\n",
            choices: ["View Shoes for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "---DONE---"]
        }
    ]).then(function (data) {
        let choice = data.menu;
        switch (choice) {
            case "View Shoes for Sale":
                return viewShoes();
            case "View Low Inventory":
                return lowInventory();
            case "Add to Inventory":
                return addInventory();
            case "Add New Product":
                return addProduct();
            case "---DONE---":
                console.log("\nTHANKS AND HAVE A GREAT DAY!\n")
                return start(); 
                
        };
    })
}

function viewShoes() {
    connection.query(
        "SELECT * FROM shoes",
        function (err, data) {
            if (err) throw err;
            console.log("\n")
            console.log(data);
            console.table(data);
            runProgram();
        }
    )
}

function lowInventory() {
    console.log("\nALL THE SHOES THAT WE HAVE LESS THAN 10 PAIRS OF\n")

    connection.query(
        "SELECT * FROM shoes WHERE (stock_quantity < 10)",
        function (err, data) {
            if (err) throw err;
            console.table(data)
            runProgram();
        }
    )
}

function addInventory() {
    let allShoes = [];

    //displays all shoes 
    connection.query(
        "SELECT * FROM shoes",
        function (err, info) {
            if (err) throw err;
            console.log("\n")
            console.table(info);
            // let stock = info[i].stock_quantity;
            
            //for loop so that it displays the all the shoes in the options to select
            for (var i = 0; i < info.length; i++) {
                allShoes.push(info[i].product_name);
            }
            
            inquire.prompt([
                {
                    type: "list",
                    name: "choice",
                    message: "WHICH SHOES DID YOU WANT TO ADD TO?\n",
                    choices: allShoes
                },
                {
                    type: "input",
                    name: "amount",
                    message: "HOW MANY PAIRS DID YOU WANT TO ADD?\n"
                }
            ]).then(function (data) {
                let choice = data.choice;
                let quantity = data.amount;
                let select = allShoes.indexOf(choice); 
                let stock_quantity = info[select].stock_quantity;
                let sum = (parseInt(stock_quantity) + parseInt(quantity)); 

               //database update
                connection.query(
                    "UPDATE shoes SET ? WHERE ?",
                    [
                        {
                            stock_quantity: sum
                        },
                        {
                            product_name: choice
                        }
                    ],
                    function (err, res) {
                        console.log("\nADDED " + quantity + " MORE PAIRS OF " + choice + " TO THE INVENTORY!\n")
                        runProgram();
                    }
                );
            })
        }
    )
}

function addProduct(){
    inquire.prompt([
        {
            type: "input", 
            name: "shoe", 
            message: "\nWHAT'S THE NAME OF THE SHOES YOU WANT TO ADD?"
        },
        {
            type: "input", 
            name: "department",
            message: "\nWHAT TYPE OF SHOE IS THIS?"

        },
        {
            type: "input",
            name: "price",
            message: "\nWHAT IS THE PRICE FOR THESE SHOES?"
        },
        {
            type: "input",
            name: "stock",
            message: "\nHOW MANY PAIRS OF THESE SHOES ARE WE ADDING?"
        }
    ]).then(function(data){
        let product_name = data.shoe; 
        let department_name = data.department; 
        let price = data.price; 
        let stock_quantity =data.stock; 
        
        
        connection.query(
            "INSERT INTO shoes SET ?",
            {
                product_name: product_name,
                department_name: department_name,
                price: price, 
                stock_quantity: stock_quantity
            },
            function(err, res) {
                // console.log(res)
                console.log("\nYOU HAVE SUCCESSFULLY ADDED " + product_name + " TO OUR INVENTORY!\n")
                runProgram();
            }
            );
            
        })
}



