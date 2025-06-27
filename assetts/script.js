// The code inside this block will only run once the entire HTML document has been fully loaded and parsed. 
// This ensures that when our JavaScript tries to find elements (like taskInput or taskList), they must already exist in the DOM
document.addEventListener('DOMContentLoaded', () => {

    // Selecting specific HTML elements from our index page using their id attributes. 
    // Storing references to these elements in constant variables, makes it easier to interact with them later.
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const errorMessage = document.getElementById('errorMessage');

    // Declare a variable named 'tasks' and initialise it as an empty array
    let tasks = []; // Array to store tasks

    // Function to render tasks to the DOM. This is the core function responsible for displaying the tasks on the web page. 
    // It's called whenever the 'tasks' array changes (or on initial load).
    function renderTasks() {

        //  Before rendering, clear the current content of the 'taskList' (<ul>). 
        // This is important to prevent duplicate entries and to ensure the list always reflects the current tasks array state.
        taskList.innerHTML = ''; // Clear existing tasks

        // Also, clear any old error messages
        errorMessage.textContent = '';
        
        // If 'tasks' is empty, add an element <li>, to the 'taskList' with the message "No tasks yet! Add one above." 
        // Then, return; immediately exits the function, so the subsequent forEach loop doesn't run, as there are no tasks to itterate through.
        if (tasks.length === 0) {
            taskList.innerHTML = '<li style="text-align: center; color: #777;">No tasks yet! Add one above.</li>';
            return;
        }
        
        // If 'tasks' is not empty, iterate over each 'task' in the 'task's array using the forEach method.
        // For each 'task', create a new <li> (list item) element, which will hold the task's text and its associated buttons.
        tasks.forEach((task, index) => {
            const listItem = document.createElement('li');

            // Task text (or input field for editing)
            // Create a 'span'. Add class .task-text. Populate the 'span' with the text from the 'task'. Append the 'taskTextSpan' to the listItems.
            const taskTextSpan = document.createElement('span');
            taskTextSpan.classList.add('task-text');
            taskTextSpan.textContent = task;
            listItem.appendChild(taskTextSpan);

            // Buttons container
            // A <div> is created to group the "Edit" and "Delete" buttons.
            const buttonContainer = document.createElement('div');

            // Create Edit button 
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.classList.add('edit-btn');
            // When the Btn is created it is given an index in the array.
            // This index is embeded in the anonymous function () => editTask(index, .. ), which is a call-back for the click event.
            editBtn.addEventListener('click', () => editTask(index, taskTextSpan, buttonContainer));
            buttonContainer.appendChild(editBtn);

            // Create Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('delete-btn');
            // When the Btn is created it is given an index in the array.
            // This index is embeded in the anonymous function () => deleteTask(index), which is a call-back for the click event.
            deleteBtn.addEventListener('click', () => deleteTask(index));
            buttonContainer.appendChild(deleteBtn);
            // Append the buttons to the button container, 
            // .. append the button container to the list item
            // .. and append the list item to the task list.
            listItem.appendChild(buttonContainer);
            taskList.appendChild(listItem);
        });
    }
     
    // Function to add a new task
    function addTask() {
        const taskText = taskInput.value.trim(); // Get the text from the input and remove whitespace

        // Check if the input is not empty
        if (taskText === '') {
            errorMessage.textContent = 'Please enter a task!';
            return; // Stop the function if the input is empty
        }
    
        // Pash the new task to the end of 'tasks' array
        tasks.push(taskText);
        // Incongruity: unshift() shifts current elements up by one index and inserts a new element at the start of the array.
        //tasks.unshift(taskText)  // Not used here. We will push to end of array.
    
        // Clear the input field
        taskInput.value = '';
    
        // Re-render the task list to show the new task
        renderTasks();
    }

    // Add an event listener to the 'Add Task' button
    addTaskBtn.addEventListener('click', addTask);

    // Add an event listener to the 'input field', to allow adding tasks with the 'Enter' key
    taskInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    // 
    // Function to delete the 'task' at the given index.
    function deleteTask(index) {
        // The splice() method removes the task at the given index.
        // 'splice(index, 1)': Start at 'index', remove '1' element.
        tasks.splice(index, 1); 
    
        // After 'task' removal, refresh the display by calling renderTasks(). This rebuilds the entire list based on the updated 'tasks' array.
        renderTasks();
    }

    // Function to edit a task
    // This takes the task's index, the span element displaying its text,
    // and the container holding the buttons for that list item.
    function editTask(index, taskTextSpan, buttonContainer) {
        // Retrieve current text of the task by index.
        const currentText = tasks[index]
        // Create an input field for editing
        const editInput = document.createElement('input');
        editInput.type = 'text'; // Set the input type to text
        editInput.value = currentText; // Pre-fill the input with the current task text
        editInput.classList.add('edit-input'); // Add a class for styling.
        
        // Create 'Save' buttons
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.classList.add('save-btn'); // Add a class for styling.
        // Create 'Cancel' buttons
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.classList.add('cancel-btn'); // Add a class for styling.

        // Replace the task text span with the new input field
        taskTextSpan.replaceWith(editInput)

        // Clear the existing buttons and append the new 'Save' and 'Cancel' buttons
        buttonContainer.innerHTML = ''; // Clears 'Edit' and 'Delete' buttons
        buttonContainer.appendChild(saveBtn);
        buttonContainer.appendChild(cancelBtn)

        // Focus on the input field for editing
        editInput.focus()

         // Keyboard shortcuts for 'Enter' (save) and 'Escape' (cancel)
        editInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                saveBtn.click(); // Programmatically click the save button
            } else if (event.key === 'Escape') {
                cancelBtn.click(); // Programmatically click the cancel button
            }
        })

        // Add event listener for the 'Save' button
        saveBtn.addEventListener('click', () => {
            const newText = editInput.value.trim(); // Get the new text and trim whitespace
            // Validate if the new task text is empty
            if (newText === '') {
                errorMessage.textContent = 'Task cannot be empty!';
                return; // Stop if empty
            }
            // Only update the tasks array if the text has actually changed
            if (newText !== currentText) {
                tasks[index] = newText; // Update task in the 'tasks' array
            }
            // Finaly, re-render the entire task list to update the display
            // The input field and Save/Cancel buttons to be replaced
            // by the updated task text span and original Edit/Delete buttons.
            renderTasks();
            }
        )

        // Event listener for the 'Cancel' button
        cancelBtn.addEventListener('click', () => {
            // Render the list, discarding any changes made in the input.
            renderTasks(); 
        })
    }

    // Call renderTasks initially to display any pre-existing tasks or the empty list
    renderTasks();
});