document.addEventListener('DOMContentLoaded', () => {
  const todoInput = document.querySelector('.todo-input');
  const addTaskButton = document.querySelector('.add-task-btn'); // Fixed selector
  const taskContainer = document.querySelector('.task-container');
  
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  
  // Render existing tasks when page loads
  renderTasks();
  
  // Add task event listener
  addTaskButton.addEventListener('click', addTask);
  
  // Also add task when pressing Enter in the input field
  todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  });
  
  // Function to add a new task
  function addTask() {
    const taskText = todoInput.value.trim();
    
    if (taskText === '') return; // Don't add empty tasks
    
    // Create a new task object with a unique ID
    const task = {
      id: Date.now(),
      text: taskText,
      completed: false
    };
    
    // Add to tasks array
    tasks.push(task);
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Render tasks
    renderTasks();
    
    // Clear input field
    todoInput.value = '';
  }
  
  // Function to delete a task
  function deleteTask(taskId) {
    // Filter out the task with the matching ID
    tasks = tasks.filter(task => task.id !== taskId);
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Render tasks
    renderTasks();
  }
  
  // Function to render all tasks
  function renderTasks() {
    // Clear current tasks display (keeping the heading)
    const heading = taskContainer.querySelector('h2');
    taskContainer.innerHTML = '';
    taskContainer.appendChild(heading);
    
    // Check if tasks array is empty
    if (tasks.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.textContent = 'No tasks yet. Add a task to get started!';
      emptyMessage.classList.add('empty-message');
      taskContainer.appendChild(emptyMessage);
      return;
    }
    
    // Create a list to hold all tasks
    const taskList = document.createElement('ul');
    taskList.classList.add('task-list');
    
    // Add each task to the list
    tasks.forEach(task => {
      const taskItem = document.createElement('li');
      taskItem.classList.add('task-item');
      if (task.completed) {
        taskItem.classList.add('completed');
      }
      
      // Create a container for the task text
      const taskTextSpan = document.createElement('span');
      taskTextSpan.textContent = task.text;
      taskTextSpan.classList.add('task-text');
      
      // Create delete button
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.classList.add('delete-btn');
      deleteButton.addEventListener('click', () => deleteTask(task.id));
      
      // Append elements to task item
      taskItem.appendChild(taskTextSpan);
      taskItem.appendChild(deleteButton);
      
      // Add click handler to toggle completion
      taskItem.addEventListener('click', (e) => {
        // Don't toggle if clicking the delete button
        if (e.target !== deleteButton) {
          task.completed = !task.completed;
          taskItem.classList.toggle('completed');
          saveToLocalStorage();
        }
      });
      
      // Add to list
      taskList.appendChild(taskItem);
    });
    
    // Add the list to the container
    taskContainer.appendChild(taskList);
  }
  
  // Function to save tasks to localStorage
  function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
});