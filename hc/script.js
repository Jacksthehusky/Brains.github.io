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


// Loading Screen Logic
document.addEventListener('DOMContentLoaded', function() {
    const loadingWrapper = document.getElementById('loadingWrapper');
    const mainContent = document.getElementById('mainContent');
    const progressFill = document.querySelector('.progress-fill');
    const loadingStatus = document.querySelector('.loading-status');
    
    // Simple loading stages
    const loadingStages = [
        { text: "Initializing systems...", progress: 10 },
        { text: "Loading modules...", progress: 25 },
        { text: "Establishing connection...", progress: 45 },
        { text: "Processing data...", progress: 65 },
        { text: "Finalizing setup...", progress: 85 },
        { text: "Ready!", progress: 100 }
    ];
    
    let currentStage = 0;
    let progress = 0;
    
    // Update loading stage
    function updateLoadingStage() {
        if (currentStage < loadingStages.length) {
            const stage = loadingStages[currentStage];
            
            // Update status text with fade animation
            loadingStatus.style.opacity = '0';
            loadingStatus.style.transform = 'translateY(5px)';
            
            setTimeout(() => {
                loadingStatus.textContent = stage.text;
                loadingStatus.style.opacity = '1';
                loadingStatus.style.transform = 'translateY(0)';
                loadingStatus.style.transition = 'all 0.3s ease';
            }, 150);
            
            // Smooth progress bar animation
            progressFill.style.transition = 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            progressFill.style.width = stage.progress + '%';
            
            currentStage++;
            
            // Continue to next stage or complete
            if (currentStage < loadingStages.length) {
                // Vary delay based on stage
                const delay = currentStage === loadingStages.length - 1 ? 600 : 800;
                setTimeout(updateLoadingStage, delay);
            } else {
                // Final stage - complete loading
                setTimeout(completeLoading, 800);
            }
        }
    }
    
    // Complete loading sequence
    function completeLoading() {
        // Add 'done' class to trigger fade out
        loadingWrapper.classList.add('done');
        
        // Show main content after a slight delay
        setTimeout(() => {
            mainContent.classList.add('visible');
            
            // Remove loading wrapper from DOM after transition
            setTimeout(() => {
                loadingWrapper.style.display = 'none';
                
                // Dispatch custom event for other scripts
                document.dispatchEvent(new Event('loadingComplete'));
            }, 1000);
        }, 300);
    }
    
    // Start loading sequence after a brief delay
    setTimeout(updateLoadingStage, 500);
    
    // Optional: Skip loading with Escape key (for testing)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !loadingWrapper.classList.contains('done')) {
            // Jump to final stage
            currentStage = loadingStages.length - 1;
            const finalStage = loadingStages[currentStage - 1];
            loadingStatus.textContent = finalStage.text;
            progressFill.style.width = '100%';
            progressFill.style.transition = 'width 0.3s ease';
            
            setTimeout(completeLoading, 300);
        }
    });
    
    // Optional: Listen for window load event for faster completion
    window.addEventListener('load', function() {
        if (!loadingWrapper.classList.contains('done')) {
            // If page loads before our sequence completes, speed it up
            const remainingTime = Math.max(0, (loadingStages.length - currentStage) * 200);
            setTimeout(() => {
                loadingStatus.textContent = "Ready!";
                progressFill.style.width = '100%';
                progressFill.style.transition = 'width 0.3s ease';
                
                setTimeout(completeLoading, 300);
            }, remainingTime);
        }
    });
});

// Add some dynamic CSS for animations
const style = document.createElement('style');
style.textContent = `
    /* Add some bounce to letters */
    .letter {
        transition: transform 0.3s ease, color 0.3s ease;
    }
    
    .letter:hover {
        transform: translateY(-5px);
        color: var(--primary-light);
    }
    
    /* Loading status animation */
    .loading-status {
        animation: pulse 2s ease-in-out infinite;
    }
`;
document.head.appendChild(style);