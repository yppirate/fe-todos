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
  }
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

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Delete';
    deleteBtn.addEventListener('click', () => {
      removeTask(task.id);
    });

    taskElement.appendChild(deleteBtn);
    taskContainer.appendChild(taskElement);
  });
}

// Function to remove a task
function removeTask(taskId) {
  tasks = tasks.filter(task => task.id !== taskId);
  renderTasks();
}

// Event listener for the "Add" button
addTaskBtn.addEventListener('click', addTask);

// Initial rendering of tasks
renderTasks();
