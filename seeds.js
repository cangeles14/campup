var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "Cloud's rest", 
        image:"https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?auto=format&fit=crop&w=1650&q=80",
        description: "Lorem ipsum dolor sit amet, id neque nulla, nunc dui urna egestas elit, elit at mollis non. Ipsum vestibulum nonummy neque a justo, vel wisi nec mi, integer feugiat lorem vestibulum est, integer quam, mattis in tellus non dui. Laoreet ante sed a. Lacus pede faucibus adipiscing tellus. Ac hendrerit elit risus sodales egestas mattis, metus velit condimentum risus imperdiet est morbi, purus neque, vitae odio ornare et adipiscing etiam, est ultrices. Quis at voluptates et in velit neque, justo condimentum nostra orci pretium. Venenatis et est nisl vivamus nisl mauris, massa velit fringilla odio suspendisse lacus nisl, primis vel arcu vitae nam tortor, sapien vestibulum habitant lorem, adipiscing porta vivamus etiam. Nec dolor nulla, molestie ut metus vitae sit, libero tristique, curabitur sit, vel tellus"
    },
    {
        name: "Ridge Peak", 
        image:"https://images.unsplash.com/photo-1484960055659-a39d25adcb3c?auto=format&fit=crop&w=1650&q=80",
        description: "Lorem ipsum dolor sit amet, id neque nulla, nunc dui urna egestas elit, elit at mollis non. Ipsum vestibulum nonummy neque a justo, vel wisi nec mi, integer feugiat lorem vestibulum est, integer quam, mattis in tellus non dui. Laoreet ante sed a. Lacus pede faucibus adipiscing tellus. Ac hendrerit elit risus sodales egestas mattis, metus velit condimentum risus imperdiet est morbi, purus neque, vitae odio ornare et adipiscing etiam, est ultrices. Quis at voluptates et in velit neque, justo condimentum nostra orci pretium. Venenatis et est nisl vivamus nisl mauris, massa velit fringilla odio suspendisse lacus nisl, primis vel arcu vitae nam tortor, sapien vestibulum habitant lorem, adipiscing porta vivamus etiam. Nec dolor nulla, molestie ut metus vitae sit, libero tristique, curabitur sit, vel tellus"
    },
    {
        name: "Treetop's sunset", 
        image:"https://images.unsplash.com/photo-1502218808493-e5fd26249efc?auto=format&fit=crop&w=1650&q=80",
        description: "Lorem ipsum dolor sit amet, id neque nulla, nunc dui urna egestas elit, elit at mollis non. Ipsum vestibulum nonummy neque a justo, vel wisi nec mi, integer feugiat lorem vestibulum est, integer quam, mattis in tellus non dui. Laoreet ante sed a. Lacus pede faucibus adipiscing tellus. Ac hendrerit elit risus sodales egestas mattis, metus velit condimentum risus imperdiet est morbi, purus neque, vitae odio ornare et adipiscing etiam, est ultrices. Quis at voluptates et in velit neque, justo condimentum nostra orci pretium. Venenatis et est nisl vivamus nisl mauris, massa velit fringilla odio suspendisse lacus nisl, primis vel arcu vitae nam tortor, sapien vestibulum habitant lorem, adipiscing porta vivamus etiam. Nec dolor nulla, molestie ut metus vitae sit, libero tristique, curabitur sit, vel tellus"
    },
];


function seedDB(){
    // remove all campgrounds
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds");
            data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err);
                } else {
                    console.log("Added a campground");
                    // create a comment
                    Comment.create(
                        {
                            text:"This place is great, but i wish I had internet",
                            author:"Homer",
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                            campground.comments.push(comment);
                            campground.save();
                            console.log("created new comment");
                            }
                        });
                }
            });
        });
    });
}


module.exports = seedDB;