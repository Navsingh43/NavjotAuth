const express=require('express');
const auth=require("./routes/auth");
const path =require("path");
const cookieParser=require('cookie-parser')
var bodyParser=require('body-parser');
var urlencodeParser=bodyParser.urlencoded({extended:false})
const DB=require('./config/db');
var bool;
const app=express();
const mongoose=require('mongoose');
app.use(express.json())
app.use(cookieParser());
app.use(urlencodeParser);
app.use('/public',express.static(__dirname + '/public'));
app.set('view engine','ejs');
app.use("/admin", require('./routes/admin'));
app.use("/",require('./routes/auth'));
app.use("/spec",require('./routes/specialist'));
app.use("/pharmacy",require('./routes/pharma'));
app.set('views', [__dirname + '/specialists', __dirname + '/views', __dirname + '/pharmacy']);
app.listen(5000,()=>{
        console.log("Now running on 5000");
})
mongoose.connect(DB.URI,{useNewUrlParser:true, useUnifiedTopology:true}, (err)=>{
    if(!err)
    console.log("BD success")
    else{
        console.log(err);
    }
}
)