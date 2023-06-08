const jwt = require('jsonwebtoken');
module.exports.verifyJWT=async(req,res,next)=> {
    try 
    {
      let token = req.headers['authorization'];
      if(token.length==0){
        res.status(401).json({
          statusCode:401,
          status:false,
          error:true,
          msg:"null tokens not valid please enter details"
        })
      }else if(token.length!=0)
      {
        const data =jwt.verify(token,"secretkey");
        console.log("data:::::::d",data.userData)
            if(data.length!=0)
            {
                next();
            } 
            else{
              console.log("token not valid")
              res.status(401).json({
                statusCode:401,
                status:false,
                error:true,
                msg:"token not valid"
              })
            }
      }
    }  
      catch (error){
       console.log("catch block");
       console.log(error.message);
       res.status(401).json({
        statusCode:401,
        status:false,
        error:true,
        msg:error.message
      })
    }
  }
