const jwt =require("jsonwebtoken")
const {config} = require("dotenv")

config()



exports.UserRequiredLogin=(req,res,next)=>{
  const token = req.headers.authorization.replace("Bearer ","")

  if(!token){
    res.send({status:401,message:"Login first"})
  }
  else{
    jwt.verify(token,`${process.env.JWT_SECRET}`,(err,decoded)=>{
      if(err){
        res.send({status:401,message:"Login first"})
      }
      else{
        req.user=decoded
        next()
      }
    })  
  }

  

}