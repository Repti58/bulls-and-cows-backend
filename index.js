const express = require('express');
const cors = require('cors');


var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db.db');

const users = ["Sara", "Mike", "James", "David", "Emily"];



// function insertData(){
//     var insertQuery = db.prepare("INSERT INTO mytable VALUES (?,?)");
//     for (var i = 0; i < users.length; i++) {
//         insertQuery.run(i, users[i]);
//         console.log("Data inserted successfully...");
//     }
//     insertQuery.finalize();
// }

function accessData(){
    db.each("SELECT * FROM mytable", function(err, results) {
        // if (error) return console.log(err.message);
        console.log(results);
    });
}

// function deleteData(name){
//     db.run("DELETE FROM mytable WHERE name=?",name, err =>{
//         if (err) return console.log(err.message);
//         console.log(`${name} deleted successfully...`);
//     });
// }

db.serialize(function() {
    // db.run("CREATE TABLE IF NOT EXISTS mytable (id, name)");
    // insertData();
    accessData();
    // deleteData("James");
});

db.close();

const PORT = process.env.port || 3002;
const message = accessData();
const app = express();




app.use(cors());

app.listen(PORT, () => {
    console.log(`Server starting on port ${PORT}`)
})

app.get('/api', (req, res) => {
    
    res.json({
        message: message
    })
})