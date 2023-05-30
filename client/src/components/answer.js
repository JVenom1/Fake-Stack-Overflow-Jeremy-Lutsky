import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;
const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

var showDate = function (date) {
  var monthNames = {
    0: "Jan",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "May",
    5: "Jun",
    6: "Jul",
    7: "Aug",
    8: "Sep",
    9: "Oct",
    10: "Nov",
    11: "Dec",
  };
  var z = function (num) {
    //Properly formats single digit minutes
    if (num < 10) {
      return "0" + num;
    } else {
      return num;
    }
  };
  var today = new Date();
  if (today.getDate() === date.getDate()) {
    if (date.getMinutes() === today.getMinutes()) {
      return today.getSeconds() - date.getSeconds() + " seconds ago";
    } else if (today.getHours() === date.getHours()) {
      return today.getMinutes() - date.getMinutes() + " minutes ago";
    } else {
      return today.getHours() - date.getHours() + " hours ago";
    }
  } else if (today.getFullYear() === date.getFullYear()) {
    return (
      monthNames[date.getMonth()] +
      " " +
      date.getDate() +
      " at " +
      date.getHours() +
      ":" +
      z(date.getMinutes())
    );
  } else {
    return (
      monthNames[date.getMonth()] +
      " " +
      date.getDate() +
      ", " +
      date.getFullYear() +
      " at " +
      date.getHours() +
      ":" +
      z(date.getMinutes())
    );
  }
};

function makeLinks(text) {
  var array = text.split(/\[(.*?)\]\((.*?)\)/g);
  return array.map((part, index) => {
    if (index % 3 === 1) {
      return (
        <a
          style={{ fontSize: "1em" }}
          key={index}
          target="_blank"
          href={array[index + 1]}
        >
          {part}
        </a>
      );
    }
    if (index % 3 === 0) {
      return part;
    }
  });
}

export default function Answer({ numQuestion, changePage }) {
  const [questionList, setQuestionList] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [answerList, setAnswerList] = useState([]);
  const [relevantAnswers, setRelevantAnswers] = useState([]);
  const data = async () => {
    let questions = await api.get("/questions");
    let tags = await api.get("/tags");
    let answers = await api.get("/answers");
    setQuestionList(questions.data.questions);
    setTagList(tags.data.tags);
    setAnswerList(answers.data.answers);
  };
  useEffect(() => {
    data();
  }, []);
  var [page, setPage] = useState();
  let thisQuestion = questionList[numQuestion];
  // console.log(thisQuestion);
  useEffect(() => {
    setPage(<Answer numQuestion={0} />);
  }, [questionList, answerList, tagList]);

  let searchAnswers = async function (questions, answers) {
    let array = [];
    for (var i = 0; i < questions[numQuestion].answers.length; i++) {
      for (var j = 0; j < answers.length; j++) {
        if (questions[numQuestion].answers[i] === answers[j]._id) {
          array.push(answers[j]);
        }
      }
    }
    setRelevantAnswers(array);
  };
  useEffect(() => {
    searchAnswers(questionList, answerList);
  }, [questionList, answerList]);

  function AnswerBox({ text, ansBy, ansDate }) {
    return (
      <div
        style={{
          border: "dotted black",
          height: "150px",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <p style={{ width: "70%" }}>{makeLinks(text)}</p>
        <div style={{ marginTop: "130px" }}>
          <span style={{ color: "green" }}> {ansBy + " "}</span>
          <span> {" answered " + showDate(new Date(ansDate))} </span>
        </div>
      </div>
    );
  }
  function AnswerBoxes() {
    var array = [];
    for (var i = 0; i < relevantAnswers.length; i++) {
      array.push(
        <AnswerBox
          key={i}
          text={relevantAnswers[i].text}
          ansBy={relevantAnswers[i].ans_by}
          ansDate={relevantAnswers[i].ans_date_time}
        />
      );
    }
    return <div>{array}</div>;
  }

  return (
    <div>
      {questionList.length > 0 && answerList.length > 0 && (
        <div>
          <div
            style={{
              marginLeft: "20px",
              marginTop: "20px",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <h3>{thisQuestion.answers.length + " answers"}</h3>
            <h3 style={{ marginLeft: "150px", width: "600px" }}>
              {thisQuestion.title}
            </h3>
            <button
              id="AskQuestionButton"
              onClick={changePage.questionForm}
              style={{
                backgroundColor: "blue",
                color: "white",
                marginLeft: "50px",
                width: "100px",
                height: "50px",
              }}
            >
              Ask Question
            </button>
          </div>
          <div
            style={{
              marginLeft: "20px",
              marginTop: "20px",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <h3>{thisQuestion.views + " views"}</h3>
            <p style={{ marginLeft: "150px", width: "600px" }}>
              {makeLinks(thisQuestion.text)}
            </p>
            <div style={{ marginLeft: "20px", marginTop: "100px" }}>
              <span style={{ color: "red" }}>
                {" "}
                {thisQuestion.asked_by + " "}
              </span>
              <span>
                {" "}
                {"asked " + showDate(new Date(thisQuestion.ask_Date_Time))}{" "}
              </span>
            </div>
          </div>
          <div>
            <AnswerBoxes />
          </div>
          <button
            onClick={() => changePage.answerForm(numQuestion, thisQuestion)}
            style={{
              backgroundColor: "blue",
              color: "white",
              margin: "50px",
              width: "100px",
              height: "50px",
            }}
          >
            Answer Question
          </button>
        </div>
      )}
    </div>
  );
}
