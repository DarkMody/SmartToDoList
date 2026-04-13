let userName = document.getElementById("user-name");
let edit = document.getElementById("edit");
let del = document.getElementById("delete");
let img = document.getElementById("profile-image");
let uploadBtn = document.getElementById("upload");
let nav = document.querySelector("nav");
let notificationOverlay = document.getElementById("notification-overlay");

async function apiGetUser() {
  return fetch(`${baseUrl}/api/users`, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => data);
}

async function apiEditUser() {
  const formData = new FormData();
  formData.append("userName", userName.value);
  formData.append("avatar", uploadBtn.files[0]);
  return fetch(`${baseUrl}/api/users`, {
    method: "PATCH",
    headers: {
      // "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => data);
}

async function apiDeleteUser() {
  return fetch(`${baseUrl}/api/users`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }).then((res) => res.json());
}

// Notifications API Handling
async function apiGetNotifications() {
  return fetch(`${baseUrl}/api/notification`, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const nots = data.data;
      for (let i = nots.length - 1; i >= 0; i--) {
        const not = `
          <div class="not" id="${nots[i]._id}">
            <p>${nots[i].text}</p>
            <button class="notification-del">Delete</button>
          </div>
          `;
        notificationOverlay.innerHTML += not;
      }
    });
}

async function apiDeleteNotification(notId) {
  return fetch(`${baseUrl}/api/notification/${notId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }).then((res) => res.json());
}
