require("dotenv").config();
const express = require("express")
const app = express();
const port = 3003;     
const mongoose = require("mongoose")
const AdminRoute=require("./Routes/adminRoute")
const UserRoute=require("./Routes/userRoute")
          

const mongoDB = "mongodb://localhost:27017/Fullstack-music-app";

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);             
  console.log("mongoDB connected");
}       


app.use(express.json());          
app.use("/api/admin", AdminRoute);
app.use("/api/users",UserRoute)

  
app.listen(port, (err) => {    
    if (err) {     
      console.log(`error detected ${err}`);
    }
    console.log(`server is running on port${port}`);
  });
