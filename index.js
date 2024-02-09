const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
// const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.PORT || 4000;
// const stripe = require("stripe")(process.env.STRIPE_SECRET);
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nzbu8kl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    const allProductCollection = client
      .db("AponStore")
      .collection("allProduct");
    const userCollection = client.db("AponStore").collection("users");
    const OrderCollection = client.db("AponStore").collection("orders");

    //create order and save to mongoDB
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await OrderCollection.insertOne(order);
      res.send(result);
    });
    //get all order to mongoDB
    app.get("/all-orders", async (req, res) => {
      const allOrders = await OrderCollection.find().toArray();
      res.send(allOrders);
    });
    //get all order by email to mongoDB
    app.get("/orders/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const order = await OrderCollection.find(query).toArray();
      res.send(order);
    });
    //create user and save to mongoDB
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
    //get user to mongoDB
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await userCollection.findOne(query);
      res.send(user);
    });
    //get product by id
    app.get("/productDetail/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const productDetail = await allProductCollection.findOne(query);
      res.send(productDetail);
    });
    //get all product by AponStore
    app.get("/Shop", async (req, res) => {
      const allProduct = await allProductCollection.find().toArray();
      res.send(allProduct);
    });
    //get all product by categories in AponStore
    app.get("/Shop/:categories", async (req, res) => {
      const categories = req.params.categories;
      const query = { categories };
      const Product = await allProductCollection.find(query).toArray();
      res.send(Product);
    });

    //get all product by subcategories in AponStore
    app.get("/Shop/:categories/:subcategories", async (req, res) => {
      const subcategories = req.params.subcategories;
      const query = { subcategories };
      const Product = await allProductCollection.find(query).toArray();
      res.send(Product);
    });
  } finally {
  }
}

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Coming Soon....Apon-Store");
});

app.listen(port, () => {
  console.log(`Apon-Store  ${port}`);
});
