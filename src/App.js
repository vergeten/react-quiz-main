import "./App.css";
import Question from "./components/Question";
import React, { useState, useEffect } from "react";
import axios from "axios";
import _ from "lodash";

function App() {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [realAnswers, setRealAnswers] = useState([]);

  function updateAnswers(questionNo, ans) {
    setSelectedAnswers((prev) => {
      var q = _.find(prev, (o) => o.questionNo === questionNo);
      if (q) {
        return [
          ..._.remove(prev, (o) => o.questionNo === questionNo),
          { questionNo: questionNo, ans: ans },
        ];
      } else {
        return [...prev, { questionNo: questionNo, ans: ans }];
      }
    });
  }

  function submitQiuz() {
    console.log(selectedAnswers);

    axios
      .post("http://localhost:8000/checkAnswers", { answers: selectedAnswers })
      .then((res) => {
        setRealAnswers(res.data);
      });
  }

  useEffect(() => {
    console.log("se", selectedAnswers);
  }, [selectedAnswers]);
  useEffect(() => {
    axios.get("http://localhost:8000/").then((res) => {
      console.log(res.data);
      setQuestions(res.data);
    });
  }, []);
  return (
    <div className="App">
      {questions.map((q) => {
        return (
          <Question
            key={q.key}
            questionNo={q.key}
            questionStatement={q.question}
            options={q.choices}
            updateAnsHook={updateAnswers}
            ansInfo={_.find(realAnswers, (o) => o.questionNo === q.key) || false}
          />
        );
      })}
      <button onClick={submitQiuz} className={"submitButton"} disabled={questions.length!==selectedAnswers.length}>Submit Quiz</button>
    </div>
  );
}

export default App;
