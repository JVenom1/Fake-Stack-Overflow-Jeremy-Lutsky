// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.

const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.get("/questions", async (req, res) => {
  let questions = await QuestionSchema.find({});
  res.status(200).json({ mssg: "welcome to the app", questions: questions });
});

app.get("/tags", async (req, res) => {
  let tags = await TagSchema.find({});
  res.status(200).json({ mssg: "welcome to the app", tags: tags });
});

app.get("/answers", async (req, res) => {
  let answers = await AnswerSchema.find({});
  res.status(200).json({ mssg: "welcome to the app", answers: answers });
});

app.post("/postQuestion", async (req, res) => {
  console.log(req.body);
  let qstn = new QuestionSchema(req.body);
  await qstn.save();
});

app.post("/postAnswer", async (req, res) => {
  console.log(req.body);
  let ans = new AnswerSchema(req.body.answer);
  await ans.save();
  let questionId = req.body.question._id;
  let theQuestion = await QuestionSchema.findById(questionId);
  theQuestion.answers.push(ans);
  await theQuestion.save();
});

app.post("/postTag", async (req, res) => {
  console.log("Posted tag");
  let tg = new TagSchema(req.body);
  await tg.save();
  res.status(200).json({ tagId: tg });
});

app.post("/increment", async (req, res) => {
  let question = await QuestionSchema.findById(req.body.qid);
  question.views++;
  await question.save();
});

const server = app.listen(8000, () => console.log("Server ready"));
process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Process terminated");
  });
});

var mongoose = require("mongoose");
var QuestionSchema = require("./models/questions.js");
var TagSchema = require("./models/tags.js");
var AnswerSchema = require("./models/answers.js");
var mongoDB = "mongodb://127.0.0.1:27017/fake_so";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
