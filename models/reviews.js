let mongoose= require('mongoose');
Schema=mongoose.Schema;

// create model class
let reviewModel= new mongoose.Schema(
    {
        For:String,
        name: String,
        content:String
    })
    const myReview= new mongoose.model('reviews', reviewModel);
    module.exports=myReview;