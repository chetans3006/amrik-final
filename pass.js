// DOM Elements
const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const togglePasswordBtn = document.getElementById("togglePassword");
const loginButton = document.getElementById("loginButton");
const alertContainer = document.getElementById("alertContainer");
const rememberMeCheckbox = document.getElementById("rememberMe");

// Modal elements
const forgotPasswordModal = document.getElementById("forgotPasswordModal");
const forgotPasswordLink = document.getElementById("forgotPasswordLink");
const closeModalBtn = document.getElementById("closeModal");
const forgotPasswordForm = document.getElementById("forgotPasswordForm");

// Social login buttons
const googleLoginBtn = document.getElementById("googleLogin");
const githubLoginBtn = document.getElementById("githubLogin");
const signupLink = document.getElementById("signupLink");

// Demo users database
const demoUsers = [
  {
    username: "demo@example.com",
    password: "password123",
    role: "user",
    name: "Demo User",
  },
  {
    username: "admin",
    password: "admin123",
    role: "admin",
    name: "Admin User",
  },
  {
    username: "john.doe@company.com",
    password: "secure456",
    role: "user",
    name: "John Doe",
  },
];

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});

function initializeApp() {
  // Load saved username if "Remember Me" was checked
  loadSavedCredentials();

  // Add event listeners
  setupEventListeners();

  // Show welcome message
  showAlert("Welcome! Use demo credentials to test the login system.", "info");
}

function setupEventListeners() {
  // Form submission
  loginForm.addEventListener("submit", handleLogin);

  // Password toggle
  togglePasswordBtn.addEventListener("click", togglePasswordVisibility);

  // Input validation on blur
  usernameInput.addEventListener("blur", validateUsername);
  passwordInput.addEventListener("blur", validatePassword);

  // Clear errors on input
  usernameInput.addEventListener("input", () => clearFieldError("username"));
  passwordInput.addEventListener("input", () => clearFieldError("password"));

  // Modal events
  forgotPasswordLink.addEventListener("click", openForgotPasswordModal);
  closeModalBtn.addEventListener("click", closeForgotPasswordModal);
  forgotPasswordModal.addEventListener("click", handleModalBackdropClick);
  forgotPasswordForm.addEventListener("submit", handleForgotPassword);

  // Social login events
  googleLoginBtn.addEventListener("click", () => handleSocialLogin("google"));
  githubLoginBtn.addEventListener("click", () => handleSocialLogin("github"));

  // Signup link
  signupLink.addEventListener("click", handleSignupClick);

  // Keyboard shortcuts
  document.addEventListener("keydown", handleKeyboardShortcuts);
}

// Authentication Functions
async function handleLogin(event) {
  event.preventDefault();

  // Clear previous alerts and errors
  clearAllErrors();
  clearAlerts();

  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  const rememberMe = rememberMeCheckbox.checked;

  // Validate inputs
  if (!validateForm(username, password)) {
    return;
  }

  // Show loading state
  setLoadingState(true);

  try {
    // Simulate API call delay
    await delay(1500);

    // Authenticate user
    const authResult = authenticateUser(username, password);

    if (authResult.success) {
      // Save credentials if remember me is checked
      if (rememberMe) {
        saveCredentials(username);
      } else {
        clearSavedCredentials();
      }

      // Show success message
      showAlert(`Welcome back, ${authResult.user.name}!`, "success");

      // Simulate redirect
      setTimeout(() => {
        redirectToDashboard(authResult.user);
      }, 1500);
    } else {
      throw new Error(authResult.message);
    }
  } catch (error) {
    showAlert(error.message, "error");

    // Add shake animation to form
    loginForm.classList.add("shake");
    setTimeout(() => loginForm.classList.remove("shake"), 500);
  } finally {
    setLoadingState(false);
  }
}

function authenticateUser(username, password) {
  // Find user in demo database
  const user = demoUsers.find(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );

  if (!user) {
    return {
      success: false,
      message: "User not found. Please check your username and try again.",
    };
  }

  if (user.password !== password) {
    return {
      success: false,
      message: "Incorrect password. Please try again.",
    };
  }

  return {
    success: true,
    user: user,
    message: "Login successful!",
  };
}

// Validation Functions
function validateForm(username, password) {
  let isValid = true;

  if (!validateUsername()) {
    isValid = false;
  }

  if (!validatePassword()) {
    isValid = false;
  }

  return isValid;
}

function validateUsername() {
  const username = usernameInput.value.trim();

  if (!username) {
    showFieldError("username", "Username or email is required");
    return false;
  }

  if (username.length < 3) {
    showFieldError("username", "Username must be at least 3 characters long");
    return false;
  }

  // If it looks like an email, validate email format
  if (username.includes("@")) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
      showFieldError("username", "Please enter a valid email address");
      return false;
    }
  }

  clearFieldError("username");
  return true;
}

function validatePassword() {
  const password = passwordInput.value;

  if (!password) {
    showFieldError("password", "Password is required");
    return false;
  }

  if (password.length < 6) {
    showFieldError("password", "Password must be at least 6 characters long");
    return false;
  }

  clearFieldError("password");
  return true;
}

// UI Helper Functions
function showFieldError(fieldName, message) {
  const input = document.getElementById(fieldName);
  const errorElement = document.getElementById(`${fieldName}-error`);

  input.classList.add("error");
  errorElement.textContent = message;
  errorElement.classList.add("show");
}

function clearFieldError(fieldName) {
  const input = document.getElementById(fieldName);
  const errorElement = document.getElementById(`${fieldName}-error`);

  input.classList.remove("error");
  errorElement.classList.remove("show");
}

function clearAllErrors() {
  clearFieldError("username");
  clearFieldError("password");
}

function showAlert(message, type = "info") {
  const alert = document.createElement("div");
  alert.className = `alert ${type}`;
  alert.textContent = message;

  alertContainer.appendChild(alert);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (alert.parentNode) {
      alert.remove();
    }
  }, 5000);
}

function clearAlerts() {
  alertContainer.innerHTML = "";
}

function setLoadingState(isLoading) {
  const btnText = loginButton.querySelector(".btn-text");
  const btnLoader = loginButton.querySelector(".btn-loader");

  if (isLoading) {
    loginButton.disabled = true;
    btnText.style.display = "none";
    btnLoader.style.display = "block";
  } else {
    loginButton.disabled = false;
    btnText.style.display = "block";
    btnLoader.style.display = "none";
  }
}

// Password Toggle
function togglePasswordVisibility() {
  const type =
    passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);

  // Update button text/icon
  togglePasswordBtn.textContent = type === "password" ? "👁️" : "🙈";
  togglePasswordBtn.setAttribute(
    "aria-label",
    type === "password" ? "Show password" : "Hide password"
  );
}

// Remember Me Functionality
function saveCredentials(username) {
  try {
    localStorage.setItem("rememberedUsername", username);
    localStorage.setItem("rememberMe", "true");
  } catch (error) {
    console.warn("Could not save credentials to localStorage:", error);
  }
}

function loadSavedCredentials() {
  try {
    const rememberedUsername = localStorage.getItem("rememberedUsername");
    const rememberMe = localStorage.getItem("rememberMe") === "true";

    if (rememberMe && rememberedUsername) {
      usernameInput.value = rememberedUsername;
      rememberMeCheckbox.checked = true;
    }
  } catch (error) {
    console.warn("Could not load saved credentials:", error);
  }
}

function clearSavedCredentials() {
  try {
    localStorage.removeItem("rememberedUsername");
    localStorage.removeItem("rememberMe");
  } catch (error) {
    console.warn("Could not clear saved credentials:", error);
  }
}

// Modal Functions
function openForgotPasswordModal(event) {
  event.preventDefault();
  forgotPasswordModal.classList.add("show");
  document.getElementById("resetEmail").focus();
}

function closeForgotPasswordModal() {
  forgotPasswordModal.classList.remove("show");
}

function handleModalBackdropClick(event) {
  if (event.target === forgotPasswordModal) {
    closeForgotPasswordModal();
  }
}

async function handleForgotPassword(event) {
  event.preventDefault();

  const email = document.getElementById("resetEmail").value.trim();

  if (!email) {
    showAlert("Please enter your email address", "error");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showAlert("Please enter a valid email address", "error");
    return;
  }

  // Simulate sending reset email
  try {
    await delay(1000);
    showAlert("Password reset link sent to your email!", "success");
    closeForgotPasswordModal();
    document.getElementById("resetEmail").value = "";
  } catch (error) {
    showAlert("Failed to send reset email. Please try again.", "error");
  }
}

// Social Login Functions
function handleSocialLogin(provider) {
  if (provider === "google") {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        showAlert(`Welcome, ${user.displayName}`, "success");
        console.log("Google user:", user);
      })
      .catch((error) => {
        showAlert("Google Sign-In failed: " + error.message, "error");
      });
  } else {
    showAlert("Only Google login is supported now.", "info");
  }
}

function handleSignupClick(event) {
  event.preventDefault();
  showAlert("Signup page would be implemented here", "info");
  console.log("Redirecting to signup page...");
}

// Keyboard Shortcuts
function handleKeyboardShortcuts(event) {
  // Escape key closes modal
  if (
    event.key === "Escape" &&
    forgotPasswordModal.classList.contains("show")
  ) {
    closeForgotPasswordModal();
  }

  // Ctrl/Cmd + Enter submits form
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    if (!forgotPasswordModal.classList.contains("show")) {
      loginForm.dispatchEvent(new Event("submit"));
    }
  }
}

// Utility Functions
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function redirectToDashboard(user) {
  // Encode user data to pass to dashboard
  const userData = encodeURIComponent(JSON.stringify(user));

  // Show success message
  showAlert("Redirecting to dashboard...", "success");

  // Redirect to dashboard with user data
  setTimeout(() => {
    window.location.href = `dashboard.html?user=${userData}`;
  }, 1000);
}

// Add shake animation CSS if not already present
if (!document.querySelector("style[data-shake]")) {
  const shakeStyle = document.createElement("style");
  shakeStyle.setAttribute("data-shake", "true");
  shakeStyle.textContent = `
        .shake {
            animation: shake 0.5s ease-in-out;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
  document.head.appendChild(shakeStyle);
}

// Console welcome message
console.log(
  "%c🔐 Password Authentication System",
  "color: #667eea; font-size: 16px; font-weight: bold;"
);
console.log("%cDemo Credentials:", "color: #374151; font-weight: bold;");
console.log("📧 demo@example.com / password123");
console.log("👤 admin / admin123");
console.log("💼 john.doe@company.com / secure456");
