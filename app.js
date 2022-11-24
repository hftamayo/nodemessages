const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const multer = require("multer");

const feedRoutes = require("./routes/feed");

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  } 
});

dotenv.config();
const GATEWAY = process.env.MONGODB_NODEMESSAGE;

app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images")));

//CORS handler
app.use((req, res, next) => {
  //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9090', 'http://localhost:3000');
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

mongoose
  .connect(GATEWAY)
  .then((result) => {
    app.listen(3006);
  })
  .catch((err) => console.log(err));