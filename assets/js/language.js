// language.js
class LanguageManager {
  constructor() {
    this.currentLang = localStorage.getItem('brains-lang') || 'en';
    this.init();
  }
  
  init() {
    this.setupDropdown();
    this.loadLanguage(this.currentLang);
    this.setupRTL();
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
    
    // Update Typed.js for different languages if needed
    this.updateTypedText(lang);
  }
  
  updateTypedText(lang) {
    // You can create different typed arrays for each language
    const typedTexts = {
      en: [
        '<i class="fas fa-layer-group"></i> Complete Business Software Suite',
        '<i class="fas fa-store"></i> For Retail, Restaurants &amp; Service Businesses',
        '<i class="fas fa-sync-alt"></i> All-in-One: POS, Accounting &amp; Inventory',
        '<i class="fas fa-bolt"></i> Works Online &amp; Offline + Multi-Location Sync'
        // ... rest of English array
      ],
      fr: [
        '<i class="fas fa-layer-group"></i> Suite logicielle commerciale complète',
        '<i class="fas fa-store"></i> Pour détaillants, restaurants &amp; services',
        '<i class="fas fa-sync-alt"></i> Tout-en-un: PDV, comptabilité &amp; inventaire',
        '<i class="fas fa-bolt"></i> Fonctionne en ligne &amp; hors ligne + synchronisation multi-sites'
      ],
      ar: [
        '<i class="fas fa-layer-group"></i> مجموعة برامج الأعمال الكاملة',
        '<i class="fas fa-store"></i> للتجار والمطاعم &amp; شركات الخدمات',
        '<i class="fas fa-sync-alt"></i> شامل: نقطة البيع، المحاسبة &amp; المخزون',
        '<i class="fas fa-bolt"></i> يعمل عبر الإنترنت &amp; دون اتصال + مزامنة متعددة المواقع'
      ],
      pt: [
        '<i class="fas fa-layer-group"></i> Suíte de Software Empresarial Completa',
        '<i class="fas fa-store"></i> Para varejo, restaurantes &amp; serviços',
        '<i class="fas fa-sync-alt"></i> Tudo-em-um: PDV, contabilidade &amp; inventário',
        '<i class="fas fa-bolt"></i> Funciona online &amp; offline + sincronização multi-local'
      ]
    };
    
    // Update Typed.js instance if it exists
    if (window.typedInstance && typedTexts[lang]) {
      window.typedInstance.destroy();
      window.typedInstance = new Typed(".multiple-text", {
        strings: typedTexts[lang],
        typeSpeed: 70,
        backSpeed: 40,
        backDelay: 1500,
        loop: true,
        contentType: 'html'
      });
    }
  }
  
  updateUI(lang) {
    // Update HTML dir attribute for RTL languages
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
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
    // Add RTL specific styles if needed
    if (this.currentLang === 'ar') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.languageManager = new LanguageManager();
});