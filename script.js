    window.onload = () => {
        gsap.from(".container", { opacity: 0, y: -50, duration: 0.5 });
        showList();
    };
    
    flatpickr("#datepicker", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
    });

    let addTasksButton = document.getElementById('addTasksButton');
    let typeTasks = document.getElementById('typeTasks');
    let typeTasks2 = document.getElementById('typeTasks2');
    let listContainer = document.getElementById('listContainer');
    let errorMessage = document.getElementById('errorMessage');
    let SelectPriorityText = document.getElementById('SelectPriorityText');
    let datepicker = document.getElementById('datepicker');
    let priorityText = '';
    let alarmTime;
    let alarmInterval;
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
            inputInsideLi.innerText = typeTasks.value ? typeTasks.value : "Edit Text";
            inputInsideLi2.innerText = typeTasks2.value ? typeTasks2.value : "Add description!";
            h1.innerText = datepicker.value;
            updatePriorityClass(priorityList, priorityText)

            let task = {
                title: typeTasks.value ? typeTasks.value : "Edit Text",
                description: typeTasks2.value ? typeTasks2.value : "Add description!",
                date: datepicker.value ? datepicker.value : "Add Date",
                priority: priorityText,
                status: 'pending'
            };

            console.log(task);
            tasks.push(task);  // Add the new task to the tasks array
            displayTasks(tasks);

            // Appending Child
            li.append(inputInsideLi, inputInsideLi2, priorityList, h1, span, editSpan);
            li.classList.add('card');
            listContainer.insertAdjacentElement('afterbegin', li);
            typeTasks.style.borderColor = 'white';
            gsap.from(li, { opacity: 0, x: -100, duration: 0.3 });
            typeTasks.value = '';
            typeTasks2.value = '';
            saveData();
            addEditEvent(editSpan, inputInsideLi, inputInsideLi2, priorityList, h1);
            return [li, span, editSpan, priorityList, h1, inputInsideLi];
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
                if (selectedPriority !== '' && selectedPriority.trim() !== '' && selectedPriority !== null) {
                    priorityList.classList.add('PriorityClass');
                } else {
                    priorityList.classList.remove('PriorityClass');
                }
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
                DateEditing.type = Text;
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
                });
            }
            isEditing = !isEditing;
        });
    };

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


    let priority = (priority) => {
        if (priority === 'High Priority') {
            priorityText = 'High Priority';
            SelectPriorityText.innerHTML = priorityText;
        } else if (priority === 'Medium Priority') {
            priorityText = 'Medium Priority';
            SelectPriorityText.innerHTML = priorityText;
        } else if (priority === 'Low Priority') {
            priorityText = 'Low Priority';
            SelectPriorityText.innerHTML = priorityText;
        }
    };
    priority();

    function addTask() {
            CreateAllElements();
    }

    listContainer.addEventListener('click', function (e) {
        if (e.target.tagName === 'LI') {
            e.target.classList.toggle("checked");
            saveData();
        } else if (e.target.classList.contains("TrashImg")) {
            e.target.parentElement.remove();
            saveData();
        } else if (e.target.classList.contains("editSpan")) {
            gsap.from(e.target, { opacity: 0, x: 2, duration: 0.1 });
        }
    });

    function saveData() {
        let InputText = [];
        let input = listContainer.querySelectorAll('span')
        let priorityText = listContainer.querySelectorAll('p');
        let h1 = listContainer.querySelectorAll('h1');
        input.forEach(input => {InputText.push(input.value);})
        priorityText.forEach(priorityText => {InputText.push(priorityText.innerText);})
        h1.forEach(h1 => {InputText.push(h1.innerText);})
        localStorage.setItem("data", listContainer.innerHTML);
        localStorage.setItem("inputData", JSON.stringify(InputText));
    }

    function showList() {
        listContainer.innerHTML = localStorage.getItem("data");
        const savedInputValues = JSON.parse(localStorage.getItem("inputData"));
        if (savedInputValues) {
            const inputs = document.querySelectorAll("#listContainer span");
            inputs.forEach((input, index) => {
                if (savedInputValues[index]) {
                    input.value = savedInputValues[index];
                }
            });
        }
        const listItems = document.querySelectorAll("#listContainer li");
        listItems.forEach(item => {
            let editSpan = item.querySelector('.editSpan');
            let inputInsideLi = item.querySelector('span:first-child');
            let inputInsideLi2 = item.querySelector('span:nth-of-type(2)');
            let priorityList = item.querySelector('p');
            let h1 = item.querySelector('h1');
            addEditEvent(editSpan, inputInsideLi, inputInsideLi2, priorityList, h1)
            gsap.from(item, { opacity: 0, x: -100, duration: 0.3 });
            gsap.to(item, { opacity: 1, x: 0 });
        });
     }


    let deletingData = () =>{
        Swal.fire({
            title: "Are you sure, this will delete all tasks??",
            showCancelButton: true,
            confirmButtonText: "Yes",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire("Deleted", "", "success");
                gsap.to("#listContainer li", { opacity: 0, y: -20, duration: 0.5, stagger: 0.1, onComplete: () => {
                    listContainer.innerHTML = "";
                    localStorage.setItem("data", "");
                    localStorage.setItem("inputData", '');
                    typeTasks.style.borderColor = 'white';
                }});
            }
        });
    }

    function setAlarm() {
        const input = task.date;
        const selectedTime = new Date(input).getTime();
        alarms.push({ time: selectedTime, task });
        if (alarmInterval) clearInterval(alarmInterval);
        alarmInterval = setInterval(checkAlarms, 1000);
    }

    function checkAlarm() {
        const now = new Date().getTime();
        alarms.forEach((alarm, index) => {
            if (now >= alarm.time) {
                triggerAlarm(alarm.task);
                alarms.splice(index, 1); // Remove triggered alarm
            }
        });
    }

    function triggerAlarm() {
        if (Notification.permission === "granted") {
            new Notification("Alarm!", {
                body: "The time for your task is up!",
                icon: "./images/favicon-32x32.png"
            });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification("Alarm!", {
                        body: "The time for your task is up!",
                        icon: "./images/favicon-32x32.png"
                    });
                }
            });
        }
    }

    let requestNotificationPermission = () => {
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
    requestNotificationPermission();