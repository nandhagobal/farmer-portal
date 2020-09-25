const mongose=require('mongoose')
const schema=require('mongoose').Schema;




const farmerSchema=new schema({
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
   farmer_id:{
       type:String,
        require:true
   },
   trans:String,
   lorry_no:String,
   max_dis:Number
})

module.exports=mongose.model('farmer',farmerSchema);