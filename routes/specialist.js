const express=require('express');
const rvw= require('../models/reviews');
const appoint=require('../models/appointment-book');
const specialist= require('../models/specialist');
const app=express();
var bodyParser=require('body-parser');
var onee=require('./auth');
var urlencodeParser=bodyParser.urlencoded({extended:false})
const router=express.Router();
var revName;
var appointName;
router.get('/',(req,res)=>{
    specialist.find((err,specialistList)=>{
        if(err){
            return console.error(err);
        }
        else{
            if(req.cookies.jwt){
            res.render('profile',{
                SpecList:specialistList
            }) 
        }    
        else{
            res.render('profile-admin',{
                SpecList:specialistList
            })
        }        
    }

}
    )
});
router.get('/add-specialist',(req,res)=>{
    res.render('add-specialist');
});

router.post('/add-specialist',urlencodeParser,(req,res)=>{
        let newSpec= specialist({
            "name": req.body.name,
            "field": req.body.field,
            "intro":req.body.intro,
        });
    
        console.log(req.body.name);
        specialist.create(newSpec, (err,specialist)=>
        {
            if(err){
                console.log(err);
                res.end(err);
            }else{
                res.redirect('/spec');
            }
        })
    }
    )

router.get('/add-review/:id',urlencodeParser,(req,res)=>{
    let id =req.params.id;
    
    specialist.findById(id,(err,reso)=>{
        if(err)
        {
            console.log(err)
        }
        else{
            revName=reso.name;
        }
    })
    console.log(onee.globemail)
    res.render('add-review');   
    
});
router.post('/add-review/:id',urlencodeParser,(req,res)=>{
   
    if(!req.body.name){
        let newReview= rvw({
            "For":revName,
            "name": "anonymous",
            "content": req.body.content
        });
    
        console.log(req.body.name);
        rvw.create(newReview, (err,Item)=>
        {
            if(err){
                console.log(err);
                res.end(err);
            }else{
                res.redirect('/spec');
            }
        })
        
    }
    else{   
    let newReview= rvw({
        "For":revName,
        "name": req.body.name,
        "content": req.body.content
    });

    console.log(req.body.name);
    rvw.create(newReview, (err,Item)=>
    {
        if(err){
            console.log(err);
            res.end(err);
        }else{
            res.redirect('/spec');
        }
    })
    }   
});

router.get('/reviews/:id',urlencodeParser,(req,res)=>{
    let md =req.params.id;
    specialist.findById(md,(err,reso)=>{
        if(err)
        {
            console.log(err)
        }
        else{
            revName=reso.name;
            rvw.find({"For":revName},(err,result)=>{
                if(err)
                {
                    console.log(err)
                }
                else{
                   res.render('reviews',{
                    RevList:result
                   })
                }
            })
        }
    })
  // console.log(revName);
  
    /*
    rvw.find((err,reviewList)=>{
        if(err){
            return console.error(err);
        }
        else{
            res.render('reviews',{
                RevList:reviewList
            })
}
}
    )*/
});

router.get('/book-appointment/:id',urlencodeParser,(req,res)=>{
    let id =req.params.id;
    
    specialist.findById(id,(err,reso)=>{
        if(err)
        {
            console.log(err)
        }
        else{
            appointName=reso.name;
            //console.log(appointName)
        }
    })
    res.render('book-appointment');
    console.log()
    
});
router.post('/book-appointment/:id',urlencodeParser,(req,res)=>{
    var m=req.body.time;
    //console.log(req.body.time)
    let newReview= appoint({
        "specName":appointName,
        "name":req.body.name,
        "myemail": req.body.email,
        "day": req.body.day,
        "time":req.body.time
    });

    appoint.find({"time":req.body.time,"day":req.body.day},(err,result)=>{
        console.log(result);
        if(err){
            console.log(err)
        }
        else if(!result[0]){
            appoint.create(newReview, (err,Item)=>
            {
                if(err){
                    console.log(err);
                    res.end(err);
                }else{
                    res.redirect('/spec');
                }
            })
        }
        else{
            return res.status(401).json({ msg: "The time already booked" })
        }
    })
    
})
router.get('/my-appointments/:name',urlencodeParser,(req,res)=>{
    let td=req.params.name;
    appoint.find({"specName":td},(err,result)=>{
        if(err)
        {
            console.log(err)
        }
        else{
            res.render('my-appointments',{
                title:"My Appointments",
                MediList:result
            })
        }
    })

});

module.exports=router;