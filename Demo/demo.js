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

 
// Improved product cards interaction
document.addEventListener('DOMContentLoaded', function() {
  const productCards = document.querySelectorAll('.product-card');
  let isMobile = window.innerWidth <= 768;

  // Handle card interactions
  productCards.forEach(card => {
    const viewFeaturesBtn = card.querySelector('.btn-view-features');
    
    // Mobile: tap to flip
    card.addEventListener('click', function(e) {
      if (isMobile && !e.target.closest('a') && !e.target.closest('.btn-view-features')) {
        e.preventDefault();
        this.classList.toggle('flipped');
      }
    });
    
    // Desktop: view features button
    if (viewFeaturesBtn) {
      viewFeaturesBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        card.classList.add('flipped');
      });
    }
    
    // Close back card
    if (closeBackBtn) {
      closeBackBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        card.classList.remove('flipped');
      });
    }
  });

  // Handle window resize
  window.addEventListener('resize', function() {
    isMobile = window.innerWidth <= 768;
  });

  // Intersection observer for animations
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