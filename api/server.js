const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();
var cors = require("cors");
var _ = require("lodash");
const port = 8000;
app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
var questions = [];
var answers = [];
app.get("/", async (req, res) => {
  console.log("came");
  var data = await fetchQuestions();
  questions = data["questions"];
  answers = data["answers"];
  res.send(questions);
});

app.post("/checkAnswers", (req, res) => {
  var clientAnswers = req.body.answers;
  console.log(clientAnswers);
  var correctAnswersCheck = [];
  for (var i = 0; i < clientAnswers.length; i++) {
    var ans = clientAnswers[i];
    console.log("client", ans);
    var actualAns = _.find(answers, (o) => o.key === ans.questionNo);
    console.log("actual", actualAns);
    if (actualAns.answer === ans.ans) {
      correctAnswersCheck.push({
        questionNo: ans.questionNo,
        correct: true,
        ans: actualAns.answer,
      });
    } else {
      correctAnswersCheck.push({
        questionNo: ans.questionNo,
        correct: false,
        ans: actualAns.answer,
      });
    }
  }

  console.log(correctAnswersCheck);
  res.send(correctAnswersCheck);
});
app.listen(port, () => {
  console.log(`quiz app listening on port ${port}!`);
});

async function fetchQuestions() {
  const res = await axios.get("https://opentdb.com/api.php?amount=5");
  const allData = res.data["results"];
  var questions_ = [];
  var answers_ = [];
  for (var i = 0; i < allData.length; i++) {
    var data = allData[i];
    var question = {
      key: i,
      difficulty: data["difficulty"],
      category: data.category,
      question: data.question,
      choices: [...data.incorrect_answers, data.correct_answer]
        .map((a) => ({ sort: Math.random(), value: a }))
        .sort((a, b) => a.sort - b.sort)
        .map((a) => a.value),
    };
    questions_.push(question);
    answers_.push({
      key: i,
      answer: data["correct_answer"],
    });
  }

  return {
    questions: questions_,
    answers: answers_,
  };
}
