const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");

const app = express();

app.use(express.json());
app.use(express.static("public"));

// DB
mongoose.connect("mongodb://127.0.0.1:27017/ecommerce")
.then(()=>console.log("MongoDB Connected"));

// SCHEMA
const Product = mongoose.model("Product",{
  name:String,
  price:Number,
  image:String
});

// MULTER
const storage = multer.diskStorage({
  destination: "public/uploads/",
  filename: (req,file,cb)=>{
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({storage});

// GET PRODUCTS
app.get("/api/products", async (req,res)=>{
  let products = await Product.find();
  res.json(products);
});

// ADD PRODUCT (IMAGE UPLOAD)
app.post("/api/products", upload.single("image"), async (req,res)=>{
  const {name,price} = req.body;

  let product = new Product({
    name,
    price,
    image: "/uploads/" + req.file.filename
  });

  await product.save();
  res.json(product);
});

// SEARCH
app.get("/api/search", async (req,res)=>{
  let q = req.query.q;

  let products = await Product.find({
    name: {$regex:q,$options:"i"}
  });

  res.json(products);
});

// START
app.listen(3000, ()=>{
  console.log("Server running on http://localhost:3000");
});