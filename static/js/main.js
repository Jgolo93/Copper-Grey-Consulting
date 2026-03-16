document.addEventListener("DOMContentLoaded", () => {
  initNavigation()
  initFlashMessages()
  initFormEnhancements()
  initSmoothScroll()
  initCountingAnimation()
})

// ========================
// Navigation Handling
// ========================
function initNavigation() {
  const navbar = document.getElementById("navbar")
  const navToggle = document.getElementById("nav-toggle")
  const navMenu = document.getElementById("nav-menu")
  const navLinks = document.querySelectorAll(".nav-link, .nav-cta")

  if (!navToggle || !navMenu) return

  // Toggle mobile menu
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active")
    navMenu.classList.toggle("active")
    document.body.style.overflow = navMenu.classList.contains("active") ? "hidden" : ""
  })

  // Close on link click
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("active")
      navMenu.classList.remove("active")
      document.body.style.overflow = ""
    })
  })

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navToggle.classList.remove("active")
      navMenu.classList.remove("active")
      document.body.style.overflow = ""
    }
  })

  // Add scroll class to navbar
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.classList.toggle("scrolled", window.scrollY > 50)
    })
  }
}

// ========================
// Flash Messages
// ========================
function initFlashMessages() {
  const messages = document.querySelectorAll(".flash-message")

  messages.forEach(message => {
    const closeBtn = message.querySelector(".flash-close")

    if (closeBtn) {
      closeBtn.addEventListener("click", () => dismissMessage(message))
    }

    // Auto-dismiss success messages
    if (message.classList.contains("flash-success")) {
      setTimeout(() => {
        if (message.parentNode) dismissMessage(message)
      }, 5000)
    }
  })

  function dismissMessage(el) {
    el.style.opacity = "0"
    el.style.transform = "translateY(-20px)"
    setTimeout(() => el.remove(), 300)
  }
}

// ========================
// Contact Form UX
// ========================
function initFormEnhancements() {
  const form = document.getElementById("contact-form")

  if (!form) return

  form.addEventListener("submit", function (e) {
    const submitBtn = form.querySelector('button[type="submit"]')
    if (!submitBtn) return

    const originalHTML = submitBtn.innerHTML
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>'
    submitBtn.disabled = true

    // Re-enable in case of failure
    setTimeout(() => {
      submitBtn.innerHTML = originalHTML
      submitBtn.disabled = false
    }, 3000)
  })
}

// ========================
// Smooth Anchor Scroll
// ========================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href").substring(1)
      const target = document.getElementById(targetId)
      if (!target) return

      e.preventDefault()
      const offsetTop = target.offsetTop - 100
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth"
      })
    })
  })
}

// ========================
// Calendly Popup
// ========================
function openCalendlyPopup() {
  document.body.classList.add("calendly-popup-open")

  if (window.Calendly) {
    Calendly.initPopupWidget({ url: "https://calendly.com/web-empath" })

    const handler = (e) => {
      const event = e.data.event
      if (event && event.startsWith("calendly.")) {
        document.body.classList.remove("calendly-popup-open")
        window.removeEventListener("message", handler)
      }
    }

    window.addEventListener("message", handler)
  } else {
    window.open("https://calendly.com/web-empath", "_blank")
    document.body.classList.remove("calendly-popup-open")
  }
}

// ========================
// Counting Animation
// ========================
function initCountingAnimation() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]')
  
  if (statNumbers.length === 0) return

  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateNumber(entry.target)
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  statNumbers.forEach(number => {
    observer.observe(number)
  })
}

function animateNumber(element) {
  const target = parseInt(element.dataset.target)
  const suffix = element.dataset.suffix || ''
  const duration = 2000
  const start = 0
  const increment = target / (duration / 16)
  let current = start

  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      current = target
      clearInterval(timer)
    }
    
    element.textContent = Math.floor(current) + suffix
    
    // Add a subtle pulse effect when complete
    if (current === target) {
      element.style.transform = 'scale(1.1)'
      setTimeout(() => {
        element.style.transform = 'scale(1)'
      }, 200)
    }
  }, 16)
}
