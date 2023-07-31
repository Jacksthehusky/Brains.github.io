
var typed = new Typed(".multiple-text", {
    strings: [
      "Accounting.",
      "Stock Control.",
      "Payroll.",
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
      "Catering Factories.",
      "Auditing Firms.",
      "Spare Parts.",
      "Schools.",
      "Libraries.",
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
    duration: 2000,
    delay: 200
  });
  
  ScrollReveal().reveal('.home-content, .map, .heading', { origin:'top' });
  ScrollReveal().reveal('.home-img, .services-container, .portfolio-box, .contact form, .team, .about-content, .sys-icons', { origin:'bottom' });
  ScrollReveal().reveal('.home-content h1, .about-img', { origin:'left' });
  ScrollReveal().reveal('.home-content p, .systemreq-content, .careers p', { origin:'right' });
  