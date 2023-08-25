const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
let questions = [];

fetch("../data/questions.json")
  .then((response) => response.json())
  .then((data) => {
    questions = data;
    const question = questions.find((q) => q.id == id);

    //id
    document.getElementById("id").innerHTML = "(ID: " + question.id + ")";

    //abbr
    document.getElementById("abbr").innerHTML = question.abbr;

    //question
    document.getElementById("question").textContent = question.q;

    //answers
    const answersContainer = document.getElementById("answers-container");

    // loop through the answers array and display each answer and its corresponding image
    for (let i = 0; i < question.answer.length; i++) {
      const answer = question.answer[i];
      const url = question.screenshots[i];
      const answerElement = document.createElement("li");
      answerElement.innerHTML = `
      <div class="answer-block"><span>${answer}</span>
      <div style="display: flex;justify-content: center;"><img src="${url}" alt="${answer}" class="w3-hover-opacity" onclick="onClick(this, ${i})"><div>
      </div>
    `;
      answersContainer.appendChild(answerElement);
    }

    //notes
    document.getElementById("notes").innerHTML = question.notes;

    // Set the modifiedDateTime element's content
    const modifiedDateTimeElement =
      document.getElementById("modified-date-time");
    const options = {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    const formattedModifiedDateTime = new Date(
      question.modifiedDateTime
    ).toLocaleString("en-US", options);
    modifiedDateTimeElement.textContent =
      "Updated: " + formattedModifiedDateTime;

    // Video
    const videoContainer = document.getElementById("video-container");

    if (question.video != null && question.video != "") {
      const videoElement = document.createElement("video");
      videoElement.src = question.video;
      videoElement.controls = true;

      videoContainer.appendChild(videoElement);
    } else {
      videoContainer.remove();
    }

    // Feedback section
    const helpfulCountElement = document.getElementById("helpful-count");
    const likeBtn = document.getElementById("like-btn");
    const dislikeBtn = document.getElementById("dislike-btn");

    let helpfulCount = question.helpfulCount || 0;
    let unhelpfulCount = question.unhelpfulCount || 0;

    // Update helpful count
    function updateHelpfulCount() {
      helpfulCountElement.textContent =
        helpfulCount +
        " out of " +
        (helpfulCount + unhelpfulCount) +
        " found this helpful";
      // Store the updated question data in local storage
      localStorage.setItem("questions", JSON.stringify(questions));
    }

    // Handle like button click
    function handleLike() {
      helpfulCount++;
      question.helpfulCount = helpfulCount;
      updateHelpfulCount();
      likeBtn.disabled = true;
      dislikeBtn.disabled = false;
    }

    // Handle dislike button click
    function handleDislike() {
      unhelpfulCount++;
      question.unhelpfulCount = unhelpfulCount;
      updateHelpfulCount();
      likeBtn.disabled = false;
      dislikeBtn.disabled = true;
    }

    // Bind event handlers to buttons
    likeBtn.addEventListener("click", handleLike);
    dislikeBtn.addEventListener("click", handleDislike);

    // Initialize the helpful count
    updateHelpfulCount();

    // Check out other related articles
    const relatedArticlesContainer =
      document.getElementById("related-articles");

    var relatedQuestions = questions.filter(
      (q) =>
        question.tag != "" && q.tag === question.tag && q.id !== question.id
    );
    console.log(relatedQuestions.length);
    if (relatedQuestions.length > 0) {
      const relatedArticlesTitle = document.createElement("h2");
      relatedArticlesTitle.textContent = "Check out other related articles";

      relatedArticlesContainer.appendChild(relatedArticlesTitle);

      const relatedArticlesList = document.createElement("ul");

      relatedQuestions.forEach((relatedQuestion) => {
        const relatedArticleItem = document.createElement("li");
        const relatedArticleLink = document.createElement("a");
        relatedArticleLink.textContent = relatedQuestion.q;
        relatedArticleLink.href = `results.html?id=${relatedQuestion.id}`;

        relatedArticleItem.appendChild(relatedArticleLink);
        relatedArticlesList.appendChild(relatedArticleItem);
      });

      relatedArticlesContainer.appendChild(relatedArticlesList);
    } else {
      const noRelatedArticlesMessage = document.createElement("p");
      noRelatedArticlesMessage.textContent = "";

      relatedArticlesContainer.appendChild(noRelatedArticlesMessage);
    }
  })
  .catch((error) => {
    console.log("An error occurred while fetching data:", error);
  });

// Assuming you have retrieved the 'question' object from the JSON data and stored it in a variable named 'question'

const shareButton = document.getElementById("share-button");
shareButton.addEventListener("click", () => {
  const pageUrl = encodeURIComponent(window.location.href);
  const caption = encodeURIComponent(
    document.getElementById("question").textContent
  );
  const whatsappUrl = `https://wa.me/?text=${caption}%0A${pageUrl}`;
  window.open(whatsappUrl, "_blank");
});
