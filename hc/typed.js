
var typed = new Typed(".multiple-text", {
    strings: [
      "Accounting",
      "Stock Control",
      "Payroll Systems",
      "Inventory Management",
      "POS Systems",
      "Invoicing",
      "Payments",
      "Supermarkets",
      "Warehouse Management",
      "Bank Reconciliation",
      "Purchase Orders",
      "Reports",
      "Car Dealers",
      "Foodstuff",
      "Catering Factories",
      "Auditing Firms",
      "Spare Parts",
      "Libraries",
      "Clothes",
      "Fashion Stores",
      "Pharmacies",
      "Electronics Stores",
      "Mobile Shops",
      "Hardware Stores",
      "Beauty Centers",
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
  ScrollReveal().reveal('.home-img, .services-section-header, .system-requirements, .industries-section, .contact form, .team, .about-content, .sys-icons', { origin:'bottom' });
  ScrollReveal().reveal('.home-content h1, .about-img', { origin:'left' });
  ScrollReveal().reveal('.home-content p, .careers p, .nav-right, .contact p', { origin:'right' });
  


  (() => {
  const scrollContainer = document.getElementById("smooth-scroll");

  let current = 0;
  let target = 0;
  let ease = 0.07;     // adjust for more/less smoothing
  let speed = 0;

  // measure page height
  function updateHeight() {
    document.body.style.height = scrollContainer.getBoundingClientRect().height + "px";
  }
  updateHeight();
  new ResizeObserver(updateHeight).observe(scrollContainer);

  // wheel listener
  window.addEventListener(
    "wheel",
    (e) => {
      target += e.deltaY;
      // clamp
      target = Math.max(0, Math.min(target, document.body.scrollHeight - window.innerHeight));
    },
    { passive: true }
  );

  function raf() {
    // inertia
    current += (target - current) * ease;

    // transform for GPU rendering
    scrollContainer.style.transform = `translate3d(0, ${-current}px, 0)`;

    requestAnimationFrame(raf);
  }

  raf();
})();
