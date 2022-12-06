const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const multer = require("multer");
const cors = require("cors");

const feedRoutes = require("./routes/feed");

const app = express();

const allowedOrigins = ['http://localhost:3000',
                         'http://127.0.0.1:3000'];

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    //valid file
    cb(null, true);
  } else {
    //invalid file
    cb(null, false);
  }
};

dotenv.config();
const GATEWAY = process.env.MONGODB_NODEMESSAGE;

app.use(bodyParser.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

//CORS handler
app.use(
  cors({
    origin: function(origin, callback){
      //allow requests with no origin like mobile apps or curl requests)
      if(!origin) return callback(null, true);
      if(allowedOrigins.indexOf(origin) === -1){
        const msg = 'This site does not allow access from the specified origin';
        return callback(new Error(msg), false);
      }
    },
    allowedHeaders: ["authorization", "Content-Type"],
    exposedHeaders: ["authorization"],
    methods: "GET,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
  }),
);

//app.use((req, res, next) => {
  //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9090', 'http://localhost:3000');
/*   res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
}); */

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
