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
     2 Buy Airtime
     3 My Account`;
   }else if(text === "1"){
     const  airtime  =  20;
     response = `END Your Airtime balance is ${airtime} KSH`;
   }else if(text === "2"){
     const  airtime  =  20;
     response = `END Your have bought airtime worthy ${airtime} KSH`;
   }
   else if(text === "3"){
     response = `CON Choose what you  want to  check
     1 Phone number
     2 My Acoount Details`;
   }
   else if(text === "3*1"){
    const  phone  =  "0796598108";
    response = `END Your phone number is ${phone}`;
   }
   else if(text === "3*2"){
    const  phone  =  "0796598108";
    const name  = "James Maina"
    const idno  = "37868062"
    response = `END Your account details \n Phone Number : ${phone} \n Full Name:  ${name} \n ID NO: ${idno}`;
   }

   res.set('content-type: text/plain');
   res.send(response);

})
const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log('Listening at port 3000')
})