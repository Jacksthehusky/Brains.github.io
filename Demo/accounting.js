class DemoPage {
  constructor() {
    this.currentTab = 'overview';
    this.tabOrder = ['overview', 'data-entry', 'operations', 'reports', 'session', 'system'];
    
    this.init();
  }
  
  init() {
    this.setupTabNavigation();
    this.setupNextButtons();
    this.setupNavigation();
  }
  
  setupTabNavigation() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        this.switchTab(tabId);
      });
    });
  }
  
  setupNextButtons() {
    const nextBtns = document.querySelectorAll('.next-tab-btn');
    
    nextBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const nextTab = btn.dataset.nextTab;
        this.switchTab(nextTab);
      });
    });
  }
  
  setupNavigation() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    prevBtn.addEventListener('click', () => this.previousTab());
    nextBtn.addEventListener('click', () => this.nextTab());
  }
  
  switchTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
      tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabId).classList.add('active');
    
    // Activate corresponding button
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    
    this.currentTab = tabId;
    this.updateNavigation();
  }
  
  nextTab() {
    const currentIndex = this.tabOrder.indexOf(this.currentTab);
    if (currentIndex < this.tabOrder.length - 1) {
      this.switchTab(this.tabOrder[currentIndex + 1]);
    }
  }
  
  previousTab() {
    const currentIndex = this.tabOrder.indexOf(this.currentTab);
    if (currentIndex > 0) {
      this.switchTab(this.tabOrder[currentIndex - 1]);
    }
  }
  
  updateNavigation() {
    const currentIndex = this.tabOrder.indexOf(this.currentTab);
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
    prevBtn.disabled = currentIndex === 0;
    
    nextBtn.style.opacity = currentIndex === this.tabOrder.length - 1 ? '0.5' : '1';
    nextBtn.disabled = currentIndex === this.tabOrder.length - 1;
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  new DemoPage();
});