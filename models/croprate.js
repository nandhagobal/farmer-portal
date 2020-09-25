const mongoose = require('mongoose');
const schema = mongoose.Schema;

const rate=new schema({
    cropname:String,
    rate:Number
})


module.exports=mongoose.model('croprate',rate);