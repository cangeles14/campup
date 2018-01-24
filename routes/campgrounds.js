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
//CREATE
router.post("/", middleware.isLoggedIn, function(req,res){
  var name = req.body.name;
  var price = req.body.price;
  var desc = req.body.description;
  var image = req.body.image;
  var author = {
      id: req.user._id,
      username: req.user.username,
  };
  geocoder.geocode(req.body.location, function (err, data){
      var lat = data[0].latitude;
      var lng = data[0].longitude;
      var location = data[0].formattedAddress;
      var newCampground = {name: name, price: price, image: image, description: desc, author: author, location: location, lat: lat, lng: lng};
      Campground.create(newCampground, function(err, newlyCreated){
          if (err || data.status === 'ZERO_RESULTS'){
              req.flash('error', 'Invalid address, trying typing a new address');
              return res.redirect('back');
          } else {
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

router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
    // geocoder.geocode(req.body.campground.location, function (err, data){
    //     var lat = data[0].latitude;
    //     var lng = data[0].longitude;
    //     var location = data[0].formattedAddress;
        var newCampground = {name: req.body.campground.name, price: req.body.campground.price, image: req.body.campground.image, description: req.body.campground.desc, author: req.body.campground.author, location: req.body.campground.location, lat: req.body.campground.lat, lng: req.body.campground.lng};    
        Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
          if (err){
              req.flash('error', 'Invalid address, trying typing a new address');
              return res.redirect('back');
          } else {
              res.redirect("/campground/" + req.params.id);
          }
        });
    });
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
