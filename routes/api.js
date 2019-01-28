var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var collection = 'users' ;
var session = require('express-session');
var cookieParser = require('cookie-parser');



// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'willgram'



// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  if (err) return console.log(err)
  const db = client.db(dbName);

  router.post('/:id', function(req, res, next) {
    if(err) return next(err);
    let objId = new ObjectID(req.params.id); 
    db.collection("posts").findOne({ "_id" : objId }, function(err, post){
            if(err) return next(err);
            //console.log(post.UserID);
            let objUserId = new ObjectID(post.UserID)
            db.collection("users").findOne({ "_id" : objUserId }, function(err, user){
                let response = [];
                response.push(post);
                response.push(user);
                return res.json({
                        response: response,
                    })
                });
            });
        });

    router.put('/:id', function(req, res, next) {
            console.log(req.body)
            if(err) return next(err);
            let objId = new ObjectID(req.params.id); 
            db.collection("posts").updateOne({ "_id" : objId }, { $set: req.body}, function(err, response){
                    return res.json({
                        newNumber: req.body,
                    })
                });
            });

    router.post('/', function(req, res, next) {
                console.log(req.body.Content)
                db.collection("Comments").insertOne({
                    "UserID": req.cookies.UserID,
                    "PostID": req.body.ID,
                    "Content": req.body.Content,
                    "Creation_date" : Date()
                    }, function(err, response){
                    return res.json({
                        newNumber: req.body,
                    })
                });
                if(err) return next(err);
        });

});


module.exports = router;