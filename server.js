var express = require("express");
var path = require("path");
var validUrl = require("valid-url");
//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;
var app = express()
/*
function urlMiddleware(req, res, next) {
    console.log(req.params.longUrl);
    next();
}
*/

//(Focus on This Variable)
//var mongoUrl = 'mongodb://localhost:27017/short_urls';      
var mongoUrl = process.env.MONGOLAB_URI;
//(Focus on This Variable)



app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
//app.use(markdownRouter(__dirname + '/'));
app.get('/', function(req, res) {
    res.render('index');
})
app.get('/new', function(req, result) {
    //res.send(req)
    var longUrl = req.query.url;
    if(!longUrl) {
        result.send({error: "Need proper url parameter"})
    } else if (!validUrl.isUri(longUrl)) {
        result.send({error: "Not a valid url"});
    } else {
        var shortUrl = 'https://node-url-shortener.herokuapp.com/short/';
        // Use connect method to connect to the Server
        MongoClient.connect(mongoUrl, function (err, db) {
          if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
          } else {
            console.log('Connection established to', mongoUrl);
            var urls = db.collection('urls');
            // do some work here with the database.
            urls.insert({original_url: longUrl}, function(req, res) {
                if (err) throw err
                shortUrl = shortUrl + res.ops[0]._id;
                console.log(shortUrl);
                db.close();
                result.send({original_url: longUrl, short_url: shortUrl});
            });
            
          }
        });
        
        //res.redirect(longUrl);
        
    }
    
    //res.send(req.params.longUrl)
})
app.get('/short/:id', function(request, result) {
    var urlId = request.params.id;
    // Use connect method to connect to the Server
    MongoClient.connect(mongoUrl, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            console.log('Connection established to', mongoUrl);
            var urls = db.collection('urls')
            urls.find({"_id" : ObjectId(urlId)}, {"original_url": 1})
                .toArray(function(err, docs) {
                    if (err) throw err
                    db.close()
                    result.redirect(docs[0].original_url)
                })

        }
    });
    //result.send(urlId);
})
app.listen(process.env.PORT || 8080, function () {
  console.log('Example app listening on port 3000!')
})