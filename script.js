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

const totalTasksElement = document.querySelector("#total-tasks");

const completedTasksElement = document.querySelector("#completed-tasks");

const activeTasksElement = document.querySelector("#active-tasks");

const overdueTasksElement = document.querySelector("#overdue-tasks");
const searchInput = document.querySelector("#search-input");

const filterButtons = document.querySelectorAll(".filter-button");


let currentFilter = "all";

// =================================
// UPDATE STATISTICS
// =================================

function updateStats() {

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(function (task) {
        return task.completed;
    }).length;

    const activeTasks = tasks.filter(function (task) {
        return !task.completed;
    }).length;

    const today = new Date().toISOString().split("T")[0];

    const overdueTasks = tasks.filter(function (task) {

        return (
            task.dueDate &&
            task.dueDate < today &&
            !task.completed
        );

    }).length;


    totalTasksElement.textContent = totalTasks;

    completedTasksElement.textContent = completedTasks;

    activeTasksElement.textContent = activeTasks;

    overdueTasksElement.textContent = overdueTasks;

}


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

searchInput.addEventListener("input", function () {

    renderTasks();

});

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

saveTasks();

renderTasks();

updateStats();

});

// =================================
// RENDER TASKS
// =================================

function renderTasks() {

    taskList.innerHTML = "";


    const searchTerm = searchInput.value.toLowerCase().trim();


    const filteredTasks = tasks.filter(function (task) {

        const matchesSearch =
            task.title.toLowerCase().includes(searchTerm) ||
            task.description.toLowerCase().includes(searchTerm);


        const matchesFilter =
            currentFilter === "all" ||
            (currentFilter === "active" && !task.completed) ||
            (currentFilter === "completed" && task.completed);


        return matchesSearch && matchesFilter;

    });


    filteredTasks.forEach(function (task) {

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

    if (filteredTasks.length === 0) {

    taskList.innerHTML = `
        <div class="empty-state">
            <h3>No tasks found</h3>
            <p>Try changing your search or filter.</p>
        </div>
    `;

}

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

task.completed = event.target.checked;

saveTasks();

renderTasks();

updateStats();

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


saveTasks();

renderTasks();

updateStats();

});

// =================================
// SAVE TASKS
// =================================

function saveTasks() {

    localStorage.setItem("kansanTasks", JSON.stringify(tasks));

}
// =================================
// LOAD TASKS
// =================================

function loadTasks() {

    const savedTasks = localStorage.getItem("kansanTasks");

    if (savedTasks) {

        tasks = JSON.parse(savedTasks);

    }

    renderTasks();

    updateStats();

}

loadTasks();

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        filterButtons.forEach(function (btn) {

            btn.classList.remove("active");

        });


        button.classList.add("active");


        currentFilter = button.textContent
            .toLowerCase()
            .trim();


        renderTasks();

    });

});