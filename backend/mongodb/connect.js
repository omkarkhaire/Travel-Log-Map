const mongoose=require('mongoose');
const dotenv=require('dotenv')
dotenv.config();

const connection=mongoose.connect(process.env.MY_db_URL, { useNewUrlParser: true,useUnifiedTopology: true},(error)=>{
    if(error){
      console.log('oops some thing error occured',error);
    }else{
        console.log('connection to database established successfully');
    }
})
// mongodb://localhost:27017/Mapapplication"
module.exports=connection;