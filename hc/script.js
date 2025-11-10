function sendWhatsAppMessageFooter() {
  // Replace this with your WhatsApp number and message text
  var whatsappNumber = "+96171492657";
  var messageText = "Hello, I'm reaching out through your website. I'd like to inquire about your services.";

  // Generate the WhatsApp message URL
  var whatsappUrl =
    "https://api.whatsapp.com/send?phone=" +
    whatsappNumber +
    "&text=" +
    encodeURIComponent(messageText);

  // Open the WhatsApp message URL in a new window
  window.open(whatsappUrl);
}

function sendWhatsAppMessageHome() {
  // Replace this with your WhatsApp number and message text
  var whatsappNumber = "+96171492657";
  var messageText = "Hi, I found your website and I'm interested in learning more about your services. Could you please assist me?";

  // Generate the WhatsApp message URL
  var whatsappUrl =
    "https://api.whatsapp.com/send?phone=" +
    whatsappNumber +
    "&text=" +
    encodeURIComponent(messageText);

  // Open the WhatsApp message URL in a new window
  window.open(whatsappUrl);
}

function sendWhatsAppMessageMichel() {
  // Replace this with your WhatsApp number and message text
  var whatsappNumber = "+9613751442";
  var messageText =
    "Hi Mr. Michel, while visiting your website, I came across your software and I am interested in learning more about it. Could you provide me with additional information?";

  // Generate the WhatsApp message URL
  var whatsappUrl =
    "https://api.whatsapp.com/send?phone=" +
    whatsappNumber +
    "&text=" +
    encodeURIComponent(messageText);

  // Open the WhatsApp message URL in a new window
  window.open(whatsappUrl);
}

function sendWhatsAppMessageNassar() {
  // Replace this with your WhatsApp number and message text
  var whatsappNumber = "+9613751440";
  var messageText =
    "Hi Mr. Nassar, while visiting your website, I came across your software and I am interested in learning more about it. Could you provide me with additional information?";

  // Generate the WhatsApp message URL
  var whatsappUrl =
    "https://api.whatsapp.com/send?phone=" +
    whatsappNumber +
    "&text=" +
    encodeURIComponent(messageText);

  // Open the WhatsApp message URL in a new window
  window.open(whatsappUrl);
}

// Modal Image Gallery
function onClick(element) {
  document.getElementById("img01").src = element.src;
  document.getElementById("modal01").style.display = "block";
  var captionText = document.getElementById("caption");
  captionText.innerHTML = element.alt;
}

// Toggle between showing and hiding the sidebar when clicking the menu icon
function w3_open() {
  var mySidebar = document.getElementById("mySidebar");
  if (mySidebar.style.display === "block") {
    mySidebar.style.display = "none";
  } else {
    mySidebar.style.display = "block";
  }
}
function w3_close() {
  var mySidebar = document.getElementById("mySidebar");
  mySidebar.style.display = "none";
}

/*===============  Scroll sections active link ===============*/
let sections = document.querySelectorAll("section");
let navlinks = document.querySelectorAll("div.header a.navbartop");

window.addEventListener("scroll", () => {
  sections.forEach((sec) => {
    let top = window.scrollY;
    let offset = sec.offsetTop - 150;
    let height = sec.offsetHeight;
    let id = sec.getAttribute("id");

    if (top >= offset && top < offset + height) {
      navlinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href").includes(id)) {
          link.classList.add("active");
        }
      });
    }
  });
});


// Dark Mode Functionality
class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById('themeToggle');
    this.currentTheme = localStorage.getItem('theme') || 'light';
    
    this.init();
  }
  
  init() {
    // Set initial theme
    this.setTheme(this.currentTheme);
    
    // Add event listener
    this.themeToggle.addEventListener('click', () => {
      this.toggleTheme();
    });
    
    // Listen for system theme changes
    this.watchSystemTheme();
  }
  
  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.updateToggleIcon(theme);
  }
  
  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(this.currentTheme);
  }
  
  updateToggleIcon(theme) {
    const sunIcon = this.themeToggle.querySelector('.fa-sun');
    const moonIcon = this.themeToggle.querySelector('.fa-moon');
    
    if (theme === 'dark') {
      sunIcon.style.opacity = '0.5';
      moonIcon.style.opacity = '1';
    } else {
      sunIcon.style.opacity = '1';
      moonIcon.style.opacity = '0.5';
    }
  }
  
  watchSystemTheme() {
    // Check if user prefers dark mode
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set initial theme based on system preference if no user preference exists
    if (!localStorage.getItem('theme') && systemPrefersDark.matches) {
      this.setTheme('dark');
    }
    
    // Listen for system theme changes
    systemPrefersDark.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();
});

// Alternative simple implementation if you prefer:
/*
const themeToggle = document.getElementById('themeToggle');
const currentTheme = localStorage.getItem('theme') || 'light';

document.documentElement.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});
*/