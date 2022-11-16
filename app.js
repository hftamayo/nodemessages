const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const feedRoutes = require("./routes/feed");

const app = express();

app.use(bodyParser.json());

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

mongoose
  .connect("mongodb+srv://node:Node123$@nodecluster.hfnls.mongodb.net/shop")
  .then(result => {
      app.listen(3006);
  })
  .catch(err => console.log(err));

