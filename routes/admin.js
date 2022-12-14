const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Teachers = require("../model/Teachers");
const Students = require("../model/Students");

router.get("/", function (req, res, next) {
  res.send("admin");
});

//List all teachers
router.get("/teachers", async function (req, res, next) {
  const allTeachers = await Teachers.find({});
  res.json(allTeachers).status(201);
});

//One teacher
router.get("/teachers/:id", async function (req, res, next) {
  const data = await Teachers.findById(req.params.id);
  res.json(data).status(201);
});

//Create a teacher
router.post("/teachers", async function (req, res, next) {
  const isExists = Boolean(await Teachers.findOne({ email: req.body.email }));
  let data;
  if (isExists) data = { message: "Email already exists" };
  else {
    const hash = await bcrypt.hash(req.body.password, 10);
    data = await Teachers.create({ ...req.body, password: hash });
  }
  res.json(data).status(201);
});

//Remove a teacher
router.delete("/teachers/:id", async function (req, res, next) {
  const data = await Teachers.findByIdAndDelete(req.params.id);
  res.json(data).status(201);
});

//Edit a teacher
router.put("/teachers/:id", async function (req, res, next) {
  const isExists = Boolean(await Teachers.findOne({ email: req.body.email }));
  let data;
  if (isExists) data = { message: "Email already exists" };
  else {
    const hash = await bcrypt.hash(req.body.password, 10);
    data = await Teachers.findByIdAndUpdate(req.params.id, { ...req.body, password: hash });
  }
  res.json(data).status(201);
});

//List All groups
router.get("/teachers/:idTeacher/groups", async function (req, res, next) {
  const data = await Teachers.findById(req.params.idTeacher, "group");
  res.json(data).status(201);
});

//One group
router.get(
  "/teachers/:idTeacher/groups/:idGroup",
  async function (req, res, next) {
    const teacher = await Teachers.findById(req.params.idTeacher, "group");
    const data = teacher.group.find((item) => item._id == req.params.idGroup);
    res.json(data).status(201);
  }
);

//Add a group
router.post("/teachers/:idTeacher/groups", async function (req, res, next) {
  const data = await Teachers.findByIdAndUpdate(req.params.idTeacher, {
    $push: { group: req.body },
  });
  res.json(data).status(201);
});

//Edit a group
router.put(
  "/teachers/:idTeacher/groups/:idGroup",
  async function (req, res, next) {
    const data = await Teachers.findOneAndUpdate(
      {
        _id: req.params.idTeacher,
        "group._id": req.params.idGroup,
      },
      {
        $set: {
          "group.$.title": req.body.title,
          "group.$.time": req.body.time,
        },
      }
    );
    res.json(data).status(201);
  }
);

//Delete a group
router.delete(
  "/teachers/:idTeacher/groups/:idGroup",
  async function (req, res, next) {
    const data = await Teachers.findByIdAndUpdate(req.params.idTeacher, {
      $pull: { group: { _id: req.params.idGroup } },
    });
    res.json(data).status(201);
  }
);

//List all students
router.get("/students", async function (req, res, next) {
  const data = await Students.find({});
  res.json(data).status(201);
});

//One student
router.get("/students/:id", async function (req, res, next) {
  const data = await Students.findById(req.params.id);
  res.json(data).status(201);
});

//Create a student
router.post("/students", async function (req, res, next) {
  const isExists = Boolean(await Students.findOne({ email: req.body.email }));
  let data, hash;
  if (isExists) data = { message: "Email already exists" };
  else {
    if(req.body.password) hash = await bcrypt.hash(req.body.password, 10);
    data = await Students.create({ ...req.body, password: hash });
  }
  res.json(data).status(201);
});

//Remove a student
router.delete("/students/:id", async function (req, res, next) {
  const data = await Students.findByIdAndDelete(req.params.id);
  res.json(data).status(201);
});

//Edit a student
router.put("/students/:id", async function (req, res, next) {
  const isExists = Boolean(await Students.findOne({ email: req.body.email }));
  let data;
  if (isExists) data = { message: "Email already exists" };
  else {
    const hash = await bcrypt.hash(req.body.password, 10);
    data = await Students.findByIdAndUpdate(req.params.id, {
      ...req.body,
      password: hash,
    });
  }
  res.json(data).status(201);
});

//Add student to Teachers group
router.post(
  "/students/manage/:idStudent/:idTeacher/:idGroup",
  async function (req, res, next) {
    const data = await Teachers.findOneAndUpdate(
      {
        _id: req.params.idTeacher,
        "group._id": req.params.idGroup,
      },
      {
        $push: { "group.$.students": req.params.idStudent },
      }
    );

    res.json(data).status(201);
  }
);

//Remove student from Teachers group
router.delete(
  "/students/manage/:idStudent/:idTeacher/:idGroup",
  async function (req, res, next) {
    const data = await Teachers.findOneAndUpdate(
      {
        _id: req.params.idTeacher,
        "group._id": req.params.idGroup,
      },
      {
        $pull: { "group.$.students": req.params.idStudent },
      }
    );

    res.json(data).status(201);
  }
);

module.exports = router;
