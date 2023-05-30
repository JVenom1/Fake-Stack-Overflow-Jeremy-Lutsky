import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

var isEmpty = function (str) {
  return str.length <= 1;
};
var invalidLink = function (str) {
  var array = str.split(/\[(.*?)\]\((.*?)\)/g);
  for (var i = 2; i < array.length; i += 3) {
    if (array[i].indexOf("https://") != 0 && array[i].indexOf("http://") != 0) {
      return true;
    }
  }
  return false;
};
export default function AnswerForm({
  questionIndex,
  thisQuestion,
  changePage,
}) {
  const [questionList, setQuestionList] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [answerList, setAnswerList] = useState([]);
  const data = async () => {
    let questions = await api.get("/questions");
    let tags = await api.get("/tags");
    let answers = await api.get("/answers");
    setQuestionList(questions.data.questions);
    setTagList(tags.data.tags);
    setAnswerList(answers.data.answers);
  };
  console.log(questionList);
  console.log(thisQuestion);
  let makeAnswer = async function (elements) {
    let answerObject = {
      ans_by: elements[0],
      text: elements[1],
    };

    return answerObject;
  };
  async function submitForm() {
    for (var i = 1; i < 3; i++) {
      document.getElementById("aerror" + i).style.display = "none";
    }
    var outputCheck1 = document.getElementById("af1").value;
    var outputCheck2 = document.getElementById("af2").value;
    if (isEmpty(outputCheck1)) {
      document.getElementById("aerror1").style.display = "block";
    } else if (isEmpty(outputCheck2) || invalidLink(outputCheck2)) {
      document.getElementById("aerror2").style.display = "block";
    } else {
      let elements = [outputCheck1, outputCheck2];
      let newAnswer = axios.post("http://localhost:8000/postAnswer", {
        answer: await makeAnswer(elements),
        question: thisQuestion,
      });
      console.log(newAnswer);
      changePage.answer(questionIndex);
    }
  }
  return (
    <form style={{ marginLeft: "20px", height: "100%" }}>
      <h3>Username*</h3>
      <input type="text" style={{ width: "1000px" }} name="af" id="af1" />
      <p style={{ color: "red", display: "none" }} id="aerror1">
        Invalid Input
      </p>
      <h3>Answer Text*</h3>
      <textarea rows="7" style={{ width: "100%" }} name="af" id="af2">
        {" "}
      </textarea>
      <p style={{ color: "red", display: "none" }} id="aerror2">
        Invalid Input
      </p>
      <button
        type="button"
        id="afsubmit"
        onClick={submitForm}
        style={{ backgroundColor: "blue", color: "white" }}
      >
        Post Answer
      </button>
    </form>
  );
}
