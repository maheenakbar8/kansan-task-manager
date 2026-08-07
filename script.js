// =================================
// DOM ELEMENTS
// =================================

const addTaskButton = document.querySelector(".add-task-button");

const taskModal = document.querySelector("#task-modal");

const closeModalButton = document.querySelector("#close-modal");

const cancelTaskButton = document.querySelector("#cancel-task");


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

cancelTaskButton.addEventListener("click", closeModal);