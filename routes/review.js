const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");

const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js");
const { creatReview, destroyReview } = require("../controllers/reviews.js");

// Reviews
// creat
router.post("/",isLoggedIn,validateReview,wrapAsync(creatReview));

// delete
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(destroyReview));


module.exports=router;