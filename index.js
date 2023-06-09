const express = require('express');
const app = express();

require('./config/dbconfing');
const exp = require('constants');
const cors = require('cors');
const api = require('./routers/api.router');
const port =8010;
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use('/api',api);
app.listen(port,(req,res)=>{
 console.log(`successfully connected to the port '${port}'`)
})
