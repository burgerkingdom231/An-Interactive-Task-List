// Constants for input, button, and task list area
const taskInput = document.querySelector("#newtask input");
const taskSection = document.querySelector(".tasks");
const addButton = document.querySelector("#push");

// Listener for Enter key → add a new task
taskInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    createTask();
  }
});

// Listener for "Add Task" button
addButton.addEventListener("click", () => {
  createTask();
});

// Function to create a new task
function createTask() {
  const taskText = taskInput.value.trim();

  if (taskText.length === 0) {
    alert("The task field is blank. Please enter a task.");
    return;
  }

  // Create task element
  const task = document.createElement("div");
  task.classList.add("task");

  task.innerHTML = `
    <label>
      <input type="checkbox" class="check-task">
      <p>${taskText}</p>
    </label>
    <div class="delete">
      <i class="uil uil-trash"></i>
    </div>
  `;

  // Append to task section
  taskSection.appendChild(task);

  // Clear input
  taskInput.value = "";

  // Add delete functionality
  const deleteBtn = task.querySelector(".delete");
  deleteBtn.addEventListener("click", () => {
    task.remove();
    toggleOverflow();
  });

  // Add checkbox functionality
  const checkbox = task.querySelector(".check-task");
  checkbox.addEventListener("change", () => {
    const taskTextElement = task.querySelector("p");
    taskTextElement.classList.toggle("checked", checkbox.checked);
  });

  // Handle overflow scroll if needed
  toggleOverflow();
}

// Toggle overflow scroll based on height
function toggleOverflow() {
  if (taskSection.scrollHeight > 300) {
    taskSection.classList.add("overflow");
  } else {
    taskSection.classList.remove("overflow");
  }
}
