var brec,fkey;
const accountSid = 'ACc51016101fdd1f62827b6dcdc2037c49';
const authToken = '3b98b7e7713787f270cb27c29ec6c551';
const productSchema=require('../models/product');
const dProductSchema=require('../models/dateProduct');
const clientm= require('twilio')(accountSid, authToken);
const farmerSchema=require('../models/seller')
const db=require('../dbConnection/db');
const dateProduct=require('../models/dateProduct')


function otpgen(a, b){
    var a=Math.random()*(b-a+1)+1000;
    return Math.floor(a);
}

exports.signup=(req, res) =>{
	res.render('farmregi',{i:0,j:0,k:0});
}

exports.login=(req,res)=>{
    if(!req.session.user)
    res.render('flogin',{i:1,error:false});
    else{
        res.redirect('/'+req.session.status+'/profile')
    }
}

exports.createUser=(req,res)=>{ 
    // console.log('ok')   
    new farmerSchema({
        name:req.body.name,
        password:req.body.passwd,
        phoneNo:req.body.phone,
        farmer_id:req.body.farmer_id,
        address:req.body.address,
        trans:req.body.trans,
        max_dis:req.body.max_dis,
        lorry_no:req.body.lorry_no

}).save().then((re)=>{
    // console.log(re);
    // console.log('user created');
    res.redirect('/seller/profile');
}).catch(err=>{
    console.log(err);
})
}

exports.fotpgen=(req,res)=>{
    brec=req.body;
	fkey=otpgen(1000,5000);
    farmerSchema.findOne({phoneNo:req.body.phone}).then((data)=>{
        if(!data){
            return res.render('farmregi',{k:0,i:2,j:0});
        }
        res.render('farmregi',{k:0,i:0,j:0,name:brec.name,phoneno:brec.phone,farmer_id:brec.farmer_id,password:brec.passwd,address:brec.address});
    }).catch(err=>{
        console.log(err);
    })
	console.log(fkey);
	clientm.messages
	.create({
    body: 'You have recieved an OTP:'+fkey+' from the website "FARM ATTIC". Please verify it ',
    from: '+16614034073',
    to: "+91"+req.body.phone
   })
.then(message => console.log(message.sid));
}

exports.logout=(req,res)=>{
    req.session.destroy();
    // console.log('logged out');
    return res.render('flogin',{i:0,error:false});
}

exports.loginCheck=(req,res)=>{
    farmerSchema.findOne({password:req.body.passwd,farmer_id: req.body.farmer_id}).then((data)=>{
        if(!data){
            return res.render('flogin',{i:0,error:true});
        }   
            productSchema.find().then((product)=>{
                dateProduct.find().then((prod)=>{
                    // console.log('logged in');
                    req.session.user=data;
                    req.session.status='seller';
                    return res.render('profile',{detail:data,product:product,products:prod});
                })
            })
    }).catch(err=>{
        res.render('flogin',{i:0,error:true});
    })
}

exports.profile=(req,res)=>{
        if(!req.session.user){
            return res.render('flogin',{i:0,error:false});
        }   
            productSchema.find().then((product)=>{
                dateProduct.find().then((prod)=>{
                    return res.render('profile',{detail:req.session.user,product:product,products:prod});
                })
            })
    }

exports.fverify=(req,res)=>{
    var verifykey=req.body.otpno;
	if(fkey==verifykey){
		res.render('farmregi',{k:0,i:1,j:0,name:brec.name,farmer_id:brec.farmer_id,phoneno:brec.phone,address:brec.address,password:brec.passwd});
		brec=null;
	}
}

exports.getUpload=(req,res)=>{
    res.render('upload');
}

exports.postUpload=async (req,res)=>{
    var dbs=await db;
    // console.log(dbs);
    var product=await dbs.collection('croprate').findOne({cropname:req.body.crop});
    // console.log(product);
    productSchema.findOne({farmer:req.session.user._id,cropname:req.body.crop,date:req.body.date}).then((result)=>{
        if(!result){
        var uploadProduct=new productSchema({
        cropname:req.body.crop,
        date:req.body.date,
        quantity:Number(req.body.quantity),
        rpkg:product.rate,
        rate:Number(req.body.quantity)*product.rate,
        farmer:req.session.user._id
    })
    uploadProduct.save().then((data)=>{
        // console.log('product is stored in product');
    }).catch(err=>{
        console.log(err);
    })
        }
        else{
            result.quantity+=Number(req.body.quantity);
            result.rate+=Number(req.body.quantity)*product.rate;
            result.save().then((ress)=>{
                // console.log('updated in product');
            }).catch((err)=>{
                console.log(err);
            })
        }
    })
    
    dateProduct.findOne({farmer:req.session.user._id,cropname:req.body.crop}).then((result)=>{
        if(!result){
            var datePro=new dateProduct({
        cropname:req.body.crop,
        quantity:Number(req.body.quantity),
        rpkg:product.rate,
        rate:Number(req.body.quantity)*product.rate,
        farmer:req.session.user._id
    })
    datePro.save().then((data)=>{
        // console.log('added newly in date'); 
        return res.redirect('/seller/profile')
    }).catch((err)=>{
        console.log(err);
    })
        }
        else{
            result.quantity+=Number(req.body.quantity);
            result.rate+=Number(req.body.quantity)*product.rate;
            result.save().then((ress)=>{
                // console.log('updated in date');
                // console.log(ress);
        return res.redirect('/seller/profile')
                
            }).catch((err)=>{
                console.log(err);
            })
        }
    })
    
}

exports.userProfile=(req,res)=>{
    farmerSchema.findOne({_id:req.session.user}).then((user)=>
        res.render('sellerProfile',{user:user})
    )
}
