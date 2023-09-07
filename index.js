const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

// const DB_PROTO = process.env.DB_PROTO
// const DB_USERNAME = process.env.DB_USERNAME
// const DB_PASSWORD = process.env.DB_PASSWORD
// const DB_HOST = process.env.DB_HOST

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `${process.env.DB_PROTO}://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const db = client.db("History");
const collection = db.collection("Games");

const connectDataBase = async() => {
  try {
    await client.connect()
    console.log("Успешное соединение с БД");
  } catch (error) {
    console.error("Ошибка соединения с БД", error);
  }
}

const getGameHistory = async() => {
  try {
    await client.connect()
    const gamesList = await collection.find({}).toArray();
    console.log("История игр получена из БД");
    return gamesList;
  } catch (error) {
    console.error("Ошибка получения истории игр из БД", error);
  } 
};

const getBestResults = async () => {
  try {
    await client.connect()
    const bestResults = await collection
      .aggregate([
        {
          $group: {
            _id: "$difficulty",
            minSteps: { $min: "$steps" },
          },
        },
        {
          $project: {
            _id: 0,
            difficulty: "$_id",
            steps: "$minSteps",
          },
        },
        {
          $sort: {
            difficulty: 1,
          },
        },
      ])
      .toArray();

    console.log("Результат выборки", bestResults);
    return bestResults;
  } catch (error) {
    console.error("Ошибка получения лучших результатов из БД", error);
  }
};

const insertData = async (data) => {
  try {
    await client.connect()
    const result = await collection.insertOne(data);
    return result.insertedId;
    // console.log("Данные успешно добавлены в БД", insertedId);
  } catch (error) {
    console.error("Ошибка добавления данных в БД", error); 
  } 
};

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
  connectDataBase()
  res.json("no request data");
});

app.get("/best_results", async (req, res) => {
  console.log("best results request");
  const results = await getBestResults();
  res.json(results);
});

app.post("/api", async (req, res) => {
  const data = req.body;
  console.log("Post data", data);
  const result = await insertData(data);
  console.log("Данные успешно добавлены в БД", result);
  res.status(201).json(`insertedId: ${result}`);
});
