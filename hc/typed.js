var typed = new Typed(".multiple-text", {
  strings: [
    // ANSWER THE 3 KEY QUESTIONS FIRST (CRITICAL)
    '<i class="fas fa-layer-group"></i> Complete Business Software Suite', // WHAT
    '<i class="fas fa-store"></i> For Retail, Restaurants &amp; Service Businesses', // WHO
    '<i class="fas fa-sync-alt"></i> All-in-One: POS, Accounting &amp; Inventory', // WHAT (specific)
    '<i class="fas fa-bolt"></i> Works Online &amp; Offline + Multi-Location Sync', // WHY
    
    // Now continue with specific industries/features with icons
    '<i class="fas fa-calculator"></i> Accounting Systems',
    '<i class="fas fa-boxes"></i> Stock Control',
    '<i class="fas fa-users-cog"></i> Payroll Systems',
    '<i class="fas fa-warehouse"></i> Inventory Management',
    '<i class="fas fa-cash-register"></i> POS Systems',
    '<i class="fas fa-shopping-cart"></i> Retail Stores',
    '<i class="fas fa-car"></i> Auto Parts',
    '<i class="fas fa-cut"></i> Salons',
    '<i class="fas fa-tshirt"></i> Boutiques',
    '<i class="fas fa-file-invoice-dollar"></i> Invoicing',
    '<i class="fas fa-credit-card"></i> Payments',
    '<i class="fas fa-shopping-basket"></i> Supermarkets',
    '<i class="fas fa-pallet"></i> Warehouse Management',
    '<i class="fas fa-university"></i> Bank Reconciliation',
    '<i class="fas fa-clipboard-list"></i> Purchase Orders',
    '<i class="fas fa-chart-bar"></i> Reports',
    '<i class="fas fa-car-side"></i> Car Dealers',
    '<i class="fas fa-apple-alt"></i> Foodstuff',
    '<i class="fas fa-industry"></i> Catering Factories',
    '<i class="fas fa-search-dollar"></i> Auditing Firms',
    '<i class="fas fa-cogs"></i> Spare Parts',
    '<i class="fas fa-book"></i> Libraries',
    '<i class="fas fa-tshirt"></i> Clothes',
    '<i class="fas fa-vest"></i> Fashion Stores',
    '<i class="fas fa-pills"></i> Pharmacies',
    '<i class="fas fa-tv"></i> Electronics Stores',
    '<i class="fas fa-mobile-alt"></i> Mobile Shops',
    '<i class="fas fa-tools"></i> Hardware Stores',
    '<i class="fas fa-spa"></i> Beauty Centers',
    '<i class="fas fa-coffee"></i> Coffee Shops',
    '<i class="fas fa-bread-slice"></i> Bakeries',
    '<i class="fas fa-gem"></i> Jewelry Stores',
    '<i class="fas fa-hotel"></i> Hotels',
    '<i class="fas fa-key"></i> Rental Services',
    '<i class="fas fa-truck"></i> Logistics',
    '<i class="fas fa-chart-line"></i> Analytics',
    '<i class="fas fa-sync"></i> Real-Time Sync',
    '<i class="fas fa-shield-alt"></i> Secure &amp; Reliable'
  ],
  typeSpeed: 70,
  backSpeed: 40,
  backDelay: 1500,
  loop: true,
  contentType: 'html',
 
});
  
  /*===============  Scroll reveal ===============*/
  ScrollReveal({
    //reset: true,
    distance: '80px',
    duration: 1000,
    delay: 100
  });
  
  ScrollReveal().reveal('.home-content, .map, .section-title, .support-form-container', { origin:'top'});
  ScrollReveal().reveal('.home-img, .about-img, .section-subtitle, .system-requirements, .featured-articles, .modern-support, .about-content, .sys-icons', { origin:'bottom'});
  ScrollReveal().reveal('.home-content h1', { origin:'left'});
  ScrollReveal().reveal('.home-content p, .contact p', { origin:'right'});
  
