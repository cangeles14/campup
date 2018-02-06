var express    = require("express");
var router     = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var NodeGeocoder   = require("node-geocoder");
//Image upload requriements 
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter});


require('dotenv').config();
var cloudinary = require('cloudinary');
var cloudinarySecret = process.env.CLOUDINARY_API_SECRET;
cloudinary.config({ 
  cloud_name: 'dicv2dhkg', 
  api_key: '347487287355216', 
  api_secret: cloudinarySecret,
});
// Geocoder
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: 'AIzaSyDOA3nXp9m9GlDiu4A9gjcLdTglfp3YFO4'
};
var geocoder = NodeGeocoder(options);
// INDEX
router.get("/", function(req,res){
    Campground.find({}, function(err, allCampgrounds){
        if (err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});
// NEW
router.get("/new", middleware.isLoggedIn, function(req,res){
   res.render("campgrounds/new"); 
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res){
    var price = req.body.price;
    var name = req.body.name;
    var image = req.body.image ? req.body.image : "/images/temp.png";
    var desc = req.body.description;
    var author = {
      id: req.user._id,
      username: req.user.username
    }; 
    
    geocoder.geocode(req.body.location, function (err, data) {
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
    
        cloudinary.uploader.upload(req.file.path, function(result) {
        // add cloudinary url for the image to the campground object under image property
            image = result.secure_url;
            var newCampground = {name: name, image: image, upload: upload, description: desc, price: price, author:author, location: location, lat: lat, lng: lng};
         
            Campground.create(newCampground, function(err, newlyCreated){
                if(err){
                    req.flash('error', err.message);
                    return res.redirect('back');
                } else {
                    //redirect back to campgrounds page
                    res.redirect("/campground");
                }
            });
        });
    });
});
// SHOW
router.get("/:id", function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
    if(err || !foundCampground){
        console.log(err);
        req.flash("error", "Campground not found");
        res.redirect("back");
    }   else {
        res.render("campgrounds/show", {campground:foundCampground});
        }
    });
});

// EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err) {
            console.log(err);
        } else {
        if(!foundCampground) {
            req.flash("error", "Item not found");
        }
        res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

// UPDATE

// PUT - updates campground in the database
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){


    geocoder.geocode(req.body.location, function (err, data) {
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        var newData = {name: req.body.name, description: req.body.description, price: req.body.price, location: location, lat: lat, lng: lng};
            
            Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
                if(err){
                    req.flash("error", err.message);
                    res.redirect("back");
                } else {
                    req.flash("success","Successfully Updated!");
                    res.redirect("/campground/" + campground._id);
                }
            });
        });
    });

// DESTROY

router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            res.redirect("/campground");
        } else {
            res.redirect("/campground");
        }
    });
});


//Exports
module.exports = router;
