const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));

app.post('/ussd',async(req,res)=>{
   const {
    sessionId,
    phoneNumber,
    serviceCode,
    text
   } = req.body;
   let  response  = "";
   //first  request  
   if(text === ""){
     response = `CON Choose what you  want to  do 
     1 Check  Airtime
     2 Buy Airtime`;
   }else if(text === "1"){
     const  airtime  =  20;
     response = `END Your Airtime balance is ${airtime} KSH`;
   }else if(text === "2"){
     const  airtime  =  20;
     response = `END Your have bought airtime worthy ${airtime} KSH`;
   }

   res.set('content-type: text/plain');
   res.send(response);

})
const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log('Listening at port 3000')
})