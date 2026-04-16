edit.addEventListener("click", async () => {
  if (edit.innerHTML == "Edit") {
    userName.disabled = false;
    uploadBtn.disabled = false;
    edit.innerHTML = "Save Changes";
  } else {
    const data = await apiEditUser();
    localStorage.setItem("token", data.data);
    dflt();
    edit.innerHTML = "Edit";
    userName.disabled = true;
    uploadBtn.disabled = true;
  }
});
del.addEventListener("click", async () => {
  if (confirm("Are you sure you want to delete account ?")) {
    apiDeleteUser();
    document.getElementById("logout").click();
  }
});

// Defult
async function dflt() {
  const user = await apiGetUser();
  profile.querySelector("img").src = `${baseUrl}/uploads/${user.data.avatar}`;
  img.src = `${baseUrl}/uploads/${user.data.avatar}`;
  document.getElementById("profile").children[0].children[1].innerHTML =
    user.data.userName;
  userName.value = user.data.userName;
  document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("token");
    location.replace("/index.html");
  });
}
dflt();

// Image Upload Handling
uploadBtn.addEventListener("change", function (event) {
  const files = event.target.files; // Get the selected files

  if (files && files.length > 0) {
    const file = files[0];
    const reader = new FileReader();

    if (file.type.split("/")[0] == "image") {
      reader.onload = function (e) {
        img.src = e.target.result;
      };
      // Read the image file as a data URL (Base64 encoded string)
      reader.readAsDataURL(file);
    } else {
      uploadBtn.value = "";
      alert("Plz Enter Valid Image");
    }
  }
});

// Menu Handling
menu.addEventListener("click", () => {
  let child = menu.children;
  if (!menu.classList.contains("active")) {
    menu.classList.add("active");
    for (let i = 0; i < 3; i++) {
      if (i == 0) {
        child[i].style.transform = `rotate(45deg)`;
      } else if (i == 1) {
        child[i].style.opacity = "0";
      } else {
        child[i].style.transform = `rotate(-45deg)`;
      }
      child[i].style.backgroundColor = "red";
      child[i].style.position = "absolute";
      child[i].style.top = "50%";
    }
    nav.style.width = "150px";
    document.getElementById("details").style.marginLeft = "150px";
    Array.from(document.getElementsByClassName("nav-text")).forEach((ele) => {
      ele.style.display = "inline";
    });
  } else {
    menu.classList.remove("active");
    for (let i = 0; i < 3; i++) {
      if (i == 0) {
        child[i].style.transform = `rotate(0deg)`;
      } else if (i == 1) {
        child[i].style.opacity = "1";
      } else {
        child[i].style.transform = `rotate(0deg)`;
      }
      child[i].style.backgroundColor = "var(--items)";
      child[i].style.position = "static";
    }
    nav.style.width = "50px";
    document.getElementById("details").style.marginLeft = "50px";
    Array.from(document.getElementsByClassName("nav-text")).forEach((ele) => {
      ele.style.display = "none";
    });
  }
});

// Notification Handling
async function notification() {
  await apiGetNotifications();

  let notificationBtn = document.querySelector("#notification");

  notificationBtn.addEventListener("click", () => {
    notificationOverlay.style.display =
      notificationOverlay.style.display == "none" ? "block" : "none";
  });

  Array.from(notificationOverlay.children).forEach((not) => {
    if (not.classList.contains("not")) {
      not
        .querySelector(".notification-del")
        .addEventListener("click", async () => {
          apiDeleteNotification(not.id);
          not.remove();
        });
    }
  });

  document
    .getElementById("notification-cancel")
    .addEventListener("click", () => {
      notificationOverlay.style.display = "none";
    });
}
notification();
