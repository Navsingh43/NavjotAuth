let mongoose= require('mongoose');

// create model class
let appointmentModel= new mongoose.Schema(
    {
        specName:String,
        name: String,
        myemail: String,
        day:String,
        time:String
    })
    const appoint= new mongoose.model('book-app', appointmentModel);
    module.exports=appoint;