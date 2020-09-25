var express = require('express');
var bodyParser = require('body-parser');
var app = express();
// var fs=require('fs');
var session=require('express-session');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
var client=require('mongoose');
var url="mongodb+srv://Nandhagobal12:hAaBQR6wjyT44YC@cluster0.zah7w.mongodb.net/farmerdb?retryWrites=true&w=majority";
const shopRoute=require('./routers/shop');
const sellerRoute=require('./routers/seller')
const mongodbSession = require('connect-mongodb-session')(session);

const store=new mongodbSession({
  uri:"mongodb+srv://Nandhagobal12:hAaBQR6wjyT44YC@cluster0.zah7w.mongodb.net/farmerdb",
  collection:'session',
  databaseName:'farmerdb',
  expires:60*60*1000
})

app.use(session({ secret:"it is a portal for farmer", resave:false, saveUninitialized:false,store:store}));
app.use(bodyParser.urlencoded({ extended: true })); 
app.use('/static',express.static(__dirname+'/nodejs'));
app.set('view engine','ejs');
app.set('views','view');


app.use('/seller',sellerRoute);
app.use('/shop',shopRoute);
app.get('/',function(req,res){
  res.render("home");
});
app.use((req,res)=>{
  res.render('error');
})


client.connect(url).then((db)=>{
  // console.log('ok');
  app.listen(process.env.PORT || 8080,function() {
    console.log('Server running at http://127.0.0.1:8080/');
  });
}).catch(err=>{
  console.log(err);
})
