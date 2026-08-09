// =================================
// TASK DATA
// =================================

let tasks = [];
let editingTaskId = null;
let taskToDeleteId = null;


// =================================
// DOM ELEMENTS
// =================================

const addTaskButton = document.querySelector(".add-task-button");

const taskModal = document.querySelector("#task-modal");
const deleteModal = document.querySelector("#delete-modal");

const closeDeleteModalButton =
    document.querySelector("#close-delete-modal");

const cancelDeleteButton =
    document.querySelector("#cancel-delete");

const confirmDeleteButton =
    document.querySelector("#confirm-delete");



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
const sortSelect = document.querySelector("#sort-select");

const filterButtons = document.querySelectorAll(".filter-button");
const modalTitle = document.querySelector("#modal-title");

const submitTaskButton = document.querySelector("#submit-task-button");

const taskSummary = document.querySelector("#task-summary");

const dashboardLink = document.querySelector('[data-page="dashboard"]');

const tasksLink = document.querySelector('[data-page="tasks"]');

const todayLink = document.querySelector('[data-page="today"]');

const upcomingLink = document.querySelector('[data-page="upcoming"]');

const progressPercentage = document.querySelector(".progress-number strong");

const progressFill = document.querySelector(".progress-fill");

const progressMessage = document.querySelector(".progress-message");

const todayTaskList = document.querySelector(".today-task-list");

const upcomingTaskList = document.querySelector(".upcoming-task-list");

const navItems = document.querySelectorAll(".nav-item[data-page]");
const pageLinks = document.querySelectorAll("[data-page]");

const categoryItems = document.querySelectorAll(".category-item");

let currentFilter = "all";
let currentView = "dashboard";
let currentCategory = "all";




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

    const today = getTodayDate();

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
// UPDATE TODAY'S TASKS
// =================================

function updateTodayTasks() {

    const today = getTodayDate();

    const todayTasks = tasks.filter(function (task) {

        return task.dueDate === today;

    });


    todayTaskList.innerHTML = "";


    if (todayTasks.length === 0) {

        todayTaskList.innerHTML = `
            <p class="dashboard-empty">
                No tasks due today.
            </p>
        `;

        return;
    }


    const visibleTasks = todayTasks.slice(0, 4);


    visibleTasks.forEach(function (task) {

        const taskItem = document.createElement("div");

taskItem.classList.add("dashboard-task");

taskItem.dataset.id = task.id;


        taskItem.innerHTML = `

            <div class="dashboard-task-check">

                <input
    type="checkbox"
    class="dashboard-task-checkbox"
    ${task.completed ? "checked" : ""}
>

            </div>

            <div class="dashboard-task-info">

                <h3 class="${task.completed ? "completed" : ""}">
                    ${task.title}
                </h3>

                <span>
                    ${formatDate(task.dueDate)}
                </span>

            </div>

            <span class="priority ${task.priority}">
                ${task.priority}
            </span>

        `;


        todayTaskList.appendChild(taskItem);

    });


    if (todayTasks.length > 4) {

        const remaining = todayTasks.length - 4;

        const moreTasks = document.createElement("p");

        moreTasks.classList.add("dashboard-more");

        moreTasks.textContent =
            `+ ${remaining} more task${remaining === 1 ? "" : "s"}`;

        todayTaskList.appendChild(moreTasks);

    }

}

// =================================
// UPDATE UPCOMING TASKS
// =================================

function updateUpcomingTasks() {

    const today = getTodayDate();

    const upcomingTasks = tasks
        .filter(function (task) {

            return (
                task.dueDate &&
                task.dueDate > today &&
                !task.completed
            );

        })
        .sort(function (a, b) {

            return a.dueDate.localeCompare(b.dueDate);

        });


    upcomingTaskList.innerHTML = "";


    if (upcomingTasks.length === 0) {

        upcomingTaskList.innerHTML = `
            <p class="dashboard-empty">
                No upcoming tasks.
            </p>
        `;

        return;
    }


    const visibleTasks = upcomingTasks.slice(0, 5);


    visibleTasks.forEach(function (task) {

        const taskItem = document.createElement("div");

        taskItem.classList.add("dashboard-task");


        taskItem.innerHTML = `

            <div class="dashboard-task-check">

                <input
                    type="checkbox"
                    disabled
                >

            </div>

            <div class="dashboard-task-info">

                <h3>
                    ${task.title}
                </h3>

                <span>
                    ${formatDate(task.dueDate)}
                </span>

            </div>

            <span class="priority ${task.priority}">
                ${task.priority}
            </span>

        `;


        upcomingTaskList.appendChild(taskItem);

    });


    if (upcomingTasks.length > 5) {

        const remaining = upcomingTasks.length - 5;

        const moreTasks = document.createElement("p");

        moreTasks.classList.add("dashboard-more");

        moreTasks.textContent =
            `+ ${remaining} more task${remaining === 1 ? "" : "s"}`;

        upcomingTaskList.appendChild(moreTasks);

    }

}


// =================================
// OPEN MODAL
// =================================

function openModal() {

    taskModal.classList.add("show");

}

// =================================
// DELETE CONFIRMATION MODAL
// =================================

function openDeleteModal(taskId) {

    taskToDeleteId = taskId;

    deleteModal.classList.add("show");

}


function closeDeleteModal() {

    deleteModal.classList.remove("show");

    taskToDeleteId = null;

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


addTaskButton.addEventListener("click", openModal);

closeModalButton.addEventListener("click", closeModal);

cancelTaskButton.addEventListener("click", closeModal)

searchInput.addEventListener("input", function () {

    renderTasks();

});

sortSelect.addEventListener("change", function () {

    renderTasks();

});

todayTaskList.addEventListener("change", function (event) {

    if (!event.target.classList.contains("dashboard-task-checkbox")) {
        return;
    }

    const taskItem = event.target.closest(".dashboard-task");

    const taskId = Number(taskItem.dataset.id);

    console.log("Dashboard task ID:", taskId);

    toggleTaskCompletion(
        taskId,
        event.target.checked
    );

});

// =================================
// SIDEBAR NAVIGATION
// =================================


taskList.addEventListener("click", function (event) {

    if (!event.target.classList.contains("edit-task-button")) {
        return;
    }

    const taskCard = event.target.closest(".task-card");

    const taskActions = event.target.closest(".task-actions");

    const taskId = Number(taskCard.dataset.id);

    const task = tasks.find(function (task) {
        return task.id === taskId;
    });

    taskActions.classList.remove("open");

    openEditModal(task);

});

// =================================
// PAGE NAVIGATION
// =================================

pageLinks.forEach(function (item) {

    item.addEventListener("click", function (event) {

        event.preventDefault();

        const page = item.dataset.page;

        currentView = page;
        currentCategory = "all";

        // Update active sidebar navigation
        navItems.forEach(function (navItem) {

            navItem.classList.remove("active");

        });

        const matchingNavItem = document.querySelector(
            `.sidebar-nav .nav-item[data-page="${page}"]`
        );

        if (matchingNavItem) {
            matchingNavItem.classList.add("active");
        }

        // Remove active category
        categoryItems.forEach(function (categoryItem) {

            categoryItem.classList.remove("active");

        });


        // =============================
        // DASHBOARD
        // =============================

        if (page === "dashboard") {

            document.body.classList.remove("tasks-page");

            updateStats();
            updateProgress();
            updateTodayTasks();
            updateUpcomingTasks();

            return;
        }


        // =============================
        // TASKS / TODAY / UPCOMING
        // =============================

        document.body.classList.add("tasks-page");

        renderTasks();

    });

});


// =================================
// CATEGORY NAVIGATION
// =================================

categoryItems.forEach(function (item) {

    item.addEventListener("click", function (event) {

        event.preventDefault();

        const category = item.dataset.category;

        currentCategory = category;
        currentView = "tasks";

        // Remove active from normal navigation
        navItems.forEach(function (navItem) {
            navItem.classList.remove("active");
        });

        // Remove active from all categories
        categoryItems.forEach(function (categoryItem) {
            categoryItem.classList.remove("active");
        });

        // Activate selected category
        item.classList.add("active");

        // Show Tasks page
        document.body.classList.add("tasks-page");

        // Render filtered tasks
        renderTasks();

    });

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
// CLOSE TASK MENU WHEN CLICKING OUTSIDE
// =================================

document.addEventListener("click", function (event) {

    if (
        !event.target.closest(".task-actions")
    ) {

        document
            .querySelectorAll(".task-actions.open")
            .forEach(function (menu) {

                menu.classList.remove("open");

            });

    }

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

    updateTodayTasks();
    updateUpcomingTasks();

    taskForm.reset();

    closeModal();

    modalTitle.textContent = "Add a new task";

    submitTaskButton.textContent = "Create Task";

});

// =================================
// RENDER TASKS
// =================================

function renderTasks() {


     console.log("renderTasks called");
    console.log("Number of tasks:", tasks.length);

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

    const matchesCategory =
    currentCategory === "all" ||
    task.category === currentCategory;


    let matchesView = true;


    if (currentView === "today") {

        matchesView = task.dueDate === today;

    }


    if (currentView === "upcoming") {

        matchesView =
            task.dueDate &&
            task.dueDate > today;

    }


    return matchesSearch &&
       matchesFilter &&
       matchesView &&
       matchesCategory;

});

const sortValue = sortSelect.value;

filteredTasks.sort(function (a, b) {

    if (sortValue === "created") {

        return b.id - a.id;

    }

    if (sortValue === "oldest") {

        return a.id - b.id;

    }

    if (sortValue === "due-date") {

        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;

        return a.dueDate.localeCompare(b.dueDate);

    }

    if (sortValue === "priority") {

        const priorityOrder = {
            high: 1,
            medium: 2,
            low: 3
        };

        return priorityOrder[a.priority] -
               priorityOrder[b.priority];

    }

});

console.log("Current view:", currentView);
console.log("Current filter:", currentFilter);
console.log("Filtered tasks:", filteredTasks.length);

    if (
    searchTerm ||
    currentFilter !== "all" ||
    currentCategory !== "all"
) {

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

function toggleTaskCompletion(taskId, completed) {

    const task = tasks.find(function (task) {
        return task.id === taskId;
    });

    if (!task) {
        console.log("Task not found:", taskId);
        return;
    }

    task.completed = completed;

    saveTasks();

    renderTasks();

    updateStats();

    updateProgress();

    updateTodayTasks();

    updateUpcomingTasks();

}

taskList.addEventListener("change", function (event) {

    if (!event.target.classList.contains("task-complete-checkbox")) {
        return;
    }

    const taskCard = event.target.closest(".task-card");

    const taskId = Number(taskCard.dataset.id);

    toggleTaskCompletion(
        taskId,
        event.target.checked
    );

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

    openDeleteModal(taskId);

});


// =================================
// CONFIRM DELETE
// =================================

confirmDeleteButton.addEventListener("click", function () {

    if (taskToDeleteId === null) {
        return;
    }

    tasks = tasks.filter(function (task) {
        return task.id !== taskToDeleteId;
    });

    saveTasks();

    renderTasks();

    updateStats();

    updateProgress();

    updateTodayTasks();

    updateUpcomingTasks();

    closeDeleteModal();

});

cancelDeleteButton.addEventListener(
    "click",
    closeDeleteModal
);

closeDeleteModalButton.addEventListener(
    "click",
    closeDeleteModal
);

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

    


updateProgress();

updateTodayTasks();
updateUpcomingTasks();

}



loadTasks();

console.log("Tasks:", tasks);

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

function getTodayDate() {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, "0");

    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}