// REQUIREMENTS
const path = require("path");

const express = require("express");
require("dotenv").config();
const morgan = require("morgan");

const dbConnection = require("./config/database");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMidleware");
const categoryRoute = require("./Routes/categoryRoute");
const subCategoryRoute = require("./Routes/subCategoryRoute");
const brandRoute = require("./Routes/brandRoute");
const productRoute = require("./Routes/productRoute");
// VARIABLES
const app = express();
const port = process.env.PORT || 8080;

// * CONNECTION TO DB
dbConnection();

//#region MIDDLEWARES
// MODE
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Mode : ${process.env.NODE_ENV}`);
}
// BODY PARSER
app.set("query parser", "extended"); // * To allow nested query objects like ?price[gt]=100
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
//#endregion

//  ROUTES
app.use("/categories", categoryRoute);
app.use("/subcategories", subCategoryRoute);
app.use("/brands", brandRoute);
app.use("/products", productRoute);
app.all("/{*path}", (req, res, next) => {
  next(new ApiError(`Can't find ${req.originalUrl} on this server!`, 400));
});

//  GLOBAL ERROR HANDLER
app.use(globalError);

//  LISTEN TO SERVER
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Handle Rejections outside express
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down server...`);
    process.exit(1);
  });
});
