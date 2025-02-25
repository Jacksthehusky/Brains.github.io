fetch("../data/questions.json")
  .then((response) => response.json())
  .then((questions) => {

    // Current year and next year dynamically
    const currentYear = Math.floor(new Date().getFullYear() - 0.75 + new Date().getMonth() / 12);
    const nextYear = currentYear + 1;

    // Replace placeholders in questions
    questions = questions.map((question) => {
      return {
        ...question,
        q: question.q
          .replace("{{CURRENT_YEAR}}", currentYear)
          .replace("{{NEXT_YEAR}}", nextYear),
        answer: question.answer.map((answer) =>
          answer
            .replace("{{CURRENT_YEAR}}", currentYear)
            .replace("{{NEXT_YEAR}}", nextYear)
        ),
      };
    });

    // Filter out questions that require permission
    const filteredQuestions = questions.filter((question) => !question.requiresPermission);

    const faqsContainer = document.getElementById("faqs");

    // Function to remove HTML tags from a string
    function stripHtmlTags(str) {
      return str.replace(/<[^>]*>/g, ""); // Remove all HTML tags
    }

    // Initial load of filtered questions
    updateQuestions(filteredQuestions);

    function updateQuestions(filteredQuestions) {
      // Clear previous questions
      faqsContainer.innerHTML = "";

      // Append all questions without grouping
      filteredQuestions.forEach((question) => {
        const questionContainer = document.createElement("div");
        questionContainer.classList.add("question-container");

        // Add the question
        const questionElement = document.createElement("p");
        questionElement.innerHTML = `<strong>${question.q}</strong>`;
        questionContainer.appendChild(questionElement);

        // Add the answer(s) as a single string separated by commas
        const answerText = document.createElement("p");
        const cleanedAnswers = question.answer.map((answer) => stripHtmlTags(answer)); // Remove HTML tags
        answerText.textContent = cleanedAnswers.join(", "); // Join answers with a comma
        questionContainer.appendChild(answerText);

        faqsContainer.appendChild(questionContainer);
      });
    }
  })
  .catch((error) => console.error(error));