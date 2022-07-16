const express = require('express');
const cors = require('cors');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db.db');

const sql = 'INSERT INTO mytable (date, difficulty, steps) VALUES(?,?,?)';

function insertData(data) {
    db.run(sql, [data.date, data.difficulty, data.number]);
    console.log("Data inserted successfully...");    
}


const getGameHistory = async () => {
    const gamesList = await new Promise((resolve, reject) => {
        db.all("SELECT * FROM mytable", function (error, results) {
            if (error) return console.log(error.message);
            resolve(results)
        });
    })
    console.log(gamesList);
    return gamesList
}


const getBestResults = async () => {
    const bestResults = []
    for (let i = 3; i < 6; i++) {
        await new Promise((resolve, reject) => {
            db.all(`SELECT * FROM mytable WHERE difficulty = ${i} AND steps = (SELECT MIN(steps) FROM mytable WHERE difficulty = ${i})`, function (error, results) {
                let bestOfCurrentDiff
                results.length === 0 ? bestOfCurrentDiff = [{ steps: 'X' }] : bestOfCurrentDiff = results
                resolve(bestResults.push(bestOfCurrentDiff[0]))
            })
        })
    }
    console.log(bestResults);
    return (bestResults)
}

db.serialize(() => {
    getGameHistory();    
});

// db.close();

const PORT = process.env.port || 3002;
const app = express();

app.use(cors());
app.use(express.json())

app.listen(PORT, () => {
    console.log(`Server starting on port ${PORT}`)
})

app.get('/api', async (req, res) => {
    const data = await getGameHistory();
    res.json(data)
})


app.get('/best_results', async (req, res) => {
    console.log('best results request');
    const results = await getBestResults()
    res.json(results);
})

app.post('/api', (req, res) => {
    const data = req.body;
    console.log(data);
    res.status(201).json(data.number);
    insertData(data);
})
