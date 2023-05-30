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
var wordCount = function (str) {
  return str.split(" ").length;
};
var longWords = function (str) {
  var array = str.split(" ");

  if (array.length > 5) {
    return true;
  }
  for (var i = 0; i < array.length; i++) {
    if (array[i].length > 10) {
      return true;
    }
  }
  return false;
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

export default function QuestionForm({ changePage, tagList }) {
  let makeTag = function (str) {
    let tagObject = {
      name: str,
    };
    return tagObject;
  };
  let findTag = async function (str) {
    console.log("finding tag");
    for (var i = 0; i < tagList.length; i++) {
      if (str === tagList[i].name) {
        console.log("found tag");
        return tagList[i]._id;
      }
    }
    console.log("before");
    let response = await axios.post(
      "http://localhost:8000/postTag",
      makeTag(str)
    );
    return response.data.tagId._id;
  };
  let makeQuestion = async function (elements) {
    let tagsArray = [];
    console.log(elements[2].split(" "));
    for (let tag of elements[2].split(" ")) {
      console.log("Pushing tag");
      console.log(tag);
      tagsArray.push(await findTag(tag));
    }
    let questionObject = {
      title: elements[0],
      text: elements[1],
      tags: tagsArray,
      answers: [],
      asked_by: elements[3],
    };

    return questionObject;
  };
  async function submitForm() {
    for (var i = 1; i < 5; i++) {
      document.getElementById("qerror" + i).style.display = "none";
    }
    var inputCheck1 = document.getElementById("qf1").value;
    var inputCheck2 = document.getElementById("qf2").value;
    var inputCheck3 = document.getElementById("qf3").value;
    var inputCheck4 = document.getElementById("qf4").value;

    if (isEmpty(inputCheck1) || inputCheck1.length >= 100) {
      document.getElementById("qerror1").style.display = "block";
    } else if (isEmpty(inputCheck2) || invalidLink(inputCheck2)) {
      document.getElementById("qerror2").style.display = "block";
    } else if (
      isEmpty(inputCheck3) ||
      wordCount(inputCheck3) > 10 ||
      longWords(inputCheck3)
    ) {
      document.getElementById("qerror3").style.display = "block";
    } else if (isEmpty(inputCheck4)) {
      document.getElementById("qerror4").style.display = "block";
    } else {
      let elements = [inputCheck1, inputCheck2, inputCheck3, inputCheck4];
      console.log(elements);
      console.log("making question");
      axios.post(
        "http://localhost:8000/postQuestion",
        await makeQuestion(elements)
      );
      changePage.main();
    }
  }
  return (
    <form style={{ marginLeft: "20px", height: "100%" }}>
      <h3>Question Title*</h3>
      <p>Limit the title to 100 characters or less</p>
      <input type="text" style={{ width: "1000px" }} name="qf" id="qf1" />
      <p style={{ color: "red", display: "none" }} id="qerror1">
        Invalid Input
      </p>
      <h3>Question text*</h3>
      <p>Add details</p>
      <textarea rows="5" style={{ width: "100%" }} name="qf" id="qf2">
        {" "}
      </textarea>
      <p style={{ color: "red", display: "none" }} id="qerror2">
        Invalid Input
      </p>
      <h3>Tags*</h3>
      <p>Add key words seperated by white spaces</p>
      <input type="text" style={{ width: "1000px" }} name="qf" id="qf3" />
      <p style={{ color: "red", display: "none" }} id="qerror3">
        Invalid Input
      </p>
      <h3>Username*</h3>
      <input type="text" style={{ width: "1000px" }} name="qf" id="qf4" />
      <p style={{ color: "red", display: "none" }} id="qerror4">
        Invalid Input
      </p>
      <h1></h1>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <button
          type="button"
          id="qfsubmit"
          onClick={submitForm}
          style={{ backgroundColor: "blue", color: "white" }}
        >
          Post Question
        </button>
        <p style={{ color: "red", marginLeft: "60%" }}>
          *indicates mandatory field
        </p>
      </div>
    </form>
  );
}
