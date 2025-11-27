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
function onClick(element, index) {
  const modal = document.getElementById("modal01");
  const modalImg = document.getElementById("img01");
  const captionText = document.getElementById("caption");

  if (!modal || !modalImg || !captionText) return; // <- SAFETY CHECK

  modal.style.display = "block";
  modalImg.src = element.src;
  captionText.innerHTML = element.alt;
}

// Close modal when clicking the X
const closeModalBtn = document.querySelector(".close-modal");
if (closeModalBtn) {
  closeModalBtn.addEventListener("click", () => {
    document.getElementById("modal01").style.display = "none";
  });
}

// Close modal when clicking outside the image
const modalContainer = document.getElementById("modal01");
if (modalContainer) {
  modalContainer.addEventListener("click", (e) => {
    if (e.target.id === "modal01") {
      document.getElementById("modal01").style.display = "none";
    }
  });
}

//Burger Menu
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
    this.currentTheme = localStorage.getItem("theme") || "dark"; // Changed to dark

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

    // Only use system preference if no user preference exists
    if (!localStorage.getItem("theme")) {
      // Since we set default to "dark" above, this will only run if localStorage is truly empty
      if (systemPrefersDark.matches) {
        this.setTheme("dark");
      } else {
        this.setTheme("light");
      }
    }

    // Listen for system theme changes (only when no user preference)
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

    this.pos = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 };

    this.init();
    this.animate();
  }

  init() {
    if (!this.gradient || !this.cardWrapper) return;

    this.cardWrapper.addEventListener("mouseenter", () => {
      this.isActive = true;
      this.gradient.style.opacity = "0.35";
      this.gradient.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0) scale(1.6)`;
    });

    this.cardWrapper.addEventListener("mouseleave", () => {
      this.isActive = false;
      this.gradient.style.opacity = "0";
      this.target = { x: 0, y: 0 };
    });

    this.cardWrapper.addEventListener("mousemove", (e) => {
      const rect = this.cardWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      this.target.x = x;
      this.target.y = y;
    });
  }

  // smoothing interpolation (like inertia)
  animate() {
    this.pos.x += (this.target.x - this.pos.x) * 0.16;
    this.pos.y += (this.target.y - this.pos.y) * 0.16;

    this.gradient.style.transform =
      `translate3d(${this.pos.x}px, ${this.pos.y}px, 0) scale(${this.isActive ? 1.6 : 0.8})`;

    requestAnimationFrame(() => this.animate());
  }
}
document.addEventListener("DOMContentLoaded", () => {
  new GradientEffect();
});

