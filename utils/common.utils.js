const conn = require('../config/dbconfing');

module.exports.checkUserByUserId = async (userId,flag)=>{
    return new Promise((resolve,reject)=>{
        const values = [userId,flag];
        const sql  = `Call user_check_user_by_user_id(?)`;
        conn.query(sql,[values],async(err,data)=>{
            if(err){
                reject(err);
            }else{
                resolve(data); 
            }
        })
    })
}
module.exports.checkInActiveUserByUserId = async (userId)=>{
    return new Promise((resolve,reject)=>{
        //const flag=1;
        const values = [userId];
        const sql  = `Call user_in_active_user(?)`;
        conn.query(sql,[values],async(err,data)=>{
            if(err){
                reject(err);
            }else{
                resolve(data); 
            }
        })
    })
   
}

module.exports.checkUserByEmailId = async (emailId)=>{
    return new Promise((resolve,reject)=>{
        const sql  = `Call user_get_user_details_by_email_id(?)`;
        conn.query(sql,[emailId],async(err,data)=>{
            if(err){
                reject(err);
            }else{
                resolve(data); 
            }
        })
    })
   
}