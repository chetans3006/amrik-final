function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("errorMsg");

  if (username === "" || password === "") {
    errorMsg.style.display = "block";
  } else {
    errorMsg.style.display = "none";
    // Simulated successful login
    alert("Login successful (placeholder)!");
    // You can redirect or call backend logic here
  }
}
