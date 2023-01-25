const express=require('express');
const app=express();
const router=require('express').Router();
var bodyParser=require('body-parser');
const checkAuth=require("../middleware/checkAuth")
const checkAdmin=require("../middleware/admin");
var Item=require('../models/medic-stores');
const { JsonWebTokenError } = require('jsonwebtoken');
var urlencodeParser=bodyParser.urlencoded({extended:false})
router.get('/list',(req,res,next)=>{
    Item.find((err,mediList)=>{
        if(err){
            return console.error(err);
        }
        else{
            if(req.cookies.jwt){
            res.render('listnormal',{
                MediList:mediList,
                title:"Store"
            })
          }
        else{
            res.render('list',{
                MediList:mediList,
                title:"Store"
            }) 
        }
}
}
)})
router.post('/add',urlencodeParser,(req,res)=>{
    let newBook= Item({
        "name": req.body.name,
        "company": req.body.company,
        "price":req.body.price,
        "quantity": req.body.quantity
    });
    console.log(req.body.name);
    Item.find({"name":req.body.name,"company":req.body.company},(err,result)=>{
        if(err){
            console.log(err)
        }
        else if(!result[0]){
            Item.create(newBook, (err,Item)=>
    {
        if(err){
            console.log(err);
            res.end(err);
        }else{
            res.redirect('/pharmacy');
        }
    })
        }
        else{
            return res.status(401).json({ msg: "The medication with the same name and company exists" })
        }
    })
    
})

router.get('/edit/:id',(req,res,next)=>{
    let id= req.params.id;
    Item.findById(id,(err,itemToEdit)=>{
        if(err){
            console.log(err);
            res.end(err);
        }
        else{
            res.render('edit',{title: 'Edit Medicine', book: itemToEdit});
        }
    })
    });

router.post('/edit/:id',urlencodeParser,(req,res,next)=>{
        Item.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, product) {
            if (err) return next(err);
            res.redirect('/pharmacy/list');
        });
    });

router.get('/delete/:id',urlencodeParser,(req,res,next)=>{
        let id=req.params.id;    
        Item.remove({ _id: id}, (err)=>{
            if(err)
            {console.log(err);
                 res.end(err);
        }  
        else{
             res.redirect('/pharmacy/list');
        }})
     });

router.get('/add',urlencodeParser, checkAdmin,(req,res)=>{
    res.render('add',{
        title:"Add new"
    });
})
router.get('/',(req,res)=>{
    res.render('main');
})

module.exports=router;