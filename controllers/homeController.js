const buyerSchema=require('../models/buyer');
const product = require('../models/product');
const accountSid = 'ACc51016101fdd1f62827b6dcdc2037c49';
const authToken = '3b98b7e7713787f270cb27c29ec6c551';
const clientm= require('twilio')(accountSid, authToken);
var stripe = require('stripe')('sk_test_51H1niCGOyvBwbrziZoJ7McS46VR0kNu2O5b09rnCFl6YvNMbehJHlcQ8wngAursJrxVg8kGziLOktOuuFyA6OB4500ApewXQEH');
var brec,bkey;


function otpgen(a, b){
    var a=Math.random()*(b-a+1)+1000;
    return Math.floor(a);
}

exports.logout=(req,res)=>{
    req.session.destroy();
    // console.log('logged out');
    return res.render('flogin',{i:1,error:false});
}

exports.getHome=(req,res)=>{
    // console.log('ok');
}

exports.signup=(req, res) =>{
	res.render('farmregi',{i:0,j:0,k:1});
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
    new buyerSchema({
        name:req.body.name,
        password:req.body.passwd,
        phoneNo:req.body.phone,
        address:req.body.address,
        total:0

}).save().then((re)=>{
    // console.log(re);
    // console.log('user created');
    res.redirect('/shop/login');
}).catch(err=>{
    console.log(err);
})
}

exports.profile=(req,res)=>{
     product.find().then((prod)=>{
            // console.log(prod);
            return res.render('sell',{product:prod,name:req.session.user.name});
        }).catch(err=>{
            console.log(err);
        })
}

exports.userProfile=(req,res)=>{
    buyerSchema.findOne({_id:req.session.user}).then((user)=>
        res.render('buyerProfile',{user:user})
    )
    
}

exports.loginCheck=(req,res)=>{
    buyerSchema.findOne({password:req.body.passwd,phoneNo: req.body.phone}).then((data)=>{
        if(!data){
            return res.render('flogin',{i:1,error:true});
        }
        product.find().then((prod)=>{
            req.session.user=data;
            req.session.status='shop';
            return res.render('sell',{product:prod,name:data.name,error:false});
        }).catch(err=>{
            console.log(err);
        })
    }).catch(err=>{
        res.render('flogin',{i:0,erorr:true})
    })
}

exports.botpgen=(req,res)=>{
    brec=req.body;
	bkey=otpgen(1000,5000);
    buyerSchema.findOne({phoneNo:req.body.phone}).then((data)=>{
        if(!data){
            return res.render('farmregi',{k:1,i:0,j:2});
        }
        res.render('farmregi',{k:1,i:0,j:0,name:brec.name,phoneno:brec.phone,password:brec.passwd,address:brec.address});
    }).catch(err=>{
        console.log(err);
    })
	console.log(bkey);
	clientm.messages
	.create({
    body: 'You have recieved an OTP:'+bkey+' from the website "FARM ATTIC". Please verify it ',
    from: '+16614034073',
    to: "+91"+req.body.phone
   })
.then(message => console.log(message.sid));

}

exports.bverify=(req,res)=>{
    var verifykey=req.body.otpno;
	if(bkey==verifykey){
		res.render('farmregi',{k:1,i:0,j:1,name:brec.name,phoneno:brec.phone,address:brec.address,password:brec.passwd});
		brec=null;
	}
}

exports.getItem=(req,res)=>{
    var id=req.params.id;
    // console.log(id);
    product.findById(id).then((data)=>{
        res.render('order',{product:data});
    })
    .catch(err=>{
        console.log(err);
    })
}

exports.addCart=async (req,res)=>{
    var id=req.body.item;
    var qty=Number(req.body.qty);
    var prod=await product.findById(id);
    buyerSchema.findOne({_id:req.session.user._id}).then((data)=>{
        var arr=data.cart.items;
        var found=0;
        arr.forEach((ele)=>{
            if(ele.product.toString()===id.toString()){
                found=1;
            }
        })
        if(found==1){
            arr.map((ele)=>{
                if(ele.product.toString()===id.toString()){
                    ele.quantity=ele.quantity+qty;
                    // ele.amount=prod.rpkg;

                }
            })
        }
        else{
            obj={product:id,quantity:qty,amount:prod.rpkg};
            arr.push(obj);
        }
        data.save().then((cart)=>{
            return res.redirect('/shop/getCart')
        })
    }).catch(err=>{
        return res.redirect('/shop/item/'+id);
    })
}

exports.getCart=(req,res)=>{
    let products;
    var id=req.session.user._id;
    buyerSchema.findById(id).populate({path:'cart.items.product',populate:{path:'farmer'}}).then((data)=>{
        products=data.cart.items;
        if(products.length>0){
        
            return res.render('cart',{product:data,i:1});
    }
        return res.render('cart',{product:data,i:0})
        
    }).catch(err=>{
        console.log(err);
    })
}

exports.checkOut=(req,res)=>{
    let products;
    // console.log('http'+req.headers.host+'/shop/success')
    var id=req.session.user._id;
    buyerSchema.findById(id).populate({path:'cart.items.product',populate:{path:'farmer'}}).then((data)=>{
        products=data.cart.items;
        if(products.length>0){
        return stripe.checkout.sessions.create(
            {
              success_url: 'http://'+req.headers.host+'/shop/success',
              cancel_url: 'http://'+req.headers.host+'/shop/cancel',
              payment_method_types: ['card'],
              line_items:products.map(p=>{
                return{
                    name:p.product.cropname,
                    currency:'inr',
                    quantity:p.quantity,
                    amount:p.amount*100
                }
            }),
              mode: 'payment',
            })
         .then(ssession=>{
            return res.render('checkout',{product:data,sessionID:ssession.id,i:1});
        })
    }
        return res.render('checkout',{product:data,i:0})
        
    }).catch(err=>{
        console.log(err);
    })
}

exports.removeItem=(req,res)=>{
    // console.log('ok'+req.params.id);
    var id=req.params.id;
    buyerSchema.findById(req.session.user._id).then((buyer)=>{
        var arr;
        buyer.cart.items=buyer.cart.items.filter((ele)=>{
              return (ele._id.toString()!==id.toString());       
        })
         buyer.save().then((data)=>{
            res.json({message:"success"})
       })
    })
}

exports.myOrder=(req,res)=>{
    buyerSchema.findById(req.session.user._id).populate({path:'order.items.product'}).then((data)=>{
        let order=data.order.items;

        res.render('myorder',{order:order,i:order.length});
        
    })

}

exports.success=(req,res)=>{
    let date=new Date().toISOString();
    buyerSchema.findById(req.session.user._id).then((data)=>{
        data.cart.items.forEach((ele)=>{
            // console.log(ele);
            data.order.items.push(ele)

            product.findById(ele.product).then((prod)=>{
                prod.quantity-=ele.quantity;
                prod.save().then(()=>{console.log('ok deleted from product table')})
            })

        });
        data.cart.items=[];

        data.save().then((order)=>{
            // console.log(order)
            return res.redirect('/shop/myOrder');
        })
    })
}

exports.cancel=(req,res)=>{
    res.render('cancel');
}