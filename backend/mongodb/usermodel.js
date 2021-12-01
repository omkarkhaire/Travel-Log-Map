const mongoose=require('mongoose');
const myschema=mongoose.Schema({
      username:{
          type:String,
          required:true,
          unique:true,
          min:5,
          max:20
      },
      email:{
          type:String,
          required:true,
          unique:true
        }, 
        password:{
          type:String,
          required:true,
          unique:true,
          min:5,
          max:20
        }
},{timestamps:true});

const mymodel=mongoose.model('usersdata',myschema);
module.exports=mymodel;