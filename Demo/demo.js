function showTab(tabId) {
  // Hide all tabs
  var tabs = document.querySelectorAll('.tab');
  var tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(function (tab) {
    tab.classList.remove('active');
  });
  tabs.forEach(function (tab) {
    if (tab.id === ('tab-' + tabId))
      tab.classList.add('selected');
    else
      tab.classList.remove('selected');
  });

  // Show the selected tab
  var selectedTab = document.getElementById(tabId);
  selectedTab.classList.add('active');

  window.scrollTo(0, 0);
  return;

}

 
// Add smooth interactions for product cards
document.addEventListener('DOMContentLoaded', function() {
  const productCards = document.querySelectorAll('.product-card');
  
  // Add click handler for mobile devices
  productCards.forEach(card => {
    card.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        this.classList.toggle('flipped');
      }
    });
  });
  
  // Add intersection observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  productCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });
});