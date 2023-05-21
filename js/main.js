const search = document.getElementById("search");
const matchList = document.getElementById("match-list");
let questions = [];

// Get questions
const getQuestions = async () => {
  const res = await fetch("../data/questions.json");
  questions = await res.json();
};

// Filter questions
const searchQuestions = (searchText) => {
  // Get matches to current text input
  let matches = questions.filter((question) => {
    const regex = new RegExp(`\\b${searchText}`, "gi");
    return question.q.match(regex) || question.abbr.match(regex);
  });

  // Clear when input or matches are empty
  if (searchText.length === 0 || matches.length === 0) {
    matches = [];
    matchList.innerHTML = "";
  }

  outputHtml(matches);
};

// Show results in HTML
const outputHtml = (matches) => {
  if (matches.length > 0) {
    const html = matches
      .map((match) => {
        const regex = new RegExp(`(${search.value})`, "gi");
        const highlightedQuestion = match.q.replace(regex, "<mark style='background-color: red; color:white'>$1</mark>");
        return `
          <div class="card card-body">
            <a href="./details.html?id=${match.id}">
              <p>${highlightedQuestion}<p>
            </a>
          </div>
        `;
      }
      )
      .join("");
    matchList.innerHTML = html;

    // Attach password prompt to all links
    const links = matchList.querySelectorAll("a");
    links.forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");
        const questionId = href.match(/id=(\d+)/)[1];
        const question = questions.find((q) => q.id == questionId);

        if (question.requiresPermission) {
          event.preventDefault();
          const password = prompt("Access denied.");
          if (password === 'brains123') {
            window.location.href = href;
          } else {
            alert("Kindly reach out to our customer services for assistance in accessing this answer.");
          }
        }
      });
    });
  } else {
    matchList.innerHTML =
      '<div class="alert alert-danger">No matches found</div>';
  }
};

// Add debounce to limit API calls
const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

window.addEventListener("DOMContentLoaded", getQuestions);
search.addEventListener(
  "input",
  debounce(() => searchQuestions(search.value), 300)
);
