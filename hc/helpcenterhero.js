// Modern Help Center JavaScript
document.addEventListener("DOMContentLoaded", () => new HelpCenter());

class HelpCenter {
  constructor() {
    this.questions = [];
    this.searchInput = document.getElementById('search');
    this.searchResults = document.getElementById('search-results');
    this.faqList = document.getElementById('faq-list');
    this.clearSearch = document.getElementById('clearSearch');
    
    this.init();
  }
  
  async init() {
    await this.loadQuestions();
    this.setupSearch();
    this.setupCategories();
    this.setupFAQAccordion();
    this.setupEventListeners();
  }
  
  async loadQuestions() {
    try {
      const res = await fetch('../data/questions.json');
      this.questions = await res.json();
      
      // Current year and next year dynamically
      const currentYear = Math.floor(new Date().getFullYear() - 0.75 + new Date().getMonth() / 12);
      const nextYear = currentYear + 1;
      
      // Replace placeholders
      this.questions = this.questions.map(question => ({
        ...question,
        q: question.q
          .replace('{{CURRENT_YEAR}}', currentYear)
          .replace('{{NEXT_YEAR}}', nextYear),
        answer: question.answer.map(answer =>
          answer
            .replace('{{CURRENT_YEAR}}', currentYear)
            .replace('{{NEXT_YEAR}}', nextYear)
        )
      }));
      
      this.renderFAQs();
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  }
  
  setupSearch() {
    // Fix: Add proper event listener with debounce
    this.searchInput.addEventListener('input', this.debounce(() => {
      this.handleSearch();
    }, 300));
  }
  
  // Fix: Add debounce method
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  handleSearch() {
    const searchTerm = this.searchInput.value.trim().toLowerCase();
    
    if (searchTerm === '') {
      this.searchResults.style.display = 'none';
      this.renderFAQs(); // Show all FAQs when search is cleared
      return;
    }
    
    const matches = this.questions.filter(question => 
      question.q.toLowerCase().includes(searchTerm) || 
      (question.abbr && question.abbr.toLowerCase().includes(searchTerm))
    );
    
    this.displaySearchResults(matches, searchTerm);
    this.filterFAQsBySearch(matches); // Also filter FAQ list
  }
  
  displaySearchResults(matches, searchTerm) {
    if (matches.length === 0) {
      this.searchResults.innerHTML = `
        <div class="search-result-item">
          <p>No results found for "${searchTerm}"</p>
          <small>Try different keywords or contact support</small>
        </div>
      `;
    } else {
      const html = matches.slice(0, 8).map(match => {
        const isProtected = match.requiresPermission;
        return `
          <div class="search-result-item ${isProtected ? 'protected' : ''}" data-id="${match.id}">
            <h4>${this.highlightText(match.q, searchTerm)}</h4>
            <p>${match.answer[0].substring(0, 120)}...</p>
            ${isProtected ? '<div class="protected-badge"><i class="fas fa-lock"></i> Protected Content</div>' : ''}
          </div>
        `;
      }).join('');
      
      this.searchResults.innerHTML = html;
      
      // Fix: Add click handlers to search results
      this.searchResults.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', (e) => {
          const questionId = item.dataset.id;
          const question = this.questions.find(q => q.id == questionId);
          
          if (question && question.requiresPermission) {
            e.preventDefault();
            this.handleRequestAccess(questionId);
          } else {
            window.location.href = `./results.html?id=${questionId}`;
          }
        });
      });
    }
    
    this.searchResults.style.display = 'block';
  }
  
  // Fix: Add method to filter FAQs by search
  filterFAQsBySearch(matches) {
    const matchedIds = matches.map(m => m.id);
    const filteredQuestions = this.questions.filter(q => matchedIds.includes(q.id));
    this.renderFAQs(filteredQuestions);
  }
  
  highlightText(text, searchTerm) {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${this.escapeRegex(searchTerm)})`, 'gi');
    return text.replace(regex, '<mark style="background-color: #ff6b6b; color: white; padding: 0.1rem 0.3rem; border-radius: 3px;">$1</mark>');
  }
  
  // Fix: Add regex escape function
  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  setupCategories() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const category = btn.dataset.category;
        this.filterFAQs(category);
        
        // Clear search when switching categories
        this.searchInput.value = '';
        this.searchResults.style.display = 'none';
      });
    });
  }
  
  filterFAQs(category) {
    const filteredQuestions = category === 'all' 
      ? this.questions 
      : this.questions.filter(q => q.group.toLowerCase() === category.toLowerCase());
    
    this.renderFAQs(filteredQuestions);
  }
  
  renderFAQs(questions = this.questions) {
    if (questions.length === 0) {
      this.faqList.innerHTML = `
        <div class="no-results">
          <i class="fas fa-search"></i>
          <h3>No questions found</h3>
          <p>Try adjusting your search or browse different categories</p>
        </div>
      `;
      return;
    }
    
    const groupedQuestions = questions.reduce((acc, question) => {
      acc[question.group] = acc[question.group] || [];
      acc[question.group].push(question);
      return acc;
    }, {});
    
    let html = '';
    
    for (const [group, groupQuestions] of Object.entries(groupedQuestions)) {
      html += `<div class="faq-group">
        <h3 class="faq-group-title">${group}</h3>
        <div class="faq-group-items">`;
      
      groupQuestions.forEach(question => {
        html += `
          <div class="faq-item" data-id="${question.id}">
            <div class="faq-question">
              <span>${question.q}</span>
              <i class="fas fa-chevron-down"></i>
            </div>
            <div class="faq-answer">
              ${question.requiresPermission ? 
                `<div class="protected-content">
                  <i class="fas fa-lock"></i>
                  <p>This content requires special access. Please contact support for assistance.</p>
                  <button class="request-access-btn" data-id="${question.id}">
                    Request Access
                  </button>
                </div>` :
                `<p>${question.answer[0]}</p>`
              }
            </div>
          </div>
        `;
      });
      
      html += `</div></div>`;
    }
    
    this.faqList.innerHTML = html;
    this.setupFAQAccordion();
  }
  
  setupFAQAccordion() {
    const faqItems = this.faqList.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all items
        faqItems.forEach(i => i.classList.remove('active'));
        
        // Open clicked item if it wasn't active
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
    
    // Setup request access buttons
    const requestButtons = this.faqList.querySelectorAll('.request-access-btn');
    requestButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleRequestAccess(btn.dataset.id);
      });
    });
  }
  
  handleRequestAccess(questionId) {
    const password = prompt('This content requires special access. Please enter the access code or contact support:');
    
    if (password === 'brains123') {
      window.location.href = `./results.html?id=${questionId}`;
    } else {
      alert('Kindly reach out to our customer services for assistance in accessing this answer.');
    }
  }
  
  setupEventListeners() {
    // Clear search
    if (this.clearSearch) {
      this.clearSearch.addEventListener('click', () => {
        this.searchInput.value = '';
        this.searchResults.style.display = 'none';
        this.searchInput.focus();
        this.renderFAQs(); // Reset to show all FAQs
      });
    }
    
    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.searchInput.contains(e.target) && !this.searchResults.contains(e.target)) {
        this.searchResults.style.display = 'none';
      }
    });
    
    // Quick links functionality
    const quickLinks = document.querySelectorAll('.quick-link');
    quickLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const text = link.querySelector('span').textContent;
        this.searchInput.value = text;
        this.searchInput.focus();
        this.handleSearch();
      });
    });
    
    // Fix: Handle Enter key in search
    this.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.handleSearch();
      }
    });
  }
}

// Fix: Initialize when DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new HelpCenter();
  });
} else {
  new HelpCenter();
}