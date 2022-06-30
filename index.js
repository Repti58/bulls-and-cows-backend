const express = require('express');
const cors = require('cors');


var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db.db');



const sql = 'INSERT INTO mytable (date, difficulty, steps) VALUES(?,?,?)';

function insertData(data) {
    db.run(sql, [data.date, data.difficulty, data.number]);
    console.log("Data inserted successfully...");
    accessData();
}

// function insertData(data) {
//     db.run('INSERT INTO mytable (id, date, difficulty, steps) VALUES(?,?,?,?)');
//     console.log("Data inserted successfully...");
//     accessData();
// }
// for (var i = 0; i < users.length; i++) {
//     insertQuery.run(i, users[i]);
// }
// insertQuery.finalize();
// }
let message = ''
function accessData() {
    db.all("SELECT * FROM mytable", function (error, results) {
        if (error) return console.log(err.message);
        console.log(results)
        message = results

    }); 
}


let bestResults = [];
function accessDataBestResults() {
   for(let i = 3; i < 6; i++) {
    db.all(`SELECT * FROM mytable WHERE difficulty = ${i} AND steps = (SELECT MIN(steps) FROM mytable WHERE difficulty = ${i})`, function (error, results) {
        if (error) return console.log(error.message);
        // console.log(results)
        message = results
        bestResults.push(results[0])
    })
    console.log(bestResults)
   }
       
    


    // db.all("SELECT * FROM mytable WHERE difficulty = 3 AND steps = (SELECT MIN(steps) FROM mytable WHERE difficulty = 3)", function (error, results) {
    //     if (error) return console.log(error.message);
    //     // console.log(results)
    //     message = results
    //     bestResults.push(results[0])
    //     // console.log(bestResults)
    // })

    // db.all("SELECT * FROM mytable WHERE difficulty = 4 AND steps = (SELECT MIN(steps) FROM mytable WHERE difficulty = 4)", function (error, results) {
    //     if (error) return console.log(error.message);
    //     // console.log(results)
    //     message = results
    //     bestResults.push(results[0])
    //     // console.log(bestResults)
    // })

    // db.all("SELECT * FROM mytable WHERE difficulty = 5 AND steps = (SELECT MIN(steps) FROM mytable WHERE difficulty = 5)", function (error, results) {
    //     if (error) return console.log(error.message);
    //     // console.log(results)
    //     message = results
    //     bestResults.push(results[0])
    //     // console.log(bestResults)
    // });

}

// function deleteData(name){
//     db.run("DELETE FROM mytable WHERE name=?",name, err =>{
//         if (err) return console.log(err.message);
//         console.log(`${name} deleted successfully...`);
//     });
// }

db.serialize(function () {
    // db.run("CREATE TABLE IF NOT EXISTS mytable (_ID INTEGER PRIMARY KEY AUTOINCREMENT, date, difficulty, steps)");
    // insertData();
    accessData();
    // accessDataBestResults()
    // deleteData("James");
}); 

// db.close();

const PORT = process.env.port || 3002;
// const message = accessData();
const app = express();




app.use(cors());
app.use(express.json())

app.listen(PORT, () => {
    console.log(`Server starting on port ${PORT}`) 
})

app.get('/api', (req, res) => {
    accessData();
    console.log('game history request')
    res.json(message)
    message = ''
})

app.get('/best_results', (req, res) => {
    
    accessDataBestResults();
    console.log('best results request')
    res.json(bestResults)
    bestResults = []
})



// app.post('/api', (req, res) => {
//     data = req.body
//     console.log(data)
//     // res.send('Data inserted successfully...') 
//     res.status(201).json(data.number)
//     insertData(data)

// })
