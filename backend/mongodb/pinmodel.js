const mongoose=require('mongoose');
const myschema=mongoose.Schema({
    username:{
          type:String,
          require:true,
      },
      title:{
          type:String,
          require:true,
          min:3
      },
      desc:{
          type:String,
          require:true,
          min:3
      },
      ratting:{
          type:Number,
          min:0,
          max:5
      },
      latitude:{
          type:Number,
          require:true
      },
      longitude:{
          type:Number,
          require:true
      },
      
},{timestamps:true});

const mymodel=mongoose.model('pinsdata',myschema);
module.exports=mymodel;