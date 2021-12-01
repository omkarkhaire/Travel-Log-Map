const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const connect = require("./mongodb/connect");
const app = express();

const pinrouter = require("./Routes/pins");
const userrouter = require("./Routes/user");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("tiny"));

//my router
app.use("/api/pins", pinrouter);
app.use("/api/user", userrouter);

app.get("/", (req, res) => {
  res.status(200).end("<h1>welcome to MapApplication</h1>");
});

app.listen(5000, () => {
  console.log("server starting at port no 5000");
});
