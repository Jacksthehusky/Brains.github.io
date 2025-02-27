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

      // Create a table element
      const table = document.createElement("table");
      table.classList.add("faq-table");

      // Add table headers
      const headerRow = document.createElement("tr");
      headerRow.classList.add("header-row");

      const questionHeader = document.createElement("th");
      questionHeader.textContent = "Question";
      headerRow.appendChild(questionHeader);

      const answerHeader = document.createElement("th");
      answerHeader.textContent = "Answer";
      headerRow.appendChild(answerHeader);

      table.appendChild(headerRow);

      // Append all questions without grouping
      filteredQuestions.forEach((question) => {
        // Create a table row for each question
        const row = document.createElement("tr");
        row.classList.add("faq-row");

        // Add the question cell
        const questionCell = document.createElement("td");
        questionCell.classList.add("question-cell");
        questionCell.textContent = question.q; // Remove "Question:" label
        row.appendChild(questionCell);

        // Add the answer cell
        const answerCell = document.createElement("td");
        answerCell.classList.add("answer-cell");
        const cleanedAnswers = question.answer.map((answer) => stripHtmlTags(answer)); // Remove HTML tags
        answerCell.textContent = cleanedAnswers.join("; "); // Use semicolons instead of commas
        row.appendChild(answerCell);

        // Append the row to the table
        table.appendChild(row);
      });

      // Append the table to the FAQ container
      faqsContainer.appendChild(table);
    }
  })
  .catch((error) => console.error(error));