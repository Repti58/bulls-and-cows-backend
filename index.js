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
        if (error) return console.log(error.message);
        message = results
    });
}


let bestResults = [];

async function dataBaseRequest1() {
    db.all("SELECT * FROM mytable WHERE difficulty = 3 AND steps = (SELECT MIN(steps) FROM mytable WHERE difficulty = 3)", function (error, results) {
        if (error) return console.log(error.message);
        // bestResults = [];
        // console.log(bestResults);
        console.log(results[0]);
        return results[0];
    });
}

async function dataBaseRequest2() {
    let res = await (db.all("SELECT * FROM mytable WHERE difficulty = 4 AND steps = (SELECT MIN(steps) FROM mytable WHERE difficulty = 4)", function (error, results) {
        if (error) return console.log(error.message);
        // console.log(results)  

        // console.log(bestResults);
        console.log(results[0]);
    }
    )
    )
    return res
}
async function dataBaseRequest3() {
    db.all("SELECT * FROM mytable WHERE difficulty = 5 AND steps = (SELECT MIN(steps) FROM mytable WHERE difficulty = 5)", function (error, results) {
        if (error) return console.log(error.message);
        // console.log(results)  

        // console.log(bestResults);
        console.log(results[0]);

        return results[0]
    })
}
async function accessDataBestResults() {
    let a = await dataBaseRequest1();
    console.log(a);
    bestResults.push(a)
    let b = await dataBaseRequest2()
    bestResults.push(b)
    let c = await dataBaseRequest3()
    bestResults.push(c)
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
    accessData();
    res.json(message)
})


app.get('/best_results', (req, res) => {
    console.log('best results request');
    // accessDataBestResults();
    res.json(bestResults);
    // bestResults = [];

})

app.post('/api', (req, res) => {
    data = req.body;
    console.log(data);
    res.status(201).json(data.number);
    insertData(data);
    accessDataBestResults();
})
