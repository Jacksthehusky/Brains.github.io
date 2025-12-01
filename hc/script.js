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


// Client Logos Slider
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.logos-slider');
    const slides = document.querySelectorAll('.logo-slide');
    const dotsContainer = document.getElementById('sliderDots');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const statNumbers = document.querySelectorAll('.stat-number');
    
    let currentSlide = 0;
    let slideInterval;
    const slideDuration = 3000; // 3 seconds per slide (1 second pause + 2 seconds transition)
    
    // Initialize dots
    function initDots() {
        dotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
            dot.setAttribute('data-slide', index);
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }
    
    // Update slider position
    function updateSlider() {
        const translateX = -currentSlide * 100;
        slider.style.transform = `translateX(${translateX}%)`;
        
        // Update dots
        document.querySelectorAll('.slider-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        // Update button states
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === slides.length - 1;
    }
    
    // Go to specific slide
    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateSlider();
        resetAutoSlide();
    }
    
    // Next slide
    function nextSlide() {
        if (currentSlide < slides.length - 1) {
            currentSlide++;
        } else {
            currentSlide = 0; // Loop back to start
        }
        updateSlider();
        resetAutoSlide();
    }
    
    // Previous slide
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
        } else {
            currentSlide = slides.length - 1; // Loop to end
        }
        updateSlider();
        resetAutoSlide();
    }
    
    // Auto slide
    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, slideDuration);
    }
    
    function resetAutoSlide() {
        clearInterval(slideInterval);
        startAutoSlide();
    }
    
    // Pause on hover
    slider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    slider.addEventListener('mouseleave', () => {
        startAutoSlide();
    });
    
    // Button events
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (document.querySelector('.trust-section').matches(':hover')) {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        }
    });
    
    // Animate stats counter
    function animateStats() {
        statNumbers.forEach(stat => {
            const target = parseFloat(stat.getAttribute('data-count'));
            const suffix = stat.getAttribute('data-suffix') || '';
            const duration = 2000;
            const startValue = 0;
            const startTime = Date.now();
            
            function update() {
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const currentValue = startValue + (target - startValue) * easeOutQuart;
                
                // Format number
                let displayValue;
                if (target % 1 === 0) {
                    displayValue = Math.round(currentValue);
                } else {
                    displayValue = currentValue.toFixed(1);
                }
                
                stat.textContent = displayValue;
                stat.setAttribute('data-suffix', suffix);
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }
            
            // Delay animation based on slide position
            setTimeout(update, currentSlide * 300);
        });
    }
    
    // Initialize
    initDots();
    updateSlider();
    startAutoSlide();
    
    // Start stats animation when section is in view
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            observer.unobserve(entry.target);
        }
    });
}, { 
    threshold: 0.1, // Trigger when 10% is visible
    rootMargin: '5px' // Add 5px margin around viewport
});
    
    observer.observe(document.querySelector('.trust-section'));
    
    // Add auto-scroll animation for infinite effect (optional)
    function addInfiniteScroll() {
        // Clone slides for seamless infinite effect
        const clone = slider.cloneNode(true);
        slider.parentNode.appendChild(clone);
        clone.style.position = 'absolute';
        clone.style.top = '0';
        clone.style.left = '100%';
        
        // Add animation
        slider.classList.add('auto-scrolling');
        clone.classList.add('auto-scrolling');
    }
    
    // Uncomment for infinite scroll effect
    // addInfiniteScroll();
});

// Add touch/swipe support for mobile
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.logos-slider');
    let startX = 0;
    let isDragging = false;
    
    slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    }, { passive: true });
    
    slider.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const diff = startX - currentX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                // Swipe left - next slide
                document.querySelector('.next-btn').click();
            } else {
                // Swipe right - previous slide
                document.querySelector('.prev-btn').click();
            }
            isDragging = false;
        }
    }, { passive: true });
    
    slider.addEventListener('touchend', () => {
        isDragging = false;
    });
});