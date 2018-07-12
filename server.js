var express = require('express');
var app = express();

// Public settings
app.use(express.static(process.cwd() + '/public'));
var PORT = process.env.PORT || 3000;

// mongo database
var mongoose = require("mongoose");
mongoose.Promise = Promise;
//mongoose.connect("mongodb://localhost:27017/Newsscraper", function(error){
//    console.log("Database connected");
//});

mongoose.connect("mongodb://heroku_ftj1x0sk:62lbuuejqh8570papafq41u5v2@ds163530.mlab.com:63530/heroku_ftj1x0sk", function(error){
    console.log("Database connected");
});

//BodyParser settings
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

//set up handlebar for views
var handlebars = require("express-handlebars");
app.engine("handlebars", handlebars({
    extname: "handlebars",
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + "/views/partials/"
}));
app.set("view engine", "handlebars");

var request = require("request");
var cheerio = require("cheerio");

var note = require("./models/note.js");
var article = require("./models/article.js");

//News Control

app.get('/', function(req, res){
    res.render('index');
});

app.get('/saved', function(req, res){

    var handlebarObjects = {
        date: []
    };

    article.find().sort({savedAt:-1}).exec(function(err,data){
        if(err) {
            console.log(err);
        } else {
            handlebarObjects.data = data;
            res.render("saved", handlebarObjects);
        }
    });
});

app.get('/scrape',function(req, res){

    request("https://www.nytimes.com/section/world/asia", function(error, response, html) {

    //initialize empty object to store cheerio objects
    var $ = cheerio.load(html);
    var handlebarObjects = {
        data: []
    };

    $("article").each(function(i, element) {
        var title = $(this).find("h2").text().trim();
        var brief = $(this).find("p.summary").text();
        var date = $(this).find("time.dateline").text();
        var link = $(this).find("a.story-link").attr("href");
        var imgLink = $(this).find("img").attr("src");

        handlebarObjects.data.push({
            title: title,
            brief: brief,
            date: date,
            link: link,
            imgLink: imgLink
        });
    });

    res.render("scrape", handlebarObjects);
    });
});


app.post("/saveArticle", function(req,res){
    //console.log(req.body);

    article.findOne({'link': req.body.link}, function(err, articleRecord){
        if(err) {
            console.log(err);
        } else {
            if(articleRecord == null) {
                article.create(req.body, function(err, record) {
                    if(err) {console.log(err);}
                    console.log("Record Added");
                });
            } else {
                console.log("No Record Added");
            }
        }
    });
});

//delete unwanted article for mongoDB
app.post("/deleteArticle/:id", function(req, res){
    //console.log(req);
    article.remove({'_id': req.params.id})
    .exec(function(err, data){
        if(err){
            console.log(err);
        } else {
            console.log("Article deleted");
        }
    }); 
});

//listening
app.listen(PORT, function(){
    console.log("Listening on port: " + PORT);
});