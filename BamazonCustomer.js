//requiring inquirer and mysql
var inquirer = require('inquirer');
var mysql = require('mysql');

//creating connection first thing
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'Bamazon'
});

//function to start the program
function start()
{
    //selecting all products to show
    connection.query('SELECT * FROM products',
    function(err, res)
    {
        //table headers
        console.log('id Product Name\t\tPrice\tStock Quantity');
        for(var i = 0; i < res.length; i++)
        {
            //logging out each row from the resulting query
            var item = res[i];
            console.log(item.ItemId + '. ' + item.ProductName + '\t\t' + item.Price + '\t' + item.StockQuantity);
        }

        //prompting for item id and quantity
        inquirer.prompt([
        {
            name: 'id',
            message: 'Enter ID of item you would like to purchase:'
        },
        {
            name : 'quantity',
            message: 'Enter quantity you would like to purchase'
        }]).then(function(answer)
        {
            //calling buy item function
            buyItem(answer.id, answer.quantity, res);
        });
    });
}

//function that contains logic for processing order
function buyItem(id, quantity, res)
{
    //reuse results from select
    var item = res[id-1];
    //ends connection if there are no more of the item selected or the quantity input is greater than stock
    if(item.StockQuantity == 0 || (item.StockQuantity - quantity < 0))
        connection.end(function(err){console.log('Insufficient quantity!')});
    else
    {
        //other wise updates table updating stock quantity
        connection.query('UPDATE products SET ? WHERE ?',
        [
            {
                StockQuantity: (item.StockQuantity - quantity)
            },
            {
                ItemId: id
            }
        ],
        function(err, res2)
        {
            //logs out total of purchase
            connection.end(function(err){console.log('Purchase Total: $' + (quantity * item.Price).toFixed(2));});
        });
    }
}
//starts program
start();