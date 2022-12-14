const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

const mongoose = require("mongoose");
mongoose.connect(process.env.MongoRoute).then((data) => {
  if (!data) console.log("Error with mongoose connection");
  console.log("Connected mongoose");
});

const indexRouter = require("./routes/index");
const adminRouter = require("./routes/admin");
const teacherRouter = require("./routes/teacher");
const studentRouter = require("./routes/student");
const authRouter = require("./routes/auth");
const tokening = require("./middleWare/signIn");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/", indexRouter);
app.use("/admin", adminRouter);
app.use("/auth", authRouter);
app.use("/teacher", tokening, teacherRouter);
app.use("/student", tokening, studentRouter);

app.listen(process.env.PORT || 3000);
