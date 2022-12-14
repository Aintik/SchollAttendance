const { Schema, model } = require("mongoose");
module.exports = model(
  "Teachers",
  Schema({
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: Number,
    password: String,
    subject: String,
    group: [
      {
        title: String,
        time: {
          type: Date
        },
        students: [Schema.ObjectId],
      },
    ],
  })
);
