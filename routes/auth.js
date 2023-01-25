const express=require('express');
const app=express();
var bodyParser=require('body-parser');
const router=require('express').Router();
const bcrypt=require("bcrypt");
const JWT=require("jsonwebtoken");
const Register=require('../models/users');
const appointmentss=require("../models/appointment-book")
var jsonParser = bodyParser.json()
var urlencodeParser=bodyParser.urlencoded({extended:false})
var globemail;
const { check, validationResult }=require("express-validator")
// const {users}=require("../config/db")
router.post('/register',urlencodeParser,[
    check("email","Please provide a valid email")
        .isEmail(),
    check("password","Please provide a password greater than 5 characters")
        .isLength({
            min:3
        })
], async (req,res)=>{
    const email =req.body.email;
    const password=req.body.password;
    const confirmPassword=req.body.confirmPassword;
    // Validated the input
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        res.send(errors);
    }
    Register.findOne({ email: email }, async function(err, user) {
        if(user){
            /*return res.status(400).json({
            "errors": [
                {
                    "msg": "This user already exists",
                }
            ]
        })*/
        res.render('register',{
            msg:"The user already exists"
        })
        }
        else{
            if(password!=confirmPassword){
                res.render('register',{
                    msg:'The passwords are not matching'
                })   
            }
            const hashedPassword=await bcrypt.hash(password,10);
            const newUser=new Register({
                "email":req.body.email,
                "password":hashedPassword,
            })
            if(email=="admin@gmail.com"){
                Register.create(newUser,async (err,Register)=>{
                    if(err){
                        console.log(err);
                        res.send(err);
                    }
                    else{
                        
                        const token= await JWT.sign({
                            email
                        },"45rtijrgioter4ltj45tkwer",{
                            expiresIn:360000
                        })
                        res.cookie('mbt',token,{httpOnly:true, maxAge:24*60*60*10000});
                        res.redirect('/register')
                      //  res.json({
                        //    token
                        //})
                       // console.log(hashedPassword); 
                    }
                })
            }
            else
            {
            Register.create(newUser,async (err,Register)=>{
                if(err){
                    console.log(err);
                    res.send(err);
                }
                else{
                    
                    const token= await JWT.sign({
                        email
                    },"45rtijrgioter4ltj45tkwer",{
                        expiresIn:360000
                    })
                    res.cookie('jwt',token,{httpOnly:true, maxAge:24*60*60*10000});
                    res.redirect('/register')
                  //  res.json({
                    //    token
                    //})
                   // console.log(hashedPassword); 
                }
            })
        }}
    })

})
/*router.post("/login",urlencodeParser, async (req,res)=>{
    user=req.body;
    console.log(email,password)
    let x=Register.findOne({email: user.email})
    /*let User=Register.findOne((user)=>{
        return user.email==email
    })
    console.log(user);
    if(!x){
        return res.status(400).json({
            "errors":[
                {
                    "msg":"Invalid Credentials",
                }
            ]
        })
    }
    let isMatch= await bcrypt.compare(user.password,password);
    if(!isMatch){
        return res.status(400).json({
            "errors":[
                {
                    "msg":"Invalid Credentials",
                }
            ]
        })
    };
    const token= await JWT.sign({
        email
    },"45rtijrgioter4ltj45tkwer",{
        expiresIn:360000
        })
        res.json({
            token
        })
    
});*/
router.post('/login',urlencodeParser, (req, res) => {
    //email and password
    const email = req.body.email
    const password = req.body.password

    //find user exist or not
    Register.findOne({ email:email })
        .then(user => {
            //if user not exist than return status 400
            if (!user) return res.status(400).json({ msg: "User not exist" })

            //if user exist than compare password
            //password comes from the user
            //user.password comes from the database
            bcrypt.compare(password, user.password, async (err, data) => {
                //if error than throw error
                if (err) throw err

                //if both match than you can do anything
                if (data) {
                    if(email=="admin@gmail.com"){
                        const token= await JWT.sign({
                            email
                        },"45rtijrgioter4ltj45tkwer",{
                            expiresIn:360000
                        })
                        res.cookie('mbt',token,{httpOnly:true, maxAge:24*60*60*10000});
                           console.log(token);
                  //  res.cookie("token", token)
                    return res.render('index');
                    }
                    else
                    {
                    
                  //  
                    const token= await JWT.sign({
                        email
                    },"45rtijrgioter4ltj45tkwer",{
                        expiresIn:360000
                    })
                    res.cookie('jwt',token,{httpOnly:true, maxAge:24*60*60*10000});
                       console.log(token);
                       globemail=email;
                       
              //  res.cookie("token", token)
                return res.render('index');
                    }
                
                } else {
                    return res.status(401).json({ msg: "Invalid credencial" })
                }

            })

        })
})
router.get('/login',urlencodeParser,(req,res)=>{
    res.render('login');
})
router.get('/',urlencodeParser,(req,res)=>{
  console.log(req.cookies.jwt)
    if(!(req.cookies.mbt || req.cookies.jwt))
    {
    res.render("login");
    }
    else{
        res.render("index");
    }
})
/*router.get('/login',(req,res)=>{
    res.render('login')
})*/
router.get('/register',(req,res)=>{
    res.render("register",{
        msg:" "
    })
})

router.get("/my-appointments",(req,res)=>{
   // let id=req.params.id;
    console.log(globemail);
        appointmentss.find({"myemail":globemail},(err,results)=>{
            if(err){
                console.log(err)
            }
            else{
                res.render("view-appointments",{
                    title:"My appointments",
                    MediList:results,
                    // Userss:
                })
            }
        })
        
    })

router.get('/logout', function (req, res) {
    if(req.cookies.mbt)
    {
    res.clearCookie('mbt');
    res.render('login');
    }
    else{
        res.clearCookie('jwt');
    res.render('login');
    }
  });
//console.log(globemail)

module.exports=router;
exports.globemail=globemail;

