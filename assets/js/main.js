const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

let questions = [];

fetch("../data/questions.json")
  .then((response) => response.json())
  .then((data) => {
    questions = data;
    const question = questions.find((q) => q.id == id);

    // Current year and next year dynamically
    const currentYear = Math.floor(
      new Date().getFullYear() - 0.75 + new Date().getMonth() / 12
    );
    const nextYear = currentYear + 1;

    // Replace placeholders
    question.q = question.q
      .replace("{{CURRENT_YEAR}}", currentYear)
      .replace("{{NEXT_YEAR}}", nextYear);

    question.answer = question.answer.map((answer) =>
      answer
        .replace("{{CURRENT_YEAR}}", currentYear)
        .replace("{{NEXT_YEAR}}", nextYear)
    );

    // ID
    document.getElementById("id").innerHTML = "(ID: " + question.id + ")";

    // abbr
    document.getElementById("abbr").innerHTML = question.abbr;

    // question
    document.getElementById("question").textContent = question.q;

    // answers
    const answersContainer = document.getElementById("answers-container");

    for (let i = 0; i < question.answer.length; i++) {
      const answer = question.answer[i];
      const url = question.screenshots[i];
      const answerElement = document.createElement("li");

      answerElement.innerHTML = `
        <div class="answer-block">
            <span>${answer}</span>
            <div class="answer-image">
                <img src="${url}" alt="${answer}" class="clickable-image" onclick="onClick(this, ${i})">
            </div>
        </div>
      `;

      answersContainer.appendChild(answerElement);
    }

    // notes
    document.getElementById("notes").innerHTML = question.notes;

    // modified date
    const modifiedDateTimeElement = document.getElementById("modified-date-time");
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

    // video
    const videoContainer = document.getElementById("video-container");
    if (question.video) {
      const videoElement = document.createElement("video");
      videoElement.src = question.video;
      videoElement.controls = true;
      videoContainer.appendChild(videoElement);
    } else {
      videoContainer.remove();
    }

    // related articles
    const relatedQuestions = questions.filter(
      (q) => question.tag != "" && q.tag === question.tag && q.id !== question.id
    );

    if (relatedQuestions.length > 0) {
      const relatedArticlesList = document.getElementById("related-articles-list");

      relatedQuestions.forEach((relatedQuestion) => {
        const relatedArticleItem = document.createElement("li");
        relatedArticleItem.className = "related-item";

        const relatedArticleLink = document.createElement("a");
        relatedArticleLink.className = "related-link";
        relatedArticleLink.textContent = relatedQuestion.q
          .replace("{{CURRENT_YEAR}}", currentYear)
          .replace("{{NEXT_YEAR}}", nextYear);
        relatedArticleLink.href = `results.html?id=${relatedQuestion.id}`;

        relatedArticleItem.appendChild(relatedArticleLink);
        relatedArticlesList.appendChild(relatedArticleItem);
      });
    } else {
      document.querySelector(".related-section").style.display = "none";
    }

    // --------------------------
    // FEEDBACK SYSTEM
    // --------------------------

    const helpfulCountElement = document.getElementById("helpful-count");
    const likeBtn = document.getElementById("like-btn");
    const dislikeBtn = document.getElementById("dislike-btn");

    let helpfulCount = question.helpfulCount || 0;
    let unhelpfulCount = question.unhelpfulCount || 0;

    const voteKey = "vote_" + question.id;
    const previousVote = localStorage.getItem(voteKey);

    function renderCount() {
      helpfulCountElement.textContent =
        `${helpfulCount} out of ${helpfulCount + unhelpfulCount} found this helpful`;
    }

    if (previousVote) {
      likeBtn.disabled = previousVote === "like";
      dislikeBtn.disabled = previousVote === "dislike";
    }

    function sendVoteToServer(type) {
      fetch("/api/update-helpful.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: question.id,
          action: type
        })
      }).catch(err => console.error("Vote API error:", err));
    }

    function voteLike() {
      if (previousVote) return;

      helpfulCount++;
      localStorage.setItem(voteKey, "like");

      likeBtn.disabled = true;
      dislikeBtn.disabled = true;

      sendVoteToServer("like");
      renderCount();
    }

    function voteDislike() {
      if (previousVote) return;

      unhelpfulCount++;
      localStorage.setItem(voteKey, "dislike");

      likeBtn.disabled = true;
      dislikeBtn.disabled = true;

      sendVoteToServer("dislike");
      renderCount();
    }

    likeBtn.addEventListener("click", voteLike);
    dislikeBtn.addEventListener("click", voteDislike);

    renderCount();
  })
  .catch((error) => {
    console.log("An error occurred while fetching data:", error);
  });

// --------------------------
// SHARE BUTTON
// --------------------------
const shareButton = document.getElementById("share-button");
shareButton.addEventListener("click", () => {
  const pageUrl = encodeURIComponent(window.location.href);
  const caption = encodeURIComponent(
    document.getElementById("question").textContent
  );
  const whatsappUrl = `https://wa.me/?text=${caption}%0A${pageUrl}`;
  window.open(whatsappUrl, "_blank");
});

// --------------------------
// BACK BUTTON
// --------------------------
document.getElementById("back-to-help").addEventListener("click", () => {
  window.history.back();
});
