// =================================
// TASK DATA
// =================================

let tasks = [];
let editingTaskId = null;

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
const modalTitle = document.querySelector("#modal-title");

const submitTaskButton = document.querySelector("#submit-task-button");

const taskSummary = document.querySelector("#task-summary");

const dashboardLink = document.querySelector("#dashboard-link");

const tasksLink = document.querySelector("#tasks-link");

const todayLink = document.querySelector("#today-link");

const upcomingLink = document.querySelector("#upcoming-link");

const progressPercentage = document.querySelector(".progress-number strong");

const progressFill = document.querySelector(".progress-fill");

const progressMessage = document.querySelector(".progress-message");


let currentFilter = "all";
let currentView = "dashboard";

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
// UPDATE DASHBOARD PROGRESS
// =================================

function updateProgress() {

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(function (task) {
        return task.completed;
    }).length;


    if (totalTasks === 0) {

        progressPercentage.textContent = "0%";

        progressFill.style.width = "0%";

        progressMessage.textContent =
            "Start checking off some tasks!";

        return;
    }


    const percentage = Math.round(
        (completedTasks / totalTasks) * 100
    );


    progressPercentage.textContent = `${percentage}%`;

    progressFill.style.width = `${percentage}%`;


    if (percentage === 100) {

        progressMessage.textContent =
            "Everything is done! 🎉";

    } else if (percentage >= 75) {

        progressMessage.textContent =
            "Almost there! Keep going!";

    } else if (percentage >= 50) {

        progressMessage.textContent =
            "Great progress! Keep it up!";

    } else if (percentage > 0) {

        progressMessage.textContent =
            "Nice start! Keep going!";

    } else {

        progressMessage.textContent =
            "Start checking off some tasks!";

    }

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

    taskForm.reset();

    editingTaskId = null;

    modalTitle.textContent = "Add a new task";

    submitTaskButton.textContent = "Create Task";

}


// =================================
// OPEN EDIT MODAL
// =================================

function openEditModal(task) {

    editingTaskId = task.id;

    modalTitle.textContent = "Edit task";

    submitTaskButton.textContent = "Save Changes";


    taskTitleInput.value = task.title;

    taskDescriptionInput.value = task.description;

    taskPriorityInput.value = task.priority;

    taskCategoryInput.value = task.category;

    taskDueDateInput.value = task.dueDate;


    taskModal.classList.add("show");

}

// =================================
// SIDEBAR NAVIGATION
// =================================

function setActiveNav(activeLink) {

    const navLinks = document.querySelectorAll(".sidebar-nav .nav-item");

    navLinks.forEach(function (link) {

        link.classList.remove("active");

    });

    activeLink.classList.add("active");

}




// =================================
// EVENT LISTENERS
// =================================

dashboardLink.addEventListener("click", function (event) {

    event.preventDefault();

    currentView = "dashboard";

    setActiveNav(dashboardLink);

    renderTasks();

});

tasksLink.addEventListener("click", function (event) {

    event.preventDefault();

    currentView = "tasks";

    setActiveNav(tasksLink);

    renderTasks();

});

todayLink.addEventListener("click", function (event) {

    event.preventDefault();

    currentView = "today";

    setActiveNav(todayLink);

    renderTasks();

});

upcomingLink.addEventListener("click", function (event) {

    event.preventDefault();

    currentView = "upcoming";

    setActiveNav(upcomingLink);

    renderTasks();

});

addTaskButton.addEventListener("click", openModal);

closeModalButton.addEventListener("click", closeModal);

cancelTaskButton.addEventListener("click", closeModal)

searchInput.addEventListener("input", function () {

    renderTasks();

});

taskList.addEventListener("click", function (event) {

    if (!event.target.classList.contains("edit-task-button")) {
        return;
    }

    const taskCard = event.target.closest(".task-card");

    const taskId = Number(taskCard.dataset.id);

    const task = tasks.find(function (task) {
        return task.id === taskId;
    });

    openEditModal(task);

});

// =================================
// TASK MENU
// =================================

taskList.addEventListener("click", function (event) {

    const menuButton = event.target.closest(".task-menu");

    if (!menuButton) {
        return;
    }

    const taskActions = menuButton.closest(".task-actions");

    taskActions.classList.toggle("open");

});

// =================================
// CREATE TASK
// =================================

taskForm.addEventListener("submit", function (event) {

    event.preventDefault();


    // ================================
    // EDIT EXISTING TASK
    // ================================

    if (editingTaskId !== null) {

        const task = tasks.find(function (task) {
            return task.id === editingTaskId;
        });


        task.title = taskTitleInput.value.trim();

        task.description = taskDescriptionInput.value.trim();

        task.priority = taskPriorityInput.value;

        task.category = taskCategoryInput.value;

        task.dueDate = taskDueDateInput.value;


        editingTaskId = null;

    }


    // ================================
    // CREATE NEW TASK
    // ================================

    else {

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

    }


    saveTasks();

    renderTasks();

    updateStats();

    updateProgress();

    taskForm.reset();

    closeModal();

    modalTitle.textContent = "Add a new task";

    submitTaskButton.textContent = "Create Task";

});

// =================================
// RENDER TASKS
// =================================

function renderTasks() {

    taskList.innerHTML = "";


    const searchTerm = searchInput.value.toLowerCase().trim();


    const today = new Date().toISOString().split("T")[0];

const filteredTasks = tasks.filter(function (task) {

    const matchesSearch =
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm);


    const matchesFilter =
        currentFilter === "all" ||
        (currentFilter === "active" && !task.completed) ||
        (currentFilter === "completed" && task.completed);


    let matchesView = true;


    if (currentView === "today") {

        matchesView = task.dueDate === today;

    }


    if (currentView === "upcoming") {

        matchesView =
            task.dueDate &&
            task.dueDate > today;

    }


    return matchesSearch && matchesFilter && matchesView;

});

    if (searchTerm || currentFilter !== "all") {

    if (filteredTasks.length === 1) {
        taskSummary.textContent = "1 task found";
    } else {
        taskSummary.textContent = `${filteredTasks.length} tasks found`;
    }

} else {

    if (filteredTasks.length === 1) {
        taskSummary.textContent = "1 task";
    } else {
        taskSummary.textContent = `${filteredTasks.length} tasks`;
    }

}


    filteredTasks.forEach(function (task) {

        const today = new Date().toISOString().split("T")[0];

    const isOverdue =
        task.dueDate &&
        task.dueDate < today &&
        !task.completed;

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

                    <span class="task-due-date ${isOverdue ? "overdue" : ""}">
    ${isOverdue ? "Overdue · " : ""}
    ${formatDate(task.dueDate)}
</span>

                </div>

            </div>


            <span class="priority ${task.priority}">
                ${task.priority}
            </span>

<div class="task-actions">

    <button
        class="task-menu"
        aria-label="Task options"
    >
        ⋮
    </button>

    <div class="task-dropdown">

        <button class="edit-task-button">
            Edit
        </button>

        <button class="delete-task-button">
            Delete
        </button>

    </div>

</div>

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



saveTasks();

renderTasks();

updateStats();

updateProgress();

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

updateProgress();

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

    renderTasks();


updateProgress();

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

// =================================
// FORMAT DATE
// =================================

function formatDate(dateString) {

    if (!dateString) {
        return "No due date";
    }

    const date = new Date(dateString + "T00:00:00");

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);

    tomorrow.setDate(today.getDate() + 1);


    if (date.getTime() === today.getTime()) {
        return "Today";
    }

    if (date.getTime() === tomorrow.getTime()) {
        return "Tomorrow";
    }


    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });

}