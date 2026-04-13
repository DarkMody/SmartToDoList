let email = document.getElementById("email");
let password = document.getElementById("password");
let submit = document.getElementById("submit");
let emailPattrn = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Fast Login
async function apiFastLogin() {
  await fetch(`${baseUrl}/api/users/fastLogin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status == "success") {
        localStorage.setItem("token", data.data);
        window.location.replace("../main.html");
      }
    });
}
apiFastLogin();

async function apiLogin() {
  return fetch(`${baseUrl}/api/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.value.trim(),
      password: password.value.trim(),
    }),
  })
    .then((res) => res.json())
    .then((data) => data);
}

submit.addEventListener("click", async () => {
  if (emailPattrn.test(email.value.trim())) {
    if (password.value.trim()) {
      const data = await apiLogin();
      if (data.status == "success") {
        localStorage.setItem("token", data.data);
        window.location.replace("../main.html");
      } else {
        alert(data.message);
      }
    } else {
      alert("Plz Enter Password");
    }
  } else {
    alert("Plz Enter Valid Email");
  }
});
