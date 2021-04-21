import React, { useState } from "react";
import "./Question.css";
function Question(props) {
  const [selectedOption, setSelectedOption] = useState(null);
  function optionClicked(optionText) {
    console.log(optionText);
    setSelectedOption(optionText);
    props.updateAnsHook(props.questionNo, optionText);
  }
  console.log("ans info", props.ansInfo);

  var selectedClass = "btn-selected ";
  var h1Class = "";
  if (props.ansInfo) {
    selectedClass = props.ansInfo.correct ? "" : "wrong";
    h1Class = props.ansInfo.correct ? "h1-right" : "h1-wrong";
  }
  return (
    <div className={"question-wrapper"}>
      <h3>Question no: {props.questionNo + 1}</h3>
      <h1 className={h1Class}>
        Q:{" "}
        {props.questionStatement
          .replaceAll("&quot;", '"')
          .replaceAll("&#039;", "'")}
      </h1>
      <div className="options">
        {props.options.map((e, i) => {
          return (
            <button
              className={
                (selectedOption === e ? selectedClass : "") +
                (props.ansInfo !== false && props.ansInfo.ans === e
                  ? "right"
                  : "")
              }
              disabled={
                selectedOption !== e &&
                selectedOption !== null &&
                props.ansInfo === false
              }
              key={i}
              onClick={() => optionClicked(e)}
            >
              {e.replaceAll("&quot;", '"').replaceAll("&#039;", "'")}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Question;
