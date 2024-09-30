window.onload = () => {
    gsap.from(".container", { opacity: 0, y: -50, duration: 2 });
    showList(); // Call showList after animations
};

let addTasksButton = document.getElementById('addTasksButton');
let typeTasks = document.getElementById('typeTasks');
let listContainer = document.getElementById('listContainer');
let resetTasksButton = document.getElementById('resetTasksButton');
let errorMessage = document.getElementById('errorMessage');
let SelectPriorityText = document.getElementById('SelectPriorityText');
let priorityText = '';

// Adding a task
addTasksButton.addEventListener('click', addTask);
let priority = (priority) =>{
    if(priority === 'high'){
        priorityText = 'High Priority';
        SelectPriorityText.innerHTML = priorityText;
    } else if(priority === 'medium'){
        priorityText = 'Medium Priority';
        SelectPriorityText.innerHTML = priorityText;
    } else if(priority === 'low'){
        priorityText = 'Low Priority';
        SelectPriorityText.innerHTML = priorityText;
    }
}
priority();

function addTask() {
    if (typeTasks.value.trim() === '') {
        gsap.fromTo(errorMessage, { x: -10 }, { x: 10, repeat: 5, yoyo: true, duration: 0.1 });
        typeTasks.style.borderColor = '#890606';
        errorMessage.style.display = 'flex';
        setTimeout(() => (errorMessage.style.display = "none"), 2000);
        errorMessage.style.color = 'red';
    } else {
        showList();
        let li = document.createElement("li");
        li.innerHTML = typeTasks.value;
        let span = document.createElement("img");
        let priorityList = document.createElement("p");
        let h1 = document.createElement("h1");
        let h2 = document.createElement("h1");
        h1.innerText = document.getElementById('dateSelector').value;
        h2.innerText = document.getElementById('timeSelector').value;
        priorityList.innerText = priorityText;
        span.src = './images/trash-bin.gif';
        li.appendChild(priorityList);
        assignClasses(priorityList);
        li.appendChild(h1);
        li.appendChild(span);
        li.appendChild(h2);
        listContainer.appendChild(li);
        typeTasks.style.borderColor = 'white';
        gsap.from(li, { opacity: 0, x: -100, duration: 0.3 });
        typeTasks.value = '';
        saveData();
        }
}

let assignClasses = (priorityList) =>{
    if (priorityText === 'High Priority') {
        priorityList.classList.toggle('highPriorityClass');
    } else if(priorityText === 'Medium Priority'){
        priorityList.classList.toggle('mediumPriorityClass');
    } else if(priorityText === 'Low Priority'){
        priorityList.classList.toggle('lowPriorityClass');
    }
}

// Event delegation for the listContainer
listContainer.addEventListener('click', function (e) {
    if (e.target.tagName === 'LI') {
        e.target.classList.toggle("checked");
        saveData();
    } else if (e.target.tagName === "IMG") {
        e.target.parentElement.remove();
        saveData();
    }
});

// Mouseover and mouseout events for scaling
listContainer.addEventListener("mouseover", function (e) {
    if (e.target.tagName === "LI") {
        gsap.to(e.target, { scale: 1.05, duration: 0.2 });
    }
});

listContainer.addEventListener("mouseout", function (e) {
    if (e.target.tagName === "LI") {
        gsap.to(e.target, { scale: 1, duration: 0.2 });
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
        gsap.to(item, {opacity :100, x:0})
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

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/MonkeyTodoList/sw.js').then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      }).catch(error => {
        console.log('Service Worker registration failed:', error);
      });
    });
  }
  