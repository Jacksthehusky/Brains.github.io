// Feedback elements
const helpfulCountElement = document.getElementById("helpful-count");
const likeBtn = document.getElementById("like-btn");
const dislikeBtn = document.getElementById("dislike-btn");

let helpfulCount = question.helpfulCount || 0;
let unhelpfulCount = question.unhelpfulCount || 0;

const voteKey = "vote_" + question.id; // localStorage key
const previousVote = localStorage.getItem(voteKey);

// Display initial counts
function renderCount() {
  helpfulCountElement.textContent =
    `${helpfulCount} out of ${helpfulCount + unhelpfulCount} found this helpful`;
}

// Lock buttons if user already voted
if (previousVote) {
  likeBtn.disabled = previousVote === "like";
  dislikeBtn.disabled = previousVote === "dislike";
}

// Send vote to server
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

// Voting handlers
function voteLike() {
  if (previousVote) return;

  helpfulCount++;
  localStorage.setItem(voteKey, "like");

  likeBtn.disabled = true;
  dislikeBtn.disabled = true; // lock permanently

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

// Assign events
likeBtn.addEventListener("click", voteLike);
dislikeBtn.addEventListener("click", voteDislike);

// Initial render
renderCount();
