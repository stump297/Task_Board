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
function handleAddTask(event) {}

// create a function to handle deleting a task
function handleDeleteTask(event) {}

// create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {}

// when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {});
