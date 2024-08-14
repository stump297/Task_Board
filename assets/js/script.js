// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// create a function to generate a unique task id
function generateTaskId() {
  const id = nextId;
  nextId += 1;
  localStorage.setItem("nextId", JSON.stringify(nextId));
  return id;
}

// create a function to create a task card
function createTaskCard(task) {}

const taskCard = $(`
      <div class="task-card" data-id="${task.id}">
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <p>Deadline: ${task.deadline}</p>
        <button class="delete-task">Delete</button>
      </div>
    `);

if (dayjs(task.deadline).isBefore(dayjs())) {
  taskCard.css("background-color", "red");
} else if (dayjs(task.deadline).isBefore(dayjs().add(3, "day"))) {
  taskCard.css("background-color", "yellow");
}

return taskCard;

// create a function to render the task list
function renderTaskList() {
  $(".task-list").emptiy();
  taskList.forEach((task) => {
    const taskCard = crateTaskCard(task);
    $(`#${task.status} .task-list`).append(taskCard);
  });

  // making the cards draggable
  $(".task-card").draggable({
    revert: "invalid",
    helper: "clone",
  });
}

// create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();
  const newTask = {
    id: generateTaskId(),
    title: $("#title").val(),
    status: "not started",
  };
  taskList.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
  $("#task-modal").hide();
}

// create a function to handle deleting a task
function handleDeleteTask(event) {
  const taskId = $(event.target).closest(".task-card").data("id");
  taskList = taskList.filter((task) => task.id !== taskId);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
}

// create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  function handleDrop(event, ui) {
    const taskId = ui.draggable.data("id");
    const newStatus = $(this).closest(".column").attr("id");
    const task = taskList.find((task) => task.id === taskId);
    task.status = newStatus;
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
  }
}

// when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  $(document).ready(function () {
    if (!taskList) {
      taskList = [];
      nextId = 1;
      localStorage.setItem("tasks", JSON.stringify(taskList));
      localStorage.setItem("nextId", JSON.stringify(nextId));
    }

    renderTaskList();

    $("#add-task-btn").click(function () {
      $("#task-modal").show();
    });

    $(".close").click(function () {
      $("#task-modal").hide();
    });

    $("#task-form").submit(handleAddTask);

    $(document).on("click", ".delete-task", handleDeleteTask);

    $(".task-list").droppable({
      accept: ".task-card",
      drop: handleDrop,
    });

    $("#deadline").datepicker();
  });
});
