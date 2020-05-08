var db=require('../views/db');



module.exports.display=function(req,res){
    //  console.log(db.get('transaction').value());
    //  console.log(db.get('books').value());
    //  console.log(db.get('users').value())
      res.render('transaction',{
        meow:db.get('transaction').value(),
        books:db.get('books').value(),
        users:db.get('users').value()
      });
    }


    module.exports.create=function(req,res){
        res.render('transaction.pug');
      }


    module.exports.complete=function(request,response){
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
      }

 

    module.exports.postCreate=function(req,res){
        req.body.id=shortid.generate();
        req.body.isComplete=false;
        db.get('transaction').push(req.body).write();
       // console.log(req.body);
        res.redirect('/transaction'); 
      }