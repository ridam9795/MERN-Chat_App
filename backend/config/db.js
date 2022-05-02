const mongoose=require('mongoose');

const connetDB=async ()=>{
   try{
      const conn=await mongoose.connect(process.env.MONGO_URI,{
          useNewUrlParser:true,
          useUnifiedTopology:true
      })
      console.log(`MongoDB connected ${conn.connection.host}`.cyan.underline)
   }catch(error){
   process.exit()
   }
}
module.exports=connetDB