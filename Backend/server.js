import express from "express";
import  dotenv  from "dotenv";
const app = express()
dotenv.config();
const port = process.env.PORT;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`server start on ${port}`)
})

