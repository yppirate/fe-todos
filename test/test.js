const { addTask, toggleTaskCompletion } = require('../script.js');

describe('addTask', () => {
  const tasks = [];

  test('adds a new task to the tasks array', () => {
    const taskInput = 'New task';
    addTask(taskInput, tasks);

    expect(tasks.length).toBe(1);
    expect(tasks[0].text).toBe(taskInput);
    expect(tasks[0].completed).toBe(false);
  });

  test('does not add a task with empty input', () => {
    const taskInput = '';
    addTask(taskInput, tasks);

    expect(tasks.length).toBe(0);
  });
});

describe('toggleTaskCompletion', () => {
  const task = {
    id: 1,
    text: 'Sample task',
    completed: false
  };

  test('toggles task completion status', () => {
    toggleTaskCompletion(task);

    expect(task.completed).toBe(true);
  });
});
