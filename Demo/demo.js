function showTab(tabId) {
    // Hide all tabs
    var tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(function (tab) {
      tab.classList.remove('active');
    });

     // Show the selected tab
  var selectedTab = document.getElementById(tabId);
  selectedTab.classList.add('active');

  // Get the section element
  var section = document.querySelector('section');

  // Map tab IDs to background colors (you can customize these colors)
  var colorMap = {
    'home': '#FFFFFF',
    'menu1': '#eda1a1',
    'menu2': '#abd9ad',
    'menu3': '#97cdf9',
    'menu4': '#ffcf88',
    'menu5': '#B8A2DD',
  };

  // Change the background color of the section based on the selected tab
  section.style.backgroundColor = colorMap[tabId];
}