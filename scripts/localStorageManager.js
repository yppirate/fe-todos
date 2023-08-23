export class LocalStorageManager {
  constructor(taskManager) {
    this.taskManager = taskManager;
    this.localStorageKey = 'tasks';
  }

  saveTasksToLocalStorage() {
    const tasks = this.taskManager.getTasks();
    localStorage.setItem(this.localStorageKey, JSON.stringify(tasks));
  }

  loadTasksFromLocalStorage() {
    const tasksString = localStorage.getItem(this.localStorageKey);
    if (tasksString) {
      const tasks = JSON.parse(tasksString);
      this.taskManager.tasks = tasks;
    }
  }
}
