// Scroll Handling
const cancelScroll = () => {
  document.body.style.overflow = "hidden";
};
const enableScroll = () => {
  document.body.style.overflow = "visible";
};

// Start Defult
async function dflt() {
  await apiGetTasks();
  const user = await apiGetUser();
  profile.querySelector("img").src = `${baseUrl}/uploads/${user.data.avatar}`;
  profile.children[0].children[1].innerHTML = user.data.userName;
  Array.from(tasksList.children).forEach((child) => {
    taskFeatures(child);
  });

  document.getElementById("add-cancel").addEventListener("click", () => {
    addTaskOverlay.style.display = "none";
    selectedElement = null;
    enableScroll();
  });

  document.getElementById("add-add-task").addEventListener("click", () => {
    addTaskOverlay.style.display = "none";
    enableScroll();
    putTask(selectedElement);
  });

  document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("token");
  });
}
dflt();

// Setting Task Features
function stopWatchTimerHandeling(time, ele) {
  let hours = Math.floor(time / 60 / 60);
  let minuts = Math.floor((time / 60) % 60);
  let seconds = time % 60;
  ele.querySelector(".stop-watch-counter").innerHTML =
    `${String(hours).padStart(2, "0")} : ${String(minuts).padStart(2, "0")} : ${String(seconds).padStart(2, "0")}`;
}

function taskFeatures(ele) {
  ele.querySelector(".edit").addEventListener("click", () => {
    addTaskOverlay.style.display = "flex";
    setAddOverlay(ele);
    selectedElement = ele;
    cancelScroll();
  });

  ele.querySelector(".delete").addEventListener("click", () => {
    deleteTask(ele.id);
    ele.remove();
  });

  let totalTime = parseFloat(ele.querySelector(".time-needed").innerHTML) * 60;
  let timer = parseFloat(ele.querySelector(".time-needed").innerHTML) * 60;
  let counter;

  ele.querySelector(".start").addEventListener("click", () => {
    ele.querySelector(".task-stop-watch").style.display = "flex";
    ele.querySelector(".start").style.display = "none";
    stopWatchTimerHandeling(totalTime, ele);
    ele.querySelector(".shadow").style.backgroundColor = "var(--red)";
    ele.querySelector(".shadow").style.width = "100%";
  });

  ele.querySelector(".stop-watch-stop").addEventListener("click", () => {
    let btn = ele.querySelector(".stop-watch-stop");
    if (btn.innerHTML == "Start") {
      btn.innerHTML = "Stop";
      counter = setInterval(() => {
        timer--;
        stopWatchTimerHandeling(timer, ele);
        ele.querySelector(".shadow").style.width =
          `${(timer / totalTime) * 100}%`;
        if (!timer) {
          clearInterval(counter);
          document.getElementById("mission-done").play();
        }
      }, 1000);
      ele.querySelector(".shadow").style.backgroundColor = "var(--items)";
    } else {
      btn.innerHTML = "Start";
      clearInterval(counter);
      ele.querySelector(".shadow").style.backgroundColor = "var(--red)";
    }
  });
  ele.querySelector(".stop-watch-reset").addEventListener("click", () => {
    ele.querySelector(".stop-watch-stop").innerHTML = "Start";
    clearInterval(counter);
    ele.querySelector(".shadow").style.backgroundColor = "var(--red)";
    ele.querySelector(".shadow").style.width = "100%";
    timer = totalTime;
    stopWatchTimerHandeling(totalTime, ele);
  });

  ele.querySelector(".stop-watch-cancel").addEventListener("click", () => {
    clearInterval(counter);
    ele.querySelector(".stop-watch-stop").innerHTML = "Start";
    ele.querySelector(".task-stop-watch").style.display = "none";
    ele.querySelector(".start").style.display = "flex";
  });
}

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
    taskContainer.style.marginLeft = "150px";
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
    taskContainer.style.marginLeft = "50px";
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
