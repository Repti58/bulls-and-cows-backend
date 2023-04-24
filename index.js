const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv")


// var sqlite3 = require("sqlite3").verbose();
// var db = new sqlite3.Database("db.db");
dotenv.config()


const sql = "INSERT INTO mytable (date, difficulty, steps) VALUES(?,?,?)";

// function insertData(data) {
//   db.run(sql, [data.date, data.difficulty, data.number]);
//   console.log("Data inserted successfully...");
// }

//MongoDB<<<
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ciiln0y.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const getGameHistory = async () => {
  let gamesList;
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const games = client.db("History").collection("Games");
    const cursor = games.find();
    gamesList = await cursor.toArray();

    // console.log(gamesList);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }

  return gamesList;
};

const getBestResults = async () => {
  const bestResults = [];
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const games = client.db("History").collection("Games");
    for (let i = 3; i < 6; i++) {
      let find = games.find({ difficulty: i }).sort({ steps: 1 }).limit(1);
      find = await find.toArray();
      console.log("Результат выборки", find);
      bestResults.push(find[0]);
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
  return bestResults;
};
//MongoDB>>>

// const getGameHistory = async () => {
//   const gamesList = await new Promise((resolve, reject) => {
//     db.all("SELECT * FROM mytable", function (error, results) {
//       if (error) return console.log(error.message);
//       resolve(results);
//     });
//   });
// //   console.log(gamesList);

//   return gamesList;
// };

// const getBestResults = async () => {
//   const bestResults = [];
//   for (let i = 3; i < 6; i++) {
//     await new Promise((resolve, reject) => {
//       db.all(
//         `SELECT * FROM mytable WHERE difficulty = ${i} AND steps = (SELECT MIN(steps) FROM mytable WHERE difficulty = ${i})`,
//         function (error, results) {
//           let bestOfCurrentDiff;
//           results.length === 0
//             ? (bestOfCurrentDiff = [{ steps: "X" }])
//             : (bestOfCurrentDiff = results);
//           resolve(bestResults.push(bestOfCurrentDiff[0]));
//         }
//       );
//     });
//   }
//   console.log(bestResults);
//   return bestResults;
// };


getGameHistory();
// db.serialize(() => {
//   getGameHistory();
// });

// db.close();

const PORT = process.env.port || 3005;
const app = express();

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server starting on port ${PORT}`);
});

app.get("/api", async (req, res) => {
  console.log("Game history request");
  const data = await getGameHistory();
  res.json(data);
});

app.get("/", async (req, res) => {
  res.json("no request data");
});

app.get("/best_results", async (req, res) => {
  console.log("best results request");
  const results = await getBestResults();
  res.json(results);
});

app.post("/api", (req, res) => {
  const data = req.body;
  console.log(data);
  res.status(201).json(data.number);
  insertData(data);
});

// this code must me ON to deploy to Glitch
// const listener = app.listen(process.env.PORT, function() {
//     console.log('Your app is listening on port ' + listener.address().port);
//   });
