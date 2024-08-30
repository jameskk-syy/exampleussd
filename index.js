const express = require('express');
const cors = require('cors');
const Joi =  require('joi');
const bodyParser = require('body-parser');
const  apps =  require('./config');
const {getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut} = require('firebase/auth');
const {getFirestore,addDoc,collection,getDocs,getDoc,doc,deleteDoc,updateDoc,setDoc} = require('firebase/firestore');
const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));

const  db = getFirestore(apps);
const auth =  getAuth(apps);
const  collectionRef =  collection(db, "Airtime");
const  productsRef =  collection(db, "Products");
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
     3 My Account
     4 Delete Account`;
   }else if(text === "1"){
     const  result = await postAirtime(phoneNumber);
     response = `END ${result}`;
   }else if(text === "2"){
     const  airtime = await updateSingleDoc(phoneNumber);
     response = `END ${airtime} `;
   }
   else if(text === "3"){
     response = `CON Choose what you  want to  check
     1 Phone number
     2 My Acoount Details`;
   }
   else if(text === "3*1"){
    const result =  await getSingleDoc(phoneNumber);
    response = `END Names : ${result.name} \n Phone Number ${result.phone_Number}`;
   }
   else if(text === "3*2"){
    const result = await getAirtime();
    response = `END Your account details \n`;
    result.forEach((resu,index)=>{
     response += `Names : ${resu.name} \n Phone Number ${resu.phone_Number}`;
    })
   }
   else if(text === "4"){
    const  airtime = await deleteSingleDoc(phoneNumber);
    response = `END ${airtime} `;
   }

   res.set('content-type: text/plain');
   res.send(response);

})
app.post('/logout',async(req,res)=>{
  try {
    signOut(auth).then((resu)=>{
      res.status(200).send("logout successfully")
    })
    .catch((err)=>{
    res.status(500).send(err)
    })
  } catch (error) {
    res.status(500).send(error)
  }
})
app.post('/login',async(req,res)=>{
  try {
    signInWithEmailAndPassword(auth,req.body.email,req.body.password)
    .then((result)=>{
      res.status(200).send({statusCode : 200, message: "logged in" ,data:result.user})
    })
    .catch((err)=>{
     res.status(500).send(err)
    })
  } catch (error) {
    res.status(500).send(error)
  }
})
app.post('/signup',async(req,res)=>{
const  Schema =  Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(8).required()
})
const {error} = Schema.validate(req.body);
if(error) return res.status(400).send(error.details[0].message); 
 try {
 createUserWithEmailAndPassword(auth,req.body.email,req.body.password)
 .then((result)=>{
   res.status(200).send(result.user)
 })
 .catch((err)=>{
    res.status(500).send(err)
 })
 } catch (error) {
    res.status(500).send(err)  
 }
})
app.post('/createproduct',async(req,res)=>{
  const Schema = Joi.object({
    productName: Joi.string().required(),
    price:Joi.number().required(),
    imageUrl:Joi.string().required(),
    description:Joi.string().required()
  })
  const {error} = Schema.validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);
   try {
    const data = {
        productName: req.body.productName,
        price : req.body.price,
        imageUrl: req.body.imageUrl,
        description:req.body.description
    }
    await addDoc(productsRef,data)
    res.status(200).send("product added successfully")
   } catch (error) {
    res.status(500).send("product not added")
   }
})
app.get('/',async(req,res)=>{
let data = [];
 try {
   const result  = await getDocs(productsRef);
   result.docs.forEach((doc)=>{
    data.push({...doc.data(),id:doc.id});
   })
   res.status(200).send(data)  
} catch (error) {
    res.status(500).send("internal  error")  
}
})
app.put('/products/:id',async(req,res)=>{
 const id  =  req.params.id;
  try {
    const docRef = doc(productsRef,id);
    await updateDoc(docRef,req.body);
    res.send("product updated")
  } catch (error) {
    res.status(500).send("internal  error")  
  }
})
app.get('/products/:id',async(req,res)=>{
 const id  =  req.params.id;
  try {
    const docRef = doc(productsRef,id);
    const  result  = await getDoc(docRef);
    res.send(result.data())
  } catch (error) {
    res.status(500).send("internal  error")  
  }
})
app.delete('/products/:id',async(req,res)=>{
 const id  =  req.params.id;
  try {
    const docRef = doc(productsRef,id);
    await deleteDoc(docRef);
    res.send("product deleted");
  } catch (error) {
    res.status(500).send("internal  error")  
  }
})


//create post  function
async function postAirtime(phonenumber){
  const  data  = {
    name : "Julius",
    phonenumber
  }
  try {
    const docRef = doc(collectionRef,phonenumber)
    await setDoc(docRef,data);
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
async function getSingleDoc(phonenumber){
 try {
  const docRef = doc(collectionRef,phonenumber) 
  const result = await getDoc(docRef); 
  return result.data();
 } catch (error) {
    console.log(error);
 }
}
async function deleteSingleDoc(phonenumber){
 try {
  const docRef = doc(collectionRef,phonenumber) 
  const result = await deleteDoc(docRef); 
  return "data deleted";
 } catch (error) {
    console.log(error);
 }
}
async function updateSingleDoc(phonenumber){
const  data = {
  name : "James Maina",
  phone_Number: "0796598108"
}
 try {
  const docRef = doc(collectionRef,phonenumber) 
  const result = await setDoc(docRef,data); 
  return "data updated";
 } catch (error) {
    console.log(error);
 }
}
const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log('Listening at port 3000')
})