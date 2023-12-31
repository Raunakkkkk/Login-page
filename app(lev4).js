require('dotenv').config()

const express= require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
// const encrypt=require("mongoose-encryption");// for encryption lev2
// var md5 = require('md5');//lev3
//better than md5 only 17000 hashing per sec
const bcrypt = require('bcrypt');//lev4

const saltRounds = 10;





const app=express();
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect('mongodb://127.0.0.1:27017/userDB');

const userSchema=new mongoose.Schema ({
    email:String,
    password:String 
});
// userSchema.plugin(encrypt, { secret: process.env.SECRET,encryptedFields:["password"] });
//only password encrypt hoga
//apne app chaleg save aur find mai

const User=new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
});
app.get("/login",function(req,res){
    res.render("login");
});
app.get("/register",function(req,res){

    res.render("register");
});

app.post("/register",function(req,res){

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {

    
        const newUser=new User({
            email:req.body.username,
            password:hash
        });
        newUser.save();
        res.render("secrets");

    });


}); 

app.post("/login",function(req,res){
const username=req.body.username;
// const password=md5(req.body.password);
const password=req.body.password;
User.findOne({email:username}).then((foundUser)=>{
// if(foundUser.password===password){
//     res.render("secrets");
// }

bcrypt.compare(password, foundUser.password, function(err, result) {
    if(result===true)
    res.render("secrets");
    else
    console.log('wrong password');
});



});


});


app.listen(3000,function(){
    console.log("server is successfully started");
});