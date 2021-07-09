const {db} = require("../config/config")


class UserController{

  static registerCar(req,res){
    const { plate,name,seats } =req.body

    db.getConnection((err,connection)=>{
      if (err) console.log("ConnectionError",err)
      else{
        connection.query("INSERT INTO cars SET ?",{
          plate,
          name,
          seats
        },(err,result)=>{
          if (err) console.log("Error",err)
          else{
            res.send({status:200,message:"Car inserted OK "})
          }
          connection.release()
        })
      }	
    })
  }
  static registerDriver(req,res){
    const { idno,name,phonenumber,license } = req.body

    
    db.getConnection((err,connection)=>{
      if (err) console.log("ConnectionError",err)
      else{
        connection.query("SELECT * FROM drivers WHERE idno=?",[idno],(err,result)=>{
          if (err) console.log("Error",err)
          else if(result.length > 0){
           res.send({status:205,message:"Driver already registered"})
          }
          else{
            connection.query("INSERT INTO drivers SET ?",{
              idno,
              name,
              phonenumber,
              license
            },(err,results)=>{
              if (err) console.log("Error",err)
              else{
                res.send({status:200,message:"Driver insrted Ok"})
              } 
              connection.release()
            })
          }
        })
      }
    })
  }

  static recordInformation(req,res){

    const {plate,outcome,driver,price,cause} =req.body
    const { tin } = req.query
    

    db.getConnection((err,connection)=>{
      if (err) console.log("ConnectionError",err)
      else{
        connection.query("SELECT * FROM users WHERE tin",[tin],(err,result)=>{
          if (err) console.log("Error",err)
          else{
            const {username}=result[0]

            if(outcome==="expenses"){
              connection.query("INSERT INTO expenses SET?",{
                plate,
                outcome,
                driver,
                price,
                cause,
                tin,
                username
              },(err,results)=>{
                if (err) console.log("Error",err)
                else{
                  res.send({status:200,message:" expenses OKKKK"})
                }
              
              })
            }
            else{
              connection.query("INSERT INTO income SET?",{
                plate,
                outcome,
                driver,
                price,
                cause,
                tin,
                username
              },(err,results)=>{
                if (err) console.log("Error",err)
                else{
                  res.send({status:200,message:" income OKKKKK"})
                }
              
              })
            }

            connection.release() 
          }
        })
      }
    })

  }

}

module.exports = UserController