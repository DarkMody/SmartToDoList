// Main Variables
let menu = document.getElementById("menu");
let taskContainer = document.getElementById("tasks-container");
let tasksList = document.getElementById("tasks-list");
let nav = document.getElementsByTagName("nav")[0];
let addTaskOverlay = document.getElementById("add-task-overlay");
let selectedElement = null;
let notificationOverlay = document.getElementById("notification-overlay");

// Overlay Variables (Add / Edit Task)
let addTitle = document.getElementById("add-title");
let addTime = document.getElementById("add-time");
let addDescription = document.getElementById("add-description");
let addDeadline = document.getElementById("add-deadline");
let addPriority = document.getElementById("add-priority");

// Tasks API Handling
async function apiGetUser() {
  return fetch(`${baseUrl}/api/users`, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => data);
}

async function apiAddTask() {
  return fetch(`${baseUrl}/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      task: addTitle.value,
      description: addDescription.value,
      time: addTime.value,
      deadline: addDeadline.value,
      priority: addPriority.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => data);
}

async function apiGetTasks() {
  return fetch(`${baseUrl}/api/tasks`, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const arr = data.data;
      arr.forEach((ele) => {
        let task = document.createElement("div");
        task.classList.add("task");
        task.id = ele._id;
        task.innerHTML = `
            <div class="task-buttons">
              <button class="edit"><img src="Icons/pencil.png" alt="" /></button>
              <button class="delete"><img src="Icons/clear.png" alt="" /></button>
            </div>
            <div class="task-title">${ele.task}</div>
            <div class="task-description">${ele.description}</div>
            <div class="data">
              <span class="time-needed">${ele.time} m</span>
              <span class="deadline">${ele.deadline}</span>
              <span class="priority">${ele.priority}</span>
            </div>
            <button class="start">Start Timer</button>
            <div class="task-stop-watch">
              <div class="stop-watch-counter"></div>
              <div class="stop-watch-bar"><div class="shadow"></div></div>
              <div class="stop-watch-buttons">
                <button class="stop-watch-stop">Start</button>
                <button class="stop-watch-reset">Reset</button>
                <button class="stop-watch-cancel">Cancel</button>
              </div>
            </div>`;
        //*************************************************************//
        tasksList.appendChild(task);
      });
    });
}

async function apiEditTask(taskId) {
  return fetch(`${baseUrl}/api/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      task: addTitle.value,
      description: addDescription.value,
      time: addTime.value,
      deadline: addDeadline.value,
      priority: addPriority.value,
    }),
  }).then((res) => res.json());
}

async function deleteTask(taskId) {
  return fetch(`${baseUrl}/api/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
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
