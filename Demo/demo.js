function showTab(tabId) {
  // Hide all tabs
  var tabs = document.querySelectorAll(".tab");
  var tabContents = document.querySelectorAll(".tab-content");
  tabContents.forEach(function (tab) {
    tab.classList.remove("active");
  });
  tabs.forEach(function (tab) {
    if (tab.id === "tab-" + tabId) tab.classList.add("selected");
    else tab.classList.remove("selected");
  });

  // Show the selected tab
  var selectedTab = document.getElementById(tabId);
  selectedTab.classList.add("active");

  window.scrollTo(0, 0);
  return;
}

// Improved product cards interaction
document.addEventListener("DOMContentLoaded", function () {
  const productCards = document.querySelectorAll(".product-card");

  // Handle card interactions
  productCards.forEach((card) => {
    card.addEventListener("click", function (e) {
      // Only handle mobile clicks
      if (window.innerWidth <= 768) {
        // Don't flip if clicking on actual links or buttons
        if (e.target.closest("a") || e.target.closest("button")) {
          return; // Allow links and buttons to work normally
        }

        e.preventDefault();
        this.classList.toggle("flipped");
      }
    });
  });

  // Close flipped cards when clicking outside (mobile only)
  document.addEventListener("click", function (e) {
    if (window.innerWidth <= 768) {
      const flippedCards = document.querySelectorAll(".product-card.flipped");
      flippedCards.forEach((card) => {
        if (!card.contains(e.target)) {
          card.classList.remove("flipped");
        }
      });
    }
  });

  // Intersection observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  productCards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(card);
  });
});
