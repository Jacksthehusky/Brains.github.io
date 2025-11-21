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

// Disable buttons if already voted
if (previousVote) {
  likeBtn.disabled = true;
  dislikeBtn.disabled = true;
  // Show which one was previously selected
  if (previousVote === "like") {
    likeBtn.classList.add("voted");
  } else {
    dislikeBtn.classList.add("voted");
  }
}

async function sendVoteToServer(type) {
  try {
    const response = await fetch("/api/update-helpful.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: question.id,
        action: type,
        timestamp: Date.now()
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to submit vote");
    }

    return result;
  } catch (error) {
    console.error("Vote API error:", error);
    // Revert the UI if server update fails
    revertVote(type);
    showNotification("Failed to submit vote. Please try again.", "error");
    throw error;
  }
}

function revertVote(type) {
  if (type === "like") {
    helpfulCount--;
  } else {
    unhelpfulCount--;
  }
  localStorage.removeItem(voteKey);
  likeBtn.disabled = false;
  dislikeBtn.disabled = false;
  renderCount();
}

function showNotification(message, type = "info") {
  // Create a simple notification system
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    background: ${type === "error" ? "#f44336" : "#4CAF50"};
    color: white;
    border-radius: 4px;
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

async function voteLike() {
  if (previousVote) return;
  
  // Immediate UI update
  helpfulCount++;
  likeBtn.disabled = true;
  dislikeBtn.disabled = true;
  likeBtn.classList.add("voted");
  renderCount();
  
  // Store vote immediately to prevent double voting during network delay
  localStorage.setItem(voteKey, "like");
  
  try {
    await sendVoteToServer("like");
    showNotification("Thanks for your feedback!", "success");
  } catch (error) {
    // Error handling done in sendVoteToServer
  }
}

async function voteDislike() {
  if (previousVote) return;
  
  // Immediate UI update
  unhelpfulCount++;
  likeBtn.disabled = true;
  dislikeBtn.disabled = true;
  dislikeBtn.classList.add("voted");
  renderCount();
  
  localStorage.setItem(voteKey, "dislike");
  
  try {
    await sendVoteToServer("dislike");
    showNotification("Thanks for your feedback!", "success");
  } catch (error) {
    // Error handling done in sendVoteToServer
  }
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
