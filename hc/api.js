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

    // Initial load of filtered questions
    updateQuestions(filteredQuestions);

    function updateQuestions(filteredQuestions) {
      // Clear previous questions
      faqsContainer.innerHTML = "";

      // Group questions by group field
      const groupedQuestions = filteredQuestions.reduce((acc, question) => {
        acc[question.group] = acc[question.group] || [];
        acc[question.group].push(question);
        return acc;
      }, {});

      // Append questions by group
      for (const group in groupedQuestions) {
        const groupTitle = document.createElement("h2");
        groupTitle.innerText = group;
        faqsContainer.appendChild(groupTitle);

        groupedQuestions[group].forEach((question) => {
          const questionContainer = document.createElement("div");
          questionContainer.classList.add("question-container");

          // Add the question
          const questionElement = document.createElement("p");
          questionElement.innerHTML = `<strong>${question.q}</strong>`;
          questionContainer.appendChild(questionElement);

          // Add the answer(s)
          const answerList = document.createElement("ol");
          question.answer.forEach((answer, index) => {
            const answerItem = document.createElement("li");
            answerItem.innerHTML = answer;
            answerList.appendChild(answerItem);
          });
          questionContainer.appendChild(answerList);

          faqsContainer.appendChild(questionContainer);
        });
      }
    }
  })
  .catch((error) => console.error(error));