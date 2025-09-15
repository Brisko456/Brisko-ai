// Theme Management
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'light';
    this.init();
  }

  init() {
    this.setTheme(this.theme);
    this.bindEvents();
  }

  setTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.updateThemeIcon();
  }

  toggle() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  updateThemeIcon() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const icon = toggle.querySelector('.theme-icon');
    if (this.theme === 'dark') {
      icon.innerHTML = `
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      `;
    } else {
      icon.innerHTML = `
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      `;
    }
  }

  bindEvents() {
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => this.toggle());
    }
  }
}

// Mobile Navigation
class MobileNav {
  constructor() {
    this.isOpen = false;
    this.init();
  }

  init() {
    this.bindEvents();
  }

  toggle() {
    this.isOpen = !this.isOpen;
    const menu = document.getElementById('nav-menu');
    const toggle = document.getElementById('mobile-toggle');
    
    if (menu) {
      menu.classList.toggle('active', this.isOpen);
    }
    
    if (toggle) {
      toggle.classList.toggle('active', this.isOpen);
    }
  }

  close() {
    this.isOpen = false;
    const menu = document.getElementById('nav-menu');
    const toggle = document.getElementById('mobile-toggle');
    
    if (menu) {
      menu.classList.remove('active');
    }
    
    if (toggle) {
      toggle.classList.remove('active');
    }
  }

  bindEvents() {
    const toggle = document.getElementById('mobile-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => this.toggle());
    }

    // Close menu when clicking nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => this.close());
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      const nav = document.querySelector('.nav');
      if (this.isOpen && nav && !nav.contains(e.target)) {
        this.close();
      }
    });
  }
}

// Form Validation
class FormValidator {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.init();
  }

  init() {
    if (!this.form) return;
    this.bindEvents();
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  validateRequired(value) {
    return value.trim().length > 0;
  }

  showError(input, message) {
    this.clearError(input);
    
    const errorElement = document.createElement('span');
    errorElement.className = 'form-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
      color: var(--color-error-500);
      font-size: var(--font-size-sm);
      margin-top: var(--space-1);
      display: block;
    `;
    
    input.parentNode.appendChild(errorElement);
    input.style.borderColor = 'var(--color-error-500)';
  }

  clearError(input) {
    const existingError = input.parentNode.querySelector('.form-error');
    if (existingError) {
      existingError.remove();
    }
    input.style.borderColor = '';
  }

  validateForm() {
    let isValid = true;
    const formData = new FormData(this.form);

    // Clear all previous errors
    this.form.querySelectorAll('input, textarea').forEach(input => {
      this.clearError(input);
    });

    // Validate required fields
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    const nameInput = this.form.querySelector('#name');
    const emailInput = this.form.querySelector('#email');
    const messageInput = this.form.querySelector('#message');

    if (!this.validateRequired(name)) {
      this.showError(nameInput, 'Name is required');
      isValid = false;
    }

    if (!this.validateRequired(email)) {
      this.showError(emailInput, 'Email is required');
      isValid = false;
    } else if (!this.validateEmail(email)) {
      this.showError(emailInput, 'Please enter a valid email address');
      isValid = false;
    }

    if (!this.validateRequired(message)) {
      this.showError(messageInput, 'Message is required');
      isValid = false;
    } else if (message.length < 10) {
      this.showError(messageInput, 'Message must be at least 10 characters');
      isValid = false;
    }

    return isValid;
  }

  handleSubmit(e) {
    e.preventDefault();
    
    if (this.validateForm()) {
      // In a real implementation, you would send the form data to your backend
      this.showSuccessMessage();
    }
  }

  showSuccessMessage() {
    const button = this.form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    
    button.textContent = 'Message Sent!';
    button.style.background = 'var(--color-success-500)';
    button.disabled = true;
    
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '';
      button.disabled = false;
      this.form.reset();
    }, 3000);
  }

  bindEvents() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Real-time validation
    this.form.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('blur', () => {
        this.clearError(input);
      });
    });
  }
}

// Newsletter Form
class NewsletterForm {
  constructor() {
    this.form = document.getElementById('newsletter-form');
    this.init();
  }

  init() {
    if (!this.form) return;
    this.bindEvents();
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  handleSubmit(e) {
    e.preventDefault();
    
    const input = this.form.querySelector('input[type="email"]');
    const email = input.value.trim();
    
    if (!email) {
      this.showError('Email is required');
      return;
    }
    
    if (!this.validateEmail(email)) {
      this.showError('Please enter a valid email address');
      return;
    }
    
    this.showSuccess();
  }

  showError(message) {
    const input = this.form.querySelector('input[type="email"]');
    input.style.borderColor = 'var(--color-error-500)';
    
    // Could add error display here
    setTimeout(() => {
      input.style.borderColor = '';
    }, 3000);
  }

  showSuccess() {
    const button = this.form.querySelector('button');
    const input = this.form.querySelector('input[type="email"]');
    const originalText = button.textContent;
    
    button.textContent = 'Subscribed!';
    button.style.background = 'var(--color-success-500)';
    button.disabled = true;
    
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '';
      button.disabled = false;
      input.value = '';
    }, 3000);
  }

  bindEvents() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }
}

// Smooth Scroll for Anchor Links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Intersection Observer for Animations
class ScrollAnimations {
  constructor() {
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        }
      );

      this.observeElements();
    }
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }

  observeElements() {
    const elements = document.querySelectorAll('.pillar-card, .case-study-card, .testimonial-card, .blog-card');
    elements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      this.observer.observe(el);
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Core functionality
  new ThemeManager();
  new MobileNav();
  
  // Forms
  new FormValidator('contactForm');
  new NewsletterForm();
  
  // Enhancements
  initSmoothScroll();
  new ScrollAnimations();
});

// Cal.com embed script
// Simple Cal.com integration - no complex embed needed for basic links
// All booking links go directly to https://cal.com/brisko/board-room-a

// Optional: Add click tracking for Cal.com links
document.addEventListener('DOMContentLoaded', () => {
  const calLinks = document.querySelectorAll('a[href*="cal.com"]');
  calLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Optional: Add analytics tracking here
      console.log('Cal.com booking link clicked');
    });
  });
});