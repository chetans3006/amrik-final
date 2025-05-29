// Enhanced form interactions and animations
document.addEventListener("DOMContentLoaded", () => {
  // Add ripple effect to buttons
  const buttons = document.querySelectorAll('button[type="submit"]');

  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = this.querySelector(".btn-ripple, .button-ripple");
      if (ripple) {
        ripple.style.width = "0";
        ripple.style.height = "0";

        setTimeout(() => {
          ripple.style.width = "300px";
          ripple.style.height = "300px";
        }, 10);

        setTimeout(() => {
          ripple.style.width = "0";
          ripple.style.height = "0";
        }, 600);
      }
    });
  });

  // Enhanced form validation
  const inputs = document.querySelectorAll("input, textarea");

  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      validateField(this);
    });

    input.addEventListener("input", function () {
      if (this.classList.contains("error")) {
        validateField(this);
      }
    });
  });

  function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;

    // Remove existing error styling
    field.classList.remove("error");

    // Basic validation
    if (field.hasAttribute("required") && !value) {
      isValid = false;
    }

    // Email validation
    if (type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
      }
    }

    // Phone validation
    if (type === "tel" && value) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(value.replace(/\D/g, ""))) {
        isValid = false;
      }
    }

    if (!isValid) {
      field.classList.add("error");
      field.style.borderColor = "#ff4757";
      field.style.boxShadow = "0 0 10px rgba(255, 71, 87, 0.3)";
    } else {
      field.style.borderColor = "";
      field.style.boxShadow = "";
    }

    return isValid;
  }

  // Form submission handling
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      let isFormValid = true;
      const formInputs = this.querySelectorAll("input, textarea");

      formInputs.forEach((input) => {
        if (!validateField(input)) {
          isFormValid = false;
        }
      });

      if (!isFormValid) {
        e.preventDefault();

        // Shake animation for invalid form
        this.style.animation = "shake 0.5s ease-in-out";
        setTimeout(() => {
          this.style.animation = "";
        }, 500);
      } else {
        // Success animation
        const submitBtn = this.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.innerHTML = "<span>Sending...</span>";
          submitBtn.disabled = true;
        }
      }
    });
  });
});

// Add shake animation for form validation errors
const style = document.createElement("style");
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    
    .error {
        animation: errorPulse 0.5s ease-in-out;
    }
    
    @keyframes errorPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);
