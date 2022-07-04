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

let message = ''
function accessData() {
    
    db.all("SELECT * FROM mytable", function (error, results) {
        if (error) return console.log(err.message);     
        message = results        
    }); 
}


let bestResults = [];
function accessDataBestResults() { 
    async function dataBaseRequest() {
        db.all("SELECT * FROM mytable WHERE difficulty = 3 AND steps = (SELECT MIN(steps) FROM mytable WHERE difficulty = 3)", function (error, results) {
            if (error) return console.log(error.message);            
            bestResults = [];  
            bestResults.push(results[0])            
        });
    }

    dataBaseRequest().then(
        db.all("SELECT * FROM mytable WHERE difficulty = 4 AND steps = (SELECT MIN(steps) FROM mytable WHERE difficulty = 4)", function (error, results) {
                if (error) return console.log(error.message);
                // console.log(results)  
                
                bestResults.push(results[0])
                console.log(bestResults);
            })
    ).then(
        db.all("SELECT * FROM mytable WHERE difficulty = 5 AND steps = (SELECT MIN(steps) FROM mytable WHERE difficulty = 5)", function (error, results) {
                if (error) return console.log(error.message);
                // console.log(results)  
                
                bestResults.push(results[0])
                console.log(bestResults);
            }))   

}

db.serialize(() => {
    // db.run("CREATE TABLE IF NOT EXISTS mytable (_ID INTEGER PRIMARY KEY AUTOINCREMENT, date, difficulty, steps)");
    // insertData();
    
    accessData();
    accessDataBestResults()      
}); 

// db.close();

const PORT = process.env.port || 3002;
const app = express();




app.use(cors());
app.use(express.json())

app.listen(PORT, () => {
    console.log(`Server starting on port ${PORT}`) 
})

app.get('/api', (req, res) => {
    console.log('game history request')
    console.log(`after request ${message}`)
    accessData();
    console.log(`after accesData ${message}`)
    res.json(message)   
})


app.get('/best_results', (req, res) => {
    console.log('best results request')
    accessDataBestResults();
    res.json(bestResults)
    bestResults = []
   
})

app.post('/api', (req, res) => {
    data = req.body
    console.log(data)    
    res.status(201).json(data.number)
    insertData(data)

})
