const mongoose = require("mongoose")
const Review = require("./review") 
const Schema = mongoose.Schema

const ListingSchema = new Schema({
    title: {
        type: String,
        required : true,
    },
    description : String,
    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09",
    },
    price: Number,
    location: String,
    country: String,
    review: [
        {
        type: Schema.Types.ObjectId,
        ref: "Review"
    }
    ]
});

ListingSchema.post("findOneAndDelete",async(listing)=>{
    if (listing){
        await Review.deleteMany({_id: {$in: listing.review}});
    }
});

const Listing = mongoose.model("Listing", ListingSchema)
module.exports = Listing


