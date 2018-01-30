var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    methodOverride  = require("method-override"),
    seedDB          = require("./seeds"),
    moment          = require("moment"),
    NodeGeocoder    = require("node-geocoder");
//Requiring Routes
var commentRoutes    = require ("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index");


mongoose.connect(process.env.DATABASEURL);
// mongoose.connect("mongodb://christopher:chris14@ds119078.mlab.com:19078/campup");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.locals.moment = require('moment');
app.use(flash());
// seedDB(); // seed the database
app.use(express.static(__dirname + "/public"));

// Passport Configuration
app.use(require("express-session")({
    secret:"the power of three will set us free",
    resave:false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.get("/", function(req,res){
   res.render("landing"); 
});

app.use(indexRoutes);
app.use("/campground/:id/comments",commentRoutes);
app.use("/campground", campgroundRoutes);

//  LISTEN Port / enviroment variable
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("YelpCamp Sever has started!"); 
});