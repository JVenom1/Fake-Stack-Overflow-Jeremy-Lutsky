import React, { useState } from "react";
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
  console.log("date");
  console.log(date);
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
export default function SortedQuestionPage({
  typeSort,
  toBeSortedArr,
  tagList,
  questionList,
  answerList,
  changePage,
}) {
  //--------------------------------------------
  function QuestionBox({ index, array }) {
    const thisQuestion = array[index];
    return (
      <div
        style={{
          border: "dotted black",
          width: "100%",
          height: "150px",
          display: "flex",
          flexDirection: "row",
          overflow: "auto",
        }}
      >
        <div style={{ marginTop: "30px", marginLeft: "20px" }}>
          <div>{thisQuestion.answers.length + " answers"}</div>
          <div>{thisQuestion.views + " views"}</div>
        </div>
        <div
          onClick={() => changePage.answer(index)}
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
  function QuestionBoxes(sorteda) {
    const array = [];
    for (let i = 0; i < sorteda.length; i++) {
      array.push(<QuestionBox key={i} index={i} array={sorteda} />);
    }

    return <div style={{ marginTop: "20px", overflow: "auto" }}>{array}</div>;
  }

  var findTag = function (id) {
    for (var i = 0; i < tagList.length; i++) {
      if (id === tagList[i]._id) {
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
    const array = [];
    for (let i = 0; i < question.tags.length; i++) {
      array.push(<QuestionTag key={i} tagName={findTag(question.tags[i])} />);
    }
    return <div style={{ display: "flex", flexDirection: "row" }}>{array}</div>;
  }

  //--------------------------------------------
  function listToBoxes(sortedList) {
    // console.log(sortedList);
    const array = [];
    for (let i in sortedList) {
      array.push(sortedList[i][2]); // actual question
    }
    return QuestionBoxes(array);
  }
  // unknown initial state so this will set it
  var useStateInit = 0;
  switch (typeSort) {
    case 0:
      useStateInit = <div>{listToBoxes(toBeSortedArr)}</div>;
      break;
    case 1:
      useStateInit = <div>{listToBoxes(toBeSortedArr)}</div>;
      break;
    case 2:
      useStateInit = <div>{listToBoxes(toBeSortedArr)}</div>;
      break;

    default:
      useStateInit = <></>;
      break;
  }
  function sortNewActUnans(typeSort, mainQuesList = questionList) {
    // typeSort: 0=Newest; 1=Active; 2=Unanswered
    switch (typeSort) {
      // Newest -- find all dates and display in order most recent on top
      case 0:
        let quesDateList = [];
        for (let i in mainQuesList) {
          //console.log("sortedQuestionPage");
          //console.log(mainQuesList[i].ask_Date_Time.getTime());
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

      // Unanswered same as newest except only show if answersIDs is empty
      case 2:
        let unAnswered = [];
        for (let i in mainQuesList) {
          if (mainQuesList[i].answers.length === 0) {
            unAnswered.push([
              Number(i),
              mainQuesList[i].ask_Date_Time,
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
  // most recent answer per question
  function mostRecentAnsQuestion(question, quesIndex) {
    let aidList = question.answers;
    if (aidList.length !== 0) {
      let answerListToBeFilled = [];
      for (let i in aidList) {
        for (let j in answerList) {
          if (aidList[i] === answerList[j]._id) {
            answerListToBeFilled.push([
              quesIndex,
              answerList[j].ans_date_time,
              question,
            ]);
            break;
          }
        }
      }
      answerListToBeFilled.sort(sortMostRecent);

      return answerListToBeFilled[0];
    }
  }
  function sortMostRecent(a, b) {
    // can only be used on [[<size 2>]...]
    return a[1] - b[1];
  }
  const [listToDisplay, setListToDisplay] = useState(useStateInit);

  function handleClickNewestQues() {
    let newest = sortNewActUnans(0); // second value is default questionList
    changePage.sortedQuestionPage(0, newest);
    setListToDisplay(<div>{listToBoxes(newest)}</div>);
  }

  function handleClickActiveQues() {
    let active = sortNewActUnans(1); // second value is default questionList
    changePage.sortedQuestionPage(1, active);
    setListToDisplay(<div>{listToBoxes(active)}</div>);
  }

  function handleClickUnansweredQues() {
    let unanswered = sortNewActUnans(2); // second value is default questionList
    changePage.sortedQuestionPage(2, unanswered);
    setListToDisplay(<div>{listToBoxes(unanswered)}</div>);
  }

  return (
    <>
      <div style={{ width: "95%", height: "100%" }}>
        <div id="questionHeader">
          <h2> All Questions </h2>
          <button
            id="AskQuestionButton"
            onClick={() => changePage.questionForm()}
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
          {toBeSortedArr.length + " Questions"}
          <button id="newestButton" onClick={handleClickNewestQues}>
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
        <div id="fullQuesBoxSorted">{listToDisplay}</div>
      </div>
    </>
  );
}
