// language.js
class LanguageManager {
  constructor() {
    this.currentLang = localStorage.getItem('brains-lang') || 'en';
    this.typedInstance = null;
    this.init();
  }
  
  init() {
    this.setupDropdown();
    this.loadLanguage(this.currentLang);
    this.setupRTL();
    this.initializeTyped(); // Initialize Typed.js
  }
  
  setupDropdown() {
    const langBtn = document.getElementById('languageBtn');
    const dropdown = document.getElementById('languageDropdown');
    const footerLangs = document.querySelectorAll('.footer-lang');
    
    if (langBtn && dropdown) {
      langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', () => {
        dropdown.classList.remove('show');
      });
      
      // Handle language selection
      dropdown.querySelectorAll('.lang-option').forEach(option => {
        option.addEventListener('click', (e) => {
          e.stopPropagation();
          const lang = option.dataset.lang;
          this.changeLanguage(lang);
          dropdown.classList.remove('show');
        });
      });
    }
    
    // Footer language buttons
    footerLangs.forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        this.changeLanguage(lang);
      });
    });
  }
  
  changeLanguage(lang) {
    this.currentLang = lang;
    localStorage.setItem('brains-lang', lang);
    this.loadLanguage(lang);
    this.updateUI(lang);
    this.setupRTL();
    this.updateTypedText(); // Update Typed.js text
  }
  
  loadLanguage(lang) {
    const langData = translations[lang];
    if (!langData) return;
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (langData[key]) {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.placeholder = langData[key];
        } else {
          element.innerHTML = langData[key];
        }
      }
    });
    
    // Update current language display
    const currentLangEl = document.querySelector('.current-lang');
    if (currentLangEl) {
      currentLangEl.textContent = lang.toUpperCase();
    }
    
    // Update active state in dropdown
    document.querySelectorAll('.lang-option').forEach(option => {
      option.classList.remove('active');
      if (option.dataset.lang === lang) {
        option.classList.add('active');
      }
    });
  }
  
  initializeTyped() {
    // Destroy existing instance if it exists
    if (this.typedInstance) {
      this.typedInstance.destroy();
    }
    
    // Get strings for current language
    const langData = translations[this.currentLang];
    const strings = langData?.typedTexts || translations.en.typedTexts;
    
    // Create new Typed.js instance
    this.typedInstance = new Typed(".multiple-text", {
      strings: strings,
      typeSpeed: 70,
      backSpeed: 40,
      backDelay: 1500,
      loop: true,
      contentType: 'html',
      showCursor: true,
      cursorChar: '|',
      onDestroy: () => {
        console.log('Typed.js instance destroyed');
      }
    });
    
    // Store reference globally if needed
    window.typedInstance = this.typedInstance;
  }
  
updateTypedText() {
  const typedElement = document.querySelector('.multiple-text');
  if (typedElement) {
    typedElement.classList.add('loading');
  }
  
  // Destroy current instance
  if (this.typedInstance) {
    this.typedInstance.destroy();
    this.typedInstance = null;
  }
  
  // Reinitialize with new language strings
  setTimeout(() => {
    this.initializeTyped();
    
    // Remove loading class
    if (typedElement) {
      setTimeout(() => {
        typedElement.classList.remove('loading');
      }, 500);
    }
  }, 100);
}
  
  updateUI(lang) {
    // Update HTML dir attribute for RTL languages
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
      document.body.classList.add('rtl');
    } else {
      document.documentElement.dir = 'ltr';
      document.body.classList.remove('rtl');
    }
    
    // Update page title based on language
    const titles = {
      en: "Brains Accounting Software",
      fr: "Brains - Logiciel Comptable",
      ar: "برينز - البرنامج المحاسبي",
      pt: "Brains - Software Contábil"
    };
    
    if (titles[lang]) {
      document.title = titles[lang];
    }
  }
  
  setupRTL() {
    // Dispatch event for other components (like ScrollReveal)
    document.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { 
        language: this.currentLang, 
        isRTL: this.currentLang === 'ar' 
      } 
    }));
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.languageManager = new LanguageManager();
});