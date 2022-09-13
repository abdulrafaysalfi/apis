const express = require("express");

// Intializing express server
const app = express();

// database Connection
require("./startup/db")();
require("./startup/routes")(app);

// Port Listening
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
