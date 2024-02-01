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
// run().catch(console.dir);
run().catch((err) => console.log(err));

// //jwt token function.

// function verifyJwt(req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     return res.status(401).send({ message: "Unauthorized access1" });
//   }
//   const token = authHeader.split(" ")[1];
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
//     if (err) {
//       return res.status(403).send({ message: "Forbidden Assess" });
//     }
//     req.decoded = decoded;
//     next();
//   });
// }

// async function run() {
//   try {
//     const userCollectionAllProduct = client
//       .db("Pet-Shop")
//       .collection("allProduct");
//     const allWishList = client.db("Pet-Shop").collection("wishList");
//     const allCartList = client.db("Pet-Shop").collection("cartList");
//     // const CreateUserCollection = client.db("Pet-Shop").collection("users");
//     // const paymentsCollection = client.db("Pet-Shop").collection("payments");
//     //jwt token create
//     // app.get("/jwt", async (req, res) => {
//     //   const email = req.query.email;
//     //   const query = { email: email };
//     //   const user = await CreateUserCollection.findOne(query);
//     //   if (user) {
//     //     const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
//     //       expiresIn: "10d",
//     //     });
//     //     return res.send({ token: token });
//     //   }
//     //   res.status(403).send({ token: " " });
//     // });
//     // This is AllProduct section
//     // get all Product
//     // app.get("/alProduct/:email", async (req, res) => {
//     //   const email = req.params.email;
//     //   const query = { email };
//     //   const user = await CreateUserCollection.findOne(query);
//     //   res.send({ iaAdmin: user?.role === "admin" });
//     // });
//     // get product By category
//     app.get("/allProduct/:category", async (req, res) => {
//       const category = req.params.category;
//       const query = { category };
//       const Product = await userCollectionAllProduct.find(query).toArray();
//       res.send(Product);
//     });
//     //get product by Id
//     app.get("/productDetails/:id", async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: new ObjectId(id) };
//       const detail = await userCollectionAllProduct.findOne(query);
//       res.send(detail);
//     });
//     //This is ProductBooking section
//     //add to wish List
//     app.post("/addToWishList", async (req, res) => {
//       const addToWishList = req.body;
//       const result = await allWishList.insertOne(addToWishList);
//       res.send(result);
//     });
//     //add to cart List
//     app.post("/addToCart", async (req, res) => {
//       const addToCartList = req.body;
//       const result = await allCartList.insertOne(addToCartList);
//       res.send(result);
//     });
//     //delete To WishList Home Page
//     app.delete("/deleteToWishList/:productId", async (req, res) => {
//       const id = req.params.productId;
//       const query = { productId: id };
//       const result = await allWishList.deleteOne(query);
//       res.send(result);
//     });
//     //delete To WishList page
//     app.delete("/removeToWishList/:id", async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: new ObjectId(id) };
//       const result = await allWishList.deleteOne(query);
//       res.send(result);
//     });
//     //delete To Cart page
//     app.delete("/deleteToCartList/:id", async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: new ObjectId(id) };
//       const result = await allCartList.deleteOne(query);
//       res.send(result);
//     });
//     //get myWishList data by email     verifyJwt,
//     app.get("/myWishList/:email", async (req, res) => {
//       const email = req.params.email;
//       // const email = req.query.email;
//       // const decodedEmail = req.decoded.email;
//       // if (email !== decodedEmail) {
//       //   return res.status(403).send({ message: "Forbidden Assess" });
//       // }
//       const query = { email };
//       const WishList = await allWishList.find(query).toArray();
//       res.send(WishList);
//     });
//     //get myCartList data by email     verifyJwt,
//     app.get("/myCartList/:email", async (req, res) => {
//       const email = req.params.email;
//       // const email = req.query.email;
//       // const decodedEmail = req.decoded.email;
//       // if (email !== decodedEmail) {
//       //   return res.status(403).send({ message: "Forbidden Assess" });
//       // }
//       const query = { email };
//       const CartList = await allCartList.find(query).toArray();
//       res.send(CartList);
//     });
//     // //AllProduct Advertised update by seller,verifyJwt
//     app.put("/updateCartListValue/:id", async (req, res) => {
//       const id = req.params.id;
//       console.log("cartList=", id);
//       console.log(" " + req.body.quantity);
//       const value = req.body.quantity;
//       console.log("cartList=", value);
//       const filter = { _id: new ObjectId(id) };
//       const options = { upsert: true };
//       const updatedUser = {
//         $set: {
//           value,
//         },
//       };
//       // db.student.updateOne({name: "Annu"}, {$set:{age:25}})
//       const result = await allCartList.updateOne(
//         { _id: new ObjectId(id) },
//         { $set: { value } }
//       );
//       res.send(result);
//     });
//   } finally {
//   }
// }
//

app.get("/", (req, res) => {
  res.send("Coming Soon....Apon-Store");
});

app.listen(port, () => {
  console.log(`Apon-Store  ${port}`);
});
