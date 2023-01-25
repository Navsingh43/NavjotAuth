let mongoose=require('mongoose');
const userModel=new mongoose.Schema({
    email: {
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    token:{
        type:String
    }
})
const Register=new mongoose.model("users",userModel)
module.exports=Register;