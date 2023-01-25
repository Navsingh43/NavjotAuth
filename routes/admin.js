const express=require('express');
const app=express();
var bodyParser=require('body-parser');
const router=require('express').Router();
const bcrypt=require("bcrypt");
const JWT=require("jsonwebtoken");
const Register=require('../models/users');
const Specialist= require('../models/specialist');
var jsonParser = bodyParser.json()
var urlencodeParser=bodyParser.urlencoded({extended:false})
const { check, validationResult }=require("express-validator")


//Login for Admin
router.post('/',urlencodeParser, (req, res) => {
    //email and password
    const email = req.body.email
    const password = req.body.password



    //find user exist or not
    Register.findOne({ email:email })
        .then(user => {

            if (!user) return res.status(400).json({ msg: "User not exist" })
            if(!user.email == 'admin01@gmail.com') return res.status(400).json({ msg: "User is not admin" })
            bcrypt.compare(password, user.password, async (err, data) => {
                //if error than throw error
                if (err) throw err

                //if both match than you can do anything
                if (data) {
                    const token= await JWT.sign({
                        email
                    },"45rtijrgioter4ltj45tkwer",{
                        expiresIn:360000
                        })
                        res.redirect('admin/admin-success');
                
                } else {
                    return res.status(401).json({ msg: "Invalid credencial" })
                }

            })

        })

})

router.get('/',(req,res)=>{
    res.render("admin-login")
});

router.get('/admin-success',(req,res)=>{
    res.render("index-admin")
});

router.get('/manageusers/edit/:id', (req, res, next) => {
    let id = req.params.id;
    Register.findById(id,(err,UserToEdit)=>{ 
        if(err){
            console.log(err);
            res.end(err);
        }
        else{
            res.render('edituser',{title:'Edit a User ',list:UserToEdit})
        }
    });
  });

  router.get('/managespecialist/edit/:id', (req, res, next) => {
    let id = req.params.id;
    Specialist.findById(id,(err,SpecialistToEdit)=>{ 
        if(err){
            console.log(err);
            res.end(err);
        }
        else{
            res.render('editspecialist',{title:'Edit a Specialist ',list:SpecialistToEdit})
        }
    });
  });

  router.post('/managespecialist/edit/:id', async (req, res, next) => {
    let id = req.params.id;
    let updateSpecialist = Specialist({
      "_id": id,
      "name":req.body.name,
      "field":req.body.fieldofinterest,
      "intro":req.body.intro
  });
  
  Specialist.updateOne({_id:id},updateSpecialist, (err)=>{
    if(err){
        console.log(err);
        res.end(err);
    }
    else{
        res.redirect('/admin/managespecialist');
    }
  });
  });

//Process the edit movie page 
router.post('/manageusers/edit/:id', async (req, res, next) => {
    let id = req.params.id;
    const hashedPassword=await bcrypt.hash(req.body.password,10);
    let updateUser = Register({
      "_id": id,
    "email":req.body.email,
    "password":hashedPassword,
  });
  
  Register.updateOne({_id:id},updateUser, (err)=>{
    if(err){
        console.log(err);
        res.end(err);
    }
    else{
        res.redirect('/admin/manageusers');
    }
  });
  });

  // GET - process the delete by user id
router.get('/manageusers/delete/:id', (req, res, next) => {

    let id = req.params.id;
    Register.remove({_id:id},(err) =>{
        if(err){
            console.log(err);
            res.end(err);
        }
        else{
            res.redirect('/admin/manageusers');
        }
    });
  });
  
  // GET - process the delete by user id
router.get('/managespecialist/delete/:id', (req, res, next) => {

    let id = req.params.id;
    Specialist.remove({_id:id},(err) =>{
        if(err){
            console.log(err);
            res.end(err);
        }
        else{
            res.redirect('/admin/managespecialist');
        }
    });
  });

  router.get('/manageusers',(req,res)=>{

    Register.find( (err, list) => {
        if (err) {
          return console.error(err);
        }
        else {
          res.render('manageusers', {
            title: 'Edit User Details',
            list: list
          });
        }
      });
})

router.get('/managespecialist',(req,res)=>{

    Specialist.find( (err, list) => {
        if (err) {
          return console.error(err);
        }
        else {
          res.render('managespecialist', {
            title: 'Edit Specialist Details',
            list: list
          });
        }
      });
})


router.get('/manageusers/adduser', (req, res, next) => {
    res.render('adduser',{title : 'Add User',list:[]});
  });

router.get('/managespecialist/addspecialist', (req, res, next) => {
    res.render('addspecialist',{title : 'Add Specialist',list:[]});
  });

  router.post('/managespecialist/addspecialist',urlencodeParser, async (req,res)=>{
    const name =req.body.name;
    const field=req.body.fieldofinterest;
    const intro=req.body.intro;

    Specialist.findOne({ name: name }, async function(err, specialist) {
        if(specialist){
            return res.status(400).json({
            "errors": [
                {
                    "msg": "This specialist already exists",
                }
            ]
        })
        }
        else{
            const newSpecialist=new Specialist({
                "name":req.body.name,
                "field":req.body.fieldofinterest,
                "intro":req.body.intro,
            })
            Specialist.create(newSpecialist,async (err,Specialist)=>{
                if(err){
                    console.log(err);
                    res.send(err);
                }
                else{
                    res.redirect('/admin/managespecialist');
                }
            })
        }
    })

})

  router.post('/manageusers/adduser',urlencodeParser,[
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
    debugger
    Register.findOne({ email: email }, async function(err, user) {
        if(user){
            return res.status(400).json({
            "errors": [
                {
                    "msg": "This user already exists",
                }
            ]
        })
        }
        else{
            if(password!=confirmPassword){
                return res.status(400).json({
                    "errors": [
                        {
                            "msg": "Password and confirm password does not match",
                        }
                    ]
                })    
            }
            const hashedPassword=await bcrypt.hash(password,10);
            const newUser=new Register({
                "email":req.body.email,
                "password":hashedPassword,
            })
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
                    res.redirect('/admin/manageusers');
                }
            })
        }
    })

})


module.exports=router;