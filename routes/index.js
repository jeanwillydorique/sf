var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var collection = 'users' ;
var session = require('express-session');
var cookieParser = require('cookie-parser');
//var app = express();



// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'willgram'



// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  if (err) return console.log(err)
  const db = client.db(dbName);



    /* GET home page. */
    router.get('/', function(req, res, next) {
        if(req.cookies.UserID) {
            db.collection("posts").find().toArray((err, posts) => {
                //console.log(posts)
                db.collection("users").find().toArray((err, users) => {
                    db.collection("Comments").find().toArray((err, comments) => {
                        //console.log(users[0]._id)
                        let objId = new ObjectID(req.cookies.UserID); 
                        db.collection("users").findOne({"_id" : objId}, function(err, user) {
                            let followings = user.Following;
                            //console.log(Following)
                            return res.render('homepage', {
                                posts: posts,
                                user:user,
                                users:users,
                                followings: followings,
                                comments:comments
                            });  
                        }); 
                    });
                }); 
            }); 
        } else {
            res.render('index', { title: 'Willgram' });
        }
    });


    router.post('/homepage', (req, res) => {  
        db.collection(collection).find().toArray((err, result) => {
        console.log(req.body["mail"])
        //console.log(result)  
        let test = false
        let data = []; 
        result.forEach(element => { 
            //console.log(element)  
            if(element["Mail"] === req.body["mail"] && element["Password"] === req.body["password"] ){
                console.log("Yes")
                data.push(element);
                res.cookie('UserID', element["_id"]); //Sets name = express
                test = true  
            } else {
                console.log("No") 
            }
        });

        if (test === true ) {
            db.collection("posts").find().toArray((err, posts) => {
                //console.log(posts)
                db.collection("users").find().toArray((err, users) => {
                    console.log(users)
                    return res.render('homepage', {
                        posts: posts,
                        users:users
                    });  
                }); 
            }); 
        } else {
          return res.render('index');     
        }
        });
    });

    router.get('/userHomepage', function(req, res, next) {
        //console.log(req.cookies.UserID);
        let objId = new ObjectID(req.cookies.UserID); 
        db.collection("posts").find({"UserID" : req.cookies.UserID}).toArray((err, posts) => {
            //let nbPost = posts.length 
            //console.log(posts)
            db.collection("users").findOne({"_id" : objId}, function(err, user) {
                //console.log(user)
                return res.render('userHomepage', {
                    posts: posts,
                    nbPost : posts.length, 
                    user:user
                });  
            }); 
        });
    });

    router.get('/:id', function(req, res, next) {
        console.log(req.params.id);
        let objId = new ObjectID(req.params.id); 
        db.collection("users").find().toArray((err, users) => {
            db.collection("posts").find({"UserID" : req.params.id}).toArray((err, posts) => {
                //let nbPost = posts.length 
                //console.log(posts)
                db.collection("users").findOne({"_id" : objId}, function(err, user) {
                    //console.log(user)
                    return res.render('userHomepage', {
                        posts: posts,
                        nbPost : posts.length, 
                        user:user,
                        users:users
                    });  
                }); 
            });
        });
    });

});


module.exports = router;

