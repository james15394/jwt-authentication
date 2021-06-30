const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
require("dotenv").config();
require("./helpers/init_mongodb");

const AuthRoute = require("./Routes/Auth.route");
const { verifyAccessToken } = require("./helpers/jwt_helper");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", verifyAccessToken, (req, res, next) => {
  console.log(req.payload);
  res.send(req.payload);
});

app.use("/auth", AuthRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("Server running on port 3000"));
