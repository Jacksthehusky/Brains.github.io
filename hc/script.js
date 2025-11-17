function sendWhatsAppMessageFooter() {
  // Replace this with your WhatsApp number and message text
  var whatsappNumber = "+96171492657";
  var messageText =
    "Hello, I'm reaching out through your website. I'd like to inquire about your services.";

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
  var messageText =
    "Hi, I found your website and I'm interested in learning more about your services. Could you please assist me?";

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
/*function w3_open() {
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
}*/
const burgerMenu = document.querySelector('.burger-menu');
const navMenu = document.querySelector('header nav ul');

burgerMenu.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Optional: Close menu when clicking on a link
const navLinks = document.querySelectorAll('header nav ul li a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Optional: Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !burgerMenu.contains(e.target)) {
        navMenu.classList.remove('active');
    }
});

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
    this.themeToggle = document.getElementById("themeToggle");
    this.currentTheme = localStorage.getItem("theme") || "light";

    this.init();
  }

  init() {
    // Set initial theme
    this.setTheme(this.currentTheme);

    // Add event listener
    this.themeToggle.addEventListener("click", () => {
      this.toggleTheme();
    });

    // Listen for system theme changes
    this.watchSystemTheme();
  }

  setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    this.updateToggleIcon(theme);
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
    this.setTheme(this.currentTheme);
  }

  updateToggleIcon(theme) {
    const sunIcon = this.themeToggle.querySelector(".fa-sun");
    const moonIcon = this.themeToggle.querySelector(".fa-moon");

    if (theme === "dark") {
      sunIcon.style.opacity = "0.5";
      moonIcon.style.opacity = "1";
    } else {
      sunIcon.style.opacity = "1";
      moonIcon.style.opacity = "0.5";
    }
  }

  watchSystemTheme() {
    // Check if user prefers dark mode
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)");

    // Set initial theme based on system preference if no user preference exists
    if (!localStorage.getItem("theme") && systemPrefersDark.matches) {
      this.setTheme("dark");
    }

    // Listen for system theme changes
    systemPrefersDark.addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        this.setTheme(e.matches ? "dark" : "light");
      }
    });
  }
}

// Initialize theme manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ThemeManager();
});


// Mouse Follow Effect
class GradientEffect {
  constructor() {
    this.gradient = document.querySelector(".effect-gradient");
    this.cardWrapper = document.querySelector(".gradient-card-wrapper");
    this.isActive = false;

    this.init();
  }

  init() {
    if (!this.gradient || !this.cardWrapper) return;

    this.cardWrapper.addEventListener("mouseenter", () => {
      this.isActive = true;
      this.gradient.style.opacity = "0.3";
    });

    this.cardWrapper.addEventListener("mouseleave", () => {
      this.isActive = false;
      this.gradient.style.opacity = "0";
      this.resetGradientPosition();
    });

    this.cardWrapper.addEventListener("mousemove", (e) => {
      if (!this.isActive) return;
      this.updateGradientPosition(e);
    });
  }

  updateGradientPosition(e) {
    const rect = this.cardWrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const posX = (x / rect.width) * 100;
    const posY = (y / rect.height) * 100;

    this.gradient.style.left = `${posX}%`;
    this.gradient.style.top = `${posY}%`;
    this.gradient.style.transform = `translate(-50%, -50%) scale(1.5)`;
  }

  resetGradientPosition() {
    this.gradient.style.left = "50%";
    this.gradient.style.top = "50%";
    this.gradient.style.transform = "translate(-50%, -50%) scale(0.2)";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new GradientEffect();
});
