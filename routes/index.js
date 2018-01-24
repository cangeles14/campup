var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
//Register
router.get("/register", function(req,res){
    res.render("register");
});
// Sign Up
router.post("/register", function(req,res){
    var newUser = new User({username:req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            req.flash("error", err.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req,res, function(){
            req.flash("success", "Welcome to CampUp " + user.username);
            res.redirect("/campground");
        });
    });
});
// Login
router.get("/login", function(req,res){
    res.render("login");
});
// Login Logic
router.post("/login", passport.authenticate("local", 
{
    successRedirect: "/campground",
    failureRedirect: "/login",
}) , function(req,res){
});
// Logout Logic
router.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "Logged out you");
    res.redirect("/campground");
});
//Exports
module.exports = router;