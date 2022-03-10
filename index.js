const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const IndexRoutes = require("./routes/IndexRoutes");
const UserRoutes = require("./routes/UsersRoutes");

// Intializing express server
const app = express();

// Middlewares
dotenv.config();
app.use(express.json());
app.use(cors());

app.use("/", IndexRoutes);
app.use("/api/users", UserRoutes);

// database Connection
mongoose.connect(process.env.DB_CONNECT, (err, result) => {
  if (err) {
    console.log("Connection Failed.");
    console.log(err);
  } else {
    console.log("Database Connection Successful.");
  }
});

// Port Listening
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
