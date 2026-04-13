let userName = document.getElementById("user-name");
let email = document.getElementById("email");
let password = document.getElementById("password");
let submit = document.getElementById("submit");

async function apiRegister() {
  return fetch(`${baseUrl}/api/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userName: userName.value.trim(),
      email: email.value.trim(),
      password: password.value.trim(),
    }),
  })
    .then((res) => res.json())
    .then((data) => data);
}

submit.addEventListener("click", async () => {
  const data = await apiRegister();
  if (data.status == "success") {
    localStorage.setItem("token", data.data);
    window.location.replace("../index.html");
  } else {
    alert(data.message);
  }
});
