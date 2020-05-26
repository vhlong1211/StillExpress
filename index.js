// server.js
// where your node app starts
require('dotenv').config();
// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const shortid=require('shortid'); 
var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/Erection', {useNewUrlParser: true, useUnifiedTopology: true});
//console.log(process.env.SESSION_SECRET);
var userRoute=require('./routes/userroute')
var authRoute=require('./routes/authroute')
var transaction=require('./routes/transaction.js')
var apitrans=require('./api/routes/api.transactions');

var Book=require('./Models/books.model');
var User=require('./Models/user.model');
var Products=require('./Models/products.model');
var Session=require('./Models/session.model.js');
var Transaction=require('./Models/trans.model.js');

var authMiddles=require('./middlewares/authwares')
var sessionMiddleware=require('./middlewares/session');
const multer  = require('multer')
const upload = multer({ dest: './public/uploads' })

const db=require('./views/db')
var cookieParser=require('cookie-parser')
var count=0;

app.set('views','./views');
app.set('view engine', 'pug');
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-
app.use(express.static("public"));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(sessionMiddleware);
// https://expressjs.com/en/starter/basic-routing.html
app.get('/',function(req,res){
  res.render('layout.pug');
})

app.get('/api/books',async function(req,res){
  // console.log(count);
  // console.log(req.cookies);
   var books=await Book.find()
   res.json(books);
 })
app.get('/books',async function(req,res,){
 // console.log(count);
 // console.log(req.cookies);
  var books=await Book.find()
  try{
    var a; a.b();
  }catch(err){
  
  }
  res.render('library.pug',{
    meow:books
  });
})
app.get('/create',function(req,res){
  res.render('create.pug');
})
app.post('/create',async function(req,res){
  req.body.coverUrl='donthaveoneyet';
  await Book.create(req.body);
  
  res.redirect('/books'); 
})
app.get('/books/:id/delete',authMiddles.check,async function(request,response){
  var id=request.params.id;
  //console.log(request.params)
  await Book.remove({_id:id});
  response.redirect('/books');
})
app.get('/books/:id/update',authMiddles.check,function(request,response){
  response.render('update.pug',{
    meow:request.params.id
  });
})
app.post('/books/:id/update',upload.single('coverUrl'),authMiddles.check,async function(req,res){

  var id=req.params.id;
  await Book.updateOne({_id:id},{$set:{title:req.body.title}});
  
  // db.get('books')
  // .find({ id: id })
  // .assign({ title: req.body.title})
  // .write()
  req.body.coverUrl = req.file.path.split('/').slice(1).join('/')
  await Book.updateOne({_id:id},{$set:{coverUrl:req.body.coverUrl}});

  // db.get('books')
  // .find({ id: id })
  // .assign({ coverUrl: req.body.coverUrl})
  // .write()
  
  res.redirect('/books');
})

  var pages1=1;
  var pages2=2;
  var pages3=3;
app.get('/products',async function(req,res){
  var products=await Products.find()
 // console.log(products);
  var page=1
  var a = 1;
  var perPage=12;
  var start=(page-1)*perPage;
  var end=page*perPage;
  var productss=products.slice(start,end)
  res.render('products',{
    products:productss,
    trang:[pages1,pages2,pages3]
  })
})
  
app.get('/products/page',async function(req,res){
  var products=await Products.find()
  if(req.query.p==='lui'){
    if(pages1!==1){
      pages1-=2;pages2-=2;pages3-=2
    }
  }
  if(req.query.p==='tien'){
    if(pages3!==11){
      pages1+=2;pages2+=2;pages3+=2
    }
  }
  var page=parseInt(req.query.q);

  var perPage=12;
  var start=(page-1)*perPage;
  var end=page*perPage;
  var productss=products.slice(start,end)
  
  res.render('products',{
    products : productss,
    trang:[pages1,pages2,pages3,page]
  })
})

app.get('/cart/:id',authMiddles.check,async function(req,res){
  var id=req.params.id;
  var sessionId=req.signedCookies.sessionId;
 // console.log(sessionId);
  if(!sessionId){
    res.redirect('/products');
    return;
  }
  var currPro = {
    productId: id,
    quantity: 1
  }
  let hailong = await Products.findOne({ _id : id });

  //try {
    let cartt = await Session.findOne({ ssid : sessionId });
    console.log(cartt)
    console.log(cartt.cart[0])
    // if this products does exist in your cart
    if(cartt) {
      let itemIndex = cartt.cart.findIndex(p => p.productId === id)
      if (itemIndex > -1) {
        //product exists in the cart, update the quantity
        const productItem = cartt.cart[itemIndex]
        let count = productItem.quantity
        ++count
        productItem.quantity = count
      }
      else {
        // no cart for user, add products to cart
        cartt.cart.push(currPro) //push products into this function
      }
      cartt = await cartt.save();
    }
    else {
      await Session.create({
        ssid : session,
        cart : [
          {
            productId: id,
            quantity: 1
          }
        ]
      })
    }
  // } 
  // catch (err) {
  //   res.status(500).send("Something went wrong")
  // }
//    console.log(db.get('session').value());
//  res.redirect('/products')

})
app.get('/buy',authMiddles.check,async function(req,res){
  var sessionId=req.signedCookies.sessionId;
  let cartt = await Session.findOne({ ssid : sessionId });
  console.log(cartt);
  //var data= db.get('session').find({id:sessionId}).value();
 // console.log(req.locals);
 // console.log(data);
  for(var x of cartt.cart){
   // console.log(data.cart[x],x)
    for(var i=1;i<=x.quantity;i++){
      req.body.userID=req.locals.id;
      req.body.bookID=x.productId
   //   console.log(req.body.bookID+'-////-'+x);
   //   db.get('transaction').push({userID:req.locals.id,bookID:x}).write();
   await Transaction.create({userId:req.body.userID,bookId:req.body.bookID,isComplete:false});
    }
  }
  res.redirect('/transaction')
 // console.log(db.get('transaction').value());
})

app.get('/profile',authMiddles.check,function(req,res){
 // console.log(req.body);
  res.render('profile.pug',{
    meow:req.locals
  });
  
}
)
app.post('/profile/:id',upload.single('avatar'),authMiddles.check,async function(req,res){
 // var name=req.params.name;
  var id=req.params.id;
  if(req.file){
  req.body.avatar = req.file.path.split('/').slice(1).join('/')
  await User.updateMany({_id:id},{$set:{name:req.body.name,avatar:req.body.avatar}})
  // db.get('users')
  // .find({ id: id })
  // .assign({ name: req.body.name})
  // .assign({avatar: req.body.avatar})
  // .write()
  }
//  console.log(req.body);
  await User.updateOne({_id:id},{$set:{name:req.body.name}})

  // db.get('users')
  // .find({ id: id })
  // .assign({ name: req.body.name})
  // .write()
  //console.log(req.body)
  res.redirect('/users')
})



app.use('/users',userRoute)
app.use('/auth',authRoute)
app.use('/transaction',transaction)
app.use('/api',apitrans);
// listen for requests :)
const listener = app.listen(3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
