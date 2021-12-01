const express = require("express");

const myrouter = express.Router();
const pinsmodel = require("../mongodb/pinmodel");

//create a pin

myrouter.post("/", async (req, res) => {
  const newdocument = new pinsmodel(req.body);
  try {
    const check = await newdocument.save();
    if (check) {
      res.status(200).json({ msg: "Pin added successfully",status:1,newdata:check });
    } else {
      res.status(500).json({ msg: "Error in svaing new Pin", status: 0 });
    }
  } catch (err) {
    res
      .status(500)
      .json({ msg: "something error occurred please try again", status: 0 });
  }
});
myrouter.get("/", async (req, res) => {
  try {
     const alldata = await pinsmodel.find();
     if (!alldata) {
       return res
         .status(500)
         .json({ msg: "some thing error occured in fecting data" });
     }
     return res.status(200).json(alldata);
    
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "some thing error occured in fecting data" });
  }
 
});
module.exports = myrouter;

//get all pins
