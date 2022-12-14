const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Teachers = require("../model/Teachers");
const Students = require("../model/Students");

/* List All groups */
router.get("/", async function (req, res, next) {
  const data = await Teachers.findById(req.user.id, "group");
  res.json(data);
});

/* Show teacher profile */
router.get("/profile", async function (req, res, next) {
  const data = await Teachers.findById(req.user.id);
  res.json(data);
});

/* Edit email and Passord */
router.put("/profile", async function (req, res, next) {
  const { email, password, oldPassword } = req.body;
  const isExist = Boolean(await Teachers.findOne({ email }));
  let message;
  if (isExist) message = "Email already exists";
  else {
    let data = await Teachers.findById(req.user.id);
    const isCorrect = await bcrypt.compare(oldPassword, data.password);
    if (isCorrect) {
      const hash = await bcrypt.hash(password, 10);
      data = await Teachers.findByIdAndUpdate(req.user.id, {
        email,
        password: hash,
      });
    } else message = "Password is incorrect";
  }
  res.json({ data, message });
});

/* Show one Group and Students */
router.get("/group/:idGroup", async function (req, res, next) {
  const teacher = await Teachers.findById(req.user.id, "group");
  const data = teacher.group.find((item) => item._id == req.params.idGroup);
  res.json(data);
});

/* 	Update one Group attendance */
router.put("/group/:idGroup", async function (req, res, next) {
  //req.body:  [{ idStudent, attendance },...]

  const { array } = req.body;
  array.map(async (item) => {
    const time = item.date || new Date();
    time.setHours(time.getHours(), 0, 0, 0);
    const isExist = await Students.findOneAndUpdate({ _id: item.idStudent, "attendance.date": time }, {
      $pull: { attendance: { date: time } },
      $inc: {totalScore: -item.score}
    });
    const updating = await Students.findByIdAndUpdate(item.idStudent, {
      $push: { attendance: item.attendance },
      $inc: { totalScore: item.score }
    });
  });
  res.send("success");
});

module.exports = router;
