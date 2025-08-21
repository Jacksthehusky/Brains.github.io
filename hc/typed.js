
var typed = new Typed(".multiple-text", {
    strings: [
      "Accounting.",
      "Stock Control.",
      "Payroll Systems.",
      "Inventory Management.",
      "POS.",
      "Invoicing.",
      "Payments.",
      "Supermarkets.",
      "Warehouse Management.",
      "Bank Reconciliation.",
      "Purchase Orders.",
      "Reports.",
      "Car Dealers.",
      "Foodstuff.",
      "Catering Factories.",
      "Auditing Firms.",
      "Spare Parts.",
      "Point of Sales Systems.",
      "Libraries.",
      "Clothes.",
      "Fashion."
    ],
    typeSpeed: 90,
    backSpeed: 40,
    backDelay: 1000,
    loop: true,
  });
  
  /*===============  Scroll reveal ===============*/
  ScrollReveal({
    //reset: true,
    distance: '80px',
    duration: 1000,
    delay: 100
  });
  
  ScrollReveal().reveal('.home-content, .map, .heading, .section-title', { origin:'top' });
  ScrollReveal().reveal('.home-img, .services-container, .portfolio-box, .contact form, .team, .about-content, .sys-icons', { origin:'bottom' });
  ScrollReveal().reveal('.home-content h1, .about-img', { origin:'left' });
  ScrollReveal().reveal('.home-content p, .systemreq-content, .system-requirements, .industries-section, .careers p, .contact p', { origin:'right' });
  