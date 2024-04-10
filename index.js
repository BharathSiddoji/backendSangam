const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const { PORT, MONGO_URI } = process.env;
const authRouter = require("./Routes/authRoute");
const memberRoute = require("./Routes/membersRoute");
const cookieParser = require("cookie-parser");
const activeMembers_router = require("./Routes/activeMembersRoute");
const app = express();

mongoose.connect(MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`on localhost:8000`, `connected to db`);
  });
});
app.use(cors({
  origin: ["https://final-aya5.onrender.com/"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  exposedHeaders: ["set-cookie"],
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get('/',(req,res)=>{
  res.status(200).json({message:"server is working"})
})
app.use("/", authRouter);
app.use("/", memberRoute);
app.use('/',activeMembers_router)
app.all("*", (req, res) => {
  res.status(404).send("<h1>404! Page not found</h1>");
});
