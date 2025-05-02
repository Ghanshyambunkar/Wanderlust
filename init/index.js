const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js");

main()
.then(()=>{
    console.log("Connected to DB..");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://ghanshyambunkar016:VQmVV6TftYNLhvPC@cluster0.mk7bd.mongodb.net/');
}

const initDB=async()=>{
    // await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"67a5eb18570d9c9fc0cadc60"}));
    await Listing.insertMany(initdata.data);
    console.log("data was initialized..");
};

initDB();