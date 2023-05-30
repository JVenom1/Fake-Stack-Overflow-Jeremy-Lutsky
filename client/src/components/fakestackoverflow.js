import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Answer from "./answer.js";
import QuestionForm from "./questionform.js";
import AnswerForm from "./answerform.js";
import SearchPage from "./searchPage.js";
import TagPage from "./tagPage.js";
import SortedQuestionPage from "./sortedQuestionPage.js";
import SortedSearchPage from "./sortedSearchPage.js";
import "../index.css";

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

export default function FakeStackOverflow() {
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
  useEffect(() => {
    data();
  }, []);
  var [page, setPage] = useState();
  useEffect(() => {
    setPage(<QuestionDisplay />);
  }, [questionList, answerList, tagList]);

  const changePage = {
    main: () => setPage(<QuestionDisplay />),
    answer: (index) => {
      setPage(<Answer numQuestion={index} changePage={changePage} />);
      api.post("/increment", { qid: questionList[index]._id });
    },
    increment: (index) => {
      api.post("/increment", { qid: questionList[index]._id });
    }, //this is to add a view
    questionForm: () =>
      setPage(<QuestionForm changePage={changePage} tagList={tagList} />),
    answerForm: (index, thisQuestion) =>
      setPage(
        <AnswerForm
          questionIndex={index}
          thisQuestion={thisQuestion}
          changePage={changePage}
        />
      ),
    searchpage: (input) =>
      setPage(
        <SearchPage
          input={input}
          questionList={questionList}
          tagList={tagList}
          answerList={answerList}
          changePage={changePage}
        />
      ),
    tagpage: () =>
      setPage(
        <TagPage
          tagList={tagList}
          changePage={changePage}
          questionList={questionList}
        />
      ),
    sortedQuestionPage: (typeSort, toBeSortedArr) =>
      setPage(
        <SortedQuestionPage
          typeSort={typeSort}
          toBeSortedArr={toBeSortedArr}
          tagList={tagList}
          questionList={questionList}
          answerList={answerList}
          changePage={changePage}
        />
      ),

    sortedSearchPage: (typeSort, toBeSortedArr) =>
      setPage(
        <SortedSearchPage
          typeSort={typeSort}
          toBeSortedArr={toBeSortedArr}
          tagList={tagList}
          questionList={questionList}
          answerList={answerList}
          changePage={changePage}
        />
      ),
  };
  function goToSearchPage() {
    console.log("Search Page Activated");
    let input = document.getElementById("search-text").value;
    changePage.searchpage(input);
  }

  function Header() {
    return (
      <div
        id="header"
        className="header"
        style={{
          color: "black",
          backgroundColor: "lightgray",
          height: "15%",
          border: "1px solid black",
          paddingLeft: "50px",
          display: "flex",
          alignItems: "center",
          maxWidth: "100%",
        }}
      >
        <div id="headerText" style={{ marginLeft: "40%" }}>
          <h1 id="FSOText">Fake Stack Overflow</h1>
        </div>
        <div id="search-textDiv" style={{ marginLeft: "20%", padding: "10px" }}>
          <input
            id="search-text"
            type="text"
            placeholder="search..."
            onKeyDown={function (event) {
              if (event.key === "Enter") {
                goToSearchPage();
              }
            }}
          />
        </div>
      </div>
    );
  }
  function changeToQuestions() {
    window.location.reload();
    return changePage.main;
  }
  function Menu() {
    return (
      <div
        id="menu"
        style={{ width: "10%", height: "visible", borderRight: "dotted black" }}
      >
        <br />
        <div className="menu-items-box">
          <a
            className="menu-items"
            href="#"
            id="questionsLink"
            onClick={changeToQuestions}
          >
            Questions
          </a>
        </div>
        <br />
        <div className="menu-items-box">
          <a
            className="menu-items"
            href="#"
            id="tagsLink"
            onClick={changePage.tagpage}
          >
            Tags{" "}
          </a>
        </div>
      </div>
    );
  }
  function QuestionDisplay() {
    function handleClick(index) {
      changePage.answer(index);
      changePage.increment(index);
    }
    var findTag = async function (id) {
      for (var i = 0; i < tagList.length; i++) {
        if (id == tagList[i]._id) {
          return tagList[i].name;
        }
      }
      return "N/A";
    };
    function QuestionTag({ tagName }) {
      const tagStyle = {
        border: "solid black",
        color: "white",
        backgroundColor: "#555555",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: "10px",
        padding: "10px",
      };

      return <div style={tagStyle}>{tagName}</div>;
    }
    function QuestionTags({ question }) {
      const [tags, setTags] = useState([]);

      useEffect(() => {
        const fetchTags = async () => {
          // console.log(tagList);
          const tagPromises = question.tags.map((tagId) =>
            findTag(tagId, tagList)
          );
          const resolvedTags = await Promise.all(tagPromises);
          setTags(resolvedTags);
        };

        fetchTags();
      }, [question.tags]);

      return (
        <div style={{ display: "flex", flexDirection: "row" }}>
          {tags.map((tag, index) => (
            <QuestionTag key={index} tagName={tag} />
          ))}
        </div>
      );
    }

    function QuestionBox({ index }) {
      const thisQuestion = questionList[index];
      return (
        <div
          style={{
            border: "dotted black",
            width: "100%",
            height: "150px",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div style={{ marginTop: "30px", marginLeft: "20px" }}>
            <div>{thisQuestion.answers.length + " answers"}</div>
            <div>{thisQuestion.views + " views"}</div>
          </div>
          <div
            onClick={() => handleClick(index)}
            style={{ marginLeft: "10%", width: "50%", marginTop: "20px" }}
          >
            <p style={{ color: "blue" }}>{thisQuestion.title}</p>
            <QuestionTags question={thisQuestion} />
          </div>
          <div style={{ marginTop: "30px", marginLeft: "20px" }}>
            <span style={{ color: "red" }}> {thisQuestion.asked_by}</span>
            <span>
              {" "}
              {"asked " + showDate(new Date(thisQuestion.ask_Date_Time))}{" "}
            </span>
          </div>
        </div>
      );
    }
    function QuestionBoxes() {
      const array = [];

      for (let i = 0; i < questionList.length; i++) {
        array.push(<QuestionBox key={i} index={i} />);
      }

      return <div style={{ marginTop: "20px" }}>{array}</div>;
    }

    return (
      <div style={{ width: "95%", height: "100%" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginLeft: "20px",
            width: "100%",
          }}
        >
          <h2>All Questions </h2>
          <button
            id="AskQuestionButton"
            onClick={changePage.questionForm}
            style={{
              backgroundColor: "blue",
              color: "white",
              marginLeft: "75%",
              width: "100px",
              height: "50px",
              marginTop: "30px",
            }}
          >
            Ask Question
          </button>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: "20px",
            marginLeft: "20px",
          }}
        >
          {questionList.length + " Questions"}
          <button
            id="newestButton"
            style={{ marginLeft: "70%" }}
            onClick={handleClickNewestQues}
          >
            {" "}
            Newest{" "}
          </button>
          <button id="activeButton" onClick={handleClickActiveQues}>
            {" "}
            Active{" "}
          </button>
          <button id="uansweredButton" onClick={handleClickUnansweredQues}>
            {" "}
            Unanswered{" "}
          </button>
        </div>
        {<QuestionBoxes />}
      </div>
    );
  }
  // most recent answer per question
  function mostRecentAnsQuestion(question, quesIndex) {
    let aidList = question.answers;
    if (aidList.length !== 0) {
      let buildAnswerList = [];
      for (let i in aidList) {
        for (let j in answerList) {
          if (aidList[i] === answerList[j]._id) {
            buildAnswerList.push([
              quesIndex,
              showDate(new Date(answerList[j].ansDate)),
              question,
            ]);
            break;
          }
        }
      }
      buildAnswerList.sort(sortMostRecent);

      return buildAnswerList[0];
    }
  }

  function sortMostRecent(a, b) {
    // can only be used on [[<size 2>]...]
    return a[1] - b[1];
  }
  function sortNewActUnans(typeSort, mainQuesList = questionList) {
    // typeSort: 0=Newest; 1=Active; 2=Unanswered
    switch (typeSort) {
      // Newest -- find all dates and display in order most recent on top
      case 0:
        let quesDateList = [];
        for (let i in mainQuesList) {
          quesDateList.push([
            Number(i),
            mainQuesList[i].ask_Date_Time,
            mainQuesList[i],
          ]);
        }
        quesDateList.sort(sortMostRecent);
        // quesDateList[i] === [qidIndex, date(in a number form)]
        return quesDateList;

      // Active -- find the most recent answered question of the question then
      // compare to eachOther most recent one and display result
      case 1:
        // questions list of questions
        let listOfMostRecAns = [];
        for (let i in mainQuesList) {
          let recentAns = mostRecentAnsQuestion(mainQuesList[i], Number(i));

          if (typeof recentAns !== "undefined") {
            listOfMostRecAns.push(recentAns);
          }
        }
        listOfMostRecAns.sort(sortMostRecent);
        return listOfMostRecAns;

      // Unanswered same as newest except only show if ansIds is empty
      case 2:
        let unAnswered = [];
        for (let i in mainQuesList) {
          if (mainQuesList[i].answers.length === 0) {
            unAnswered.push([
              Number(i),
              showDate(new Date(mainQuesList[i].ask_Date_Time)),
              mainQuesList[i],
            ]);
          }
        }
        unAnswered.sort(sortMostRecent);
        return unAnswered;
      default:
        console.log("Need a valid typeSort value (eg: 0,1,2) to sort");
        return false;
    }
  }
  function handleClickNewestQues() {
    let newest = sortNewActUnans(0); // second value is default questionList
    changePage.sortedQuestionPage(0, newest);
  }
  function handleClickActiveQues() {
    let active = sortNewActUnans(1); // second value is default questionList
    changePage.sortedQuestionPage(1, active);
  }

  function handleClickUnansweredQues() {
    let unanswered = sortNewActUnans(2); // second value is default questionList
    changePage.sortedQuestionPage(2, unanswered);
  }

  return (
    <div id="fullPage">
      <div>
        <Header />
        <div
          id="main"
          className="main"
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            height: "100%",
          }}
        >
          <Menu />
          {page}
        </div>
      </div>
    </div>
  );
}
