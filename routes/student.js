const express = require("express");
const router = express.Router();
const Students = require("../model/Students");

/* Give all attends to student and top 3 students in totalScore */
router.get("/", async function (req, res, next) {
  const myAttendance = await Students.findById(req.user.id, "attendance");
  const top3 = []
  const arrayOfTop = await Students.find({}).sort({ totalScore: -1 }).limit(3)
  arrayOfTop.forEach(item => {
    top3.push({
      name: item.firstName + " " + item.lastName,
      totalScore: item.totalScore
    })
  })
  res.json({ myAttendance: myAttendance.attendance, top3 });
});

module.exports = router;
