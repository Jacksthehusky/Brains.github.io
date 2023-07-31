fetch('../data/questions.json')
  .then(response => response.json())
  .then(questions => {
    const faqsContainer = document.getElementById('faqs');
    const searchInput = document.getElementById('search');

    // Update questions on search input
    searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.toLowerCase();
      const filteredQuestions = questions.filter(question => question.q.toLowerCase().includes(searchTerm));
      updateQuestions(filteredQuestions);
    });

    // Initial load of all questions
    updateQuestions(questions);

    function updateQuestions(filteredQuestions) {
      // Clear previous questions
      faqsContainer.innerHTML = '';

      // Group questions by group field
      const groupedQuestions = filteredQuestions.reduce((acc, question) => {
        acc[question.group] = acc[question.group] || [];
        acc[question.group].push(question);
        return acc;
      }, {});

      // Append questions by group
      for (const group in groupedQuestions) {
        const groupTitle = document.createElement('h2');
        groupTitle.innerText = group;
        faqsContainer.appendChild(groupTitle);

        groupedQuestions[group].forEach(question => {
          const questionElement = document.createElement('a');
          const questionContainer = document.createElement('p');
          questionElement.innerHTML = question.q;
          questionElement.href = `details.html?id=${question.id}`;
          questionContainer.appendChild(questionElement);
          faqsContainer.appendChild(questionContainer);
         

          // Check if question requires permission to view
          if (question.requiresPermission) {
            const lockIcon = document.createElement('img');
            lockIcon.src = '../Images/brains.ico';
            lockIcon.style.maxWidth = '20px';
            lockIcon.style.borderRadius = '25%';
            questionContainer.appendChild(lockIcon);

            questionElement.addEventListener('click', (event) => {
              event.preventDefault();
              const password = prompt('Access denied.');
              if (password === 'brains123') {
                window.location.href = questionElement.href;
              } else {
                alert('Kindly reach out to our customer services for assistance in accessing this answer.');
              }
            });
          }

          
        });
      }
    }
  })
  .catch(error => console.error(error));
