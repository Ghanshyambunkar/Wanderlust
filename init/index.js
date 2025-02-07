const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js");

main()
.then(()=>{
    console.log("Connected to DB..");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://bunkarghanshyam3:J3R9D7YXEGTkQySr@cluster0.cmyc7.mongodb.net/');
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"67a5c53e57edd2c9f78baa83"}));
    await Listing.insertMany(initdata.data);
    console.log("data was initialized..");
};

initDB();