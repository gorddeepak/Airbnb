const express = require('express');
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const router = express.Router();
const {saveRedirectUrl}  = require("../middleware");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",saveRedirectUrl, wrapAsync(async(req,res,next)=>{
    try {
        let {username,email,password} = (req.body)
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if (err) {
                return next(err);
            }
            req.flash("success", "Signed in successfully!");
            res.redirect("/listings"); 
        })
    } catch(error){
        req.flash("error", error.message);
        res.redirect(res.locals.redirectUrl);
    }
}));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",saveRedirectUrl, passport.authenticate("local",{
    failureFlash: true,
    failureRedirect : "/login"
}),async(req,res) =>{
    req.flash("success", "Login successful!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl); 
} );

router.get("/logout",(req,res)=>{
    req.logOut((err)=>{
        if (err){
        next(err);
    };
    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
    });
});


module.exports = router; 