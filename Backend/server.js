import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouters from "./routes/authRouter.js";
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRouter.js";
dotenv.config();

const app = express()
const port = process.env.PORT;
//db connection
connectDB();

app.use(express.json());
app.use("/uploadImages", express.static("uploadImages"));
app.use(cookieParser());
app.use(cors({ 
  origin: 'http://localhost:5173',
  credentials: true }));

app.get('/', (req, res) => {
  res.json({message:"server connect"});
});
app.use("/authSystem", authRouters);
app.use("/dashboard",userRouter );
app.listen(port, () => {
  console.log(`server start on ${port}`)
})

