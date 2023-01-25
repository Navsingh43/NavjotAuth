let mongoose= require('mongoose');

// create model class
let specModel= new mongoose.Schema(
    {
        name: {
            type:String,
            required:true,
            unique:true
        },
        field:String,
        intro:String,
        
    })
    const myReview= new mongoose.model('specialists', specModel);
    module.exports=myReview;