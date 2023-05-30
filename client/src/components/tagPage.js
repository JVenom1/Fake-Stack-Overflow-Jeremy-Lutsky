import React from "react";

export default function TagPage({ tagList, changePage, questionList }) {
  let tagAmount = tagList.length;
  function tagListGroup() {
    let result = [];
    for (let i in tagList) {
      result.push(tagItem(tagList[i]._id));
    }
    return result;
  }

  function tagItem(_id) {
    // list of questions
    let quesList = [];
    for (let i in questionList) {
      //dont want duplicates
      if (questionList[i].tags.includes(_id)) {
        quesList.push(questionList[i]);
      }
    }
    if (quesList.length === 0) return false; // none found
    // otherwise
    return [_idToName(_id), quesList];
  }
  function _idToName(_id) {
    for (let i in tagList) {
      if (tagList[i]._id === _id) return tagList[i].name;
    }
  }
  function ActualTags() {
    let tagsToShow = tagListGroup(); // [tagname, [<questionList>]]
    const array = [];
    for (let i in tagsToShow) {
      let tagItem = tagsToShow[i];
      array.push(
        <div className="tagLink">
          <a
            href="#"
            onClick={() => changePage.searchpage("[" + tagItem[0] + "]")}
          >
            {tagItem[0]}
          </a>
          <p>{tagItem[1].length + " Questions"}</p>
        </div>
      );
    }
    return <div className="row">{array}</div>;
  }
  return (
    //<button id="AskQuestionButtonTag" onClick={() => changePage.questionForm()}>
    <>
      <div id="tagHeader">
        <h2 style={{ display: "inline-block" }} id="tagAmount">
          {tagAmount} Tags{" "}
        </h2>
        <h2 style={{ display: "inline-block", marginLeft: "35%" }}>All Tags</h2>

        <button
          id="AskQuestionButtonTag"
          onClick={() => changePage.questionForm()}
        >
          Ask Question
        </button>

        <div>{<ActualTags />}</div>
      </div>
    </>
  );
}
