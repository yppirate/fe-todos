// Get references to HTML elements
const taskContainer = document.querySelector('.task-container');
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');

// Array to store tasks
let tasks = [];

// Function to add a new task
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText !== '') {
    const task = {
      id: Date.now(),
      text: taskText,
      completed: false
    };

    tasks.push(task);
    renderTasks();
    taskInput.value = '';

    // Save tasks to local storage
    saveTasksToLocalStorage();
  }
}

// Function to toggle task completion
function toggleTaskCompletion(taskId) {
  tasks.forEach(task => {
    if (task.id === taskId) {
      task.completed = !task.completed;
    }
  });
  // Save tasks to local storage
  saveTasksToLocalStorage();
  renderTasks();
}

// Function to render tasks in the task container
function renderTasks() {
  taskContainer.innerHTML = '';

  tasks.forEach(task => {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    taskElement.innerHTML = `
      <input type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}>
      <label for="task-${task.id}" ${task.completed ? 'style="text-decoration: line-through;"' : ''}>${task.text}</label>
    `;

    taskElement.querySelector('input[type="checkbox"]').addEventListener('change', () => {
      task.completed = !task.completed;
      renderTasks();
    });

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `task-${task.id}`;
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => {
      toggleTaskCompletion(task.id);
    });

    const label = document.createElement('label');
    label.setAttribute('for', `task-${task.id}`);
    label.innerText = task.text;
    if (task.completed) {
      label.style.textDecoration = 'line-through';
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Delete';
    deleteBtn.addEventListener('click', () => {
      removeTask(task.id);
    });

    taskElement.appendChild(checkbox);
    taskElement.appendChild(label);
    taskElement.appendChild(deleteBtn);
    taskContainer.appendChild(taskElement);
  });
}

// Function to remove a task
function removeTask(taskId) {
  tasks = tasks.filter(task => task.id !== taskId);
  // Save tasks to local storage
  saveTasksToLocalStorage();
  renderTasks();
}

// Function to save tasks to local storage
function saveTasksToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from local storage
function loadTasksFromLocalStorage() {
  const storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
  }
}

// Event listener for the "Add" button
addTaskBtn.addEventListener('click', addTask);

// Load tasks from local storage on page load
loadTasksFromLocalStorage();

// Initial rendering of tasks
renderTasks();
