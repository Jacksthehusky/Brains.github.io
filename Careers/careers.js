// Add smooth form submission feedback
document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.modern-form');
  const submitBtn = form.querySelector('.modern-btn');
  
  form.addEventListener('submit', function(e) {
    // Add loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate form submission (remove this in production)
    setTimeout(() => {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }, 2000);
  });
});