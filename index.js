const express = require("express");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 5000;
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.jzmmeq8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // user collection
    const usersCollection = client.db("jobTask").collection("users");
    const productsCollection = client.db("jobTask").collection("products");

    //*************************************************************************

    // Get all users
    app.get("/users", async (req, res) => {
      try {
        const result = await usersCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };

      try {
        const existingUser = await usersCollection.findOne(query);
        if (existingUser) {
          console.log("User already exists");
          return res
            .status(409)
            .send({ message: "User already exists", insertedId: null });
        }

        const result = await usersCollection.insertOne(user);
        console.log("User inserted:", result);

        res.status(201).send(result);
      } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });

    //*************************************************************************

    // get all packages
    app.get("/products", async (req, res) => {
      const result = await productsCollection.find().toArray();
      res.send(result);
    });

    // // get individual package by id
    // app.get("/packages/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await pakagesCollection.findOne(query);
    //   res.send(result);
    // });

    // // post package from front end to db
    // app.post("/packages", async (req, res) => {
    //   const newItem = req.body;
    //   const result = await pakagesCollection.insertOne(newItem);
    //   res.send(result);
    // });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("welcome to job task");
});

app.listen(port, () => {
  console.log(`server is running in port ${port}`);
});
