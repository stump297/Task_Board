// Retrieve tasks from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];

// Select DOM elements
const taskName = document.querySelector("#taskName");
const datePicker = document.querySelector("#datepicker");
const taskDescription = document.querySelector("#taskDescription");
const taskSubmitBut = $("#taskSubmit");

// Check if taskList is null and initialize if necessary
if (taskList === null) {
  taskList = [];
} else {
  taskList = JSON.parse(localStorage.getItem("tasks"));
}

// Function to generate a unique task id
function generateTaskId() {
  return "id" + new Date().getTime();
}

// Function to create a task card
function createTaskCard(task) {
  let bgColor = "";

  if (dayjs().isSame(dayjs(task.taskDate), "day")) {
    bgColor = "yellow";
  } else if (dayjs().isAfter(dayjs(task.taskDate))) {
    bgColor = "red";
  }

  const cardObject = $(`
    <div class="ui-widget-content draggable ${bgColor}" id="${task.uniqID}">
      <p>${task.taskName}</p>
      <p>${task.taskDate}</p>
      <p>${task.taskDescription}</p>
      <button onclick="handleDeleteTask(event)">Remove</button>
    </div>
  `);

  switch (task.taskStatus) {
    case "in-progress-cards":
      $("#in-progress-cards").append(cardObject);
      break;
    case "done-cards":
      $("#done-cards").append(cardObject);
      cardObject.removeClass("yellow red");
      break;
    case "todo-cards":
      $("#todo-cards").append(cardObject);
      break;
  }

  $(".draggable").draggable({
    revert: "invalid",
    zIndex: 100,
    helper: "clone",
  });
}

// Function to render the task list
function renderTaskList() {
  $("#todo-cards").empty();
  $("#in-progress-cards").empty();
  $("#done-cards").empty();

  taskList.forEach((task) => {
    createTaskCard(task);
  });

  $(".task-list")
    .sortable({
      connectWith: ".task-list",
      update: function (event, ui) {
        const newStatus = $(this).closest(".lane").attr("id").split("-")[0];
        const taskId = ui.item.attr("id");
        const task = taskList.find((task) => task.uniqID === taskId);
        task.taskStatus = newStatus;
        localStorage.setItem("tasks", JSON.stringify(taskList));
      },
    })
    .disableSelection();
}

// Function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();
  const newTask = {
    uniqID: generateTaskId(),
    taskName: taskName.value,
    taskDate: datePicker.value,
    taskDescription: taskDescription.value,
    taskStatus: "todo-cards",
  };
  taskList.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
  $("#formModal").modal("hide");
}

// Function to handle deleting a task
function handleDeleteTask(event) {
  const taskId = $(event.target).closest(".draggable").attr("id");
  taskList = taskList.filter((task) => task.uniqID !== taskId);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
}

// Function to handle dropping a task into a new status lane

function handleDrop(event, ui) {
  $(".droppable").droppable({
    accept: ".draggable",
    drop: handleDrop,
    classes: {
      "ui-droppable-active": "ui-state-active",
      "ui-droppable-hover": "ui-state-hover",
    },
  });

  const taskId = ui.draggable[0].id;
  const newStatus = event.target.children[0].id;
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].uniqID === taskId) {
      taskList[i].taskStatus = newStatus;
      localStorage.setItem("tasks", JSON.stringify(taskList));
      break;
    }
  }
  renderTaskList();
}

// When the page loads, render the task list and add event listeners
$(document).ready(function () {
  $("#datepicker").datepicker();

  renderTaskList();

  $("#add-task-btn").click(function () {
    $("#formModal").modal("show");
  });

  $(".close").click(function () {
    $("#formModal").modal("hide");
  });

  $("#task-form").submit(handleAddTask);

  $(document).on("click", ".delete-task", handleDeleteTask);

  // $(".droppable").droppable({
  //   accept: ".draggable",
  //   drop: handleDrop,
  //   classes: {
  //     "ui-droppable-active": "ui-state-active",
  //     "ui-droppable-hover": "ui-state-hover",
  //   },
  // });
});
