const mongoClient=require('mongodb');
const url="mongodb://localhost:27017/farmerdb";
var _db;
const getDb = ()=>{
       return mongoClient.connect("mongodb+srv://Nandhagobal12:hAaBQR6wjyT44YC@cluster0.zah7w.mongodb.net/farmerdb").then((db)=>{return db.db("farmerdb")}).catch(err=>console.log(err));
}
module.exports=getDb();