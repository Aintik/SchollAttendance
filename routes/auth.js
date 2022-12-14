const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Students = require("../model/Students");
const Teachers = require("../model/Teachers");

/* Auntificate Student token. */
router.get("/student", async function (req, res, next) {
  const { email, password } = req.body;
  const student = await Students.findOne({ email });
  let message = "ok";
  let token;
  if (student) {
    const isCorrect = await bcrypt.compare(password, student.password);
    if (isCorrect) {
      token = jwt.sign(
        { id: student._id },
        process.env.tokenKey || "privateKey"
      );
      message = "You are logged";
    } else message = "password is incorrect";
  } else message = "User is not found";
  res.json({ message, token });
});

/* Auntificate Teacher */
router.get("/teacher", async function (req, res, next) {
  const { email, password } = req.body;
  const teacher = await Teachers.findOne({ email });
  let message = "ok";
  let token;
  if (teacher) {
    const isCorrect = await bcrypt.compare(password, teacher.password);
    if (isCorrect) {
      token = jwt.sign(
        { id: teacher._id },
        process.env.tokenKey || "privateKey"
      );
      message = "You are logged";
    } else message = "password is incorrect";
  } else message = "User is not found";
  res.json({ message, token }).status(200);
});

module.exports = router;
