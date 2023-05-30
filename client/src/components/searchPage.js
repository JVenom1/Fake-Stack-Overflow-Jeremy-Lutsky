function splitTextAndTags(text) {
  const brackets = [];
  const nonBrackets = [];
  let currentWord = "";
  let insideBrackets = false;
  // Make 2 lists of bracketed text and non bracketed text
  for (let i = 0; i < text.length; i++) {
    const char = text.charAt(i);

    if (char === "[") {
      insideBrackets = true;

      if (currentWord !== "") {
        nonBrackets.push(currentWord);
        currentWord = "";
      }
    } else if (char === "]") {
      insideBrackets = false;

      if (currentWord !== "") {
        brackets.push(currentWord);
        currentWord = "";
      }
    } else {
      currentWord += char;

      if (i === text.length - 1) {
        if (insideBrackets) {
          brackets.push(currentWord);
        } else {
          nonBrackets.push(currentWord);
        }
      }
    }
  }

  return [nonBrackets, brackets];
}
function showDate(date) {
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
}
export default function SearchPage({
  input,
  questionList,
  tagList,
  answerList,
  changePage,
}) {
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

  function SearchedTags({ question }) {
    const array = [];
    for (let i = 0; i < question.tags.length; i++) {
      array.push(
        <QuestionTag key={i} tagName={findSearchTag(question.tags[i])} />
      );
    }
    return <div style={{ display: "flex", flexDirection: "row" }}>{array}</div>;
  }
  var findSearchTag = function (id) {
    for (var i = 0; i < tagList.length; i++) {
      if (id === tagList[i]._id) {
        return tagList[i].name;
      }
    }
    return "N/A";
  };
  function SearchBox({ question, index, changePage }) {
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
          <div>{question.answers.length + " answers"}</div>
          <div>{question.views + " views"}</div>
        </div>
        <div
          onClick={() => changePage.answer(index)}
          style={{ marginLeft: "10%", width: "50%", marginTop: "20px" }}
        >
          <p style={{ color: "blue" }}>{question.title}</p>
          <SearchedTags question={question} />
        </div>
        <div style={{ marginTop: "30px", marginLeft: "20px" }}>
          <span style={{ color: "red" }}> {question.asked_by}</span>
          <span> {"asked " + showDate(new Date(question.ask_Date_Time))} </span>
        </div>
      </div>
    );
  }
  function ShowSearchedQuestions({ searchQuestionList, changePage }) {
    const array = [];
    if (searchQuestionList.length === 0) {
      return <></>;
    }
    for (let question in searchQuestionList) {
      array.push(
        <SearchBox
          key={searchQuestionList[question]._id}
          question={searchQuestionList[question]}
          index={question}
          changePage={changePage}
        />
      );
    }
    return <div style={{ marginTop: "20px" }}>{array}</div>;
  }
  function searchModelQuestions_searchbarText(wordsList, tagsList) {
    let quesList = [];
    let hitIDs = [];

    //text search
    if (wordsList.length !== 0) {
      for (let i in wordsList) {
        // each searched word compared to each question (title/text)
        if (hitIDs.length === questionList.length) break;

        for (let j in questionList) {
          if (hitIDs.length === questionList.length) break;
          //dont want duplicates
          if (!hitIDs.includes(questionList[j]._id)) {
            if (questionList[j].title.includes(wordsList[i])) {
              hitIDs.push(questionList[j]._id);
              quesList.push(questionList[j]);
            } else if (questionList[j].text.includes(wordsList[i])) {
              hitIDs.push(questionList[j]._id);
              quesList.push(questionList[j]);
            }
          }
        }
      }
    }
    //tag search
    if (tagsList.length !== 0) {
      // all tags in search bar = tagsList

      for (let i in tagsList) {
        // case if all questions are used already
        if (hitIDs.length === questionList.length) break;
        for (let j in questionList) {
          if (hitIDs.length === questionList.length) break;
          //dont want duplicates
          if (!hitIDs.includes(questionList[j]._id)) {
            // cases
            //first convert modelQues[j].tagIds to the names list

            let nameTagList = tag_idToName_ListConverter(questionList[j].tags);
            if (nameTagList.includes(tagsList[i])) {
              // console.log("here");
              hitIDs.push(questionList[j]._id);
              quesList.push(questionList[j]);
            }
          }
        }
      }
    }
    //this.searchList = quesList;
    if (quesList.length === 0) {
      return false; // nothing to display case
    }
    return quesList;
  }

  function tag_idToName_ListConverter(quesTag_ids) {
    let result = [];
    for (let i in quesTag_ids) {
      // gets index for main tag list
      let tagID = quesTag_ids[i];
      //let mainIndex = Number(quesT_idList[i][quesT_idList[i].length - 1]) - 1;
      for (let i in tagList) {
        if (tagID === tagList[i]._id) {
          result.push(tagList[i].name);
        }
      }
    }
    return result;
  }
  function sortMostRecent(a, b) {
    // can only be used on [[<size 2>]...]
    return a[1] - b[1];
  }
  function mostRecentAnsQuestion(question, quesIndex) {
    let aidList = question.answers;
    if (aidList.length !== 0) {
      let buildAnswerList = [];
      for (let i in aidList) {
        for (let j in answerList) {
          if (aidList[i] === answerList[j]._id) {
            buildAnswerList.push([
              quesIndex,
              answerList[j].ans_date_time,
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
          if (mainQuesList[i].ansIds.length === 0) {
            unAnswered.push([
              Number(i),
              mainQuesList[i].askDate,
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
  var [wordsList, tagsList] = splitTextAndTags(input);
  var searchQuestionList = searchModelQuestions_searchbarText(
    wordsList,
    tagsList
  );
  if (!searchQuestionList) {
    searchQuestionList = []; // displays correct number of no questions
  }

  function handleClickNewestSearch() {
    let newest = sortNewActUnans(0); // second value is default questionList
    changePage.sortedSearchPage(0, newest);
  }
  function handleClickActiveSearch() {
    let active = sortNewActUnans(1); // second value is default questionList
    changePage.sortedSearchPage(1, active);
  }
  function handleClickUnansweredSearch() {
    let unanswered = sortNewActUnans(2); // second value is default questionList
    changePage.sortedSearchPage(2, unanswered);
  }

  return (
    <>
      <div style={{ width: "95%", height: "100%" }}>
        <div id="searchHeader">
          <h2 id="PageTitleText">Search Results </h2>
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
          {searchQuestionList.length + " Questions"}
          <button id="newestButton" onClick={handleClickNewestSearch}>
            {" "}
            Newest{" "}
          </button>
          <button id="activeButton" onClick={handleClickActiveSearch}>
            {" "}
            Active{" "}
          </button>
          <button id="uansweredButton" onClick={handleClickUnansweredSearch}>
            {" "}
            Unanswered{" "}
          </button>
        </div>
        {
          <ShowSearchedQuestions
            searchQuestionList={searchQuestionList}
            changePage={changePage}
          />
        }
      </div>
    </>
  );
}
