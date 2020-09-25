const mongose=require('mongoose')
const schema=require('mongoose').Schema;
// const product =require('./product')
// const schema=mongose.Schema;
const buyerSchema=new schema({
   name:{
       type:String,
       required:true
   },
   address:{
       type:String,
       required:true
   },
   password:{
       type:String,
       required:true
   },
   phoneNo:{
       type:String,
       required:true
   },
   cart:{
       items:[{product:{type:schema.Types.ObjectId,ref:'product'},quantity:{type:Number},amount:{type:Number}}],
       
   },
   
   order:{
       items:[{product:{type:schema.Types.ObjectId,ref:'product'},quantity:{type:Number},amount:{type:Number},data:{type:String}}]
   }
})

module.exports=mongose.model('buyer',buyerSchema);