const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ciiln0y.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const db = client.db("History");
const collection = db.collection("Games");

const getGameHistory = async () => {
  try {
    await client.connect();
    const gamesList = await collection.find({}).toArray();
    console.log("История игр получена из БД");
    return gamesList;
  } catch (error) {
    console.error("Ошибка получения истории игр из БД", error);
  } finally {
    await client.close();
  }
};

const getBestResults = async () => {
  try {
    await client.connect();
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
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
};

const insertData = async (data) => {
  await client.connect();
  const db = client.db("History");
  const collection = db.collection("Games");
  try {
    await collection.insertOne(data);
    console.log("Данные успешно добавлены в БД");
  } catch (error) {
    console.error("Ошибка добавления данных в БД", error);
  } finally {
    await client.close();
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
