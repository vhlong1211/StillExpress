// server.js
// where your node app starts
require('dotenv').config();
// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const shortid=require('shortid'); 
//console.log(process.env.SESSION_SECRET);
var userRoute=require('./routes/userroute')
var authRoute=require('./routes/authroute')
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
app.get('/biscuit',function(req,res){
    count++;
 // res.send('gg');
  res.cookie('hmm',22);
  res.redirect('/books');
})

app.get('/books',function(req,res){
 // console.log(count);
 // console.log(req.cookies);
  res.render('library.pug',{
    meow:db.get('books').value()
  });
})
app.get('/create',function(req,res){
  res.render('create.pug');
})
app.post('/create',function(req,res){
  req.body.id=shortid.generate();
  db.get('books').push(req.body).write();
  res.redirect('/books'); 
})
app.get('/books/:id/delete',authMiddles.check,function(request,response){
  var id=request.params.id;
  //console.log(request.params)
  db.get('books')
  .remove({ id:id })
  .write()
  response.redirect('/books');
})
app.get('/books/:id/update',authMiddles.check,function(request,response){
  response.render('update.pug',{
    meow:request.params.id
  });
})
app.post('/books/:id/update',upload.single('coverUrl'),authMiddles.check,function(req,res){

  var id=req.params.id;

  db.get('books')
  .find({ id: id })
  .assign({ title: req.body.title})
  .write()
  req.body.coverUrl = req.file.path.split('/').slice(1).join('/')
  db.get('books')
  .find({ id: id })
  .assign({ coverUrl: req.body.coverUrl})
  .write()
  console.log(req.body);
  res.redirect('/books');
})



app.get('/transaction',authMiddles.check,function(req,res){
//  console.log(db.get('transaction').value());
//  console.log(db.get('books').value());
//  console.log(db.get('users').value())
  res.render('transaction',{
    meow:db.get('transaction').value(),
    books:db.get('books').value(),
    users:db.get('users').value()
  });
})
app.get('/transaction/create',authMiddles.check,function(req,res){
  res.render('transaction.pug');
})
app.get('/transaction/:id/complete',authMiddles.check,function(request,response){
  var id=request.params.id;
//  console.log(request.params)
  var count=0;
  for(var item of db.get('transaction').value()){
    if(id===item.id){
      count++;
    }
  }
  if(count===0){
    console.log('nooo');
    return;
  }
//  console.log(db.get('transaction').value());
 db.get('transaction')
  .find({ id: id })
  .assign({ isComplete: true})
  .write()
  response.redirect('/transaction');
})
app.post('/transaction/create',function(req,res){
  req.body.id=shortid.generate();
  req.body.isComplete=false;
  db.get('transaction').push(req.body).write();
 // console.log(req.body);
  res.redirect('/transaction'); 
})

app.get('/products',function(req,res){
  var page=parseInt(req.query.page)||1
  var perPage=9;
  var start=(page-1)*perPage;
  var end=page*perPage;
  res.render('products',{
    products:db.get('products').value().slice(start,end)
  })
})
app.get('/cart/:id',authMiddles.check,function(req,res){
  var id=req.params.id;
  var sessionId=req.signedCookies.sessionId;
 // console.log(sessionId);
  if(!sessionId){
    res.redirect('/products');
    return;
  }
  let count = db.get('session').find({id:sessionId}).get('cart.' + id,0).value()
  
  db.get('session').find({id:sessionId}).set('cart.'+id,++count).write();
    console.log(db.get('session').value());
//  res.redirect('/products')

})
app.get('/buy',authMiddles.check,function(req,res){
  var sessionId=req.signedCookies.sessionId;
  var data= db.get('session').find({id:sessionId}).value();
 // console.log(req.locals);
  console.log(data);
  for(var x in data.cart){
   // console.log(data.cart[x],x)
    for(var i=1;i<=data.cart[x];i++){
      req.body.userID=req.locals.id;
      req.body.bookID=x
   //   console.log(req.body.bookID+'-////-'+x);
      db.get('transaction').push({userID:req.locals.id,bookID:x}).write();
    }
  }
 // console.log(db.get('transaction').value());
})

app.get('/profile',authMiddles.check,function(req,res){
 // console.log(req.body);
  res.render('profile.pug',{
    meow:req.locals
  });
  
}
)
app.post('/profile/:id',upload.single('avatar'),authMiddles.check,function(req,res){
 // var name=req.params.name;
  var id=req.params.id;
  console.log(req.body);
  db.get('users')
  .find({ id: id })
  .assign({ name: req.body.name})
  .write()
  req.body.avatar = req.file.path.split('/').slice(1).join('/')
  console.log(req.body)
  res.render('longngu',{
    info : req.body
  });
})



app.use('/users',userRoute)
app.use('/auth',authRoute)

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
