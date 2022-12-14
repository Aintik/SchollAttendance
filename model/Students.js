const { Schema, model } = require("mongoose");
function getDate() {
  const now = new Date();
  now.setHours(now.getHours(), 0, 0, 0)
  return now
}
module.exports = model(
  "Students",
  Schema({
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: Number,
    ParentsPhoneNumber: {
      mother: Number,
      father: Number,
    },
    password: String,
    totalScore: Number,
    attendance: [
      {
        status: Boolean,
        date: {
          type: Date,
          default: getDate(),
        },
        reason: String,
        score: Number,
      },
    ],
  })
);
