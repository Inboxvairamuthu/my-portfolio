document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Menu Toggle ---
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = mobileMenu.querySelectorAll('a');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      mobileMenu.classList.toggle('flex');
      // Toggle button icon representation if needed
      const icon = menuBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
        const icon = menuBtn.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  // --- Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Stop observing once animated
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealOnScroll.observe(element);
  });

  // --- Scroll Spy (Active Nav Link Link Highlight) ---
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  const scrollSpy = () => {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 100; // offset for navbar height

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-teal-400');
      link.classList.add('text-slate-300');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.remove('text-slate-300');
        link.classList.add('text-teal-400');
      }
    });
  };

  window.addEventListener('scroll', scrollSpy);
  scrollSpy(); // run once on load

  // --- Copy to Clipboard Utility ---
  const copyButtons = document.querySelectorAll('[data-copy]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      
      navigator.clipboard.writeText(textToCopy).then(() => {
        // Visual feedback
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check text-green-400 mr-2"></i>Copied!';
        btn.classList.add('border-green-500', 'text-green-400');
        
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.remove('border-green-500', 'text-green-400');
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    });
  });

  // --- Contact Form Submission & Validation ---
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const formSubmitBtn = document.getElementById('form-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const fallbackSubmit = () => {
        console.warn('AJAX submit failed. Falling back to standard form submission.');
        contactForm.setAttribute('action', 'https://api.web3forms.com/submit');
        contactForm.setAttribute('method', 'POST');
        contactForm.submit();
      };

      // Basic client-side check
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !subject || !message) {
        alert('Please fill in all fields.');
        return;
      }

      // Change button state to loading
      const originalBtnText = formSubmitBtn.innerHTML;
      formSubmitBtn.disabled = true;
      formSubmitBtn.innerHTML = '<i class="fa-solid fa-circle-notch animate-spin mr-2"></i>Sending...';

      // Send actual POST request to Web3Forms
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: '680b8957-1088-400f-bce8-575a4e5eedc9',
          name: name,
          email: email,
          subject: subject,
          message: message,
          from_name: 'Vairamuthu Portfolio Contact Form'
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success === "true" || data.success === true) {
          formSubmitBtn.disabled = false;
          formSubmitBtn.innerHTML = originalBtnText;
          
          // Reset form & display success message
          contactForm.reset();
          if (formSuccess) {
            formSuccess.classList.remove('hidden');
            formSuccess.classList.add('flex');
            
            // Auto scroll to success message
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Fade success message out after 5 seconds
            setTimeout(() => {
              formSuccess.classList.add('opacity-0');
              setTimeout(() => {
                formSuccess.classList.add('hidden');
                formSuccess.classList.remove('flex', 'opacity-0');
              }, 500);
            }, 5000);
          }
        } else {
          // If response says error (e.g. key not working), do standard form submission
          fallbackSubmit();
        }
      })
      .catch(err => {
        console.error('AJAX Error:', err);
        // If fetch fails (CORS, file:// protocol, network error), do standard form submission
        fallbackSubmit();
      });
    });
  }
});
