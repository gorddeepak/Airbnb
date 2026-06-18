const express = require('express');
const router = express.Router();
const Listing = require("../models/listing.js");
const { ListingSchema, ReviewSchema } = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const {isLoggedIn} = require("../middleware.js")

const validateListing = (req,res,next) => {
    let {error} = ListingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el)=>error.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

//index route
router.get("/", wrapAsync(async(req,res)=> {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

//New Route
router.get("/new", isLoggedIn, wrapAsync(async(req,res)=>{
    res.render("listings/new.ejs");
}));

//Edit Route
router.get("/:id/edit",isLoggedIn, wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if (!listing){
        req.flash("error", "The requested listing does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}));

//Update Route
router.put("/:id",
    isLoggedIn,
    validateListing,
    wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success", "Listing was updated successfully!");
    res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id",isLoggedIn, wrapAsync(async(req,res)=>{
    let {id} = req.params;
    // res.send(req.body.listing)
    const deletedLisitng = await Listing.findByIdAndDelete(id);
    console.log(deletedLisitng);
    req.flash("success", "Listing was deleted successfully!");
    res.redirect("/listings");
}));

//show route 
router.get("/:id", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("review");
    if (!listing){
        req.flash("error", "The requested listing does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}));

//create route
router.post("/",isLoggedIn,
    validateListing, 
    wrapAsync(async(req,res,next)=>{
    const newListing = new Listing(req.body.listing);
    if (!newListing.image || newListing.image.trim() === "") {
        newListing.image = "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09";
    };
    await newListing.save();
    req.flash("success", "Listing was saved successfully!");
    res.redirect("/listings");
}));

module.exports = router;