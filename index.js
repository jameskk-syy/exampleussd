const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const  apps =  require('./config');
const {getFirestore,addDoc,collection,getDocs} = require('firebase/firestore');
const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));

const  db = getFirestore(apps);
const  collectionRef =  collection(db, "Airtime");
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
     const  result = await postAirtime();
     response = `END ${result}`;
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
    const result = await getAirtime();
    response = `END Your account details \n`;
    result.forEach((resu,index)=>{
     response += `Names : ${resu.name} \n Phone Number ${resu.phone_Number}`;
    })
   }

   res.set('content-type: text/plain');
   res.send(response);

})
//create post  function
async function postAirtime(){
  const  data  = {
    name : "Julius",
    phone_Number: "0799294225"
  }
  try {
    await addDoc(collectionRef,data);
    return "Your data is saved"
  } catch (error) {
    console.log(error);
  }
}
async function getAirtime(){
 const datas = [];
  try {
    const result = await getDocs(collectionRef);
    result.docs.forEach((doc)=>{
        datas.push({...doc.data(),id:doc.id});
    })
   return datas;
  } catch (error) {
    console.log(error);
  }
}
const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log('Listening at port 3000')
})