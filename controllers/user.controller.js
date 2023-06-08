const conn = require('../config/dbconfing');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const readline =  require('readline');
const utils =require('../utils/common.utils');
module.exports.addUserDetails = async (req,res)=>{
    const sql = `Call user_add_user(?)`;
    const saltRounds =10;
    let password = req.body.password;
    const salt = await bcrypt.genSalt(saltRounds);
    password = await bcrypt.hash(password,salt);
    const values = [req.body.user_name,req.body.firstName,req.body.lastName,req.body.fullName,req.body.email_id,req.body.mobile,password];
    conn.query(sql,[values],async(err,data)=>{
        if(err){
            res.status(500).json({
                statusCode:500,
                status:false,
                error:true,
                message:err
            })
        }else{
            console.log(data[0].length);
            res.status(200).json({
                statusCode:200,
                status:true,
                error:false,
               ResponseData:data[0]
            })
        }
    })
}
module.exports.getUserDetails = async(req,res)=>{
    const mysql = `Call user_get_user_details`;
    conn.query(mysql,async(err,data)=>{
        if(err){
            res.status(500).json({
                statusCode:500,
                status:false,
                error:true,
                message:err
            })
        }
        else{
            res.status(200).json({
                statusCode:200,
                status:true,
                error:false,
               ResponseData:data[0]
            })
        }
    })
}
module.exports.userLoign = async(req,res)=>{
    const sql = `Call user_get_user_details_by_email_id(?)`;
    const values = [req.body.email_id];
    conn.query(sql,[values],async(err,data)=>{
        if(err){
            res.status(500).json({
                statusCode:500,
                status:false,
                error:true,
                message:err
            })
        }
        else{
            console.log("data:::",data[0][0].password)
            if(data[0].length!=0){
                const password= req.body.password;
                const match = await bcrypt.compare(password,data[0][0].password);
                if(match){
                    console.log("matched:::",match)
                    const token = await jsonwebtoken.sign({userData:data},"secretkey");
                    data[0][0].token=token;
                    console.log("data::::::",data[0][0]);
                    const sql1 = `Call user_login_login_user(?)`;
                    const values = [data[0][0].user_id,data[0][0].email_id,new Date(),token];
                    conn.query(sql1,[values],async(err,data1)=>{
                        if(err){
                            res.status(500).json({
                                statusCode:500,
                                status:false,
                                error:true,
                                message:err
                            })
                        }
                        else{
                            res.status(200).json({
                                statusCode:200,
                                status:true,
                                error:false,
                                ResponseData:data[0]    
                            })
                        }
                    })
                }else{
                    res.status(401).json({
                        statusCode:401,
                        status:false,
                        error:true,
                        message:"enter a valid password"
                    })
                }
            }else{
                res.status(401).json({
                    statusCode:402,
                    status:false,
                    error:true,
                    message:"enter a valid email address"
                })
            }
        }
    })
}
module.exports.changePassword = async(req,res)=>{
    const sql =`Call user_get_user_details_by_email_id(?)`;
    const values = [req.body.email_id];
    conn.query(sql,[values],async(err,data)=>{
        if(err){
            res.status(500).json({
                statusCode:500,
                status:false,
                error:true,
                message:err
            })
        }
        else{
            if(data[0].length!=0){
            const oldPassword = req.body.old_password;
            let newPassword = req.body.new_password;
            const saltRounds=10;
            const salt = await bcrypt.genSalt(saltRounds);
            newPassword = await bcrypt.hash(newPassword,salt);
            const match = bcrypt.compare(oldPassword,data[0][0].password);
            if(match){
                const sql1 = `Call user_user_password_update(?)`;
                const values = [req.body.email_id,newPassword];
                conn.query(sql1,[values],async(err,data1)=>{
                    if(err){
                        res.status(500).json({
                            statusCode:500,
                            status:false,
                            error:true,
                            message:err
                        })
                    }else{
                        res.status(200).json({
                            statusCode:200,
                            status:true,
                            error:false,
                            responseData:data1[0]
                        })
                    }
                })
            }else{
                res.status(401).json({
                    statusCode:401,
                    status:false,
                    error:true,
                    message:"password not matched"
                })
            }
            }
        }
    })
}

module.exports.forgetPassword = async (req,res)=>{
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
      user: 'nodejssentmail45@gmail.com',
      pass: 'sliabuyslamxfxki'
      }
      });
  
    // Generate a random 6-digit OTP
    function generateOTP() {
      return Math.floor(100000 + Math.random() * 900000);
    }
  
    // Function to send OTP to user's email
    function sendOTP(email, otp) {
      const mailOptions = { 
       from: 'nodejssentmail45@gmail.com',
       to: email,
       subject: 'OTP for Verification',
       text: `Your OTP is ${otp}.`
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }
    
    // Verify the OTP entered by the user
    function verifyOTP(email, otp, callback) {
      const query = `SELECT * FROM user_otp_verification WHERE email_id = '${email}' AND otp = '${otp}' AND otp_expires_at > NOW()`;
      conn.query(query, function (error, results) {
        if (error) {
          console.log(error);
          callback(false);
        } else {
          if (results.length === 1) {
            callback(true);
          } else {
            callback(false);
          }
        }
      });
    }
    
    // Reset the user's password
    function resetPassword(email, otp, newPassword) {
      verifyOTP(email, otp, async function (isValid) {
        if (isValid) {
          console.log('OTP verification successful!');
          const saltRounds=10;
          const salt = await bcrypt.genSalt(saltRounds);
          newPassword = await bcrypt.hash(newPassword,salt);
          const updateQuery = `UPDATE user SET password = '${newPassword}' WHERE email_id = '${email}'`;
          conn.query(updateQuery, function (error, results) {
            if (error) {
              console.log(error);
            } else {
              console.log('Password reset successful!');
              res.status(200).json({
                  statusCode:200,
                  status:true,
                  error:false,
                  responseData:"password reset successful!"
              })
            }
          });
        } else {
          console.log('Invalid OTP or expired OTP');
          res.status(500).json({
              statusCode:500,
              status:false,
              error:true,
              message:"Invalid OTP or expired OTP"
          })
        }
      });
    }
    
    // Generate and send OTP to the user's email
    function forgotPassword(email) {
      const otp = generateOTP();
      const otpStartTime = new Date(Date.now());
      const otpExpires = new Date(Date.now() + 60000); // Set OTP expiration time to 1 minute
      //const query = `UPDATE users SET otp = '${otp}', otp_expires = '${otpExpires}' WHERE email = '${email}'`;
      const query = `CALL user_opt_verifiaction_add_otp(?)`;
      const values = [req.body.email_id,otp,otpStartTime,otpExpires];
      conn.query(query,[values], function (error, results) {
        if (error) {
          res.status(500).json({
              statusCode:500,
              error:true,
              status:false,
              msg:error
          })
        } else {
          console.log("otp:::",otp);
          sendOTP(email, otp);
          console.log('OTP sent successfully!');
          promptResetPassword(email,req.body.password);
        }
      });
    }
    
    // Prompt user to enter OTP and new password
    function promptResetPassword(email) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
    
      rl.question('Enter the OTP: ', function (otp) {
       // rl.question('Enter the new password: ', 
       // function (newPassword) {
          resetPassword(email, otp,req.body.new_password);
          rl.close();
        //}
        //);
      });
    }
    
    const userEmail = req.body.email_id;
    console.log("emailid:::",userEmail)
    forgotPassword(userEmail);
}

module.exports.updateUser = async(req,res)=>{
    const sql = `Call user_get_user_details_by_email_id(?)`;
    const values = [req.body.user_id];
    const checkUser = await utils.checkUserByUserId(values);
            console.log("data:::::",checkUser[0])
            if(checkUser[0].length!=0){
                const sql1= `Call user_update_user_details(?)`;
                const values = [req.body.user_name,req.body.firstName,req.body.lastName,req.body.fullName,req.body.email_id,req.body.mobile,req.body.password,req.body.user_id];
                conn.query(sql1,[values],async(err,data)=>{
                    if(err){
                        res.status(500).json({
                            statusCode:500,
                            status:false,
                            error:true,
                            message:err
                        })
                    }else{
                        res.status(200).json({
                            statusCode:200,
                            status:true,
                            error:false,
                            responseData:data[0]
                        })
                    }
                })
            }else{
                res.status(200).json({
                    statusCode:200,
                    status:false,
                    error:true,
                    message:"user not found"
                })
            }
}
  

