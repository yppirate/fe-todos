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

    // Add priority level to the task
    const prioritySelect = document.getElementById('prioritySelect');
    task.priority = prioritySelect.value;

    // Add priority level to the task
    const prioritySelect = document.getElementById('prioritySelect');
    task.priority = prioritySelect.value;

    // Add deadline to the task
    const deadlineInput = document.getElementById('deadlineInput');
    task.deadline = deadlineInput.value;

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
    taskElement.draggable = true;
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

    const prioritySelect = document.createElement('select');
    prioritySelect.id = `priority-${task.id}`;
    prioritySelect.innerHTML = `
      <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
      <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
      <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
    `;

    prioritySelect.addEventListener('change', () => {
      task.priority = prioritySelect.value;
      saveTasksToLocalStorage();
    });

    taskElement.addEventListener('dragstart', () => {
      taskElement.classList.add('dragging');
    });

    taskElement.addEventListener('dragend', () => {
      taskElement.classList.remove('dragging');
      saveTasksToLocalStorage();
    });

    const deadlineInput = document.createElement('input');
    deadlineInput.type = 'datetime-local';
    deadlineInput.id = `deadline-${task.id}`;
    deadlineInput.value = task.deadline || '';
    deadlineInput.addEventListener('input', () => {
      task.deadline = deadlineInput.value;
      saveTasksToLocalStorage();
      updateRemainingTime(task);
    });


    taskElement.appendChild(checkbox);
    taskElement.appendChild(label);
    taskElement.appendChild(deleteBtn);
    taskElement.appendChild(prioritySelect);
    taskElement.appendChild(remainingTimeElement);
    taskElement.appendChild(deadlineInput);
    taskContainer.appendChild(taskElement);
  });
  initDragAndDrop();
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

// Function to update remaining time for a task
function updateRemainingTime(task) {
  const deadlineElement = document.getElementById(`deadline-${task.id}`);
  const remainingTimeElement = document.createElement('span');
  remainingTimeElement.classList.add('remaining-time');

  if (task.deadline) {
    const deadline = new Date(task.deadline);
    const currentTime = new Date();
    const remainingTime = deadline - currentTime;

    if (remainingTime <= 0) {
      remainingTimeElement.innerText = 'Past Deadline';
    } else {
      const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      remainingTimeElement.innerText = `${days}d ${hours}h remaining`;
    }
  }

  const existingRemainingTime = document.getElementById(`remaining-${task.id}`);
  if (existingRemainingTime) {
    existingRemainingTime.remove();
  }

  deadlineElement.insertAdjacentElement('afterend', remainingTimeElement);
}

// Function to initialize drag-and-drop functionality
function initDragAndDrop() {
  const tasks = document.querySelectorAll('.task');

  tasks.forEach(task => {
    task.addEventListener('dragover', event => {
      event.preventDefault();
      const draggingTask = document.querySelector('.dragging');
      const bounding = task.getBoundingClientRect();
      const offset = bounding.y + bounding.height / 2;
      if (event.clientY - offset > 0) {
        task.style.borderBottom = '2px dashed #ccc';
        task.style.borderTop = '';
      } else {
        task.style.borderBottom = '';
        task.style.borderTop = '2px dashed #ccc';
      }
    });

    task.addEventListener('dragleave', () => {
      task.style.borderBottom = '';
      task.style.borderTop = '';
    });

    task.addEventListener('drop', event => {
      event.preventDefault();
      const draggingTask = document.querySelector('.dragging');
      const parent = task.parentElement;
      const draggingIndex = Array.from(parent.children).indexOf(draggingTask);
      const dropIndex = Array.from(parent.children).indexOf(task);

      if (draggingIndex < dropIndex) {
        parent.insertBefore(draggingTask, task.nextSibling);
      } else {
        parent.insertBefore(draggingTask, task);
      }

      task.style.borderBottom = '';
      task.style.borderTop = '';
    });
  });
}

// Event listener for the "Add" button
addTaskBtn.addEventListener('click', addTask);

// Load tasks from local storage on page load
loadTasksFromLocalStorage();

// Initial rendering of tasks
renderTasks();
