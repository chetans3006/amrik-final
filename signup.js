function signup() {
  const username = document.getElementById("newUsername").value;
  const password = document.getElementById("newPassword").value;

  if (!username || !password) {
    alert("Please enter both username and password");
    return;
  }

  // Save to localStorage (simulated "database")
  localStorage.setItem("user", JSON.stringify({ username, password }));
  alert("Sign up successful! You can now log in.");
  // window.location.href = "login.html";
}
