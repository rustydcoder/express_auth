const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// set up mongoose
mongoose.connect(
  process.env.MONGODB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Mongodb connection established");
  }
);

// middlewares
app.use(bodyParser.json());
app.use(cors());

// set routes
const userRoute = require("./routes/userRouter");

app.use("/users", userRoute);

// startup server
app.listen(PORT, () => console.log(`server running on ${PORT}`));
