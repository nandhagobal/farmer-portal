const mongoose= require('mongoose');
const schema=mongoose.Schema;
// const farmer=require('./seller')

var dateProductSchema=new schema({
    cropname:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    rpkg:{
        type:Number,
        required:true
    },
    rate:{
        type:Number,
        required:true
    },
    farmer:{
        type:schema.Types.ObjectId,
        ref:'farmer'
    }
    
})
module.exports=mongoose.model('dateProduct',dateProductSchema);