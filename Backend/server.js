import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouters from "./routes/authRouter.js";
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRouter.js";
dotenv.config();
const allowedOrigins = [
  'https://finear-finance-expense-tracker-qcg4.vercel.app',
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
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS Policy block: This origin is not allowed'), false);
    }
    return callback(null, true);
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

