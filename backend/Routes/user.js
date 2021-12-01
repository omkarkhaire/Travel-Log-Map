const express = require("express");

const myrouter = express.Router();
const bcrypt = require("bcrypt");
const usermodel = require("../mongodb/usermodel");

myrouter.post("/register", async (req, res) => {
  try {
    //we have to encrypt password
    var newpassword = await bcrypt.hash(req.body.password, 12);

    const newuser = new usermodel();

    const alldata = await usermodel.findOne({
      username: req.body.username,
      email: req.body.email,
    });
    if (alldata) {
      return res
        .status(200)
        .json({ msg: "You Already Have Account Please Login" });
    } else if (
      await usermodel.findOne({
        username: req.body.username,
      })
    ) {
      return res.status(200).json({ msg: "Usename already taken" });
    } else {
      newuser.username = req.body.username;
      newuser.email = req.body.email;
      newuser.password = newpassword;

      const saveddata = await newuser.save();
      if (!saveddata) {
        res
          .status(200)
          .json({ msg: "error in regsitering please try again later" });
      }

      return res.status(200).json({ msg: "registered successfully now you can login" });
    }
  } catch (error) {
    return res.status(200).json({ msg: "oops some thing error occurred" });
  }
});

myrouter.post("/login", async (req, res) => {
  try {
    const alldata = await usermodel.findOne({ username: req.body.username });
    if (!alldata) {
      return res
        .status(200)
        .json({ msg: "You dont have account please Register" });
    }
    var check = await bcrypt.compare(req.body.password, alldata.password);
    if (!check) {
      return res.status(200).json({ msg: "Invalid Password or Username" });
    }
    return res
      .status(200)
      .json({ msg: "Loggedin Successfully", userName: alldata.username });
  } catch (error) {
    return res.status(200).json({ msg: `error occurred ${error}` });
  }
});

module.exports = myrouter;
