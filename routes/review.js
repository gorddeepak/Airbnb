const express = require('express');
const router = express.Router({mergeParams : true});
const ExpressError = require("../utils/expressError.js");
const { ListingSchema, ReviewSchema } = require("../schema.js");
const Review =  require("../models/review.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");


const validateReview = (req,res,next) => {
    let {error} = ReviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el)=>error.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// post route
router.post("/",
    validateReview,
    wrapAsync(async(req,res,next)=>{
    let listing = await Listing.findById(req.params.listingId);
    let newReview = new Review(req.body.review);
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Review was saved successfully!");
    res.redirect(`/listings/${listing._id}`);
}));

// delete route
router.delete("/:reviewId", wrapAsync(async(req,res,next)=>{
    let {listingId,reviewId} = req.params;
    await Listing.findByIdAndUpdate(listingId,{$pull: {review: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review was deleted successfully!");
    res.redirect(`/listings/${listingId}`);
}));

module.exports = router;