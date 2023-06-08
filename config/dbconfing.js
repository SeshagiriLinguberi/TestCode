const mysql =  require('mysql');

const conn = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"testdatabase",
    multipleStatements:true
    })
conn.getConnection((err,data)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("successfully connected to the database...");
    }
})
module.exports=conn;