import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouters from "./routes/authRouter.js";
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRouter.js";
dotenv.config();
const allowedOrigins = [
  'http://localhost:5173',
  'https://finear-finance-expense-tracker.vercel.app' // Jo error mein origin aa raha hai usay bhi add karein
];
const app = express()
const port = process.env.PORT;
//db connection
connectDB();

app.use(express.json());
app.use("/uploadImages", express.static("uploadImages"));
app.use(cookieParser());
app.use(cors({
  origin: function (origin, callback) {
    // Agar request local ho (bina origin ke, like Postman) ya allowed list mein ho
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS blocked this request!'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.get('/', (req, res) => {
  res.json({message:"server connect"});
});
app.use("/authSystem", authRouters);
app.use("/dashboard",userRouter );
app.listen(port, () => {
  console.log(`server start on ${port}`)
})

