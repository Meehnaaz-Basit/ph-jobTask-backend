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
    // app.get("/products", async (req, res) => {
    //   const result = await productsCollection.find().toArray();
    //   res.send(result);
    // });

    // Get paginated products
    // app.get("/products", async (req, res) => {
    //   try {
    //     const page = parseInt(req.query.page) || 1;
    //     const limit = parseInt(req.query.limit) || 10;
    //     const skip = (page - 1) * limit;

    //     // Fetch the filtered and paginated products
    //     const products = await productsCollection
    //       .find()
    //       .skip(skip)
    //       .limit(limit)
    //       .toArray();

    //     // Get the total count for pagination
    //     const totalProducts = await productsCollection.countDocuments();

    //     res.send({
    //       products,
    //       totalProducts,
    //       totalPages: Math.ceil(totalProducts / limit),
    //       currentPage: page,
    //     });
    //   } catch (error) {
    //     console.error("Error fetching products:", error);
    //     res.status(500).send({ message: "Internal Server Error" });
    //   }
    // });
    // app.get("/products", (req, res) => {
    //   // current page
    //   const page = req.query.p || 0;
    //   const productsPerPage = 10;

    //   let products = [];

    //   db.collection("products")
    //     .find()
    //     .skip(page * productsPerPage)
    //     .limit(productsPerPage)
    //     .toArray()
    //     .forEach((product) => products.push(product))
    //     .then(() => {
    //       res.status(200).json(products);
    //     })
    //     .catch(() => {
    //       res.status(500).json({ error: "could not fetch products" });
    //     });
    // });
    app.get("/products", async (req, res) => {
      try {
        // Parse page number from query parameters, default to 0
        const page = parseInt(req.query.p, 10) || 0;
        const productsPerPage = 10;

        if (page < 0) {
          return res
            .status(400)
            .json({ error: "Page number cannot be negative" });
        }

        // Get total product count
        const totalProducts = await db.collection("products").countDocuments();

        // Fetch paginated products
        const products = await db
          .collection("products")
          .find()
          .skip(page * productsPerPage)
          .limit(productsPerPage)
          .toArray();

        // Send response with products and total pages
        res.status(200).json({
          products,
          totalPages: Math.ceil(totalProducts / productsPerPage), // Calculate total pages
        });
      } catch (error) {
        console.error("Error fetching products:", error); // Log the error for debugging
        res.status(500).json({ error: "Could not fetch products" });
      }
    });

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
