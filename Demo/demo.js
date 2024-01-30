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

 