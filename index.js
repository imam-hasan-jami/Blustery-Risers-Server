require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lqn2pwg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const usersCollection = client.db("blusteryRisers").collection("users");
    const oldPlayersCollection = client.db("blusteryRisers").collection("oldPlayers");

    // users related apis

    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      res.send(user);
    });

    // app.post("/users", async (req, res) => {
    //   const user = req.body;
    //   console.log(user);
    //   const result = await usersCollection.insertOne(user);
    //   res.send(result);
    // });

    // old players related apis

    app.get("/oldPlayers", async (req, res) => {
      const result = await oldPlayersCollection.find().toArray();
      res.send(result);
    });

    app.get("/oldPlayers/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await oldPlayersCollection.findOne(query);
      res.send(result);
    });

    app.post("/oldPlayers", async (req, res) => {
      const player = req.body;
      console.log(player);
      const result = await oldPlayersCollection.insertOne(player);
      res.send(result);
    });

    app.put("/oldPlayers/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedPlayer = req.body;
      const updatedDoc = {
        $set: updatedPlayer,
      };

      const result = await oldPlayersCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.delete("/oldPlayers/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await oldPlayersCollection.deleteOne(query);
      res.send(result);
    });

    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("This is Blustery Risers server!");
});

app.listen(port, () => {
  console.log("Plant Pulse Server is running on port", port);
});
