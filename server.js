// * REQUIREMENTS
const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const dbConnection = require("./config/database");
const categoryRoute = require("./Routes/categoryRoute");

// * VARIABLES
const app = express();
const port = process.env.PORT || 8080;

// * CONNECTION TO DB
dbConnection();

//#region MIDDLEWARES
// * MODE
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Mode : ${process.env.NODE_ENV}`);
}
// * BODY PARSER
app.use(express.json());

//#endregion

// * ROUTES
app.use("/categories", categoryRoute);

// * LISTEN TO SERVER
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
