module.exports.isLoggedIn = (req,res,next)=>{
    req.session.saveRedirectUrl = req.originalUrl;
    if (!req.isAuthenticated()){
        req.flash("error", "You must be Logged In!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if (req.session.saveRedirectUrl){
        res.locals.redirectUrl = req.session.saveRedirectUrl;
    }
    next();
};
