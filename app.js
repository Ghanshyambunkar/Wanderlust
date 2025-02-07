if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

const dburl='mongodb+srv://bunkarghanshyam3:J3R9D7YXEGTkQySr@cluster0.cmyc7.mongodb.net/';

main()
.then(()=>{
    console.log("Connected to DB..");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dburl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const stote=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

stote.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
});

const sessionOptinos={
    stote,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    },
};

app.get("/",async(req,res)=>{
    res.redirect("./listings");
});

app.use(session(sessionOptinos));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Faund!"));
});

app.use((err,req,res,next)=>{
    let{StatusCode=500,message="Somting went wrong!"}=err;
    res.status(StatusCode).render("error.ejs",{message});
    // res.status(StatusCode).send(message);
});

app.listen(8080,()=>{
    console.log("Server is listening on port 8080");
});
