    window.onload = () => {
        gsap.from(".container", { opacity: 0, y: -50, duration: 0.5 });
        gsap.from("#accordionExample", { opacity: 0, y: -50, duration: 0.5 });
        showList();
        saveData();
    };
    // Swal.fire({
    //     title: "Remember its necessary to select all the fields to make the todolist work perfectly.",
    //     width: 600,
    //     padding: "3em",
    //     color: "#716add",
    //     background: "#fff url(/images/trees.png)",
    //     backdrop: `
    //       rgba(0,0,123,0.4)
    //       url("/images/nyan-cat.gif")
    //       left top
    //       no-repeat
    //     `
    //   });
    
    flatpickr("#datepicker", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        disableMobile: "true"
    });

    let addTasksButton = document.getElementById('addTasksButton');
    let typeTasks = document.getElementById('typeTasks');
    let typeTasks2 = document.getElementById('typeTasks2');
    let listContainer = document.getElementById('listContainer');
    let errorMessage = document.getElementById('errorMessage');
    let SelectPriorityText = document.getElementById('SelectPriorityText');
    let datepicker = document.getElementById('datepicker');
    let domTasks = document.getElementById('domTasks');
    let domFilters = document.getElementById('domFilters');
    let domDontKnow = document.getElementById('domDontKnow');
    let completedTasksElement = document.getElementById('completedTasks');
    let pendingTasksElement = document.getElementById('pendingTasks');
    let FilterViewInner = document.getElementById('FilterViewInner');
    let priorityText = '';
    let li, span, editSpan, priorityList, h1, inputInsideLi, inputInsideLi2;
    
    new Sortable(listContainer, {
        animation: 400,
        onUpdate: function() {
            saveData();
        }
    });

    function createElement(tag, classList = [], attributes = {}) {
    const element = document.createElement(tag);
    classList.forEach(className => element.classList.add(className));
    for (let key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
    return element;
    }


    let CreateAllElements = () =>{
        inputInsideLi = createElement('span', ['card-title'], { contentEditable: 'false' });
        inputInsideLi2 = createElement('span', ['card-text'], { contentEditable: 'false' });
        span = createElement("img", ['TrashImg'], { src: './images/trash-bin.png' });
        editSpan = createElement("img", ['editSpan'], { src: './images/edit (1).png' });
        li = document.createElement("li");
        priorityList = document.createElement("p");
        h1 = document.createElement("h1");
        inputInsideLi.role = "input";
        inputInsideLi2.role = "input";
        
        // Appending Class
        inputInsideLi.innerText = typeTasks.value;
        inputInsideLi2.innerText = typeTasks2.value;
        h1.innerText = datepicker.value;
        document.querySelectorAll(".priorityButton").forEach(button => {
            button.addEventListener("click", () => {
                priority(button.innerText);
            });
        });
        
        updatePriorityClass(priorityList, priorityText)
        
        // Appending Child
        whatIsBlankCheck(typeTasks, typeTasks2, datepicker, priorityText);
            li.append(inputInsideLi, inputInsideLi2, priorityList, h1, span, editSpan);
            li.classList.add('card');
            listContainer.insertAdjacentElement('afterbegin', li);
            typeTasks.style.borderColor = 'white';
            gsap.from(li, { opacity: 0, x: -100, duration: 0.3 });
            typeTasks.value = '';
            typeTasks2.value = '';
            saveData();
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Your work has been added and saved!",
                showConfirmButton: false,
                timer: 1000
              });
            addEditEvent(editSpan, inputInsideLi, inputInsideLi2, priorityList, h1);
            return [li, span, editSpan, priorityList, h1, inputInsideLi];
    };

    let  whatIsBlankCheck = (typeTasks, typeTasks2, datepicker, priorityText) =>{
        if (
            typeTasks.value.trim() === '' ||
            typeTasks2.value.trim() === '' ||
            datepicker.value.trim() === '' ||
            priorityText.trim() === ''
        ) {
            Swal.fire({
                title: "Error!",
                text: "You have to fill title, description, date, and priority list to add todo.",
                icon: "error",
                button: "Cool"
            });
        }
    };
    


    function updatePriorityClass(priorityList, priorityText) {
        priorityList.innerText = priorityText;
        if (priorityText !== '' && priorityText.trim() !== '' && priorityText !== null) {
            priorityList.classList.add('PriorityClass');
        } else {
            priorityList.classList.remove('PriorityClass');
        }
    }

    let addEditEvent = (editSpan, inputInsideLi, inputInsideLi2, priorityList, h1) => {
        let priorityDropdown;
        let selectedPriority;
        let isEditing = false;
        let DateEditing;
        editSpan.addEventListener("click", () => {
            if (isEditing) {
                inputInsideLi.contentEditable = false;
                inputInsideLi2.contentEditable = false;
                selectedPriority = priorityDropdown.value;
                priorityList.innerText = selectedPriority;
                h1.innerText = DateEditing.value;
                farziHai(selectedPriority, priorityList);
                DateEditing.classList.remove('datepickerEdit');
                editSpan.src = './images/edit (1).png';
                inputInsideLi.style.border = 'none';
                inputInsideLi2.style.border = 'none';
                DateEditing.replaceWith(h1);
                priorityDropdown.replaceWith(priorityList);
                saveData();
            } else {
                editSpan.src = './images/save-data.png';
                inputInsideLi.style.border = '2px solid black';
                inputInsideLi2.style.border = '2px solid black';
                inputInsideLi.contentEditable = true;
                inputInsideLi2.contentEditable = true;
                DateEditing = document.createElement('input');
                DateEditing.type = 'text';
                DateEditing.value = h1.innerText;
                DateEditing.placeholder = 'Add or edit date!';
                priorityDropdown = document.createElement('select');
                priorityDropdown.classList.add('priorityDropdown');
                DateEditing.classList.add('datepickerEdit');
                const priorities = ["High Priority", "Medium Priority", "Low Priority"];
                priorities.forEach((priority) => {
                    let option = document.createElement('option');
                    option.value = priority;
                    option.innerText = priority;
                    if (priority === priorityList.innerText) {
                        option.selected = true;
                    }
                    priorityDropdown.appendChild(option);
                });
                priorityList.replaceWith(priorityDropdown);
                h1.replaceWith(DateEditing);
                flatpickr(".datepickerEdit", {
                    enableTime: true,
                    dateFormat: "Y-m-d H:i",
                    disableMobile: "true"
                });
            }
            isEditing = !isEditing;
        });
    };

    let farziHai = (selectedPriority, priorityList) =>{
        if (selectedPriority !== '' && selectedPriority.trim() !== '' && selectedPriority !== null) {
            priorityList.classList.add('PriorityClass');
        } else {
            priorityList.classList.remove('PriorityClass');
        }
    }


    listContainer.addEventListener('mouseover', (e) => {
        const liElement = e.target.closest('li');
        if (liElement) {
            gsap.to(liElement, {
                scale: 1.01,
                duration: 0.3,
            });
        }
    });

    listContainer.addEventListener('mouseout', (e) => {
        const liElement = e.target.closest('li');
        if (liElement) {
            gsap.to(liElement, {
                scale: 1,
                duration: 0.3,
            });
        }
    });


    function priority(priority) {
        priorityText = priority;
        SelectPriorityText.innerHTML = priorityText;
    }
    
    
    function updateTaskStats() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.status === "completed").length;
        const pendingTasks = totalTasks - completedTasks;
    
        // Assuming you have some elements in your HTML to display these stats
    
        domFilters.innerText = `Total tasks: ${totalTasks}`;
        domTasks.innerText = `Completed tasks: ${completedTasks}`;
        domDontKnow.innerText = `Pending tasks: ${pendingTasks}`;
    }



    function addTask() {
            CreateAllElements();
    }

    listContainer.addEventListener('click', function (e) {
        if (e.target.tagName === 'LI') {
            e.target.classList.toggle("checked");
            saveData();
        } else if (e.target.classList.contains('TrashImg')) {
            e.target.parentElement.remove();
            saveData();
        } else if (e.target.classList.contains('editSpan')) {
            gsap.from(e.target, { opacity: 0, x: 2, duration: 0.1 });
        }
    });

    function saveData() {
        let tasks = [];
        const listItems = document.querySelectorAll("#listContainer li");
        listItems.forEach((item) => {
            const task = {
              title: item.querySelector("span:first-child").textContent,
              description: item.querySelector("span:nth-of-type(2)").textContent,
              date: item.querySelector("h1").textContent,
              priority: item.querySelector("p").textContent,
              status: item.classList.contains("checked") ? "completed" : "pending",
            };
            tasks.push(task);
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
        updateTaskStats();
    }

    function showList() {
        const savedTasks = JSON.parse(localStorage.getItem("tasks"));
        if (savedTasks) {
            listContainer.innerHTML = "";
            savedTasks.forEach((task) => {
            const li = createElement('li', ['card']);
            const inputInsideLi = createElement('span', ['card-title'], { contentEditable: 'false' });
            const inputInsideLi2 = createElement('span', ['card-text'], { contentEditable: 'false' });
            const span = createElement("img", ['TrashImg'], { src: './images/trash-bin.png' });
            const editSpan = createElement("img", ['editSpan'], { src: './images/edit (1).png' });
            const priorityList = createElement('p');
            const h1 = document.createElement("h1");
            updatePriorityClass(priorityList, task.priority);

            domTasks.innerText = `Total tasks - ${task.totalTask}`;
            inputInsideLi.textContent = task.title;
            inputInsideLi2.textContent = task.description;
            priorityList.textContent = task.priority;
            h1.textContent = task.date;
            if (task.status === "completed") {
                li.classList.add("checked");
            }
            li.append(inputInsideLi, inputInsideLi2, priorityList, h1, span, editSpan);
            listContainer.appendChild(li);
            addEditEvent(editSpan, inputInsideLi, inputInsideLi2, priorityList, h1);
            });

            const savedFilter = localStorage.getItem('filter');
            if (savedFilter) {
              filterTasks(savedFilter);
            }
  }}

     function filterTasks(filterType) {
        const tasks = JSON.parse(localStorage.getItem("tasks"));
        const listItems = document.querySelectorAll("#listContainer li");
        localStorage.setItem('filter', filterType);
      
        if (filterType === "all") {
          listItems.forEach((item) => {
            item.classList.remove('displayNone')
            item.classList.add('card');
          });
        } else if (filterType === "completed") {
          listItems.forEach((item) => {
            if (item.classList.contains("checked")) {
              item.classList.remove('displayNone')
              item.classList.add('card')
            } else {
              item.classList.remove('card')
              item.classList.add('displayNone')
            }
        });
    } else if (filterType === "pending") {
        listItems.forEach((item) => {
            if (!item.classList.contains("checked")) {
                item.classList.remove('displayNone');
                item.classList.add('card');
            } else {
                item.classList.remove('card');
                item.classList.add('displayNone');
            }
        });
    } else if (filterType === "high") {
        listItems.forEach((item) => {
            const taskPriority = item.querySelector("p").textContent;
            if (taskPriority === "High Priority") {
                item.classList.remove('displayNone');
                item.classList.add('card')
            } else {
                item.classList.remove('card');
                item.classList.add('displayNone');
            }
          });
        } else if (filterType === "medium") {
          listItems.forEach((item) => {
            const taskPriority = item.querySelector("p").textContent;
            if (taskPriority === "Medium Priority") {
                item.classList.remove('displayNone');
                item.classList.add('card')
            } else {
                item.classList.remove('card');
                item.classList.add('displayNone');
            }
        });
    } else if (filterType === "low") {
        listItems.forEach((item) => {
            const taskPriority = item.querySelector("p").textContent;
            if (taskPriority === "Low Priority") {
                item.classList.remove('displayNone');
                item.classList.add('card')
            } else {
                item.classList.remove('card');
                item.classList.add('displayNone');
            }
          });
        }
      };
   




    let deletingData = () =>{
        Swal.fire({
            title: "Are you sure, i will delete all tasks??",
            showCancelButton: true,
            confirmButtonText: "Yes",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire("Deleted", "", "success");
                gsap.to("#listContainer li", { opacity: 0, y: -20, duration: 0.5, stagger: 0.1, onComplete: () => {
                    listContainer.innerHTML = "";
                    localStorage.setItem("tasks", '');
                    localStorage.setItem('filter', '');
                    typeTasks.style.borderColor = 'white';
                }});
            }
        });
    };