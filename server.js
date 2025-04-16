const express = require('express');
// const bodyParser = require('body-parser');  use in old version of express
const app = express();
const users = require("./MOCK_DATA.json");
const mongoose = require('mongoose');
const UserModel = require('./Model/userModel');
const bcrypt = require('bcrypt');
// const somedata = users.slice(0,15);
// username = shivamwallu72594
//  password = Kd0cyNou0YxOHf5y

//url connected = mongodb+srv://shivamwallu72594:Kd0cyNou0YxOHf5y@cluster0.ksxpvhs.mongodb.net/
const connectDB = async () => {
  try{
   await  mongoose.connect("mongodb+srv://shivamwallu72594:Kd0cyNou0YxOHf5y@cluster0.ksxpvhs.mongodb.net/DataBaseUser");
       console.log("MongoDB connected successfully"); 
  }
  catch(err){
    console.log("Error connecting to MongoDB:", err);
  }
}
connectDB();

const fs = require('fs');
app.use(express.urlencoded({extended: false}))
app.use(express.json());
app.use(express.text());
// const { writeFile } = require('fs.promises');hbvbdhsbh
app.use(function (req, res, next) {
  console.log("this is use middleware");
  next();
})
app.use('/user' , (req , res , next) => {
  console.log("this is user middleware");
  next();
})
const m1 =(req , res , next)=>{
  console.log("m1");
  req.game = "football";
  res.setname ="m1";
  next();
  console.log("after m1");
  
}


const m2 =(req , res , next)=>{
  console.log("m2");
  console.log(req.game);
  
  // res.send("heloo mai m2 hu")
  // return;
  next();
  console.log("after m2");
  
}

const m3 =(req , res , next)=>{
  console.log("m3");
  let key = "backend";
  let querykey = req.query.key;
  if(key != querykey){
    res.send("Please enter valid key")
    return;
  }
  next();
}

app.get("/" ,m1 ,m2 , (req , res )=>{
    console.log("route hit huaa");
    console.log(res.setname);
    
    res.json(users)
    console.log("after route");
    
 })
 app.get("/user" , m3 , (req , res )=>{
   const query = req.query;
     console.log(query);
     res.send("<h1>hello user Importand data </h1>")
  })
app.get("/:id" , (req , res )=>{
    const id = req.params.id;
    console.log(id)
    const user = users.find((user) => user.id == id);
    if(!user) return res.status(404).json({status : "fail" , message : "User not found"})
  return res.json(user);
});



//  app.post("/users" , (req , res )=>{
//    const body = req.body;
//    users.push({...body , id : users.length +1});
//    fs.writeFile("./MOCK_DATA.json" , JSON.stringify(users), (err ,data) =>{
//    return  res.json({ status : "success" , id : users.length , data : body})
//    })
//  });


app.post("/users" , async (req , res)=>{
  const {name , email, age , password} = req.body;
  const HashPassworld = await bcrypt.hash(password , 10);
  console.log(HashPassworld);
  
  try{
      const CreateSchema = await UserModel.create({
     
      name, 
      email,
      password : HashPassworld,
      age,
    })
    return res.json({success : true , user : CreateSchema});
  }
    catch(e){
      console.log(e);
     return res.json({success : false , message : "something went wrong"})
      
    }

})
 app.delete('/users/:id' , async (req,res)=>{
  const id = Number(req.params.id);
  const updateuser = users.filter((user) => user.id != id);
   await fs.writeFile('./MOCK_DATA.json' , JSON.stringify(updateuser , null , 2) , (err , data)=>{
     return res.json({ status : `delete success ${id}` });
   } )
 })
app.listen(3000 , ()=>{
    console.log("Server is running on port 3000")
})