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




// const f3 = () => {
//     let a = db.all("SELECT * FROM mytable WHERE difficulty = 3 AND steps = (SELECT MIN(steps) FROM mytable WHERE difficulty = 3)", function (error, results) {
//         if (error) return console.log(error.message);
//         console.log(results)  
//         // bestResults.push(results[0])
//         // console.log(bestResults);
//         return results[0]
//     })
//     return a
// }
// const f4 = () => {
//     let a = db.all("SELECT * FROM mytable WHERE difficulty = 4 AND steps = (SELECT MIN(steps) FROM mytable WHERE difficulty = 4)", function (error, results) {
//         let bestOf4 = results[0]
//         if (error) return console.log(error.message);
//         console.log(results)  
//         // bestResults.push(results[0])
//         // console.log(bestResults);
//         return results[0]
//     })
//     return a
// }
// const f5 = () => {
//     let a = db.all("SELECT * FROM mytable WHERE difficulty = 5 AND steps = (SELECT MIN(steps) FROM mytable WHERE difficulty = 5)", function (error, results) {
//         if (error) return console.log(error.message);
//         console.log(results)  
//         // bestResults.push(results[0])
//         // console.log(bestResults);
//         return results[0]
//     })
//     return a
// }



let bestResults = [];

const accessDataBestResults3 = new Promise((resolve, reject) => {
    db.all("SELECT * FROM mytable WHERE difficulty = 3 AND steps = (SELECT MIN(steps) FROM mytable WHERE difficulty = 3)", function (error, results) {
        // if (error) return console.log(error.message);
        let bestOf3 = results[0]
        resolve(bestOf3)
    })
})


// async function accessDataBestResults4() {
const accessDataBestResults4 = new Promise((resolve, reject) => {
    db.all("SELECT * FROM mytable WHERE difficulty = 4 AND steps = (SELECT MIN(steps) FROM mytable WHERE difficulty = 4)", function (error, results) {
        let bestOf4 = results[0]
        // console.log(results[0]);
        resolve(bestOf4)
    })
})

const accessDataBestResults5 = new Promise((resolve, reject) => {
    db.all("SELECT * FROM mytable WHERE difficulty = 5 AND steps = (SELECT MIN(steps) FROM mytable WHERE difficulty = 5)", function (error, results) {
        let bestOf5 = results[0]
        // console.log(results[0]);
        resolve(bestOf5)
    })
})

// const accessDataBestResults = () => {
//     // bestResults = []
//     console.log(bestResults);
   
//     accessDataBestResults4.then((data) => {
//         bestResults.push(data)
//         console.log(bestResults)
        
//     }) 
//         .then(() => {
//             return accessDataBestResults4.then((data) => {         
//             bestResults.push(data)
//             console.log(bestResults)
//         })})

//        .then(() => {
//             return accessDataBestResults5.then((data) => {
//             bestResults.push(data)
//             console.log(bestResults)
//         })})  
                                               
// }


const accessDataBestResults = async () => {    

    const data = await accessDataBestResults3;
    bestResults.push(data);
    const data_1 = await accessDataBestResults4;
    bestResults.push(data_1);
    const data_2 = await accessDataBestResults5;
    bestResults.push(data_2);
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
    bestResults = []
    // accessDataBestResults();
    const result = new Promise((resolve, reject) => {
        accessDataBestResults()
        resolve()
    })
    result.then(() => res.json(bestResults));
    // bestResults = [];

})

app.post('/api', (req, res) => {
    data = req.body;
    console.log(data);
    res.status(201).json(data.number);
    insertData(data);
    accessDataBestResults();
})
