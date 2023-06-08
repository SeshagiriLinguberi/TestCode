const conn = require('../config/dbconfing');

module.exports.checkUserByUserId = async (userId)=>{
    return new Promise((resolve,reject)=>{
        const sql  = `Call user_check_user_by_user_id(?)`;
        conn.query(sql,[userId],async(err,data)=>{
            if(err){
                reject(err);
            }else{
                resolve(data); 
            }
        })
    })
   
}