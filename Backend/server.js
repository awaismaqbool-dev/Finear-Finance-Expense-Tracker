import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouters from "./routes/authRouter.js";
import connectDB from "./config/mongodb.js";
dotenv.config();

const app = express()
const port = process.env.PORT;
//db connection
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ 
  origin: "http://localhost:3000",
  credentials: true }));

app.get('/', (req, res) => {
  res.send('Hello From Finear app')
});
app.use("/authSystem", authRouters);
app.listen(port, () => {
  console.log(`server start on ${port}`)
})



