window.onload = () => {
    gsap.from(".container", { opacity: 0, y: -50, duration: 2 });
    showList(); // Call showList after animations
};

let addTasksButton = document.getElementById('addTasksButton');
let typeTasks = document.getElementById('typeTasks');
let listContainer = document.getElementById('listContainer');
let resetTasksButton = document.getElementById('resetTasksButton');
let errorMessage = document.getElementById('errorMessage');

// Adding a task
addTasksButton.addEventListener('click', addTask);

function addTask() {
    if (typeTasks.value.trim() === '') {
        gsap.fromTo(errorMessage, { x: -10 }, { x: 10, repeat: 5, yoyo: true, duration: 0.1 });
        typeTasks.style.borderColor = '#890606';
        errorMessage.style.display = 'flex';
        setTimeout(() => (errorMessage.style.display = "none"), 2000);
        errorMessage.style.color = 'red';
    } else {
        let li = document.createElement("li");
        li.innerHTML = typeTasks.value;
        let span = document.createElement("span");
        span.innerHTML = '\u00d7';
        li.appendChild(span);
        listContainer.appendChild(li);
        li.classList.add('removeBorder');
        typeTasks.style.borderColor = 'white';
        gsap.from(li, { opacity: 0, x: -100, duration: 0.3 });
        typeTasks.value = '';
        saveData();
    }
}

// Event delegation for the listContainer
listContainer.addEventListener('click', function (e) {
    if (e.target.tagName === 'LI') {
        e.target.classList.toggle("checked");
        saveData();
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        saveData();
    }
});

// Mouseover and mouseout events for scaling
listContainer.addEventListener("mouseover", function (e) {
    if (e.target.tagName === "LI") {
        gsap.to(e.target, { scale: 1.05, marginRight: '15px', marginLeft: '15px', duration: 0.2 });
    }
});

listContainer.addEventListener("mouseout", function (e) {
    if (e.target.tagName === "LI") {
        gsap.to(e.target, { scale: 1, marginRight: '0', marginLeft: '0', duration: 0.2 });
    }
});

function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

function showList() {
    listContainer.innerHTML = localStorage.getItem("data");
    const listItems = document.querySelectorAll("#listContainer li");
    listItems.forEach(item => {
        gsap.from(item, { opacity: 0, x: -100, duration: 0.3 });
    });
}

// Reset all tasks
resetTasksButton.addEventListener('click', () => {
    gsap.to("#listContainer li", { opacity: 0, y: -20, duration: 0.5, stagger: 0.1, onComplete: () => {
        listContainer.innerHTML = "";
        localStorage.setItem("data", "");
        typeTasks.style.borderColor = 'white';
    }});
});
