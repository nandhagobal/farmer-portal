const mongoose= require('mongoose');
const schema=mongoose.Schema;


var productSchema=new schema({
    cropname:{
        type:String,
        required:true
    },
    date:{
        type:Date,
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
module.exports=mongoose.model('product',productSchema);