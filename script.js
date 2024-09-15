window.onload = () => {
    gsap.from(".container", { opacity: 0, y: -50, duration: 1 });
  };
  
let addTasksButton = document.getElementById('addTasksButton');
let typeTasks = document.getElementById('typeTasks');
let listContainer = document.getElementById('listContainer');
let resetTasksButton = document.getElementById('resetTasksButton');
let errorMessage = document.getElementById('errorMessage');
let listContent = document.getElementsByClassName('removeBorder');


addTasksButton.addEventListener('click', ()=>{
    addTask();
});

function addTask(){
    if(typeTasks.value == ''){
        gsap.fromTo(errorMessage, { x: -5 }, { x: 5, repeat: 5, yoyo: true, duration: 0.1 }); // Shake animation
        typeTasks.style.borderColor = '#890606';
        errorMessage.style.display = 'flex';
        setTimeout(() => (errorMessage.style.display = "none"), 2000);
        errorMessage.style.color = 'red';
    } else {
        let li = document.createElement("li");
        li.innerHTML = typeTasks.value;
        listContainer.appendChild(li);
        gsap.to(listContainer,{
            duration:1,
        })
        let span = document.createElement("span");
        span.innerHTML = '\u00d7';  
        li.appendChild(span);
        li.classList.toggle('removeBorder');
        typeTasks.style.borderColor = 'white';
        gsap.from(li, { opacity: 0, x: -100, duration: 0.3 });
    }
    typeTasks.value = '';
    saveData();
}

listContainer.addEventListener('click', function(e){
    if(e.target.tagName === 'LI'){
        e.target.classList.toggle("checked");
        saveData();
    } else if(e.target.tagName === "SPAN"){
        e.target.parentElement.remove();
        saveData();
    }
});


function saveData(){
    localStorage.setItem("data", listContainer.innerHTML);
};

function showList() {
    // Retrieve stored list from localStorage or set to empty if none
    const savedData = localStorage.getItem("data");
    
    if (savedData) {
        // Restore list items
        listContainer.innerHTML = savedData;

        // Query the list items to ensure they are restored properly
        const listItems = listContainer.querySelectorAll("li");

        // Loop through each item to make sure all elements (like spans) are in place
        listItems.forEach((li) => {
            // If 'li' doesn't already have the span (close button), we add it
            if (!li.querySelector('span')) {
                let span = document.createElement("span");
                span.innerHTML = '\u00d7';  
                li.appendChild(span);
            }

            // Reapply event listeners for toggling 'checked' state
            li.addEventListener('click', function(e) {
                if (e.target.tagName === 'LI') {
                    e.target.classList.toggle("checked");
                    saveData();
                } else if (e.target.tagName === "SPAN") {
                    e.target.parentElement.remove();
                    saveData();
                }
            });
        });

        // Apply GSAP animations to restored list items to make them visible
        gsap.from(listItems, { opacity: 0, x: -100, duration: 0.3, stagger: 0.1 });
    }
}


showList();


resetTasksButton.addEventListener('click', ()=>{
    gsap.to("#listContainer li", { 
        opacity: 0, 
        y: -20, 
        duration: 0.5, 
        stagger: 0.1,
        onComplete: () => {
            listContainer.innerHTML = "";
            localStorage.setItem("data", listContainer.innerHTML);
            typeTasks.style.borderColor = 'white';
        }
    });
});

listContainer.addEventListener("mouseover", function (e) {
    if (e.target.tagName === "LI") {
      gsap.to(e.target, { scale: 1.05, marginRight: '15px', marginLeft: '15px',duration: 0.2 });
    }
  });
  listContainer.addEventListener("mouseout", function (e) {
    if (e.target.tagName === "LI") {
      gsap.to(e.target, { scale: 1, marginRight: '0', marginLeft: '0',duration: 0.2 });
    }
  });
