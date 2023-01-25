let mongoose= require('mongoose');

// create model class
let storeModel= new mongoose.Schema(
    {
        name: String,
        company: String,
        price: Number,
        quantity: Number
    })
    const myItem= new mongoose.model('medic-stores', storeModel);
    module.exports=myItem;