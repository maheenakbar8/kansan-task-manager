// =================================
// TASK DATA
// =================================

let tasks = [];
// =================================
// DOM ELEMENTS
// =================================

const addTaskButton = document.querySelector(".add-task-button");

const taskModal = document.querySelector("#task-modal");

const closeModalButton = document.querySelector("#close-modal");

const cancelTaskButton = document.querySelector("#cancel-task");
const taskForm = document.querySelector("#task-form");

const taskTitleInput = document.querySelector("#task-title");

const taskDescriptionInput = document.querySelector("#task-description");

const taskPriorityInput = document.querySelector("#task-priority");

const taskCategoryInput = document.querySelector("#task-category");

const taskDueDateInput = document.querySelector("#task-due-date");

const taskList = document.querySelector(".task-list");


// =================================
// OPEN MODAL
// =================================

function openModal() {

    taskModal.classList.add("show");

}


// =================================
// CLOSE MODAL
// =================================

function closeModal() {

    taskModal.classList.remove("show");

}


// =================================
// EVENT LISTENERS
// =================================

addTaskButton.addEventListener("click", openModal);

closeModalButton.addEventListener("click", closeModal);

cancelTaskButton.addEventListener("click", closeModal)

// =================================
// CREATE TASK
// =================================

taskForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const task = {

        id: Date.now(),

        title: taskTitleInput.value.trim(),

        description: taskDescriptionInput.value.trim(),

        priority: taskPriorityInput.value,

        category: taskCategoryInput.value,

        dueDate: taskDueDateInput.value,

        completed: false

    };

    tasks.push(task);

    renderTasks();

    taskForm.reset();

    closeModal();

});

// =================================
// RENDER TASKS
// =================================

function renderTasks() {

    taskList.innerHTML = "";

    tasks.forEach(function (task) {

       const taskCard = document.createElement("article");

taskCard.classList.add("task-card");

if (task.completed) {
    taskCard.classList.add("completed");
}

taskCard.dataset.id = task.id;

        taskCard.innerHTML = `

            <div class="task-checkbox">

                <input
    type="checkbox"
    class="task-complete-checkbox"
    ${task.completed ? "checked" : ""}
>

            </div>


            <div class="task-info">

                <h3>${task.title}</h3>

                <p>${task.description}</p>

                <div class="task-meta">

                    <span class="task-category">
                        ${task.category}
                    </span>

                    <span class="task-due-date">
                        ${task.dueDate || "No due date"}
                    </span>

                </div>

            </div>


            <span class="priority ${task.priority}">
                ${task.priority}
            </span>


            <button
    class="task-menu delete-task-button"
    aria-label="Delete task"
>
    ×
</button>

        `;

        taskList.appendChild(taskCard);

    });

}
// =================================
// COMPLETE TASK
// =================================

taskList.addEventListener("change", function (event) {

    if (!event.target.classList.contains("task-complete-checkbox")) {
        return;
    }

    const taskCard = event.target.closest(".task-card");

    const taskId = Number(taskCard.dataset.id);

    const task = tasks.find(function (task) {
        return task.id === taskId;
    });

    task.completed = event.target.checked;

    renderTasks();

});

// =================================
// DELETE TASK
// =================================

taskList.addEventListener("click", function (event) {

    if (!event.target.classList.contains("delete-task-button")) {
        return;
    }

    const taskCard = event.target.closest(".task-card");

    const taskId = Number(taskCard.dataset.id);

    tasks = tasks.filter(function (task) {
        return task.id !== taskId;
    });

    renderTasks();

});