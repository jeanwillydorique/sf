var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var collection = 'users' ;



// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'willgram'



// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  if (err) return console.log(err)
  const db = client.db(dbName);



  /* GET users listing. */
  router.get('/newUser', function(req, res, next) {
    res.render('newUser', { title: 'Willgram' });
  });



  /* POST CreateUser */ 

  router.post('/createUser', function(req, res, next) {

      // let data = []; 
      // let date = 'creation_date :' + new Date();
      // data.push(req.body);
      // data.push(date)
      
      // console.log(data)

      // let Username = req.body.username;
      // let Password = req.body.password;
      // let Mail = req.body.mail;
      // let Birth_Date = req.body.birth_date;
      // let Creation_Date = new Date(); 

      //console.log(Creation_Date);
        db.collection(collection).insertOne({

          "Username" : req.body.username,
          "Password" : req.body.password,
          "Mail" : req.body.mail,
          "Birth_Date" : req.body.birth_date,
          "Follower" : [],
          "Following" : [],
          "Creation_Date" : new Date()
        }, function(err, result) {
          if (err) {
            throw err;
          }
          console.log(result.insertedId)
          let objId = new ObjectID(result.insertedId); 
          db.collection(collection).updateOne({ "_id" : objId },  
            { $set: { "Following" : [result.insertedId] }}, 
            function(err, doc){
            if(err) return next(err);
            //console.log(doc)
            //if ( doc.state === false )
            //{
                res.render('homepage', {data : doc} )
            });
        });

  });


});

module.exports = router;
