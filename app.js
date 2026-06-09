const express = require('express');
const app = express()
const mongoose = require('mongoose');
const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

async function main(){
    await mongoose.connect(MONGO_URL)
}

main().then(()=>{
    console.log("connected to db");
    app.listen(8080,() => {
    console.log("server is listening on port 8080");
});
})

.catch((err)=>{
    console.log(err)
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req, res)=>{
    res.send("Hi, I am root")
});

//index route
app.get("/listings", async(req,res)=> {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});

//New Route
app.get("/listings/new", async(req,res)=>{
    res.render("listings/new.ejs");
})

//Edit Route
app.get("/listings/:id/edit", async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});

//Update Route
app.put("/listings/:id", async(req,res)=>{
    let {id} = req.params;
    // res.send(req.body.listing)
    if (!req.body.listing.image || req.body.listing.image.trim() === "") {
        req.body.listing.image = "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09";
    }
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete("/listings/:id", async(req,res)=>{
    let {id} = req.params;
    // res.send(req.body.listing)
    const deletedLisitng = await Listing.findByIdAndDelete(id);
    console.log(deletedLisitng);
    res.redirect("/listings");
});

//read route
app.get("/listings/:id", async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
})

//create route
app.post("/listings", async(req,res)=>{
    const newListing = new Listing(req.body.listing);
    if (!newListing.image || newListing.image.trim() === "") {
        newListing.image = "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09";
    }
    await newListing.save();
    res.redirect("/listings");
});


app.get("/testingdb", async(req,res) => {
    let sampledata = new Listing({
    title: "Modern Loft in Downtown",
    description: "Stay in the heart of the city in this stylish loft apartment. Perfect for urban explorers!",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=60",
    price: 1200,
    location: "New York City",
    country: "United States",
    });
    await sampledata.save();
    console.log("sample was saved");
    res.send("sample saved");
});

