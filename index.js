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

    // Check if user exists
    app.post("/users/check", async (req, res) => {
      const { email } = req.body;

      try {
        const user = await usersCollection.findOne({ email });
        if (user) {
          res.json({ exists: true });
        } else {
          res.json({ exists: false });
        }
      } catch (error) {
        console.error("Error checking user existence:", error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });

    //*************************************************************************

    // get all packages
    app.get("/products", async (req, res) => {
      const result = await productsCollection.find().toArray();
      res.send(result);
    });

    // Filter products by brand
    // app.post("/filter-products", async (req, res) => {
    //   const { brands } = req.body;

    //   try {
    //     let query = {};
    //     if (brands && brands.length > 0 && !brands.includes("All")) {
    //       query.brand = { $in: brands };
    //     }
    //     const result = await productsCollection.find(query).toArray();
    //     res.send(result);
    //   } catch (error) {
    //     console.error("Error filtering products:", error);
    //     res.status(500).send({ message: "Internal Server Error" });
    //   }
    // });

    // app.get("/filter-products", async (req, res) => {
    //   const { categories = [], brands = [] } = req.query;
    //   const filter = {};

    //   if (categories.length > 0 && !categories.includes("All")) {
    //     filter.category = { $in: categories.split(",") };
    //   }

    //   if (brands.length > 0 && !brands.includes("All")) {
    //     filter.brand = { $in: brands.split(",") };
    //   }

    //   try {
    //     const result = await productsCollection.find(filter).toArray();
    //     res.send(result);
    //   } catch (error) {
    //     console.error("Error fetching products:", error);
    //     res.status(500).send({ message: "Internal Server Error" });
    //   }
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
