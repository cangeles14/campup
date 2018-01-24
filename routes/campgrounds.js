var express    = require("express");
var router     = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var NodeGeocoder   = require("node-geocoder");
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
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  var price = req.body.price;
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || data.status === 'ZERO_RESULTS') {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newCampground = {name: name, image: image, description: desc, price: price, author:author, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campground");
        }
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
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, price: req.body.price, location: location, lat: lat, lng: lng};
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
// // UPDATE CAMPGROUND ROUTE
// router.put("/:id",middleware.checkCampgroundOwnership, function(req, res){
//     // find and update the correct campground
//     geocoder.geocode(req.body.campground.location, function (err, data){
//         var lat = data[0].latitude;
//         var lng = data[0].longitude;
//         var location = data[0].formattedAddress;
//     Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
//       if(err){
//           res.redirect("/campground");
//       } else {
//           //redirect somewhere(show page)
//           res.redirect("/campground/" + req.params.id);
//       }
//     });
// });





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
