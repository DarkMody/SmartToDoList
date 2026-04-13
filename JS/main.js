function setAddOverlay(ele = null) {
  if (ele == null) {
    document.getElementById("add-add-task").innerHTML = "Add Task";
    addTitle.value = "";
    addTime.value = "";
    addDescription.value = "";
    addDeadline.valueAsDate = new Date();
    addPriority.value = "Medium";
  } else {
    document.getElementById("add-add-task").innerHTML = "Edit Task";
    addTitle.value = ele.querySelector(".task-title").textContent;
    addTime.value = parseInt(ele.querySelector(".time-needed").innerHTML);
    addDescription.value = ele
      .querySelector(".task-description")
      .textContent.trim();
    addDeadline.value = ele.querySelector(".deadline").innerHTML.trim();
    addPriority.value = ele.querySelector(".priority").innerHTML;
  }
}

async function putTask(ele) {
  let task = document.createElement("div");
  task.classList.add("task");
  task.innerHTML = `
            <div class="task-buttons">
              <button class="edit"><img src="Icons/pencil.png" alt="" /></button>
              <button class="delete"><img src="Icons/clear.png" alt="" /></button>
            </div>
            <div class="task-title">${addTitle.value}</div>
            <div class="task-description">${addDescription.value}</div>
            <div class="data">
              <span class="time-needed">${addTime.value || 30} m</span>
              <span class="deadline">${addDeadline.value}</span>
              <span class="priority">${addPriority.value}</span>
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
  if (ele == null) {
    tasksList.appendChild(task);
    const added = await apiAddTask();
    task.id = added.data.task._id;
    taskFeatures(task);
  } else {
    ele.innerHTML = task.innerHTML;
    await apiEditTask(ele.id);
    taskFeatures(ele);
  }
  selectedElement = null;
}

// Adding Task
document.getElementById("add").addEventListener("click", () => {
  cancelScroll();
  selectedElement = null;
  addTaskOverlay.style.display = "flex";
  setAddOverlay();
});
